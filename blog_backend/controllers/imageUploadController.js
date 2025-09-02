exports.uploadImage = (req, res) => {
  try {
    console.log('📸 Upload request received:', req.file);
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Check if it's a Cloudinary upload or local file
    let imageUrl;
    
    if (req.file.path && req.file.path.startsWith('http')) {
      // Cloudinary upload
      imageUrl = req.file.path;
      console.log('☁️ Cloudinary upload:', imageUrl);
    } else {
      // Local file upload
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      console.log('💾 Local upload:', imageUrl);
    }

    console.log('✅ Image uploaded successfully:', imageUrl);
    res.json({ 
      url: imageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('❌ Image upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
}; 