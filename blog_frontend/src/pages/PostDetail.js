import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Comments from '../components/Comments';
import { Helmet } from 'react-helmet-async';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [totalClaps, setTotalClaps] = useState(0);
  const [userClaps, setUserClaps] = useState(0);
  const contentRef = useRef();
  const [progress, setProgress] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('spam');
  const [reportComment, setReportComment] = useState('');
  const userData = JSON.parse(localStorage.getItem('user') || 'null');
  const isAuthor = userData && post && (userData._id === post.author._id);
  // Show post status to author
  const showStatus = isAuthor && post.status && post.status !== 'published';

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
    fetchPost();
    fetchClaps();
  }, [id]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
    }
    // eslint-disable-next-line
  }, [post]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareMenu && !event.target.closest('.share-menu')) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const totalHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
      const winScroll = window.scrollY;
      const height = contentRef.current.offsetTop + contentRef.current.clientHeight - window.innerHeight;
      const scrolled = Math.min(100, Math.max(0, ((winScroll - contentRef.current.offsetTop) / height) * 100));
      setProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Post not found');
      }

      // Fix: support both { post: {...} } and direct post object
      setPost(data.post ? data.post : data);
      setLikesCount((data.post ? data.post : data).likes?.length || 0);
      // Check if current user has liked the post
      if (userData && (data.post ? data.post : data).likes) {
        setLiked((data.post ? data.post : data).likes.includes(userData._id));
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    if (!post) return;
    try {
      // Fetch posts by same author, excluding current post
      const res = await fetch(`http://localhost:5000/api/posts?author=${post.author._id}`);
      let data = await res.json();
      if (Array.isArray(data)) {
        data = data.filter(p => p._id !== post._id);
      }
      // Optionally, add posts with similar tags (not implemented here for simplicity)
      setRelatedPosts(data.slice(0, 3)); // Show up to 3 related posts
    } catch (err) {
      setRelatedPosts([]);
    }
  };

  const fetchClaps = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`);
      const data = await response.json();
      if (response.ok) {
        const likes = data.likes || [];
        setTotalClaps(likes.reduce((sum, l) => sum + (l.count || 1), 0));
        const userData = localStorage.getItem('user');
        if (userData) {
          const userId = JSON.parse(userData)._id;
          setUserClaps(likes.find(l => l.user === userId)?.count || 0);
        }
      }
    } catch {}
  };
  const stripHTML = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
  };

  const handleLike = async () => {
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to like post');
      }

      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleClap = async () => {
    if (!userData) {
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${id}/clap`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setTotalClaps(data.totalClaps);
        setUserClaps(data.userClaps);
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!userData || post.author._id !== userData._id) return;

    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const handleBookmark = async () => {
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/bookmarks/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle bookmark');
      }

      setBookmarked(!bookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleShare = async (platform) => {
    const postUrl = window.location.href;
    const postTitle = post?.title || 'Check out this post';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(postTitle + ' ' + postUrl)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(postUrl);
          alert('Link copied to clipboard!');
          setShowShareMenu(false);
          return;
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
        break;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  const handleReport = async () => {
    try {
      await fetch('http://localhost:5000/api/posts/' + post._id + '/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ reason: reportReason, comment: reportComment })
      });
      setShowReportModal(false);
      setReportReason('spam');
      setReportComment('');
      alert('Report submitted. Thank you!');
    } catch {
      alert('Failed to submit report.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/" 
            className="bg-primary-navy text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  if (post?.membersOnly && (!userData || userData.membership?.status !== 'active')) {
    // Show preview and subscribe prompt
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-soft p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-primary-navy mb-4">Members Only</h1>
          <p className="text-gray-600 mb-6">This post is for paid subscribers. Subscribe to unlock the full content and support the author!</p>
          <div className="mb-6 text-gray-700 text-left bg-gray-50 rounded-xl p-4">
            <div className="font-semibold mb-2">Preview:</div>
            <div dangerouslySetInnerHTML={{ __html: post.content.substring(0, 300) + '...' }} />
          </div>
          <Link to="/subscribe" className="px-8 py-3 bg-primary-navy text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors shadow-lg">Subscribe to Read More</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>{post.title} | BlogHub</title>
        <meta name="description" content={post.content.substring(0, 150)} />
        <meta property="og:title" content={post.title + ' | BlogHub'} />
        <meta property="og:description" content={post.content.substring(0, 150)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={post.thumbnail || '/logo192.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title + ' | BlogHub'} />
        <meta name="twitter:description" content={post.content.substring(0, 150)} />
        <meta name="twitter:image" content={post.thumbnail || '/logo192.png'} />
      </Helmet>
      {/* Floating Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300" 
          style={{width: `${readingProgress}%`}}
        ></div>
      </div>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div className="bg-indigo-600 transition-all duration-200" style={{ width: `${progress}%`, height: '100%' }} />
      </div>
      {/* Hero Section with Post Header */}
      <div className="relative bg-gradient-to-r from-primary-navy via-blue-800 to-indigo-900 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-8 bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-2xl backdrop-blur-sm">
              {error}
            </div>
          )}

          {post && (
            <div className="text-center">
              {/* Breadcrumb */}
              <div className="flex items-center justify-center space-x-2 text-blue-200 mb-6">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white">Post</span>
              </div>

              {/* Post Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
                {post.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <img 
                  src={post.author.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"} 
                  alt={post.author.name}
                  className="w-14 h-14 rounded-full border-3 border-white shadow-lg"
                />
                <div className="text-left">
                  <p className="text-xl font-semibold">{post.author.name}</p>
                  <p className="text-blue-200">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} • {Math.ceil(post.content.length / 200)} min read
                  </p>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-opacity-30 transition-all duration-200 cursor-pointer border border-white border-opacity-30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-4 flex-wrap">
                <button
                  onClick={handleClap}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-200 backdrop-blur-sm bg-white bg-opacity-20 text-white hover:bg-opacity-30 border border-white border-opacity-30`}
                >
                  <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">{totalClaps} {totalClaps === 1 ? 'clap' : 'claps'}</span>
                  {userClaps > 0 && <span className="ml-2 text-yellow-300">+{userClaps}</span>}
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-200 backdrop-blur-sm ${
                    bookmarked 
                      ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 border border-white border-opacity-30'
                  }`}
                >
                  <svg className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span className="font-medium">{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <div className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-2xl border border-white border-opacity-30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{post.views || 0} views</span>
                </div>

                {/* Share Button */}
                <div className="relative share-menu">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-2xl hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span className="font-medium">Share</span>
                  </button>
                  
                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white rounded-2xl shadow-2xl border border-gray-200 py-3 z-20 min-w-[220px]">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-700">Share this post</p>
                      </div>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                      >
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <span className="font-medium">Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="font-medium">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                      >
                        <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span className="font-medium">LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                      >
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        <span className="font-medium">WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Copy Link</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit/Delete buttons for post author */}
                {userData && post.author._id === userData._id && (
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/edit-post/${id}`}
                      className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all duration-200 shadow-lg"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-200 shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                )}
                {/* Report Button (not for author) */}
                {!isAuthor && userData && (
                  <button
                    className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    onClick={() => setShowReportModal(true)}
                  >
                    Report
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {post && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Thumbnail */}
              {post.thumbnail && (
                <div className="mb-8">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover rounded-3xl shadow-2xl"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="bg-white rounded-3xl shadow-soft p-8 md:p-12 mb-8">
                <div className="prose prose-lg md:prose-xl max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg" ref={contentRef}>
                    {/* {post.content} */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-3xl shadow-soft p-8 md:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Comments</h2>
                  <p className="text-gray-600">Join the conversation</p>
                </div>
                <Comments postId={id} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Card */}
              <div className="bg-white rounded-3xl shadow-soft p-6 mb-8 sticky top-8">
                <div className="text-center">
                  <img 
                    src={post.author.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"} 
                    alt={post.author.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author.name}</h3>
                  <p className="text-gray-600 mb-4">Author</p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {likesCount}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path fillRule="evenodd" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" clipRule="evenodd" />
                      </svg>
                      {post.views || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reading Progress */}
              <div className="bg-white rounded-3xl shadow-soft p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Reading Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${readingProgress}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{Math.round(readingProgress)}% completed</p>
              </div>

              {/* Related Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white rounded-3xl shadow-soft p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Social Sharing Buttons */}
      <div className="flex space-x-4 mt-8">
        <button
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
          className="px-4 py-2 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
        >
          Share on Twitter
        </button>
        <button
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Share on Facebook
        </button>
        <button
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Share on LinkedIn
        </button>
        <button
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Share on WhatsApp
        </button>
      </div>

      {/* You Might Also Like */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-primary-navy mb-8">You might also like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relPost) => (
                <article key={relPost._id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {relPost.thumbnail && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={relPost.thumbnail} 
                        alt={relPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-primary-navy transition-colors">
                      <Link to={`/post/${relPost._id}`}>{relPost.title}</Link>
                    </h3>
                    {/* <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {relPost.content.substring(0, 120)}...
                    </p> */}
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {stripHTML(relPost.content).substring(0, 120)}
                    </p>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={relPost.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                        alt={relPost.author.name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{relPost.author.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(relPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} 
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Report Post</h2>
            <label className="block mb-2 font-medium">Reason</label>
            <select value={reportReason} onChange={e => setReportReason(e.target.value)} className="w-full mb-4 p-2 rounded border dark:bg-gray-800">
              <option value="spam">Spam</option>
              <option value="abuse">Abusive or Harmful</option>
              <option value="copyright">Copyright Violation</option>
              <option value="other">Other</option>
            </select>
            <label className="block mb-2 font-medium">Comment (optional)</label>
            <textarea value={reportComment} onChange={e => setReportComment(e.target.value)} className="w-full mb-4 p-2 rounded border dark:bg-gray-800" rows={3} />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Cancel</button>
              <button onClick={handleReport} className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail; 