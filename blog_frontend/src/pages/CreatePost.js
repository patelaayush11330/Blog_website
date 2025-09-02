// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// const CreatePost = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     tags: '',
//     thumbnail: '',
//     membersOnly: false
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

  
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     const token = localStorage.getItem('token');
    
//     if (!userData || !token) {
//       navigate('/login');
//       return;
//     }

//     setUser(JSON.parse(userData));

//     // Check for draft in localStorage
//     const draft = localStorage.getItem('draft_post');
//     if (draft) {
//       if (window.confirm('You have a saved draft. Do you want to restore it?')) {
//         setFormData(JSON.parse(draft));
//       } else {
//         localStorage.removeItem('draft_post');
//       }
//     }
//   }, [navigate]);

//   // Autosave draft on formData change
//   useEffect(() => {
//     localStorage.setItem('draft_post', JSON.stringify(formData));
//   }, [formData]);

//   const handleSaveDraft = () => {
//     localStorage.setItem('draft_post', JSON.stringify(formData));
//     alert('Draft saved!');
//   };

//   const handleClearDraft = () => {
//     localStorage.removeItem('draft_post');
//     alert('Draft cleared!');
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!formData.title.trim() || !formData.content.trim()) {
//       setError('Title and content are required');
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

//       const response = await fetch('http://localhost:5000/api/posts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title: formData.title,
//           content: formData.content,
//           tags: tagsArray,
//           thumbnail: formData.thumbnail || null,
//           membersOnly: formData.membersOnly
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to create post');
//       }

//       setLoading(false);
//       // Clear draft on successful post creation
//       localStorage.removeItem('draft_post');
//       // Navigate to dashboard to show the new post
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.message || 'Failed to create post');
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center space-x-2 text-gray-600 hover:text-primary-navy hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               <span>Back</span>
//             </button>
//           </div>
          
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
//           <p className="text-gray-600">Share your thoughts with the BlogHub community</p>
//         </div>

//         {/* Create Post Form */}
//         <div className="bg-white rounded-2xl shadow-soft p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
//                 {error}
//               </div>
//             )}

//             {/* Title */}
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                 Post Title *
//               </label>
//               <input
//                 id="title"
//                 name="title"
//                 type="text"
//                 required
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200"
//                 placeholder="Enter your post title"
//                 maxLength={100}
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 {formData.title.length}/100 characters
//               </p>
//             </div>

//             {/* Thumbnail URL
//             <div>
//               <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
//                 Thumbnail Image URL
//               </label>
//               <input
//                 id="thumbnail"
//                 name="thumbnail"
//                 type="url"
//                 value={formData.thumbnail}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200"
//                 placeholder="https://example.com/image.jpg"
//               />
//               {/* <p className="text-xs text-gray-500 mt-1">
//                 Optional: Add a cover image for your post
//               </p> */}
//             {/* </div> */} 
//             <div>
//   <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
//     Thumbnail Image URL or Upload
//   </label>
//   {/* URL Input */}
//   <input
//     id="thumbnail"
//     name="thumbnail"
//     type="url"
//     value={formData.thumbnail}
//     onChange={handleChange}
//     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 mb-2"
//     placeholder="https://example.com/image.jpg"
//   />
//   {/* File Input */}
//   <input
//     id="thumbnailFile"
//     name="thumbnailFile"
//     type="file"
//     accept="image/*"
//     onChange={handleFileChange}
//     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200"
//   />
//   {/* Image Preview (Optional) */}
//   {previewUrl && (
//     <img
//       src={previewUrl}
//       alt="Thumbnail Preview"
//       className="mt-2 rounded-xl w-32 h-32 object-cover border"
//     />
//   )}
// </div>


//             {/* Members Only */}
//             <div className="flex items-center mb-2">
//               <input
//                 id="membersOnly"
//                 name="membersOnly"
//                 type="checkbox"
//                 checked={formData.membersOnly || false}
//                 onChange={e => setFormData({ ...formData, membersOnly: e.target.checked })}
//                 className="mr-2"
//               />
//               <label htmlFor="membersOnly" className="text-sm text-gray-700">Members Only (paid subscribers can read full post)</label>
//             </div>

//             {/* Tags */}
//             <div>
//               <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
//                 Tags
//               </label>
//               <input
//                 id="tags"
//                 name="tags"
//                 type="text"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200"
//                 placeholder="React, JavaScript, Web Development"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Separate tags with commas (e.g., React, JavaScript, Tutorial)
//               </p>
//             </div>

