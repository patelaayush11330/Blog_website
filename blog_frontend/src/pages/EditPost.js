import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    thumbnail: '',
    membersOnly: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchPost();

    // Check for draft in localStorage
    const draftKey = `draft_edit_post_${id}`;
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      if (window.confirm('You have a saved draft for this post. Do you want to restore it?')) {
        setFormData(JSON.parse(draft));
      } else {
        localStorage.removeItem(draftKey);
      }
    }
  }, [id, navigate]);

  // Autosave draft on formData change
  useEffect(() => {
    const draftKey = `draft_edit_post_${id}`;
    localStorage.setItem(draftKey, JSON.stringify(formData));
  }, [formData, id]);

  const handleSaveDraft = () => {
    const draftKey = `draft_edit_post_${id}`;
    localStorage.setItem(draftKey, JSON.stringify(formData));
    alert('Draft saved!');
  };

  const handleClearDraft = () => {
    const draftKey = `draft_edit_post_${id}`;
    localStorage.removeItem(draftKey);
    alert('Draft cleared!');
  };

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Post not found');
      }

      // Check if user is the author
      if (data.author._id !== JSON.parse(localStorage.getItem('user'))._id) {
        navigate('/dashboard');
        return;
      }

      setFormData({
        title: data.title,
        content: data.content,
        tags: data.tags ? data.tags.join(', ') : '',
        thumbnail: data.thumbnail || '',
        membersOnly: data.membersOnly || false
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: tagsArray,
          thumbnail: formData.thumbnail || null,
          membersOnly: formData.membersOnly
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update post');
      }

      setSaving(false);
      // Clear draft on successful update
      const draftKey = `draft_edit_post_${id}`;
      localStorage.removeItem(draftKey);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update post');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-navy hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
          <p className="text-gray-600">Update your post content and settings</p>
        </div>

        {/* Edit Post Form */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200"
                placeholder="Enter your post title"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image URL
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="url"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Add a cover image for your post
              </p>
            </div>

            {/* Members Only */}
            <div className="flex items-center mb-2">
              <input
                id="membersOnly"
                name="membersOnly"
                type="checkbox"
                checked={formData.membersOnly || false}
                onChange={e => setFormData({ ...formData, membersOnly: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="membersOnly" className="text-sm text-gray-700">Members Only (paid subscribers can read full post)</label>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200"
                placeholder="React, JavaScript, Web Development"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas (e.g., React, JavaScript, Tutorial)
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Post Content *
              </label>
              <ReactQuill
                id="content"
                theme="snow"
                value={formData.content}
                onChange={value => setFormData({ ...formData, content: value })}
                className="bg-white rounded-xl border border-gray-300 mb-2"
                style={{ minHeight: '250px' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.content.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-yellow-400 text-primary-navy rounded-lg font-medium hover:bg-yellow-500 transition-colors mr-2"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleClearDraft}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors mr-2"
              >
                Clear Draft
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary-navy text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors shadow-lg"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Update Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost; 