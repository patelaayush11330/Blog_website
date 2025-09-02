import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/comments/${postId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch comments');
      }

      setComments(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post comment');
      }

      setNewComment('');
      fetchComments(); // Refresh comments
      setSubmitting(false);
    } catch (err) {
      console.error('Error posting comment:', err);
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: replyContent,
          parent: parentId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post reply');
      }

      setReplyContent('');
      setReplyTo(null);
      fetchComments(); // Refresh comments
      setSubmitting(false);
    } catch (err) {
      console.error('Error posting reply:', err);
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      fetchComments(); // Refresh comments
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const CommentItem = ({ comment, level = 0 }) => (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-start space-x-3">
          <img 
            src={comment.user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
            alt={comment.user.name}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900">{comment.user.name}</span>
              <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setReplyTo(comment._id)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reply
              </button>
              {(user && (comment.user._id === user._id || user.role === 'admin')) && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              )}
            </div>

            {/* Reply Form */}
            {replyTo === comment._id && (
              <div className="mt-4">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-navy focus:border-transparent resize-none"
                  rows="3"
                />
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => handleSubmitReply(comment._id)}
                    disabled={submitting || !replyContent.trim()}
                    className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {submitting ? 'Posting...' : 'Post Reply'}
                  </button>
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h3>
        
        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-start space-x-3">
              <img 
                src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
                alt={user.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent resize-none"
                  rows="4"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {newComment.length}/1000 characters
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="px-6 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Please log in to leave a comment</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments; 