//             {/* Content */}
//             <div>
//               <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
//                 Post Content *
//               </label>
//               <ReactQuill
//                 id="content"
//                 theme="snow"
//                 value={formData.content}
//                 onChange={value => setFormData({ ...formData, content: value })}
//                 className="bg-white rounded-xl border border-gray-300 mb-2"
//                 style={{ minHeight: '250px' }}
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 {formData.content.length} characters
//               </p>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center justify-between pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={handleSaveDraft}
//                 className="px-4 py-2 bg-yellow-400 text-primary-navy rounded-lg font-medium hover:bg-yellow-500 transition-colors mr-2"
//               >
//                 Save Draft
//               </button>
//               <button
//                 type="button"
//                 onClick={handleClearDraft}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors mr-2"
//               >
//                 Clear Draft
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate('/dashboard')}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-3 bg-primary-navy text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors shadow-lg"
//                 disabled={loading}
//               >
//                 {loading ? 'Publishing...' : 'Publish Post'}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Writing Tips */}
//         <div className="mt-8 bg-blue-50 rounded-xl p-6">
//           <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Writing Tips</h3>
//           <ul className="space-y-2 text-sm text-blue-800">
//             <li>• Start with a compelling title that grabs attention</li>
//             <li>• Use clear, concise language</li>
//             <li>• Break up content with headings and paragraphs</li>
//             <li>• Include relevant tags to help others find your post</li>
//             <li>• Add a thumbnail image to make your post more engaging</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePost; 

//EDITED CODE SINCE WE NEED TO GIVE IMAGE UPLODATION FROM LOCAL STORAGE ALSO
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    thumbnail: '', // This will store either the URL or the uploaded image's data URL
    membersOnly: false,
    thumbnailFile: null, // For file upload
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Restore user and draft
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    const draft = localStorage.getItem('draft_post');
    if (draft) {
      if (window.confirm('You have a saved draft. Do you want to restore it?')) {
        const draftData = JSON.parse(draft);
        setFormData(draftData);
        // Set preview if thumbnail exists
        if (draftData.thumbnail) setPreviewUrl(draftData.thumbnail);
      } else {
        localStorage.removeItem('draft_post');
      }
    }
  }, [navigate]);

  // Autosave draft on formData change
  useEffect(() => {
    localStorage.setItem('draft_post', JSON.stringify(formData));
  }, [formData]);

  // Handle URL input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === 'thumbnail' && { thumbnailFile: null }), // Clear file if URL is entered
    }));

    if (name === 'thumbnail') {
      setPreviewUrl(value);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFormData((prev) => ({
          ...prev,
          thumbnail: reader.result, // Save base64 data URL
          thumbnailFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('draft_post', JSON.stringify(formData));
    alert('Draft saved!');
  };

  const handleClearDraft = () => {
    localStorage.removeItem('draft_post');
    alert('Draft cleared!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      // If you're uploading the file to a backend, you'd send formData.thumbnailFile
      // Here, we send the thumbnail as a base64 data URL or as a URL string
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: tagsArray,
          thumbnail: formData.thumbnail || null, // base64 or URL
          membersOnly: formData.membersOnly,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      setLoading(false);
      localStorage.removeItem('draft_post');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create post');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy"></div>
      </div>
    );
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-600">Share your thoughts with the BlogHub community</p>
        </div>

        {/* Create Post Form */}
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

            {/* Thumbnail URL or Upload */}
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image URL or Upload
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="url"
                value={formData.thumbnailFile ? '' : formData.thumbnail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 mb-2"
                placeholder="https://example.com/image.jpg"
                disabled={!!formData.thumbnailFile}
              />
              <div className="flex items-center space-x-2">
                <input
                  id="thumbnailFile"
                  name="thumbnailFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200"
                  disabled={!!formData.thumbnail}
                />
                {(formData.thumbnail || formData.thumbnailFile) && (
                  <button
                    type="button"
                    className="text-xs text-red-500 underline"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail: '',
                        thumbnailFile: null,
                      }));
                      setPreviewUrl('');
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Thumbnail Preview"
                  className="mt-2 rounded-xl w-32 h-32 object-cover border"
                />
              )}
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
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="membersOnly" className="text-sm text-gray-700">
                Members Only (paid subscribers can read full post)
              </label>
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
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                className="bg-white rounded-xl border border-gray-300 mb-2"
                style={{ minHeight: '250px' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.content.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 flex-wrap gap-2">
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
                disabled={loading}
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Writing Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Writing Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Start with a compelling title that grabs attention</li>
            <li>• Use clear, concise language</li>
            <li>• Break up content with headings and paragraphs</li>
            <li>• Include relevant tags to help others find your post</li>
            <li>• Add a thumbnail image to make your post more engaging</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
