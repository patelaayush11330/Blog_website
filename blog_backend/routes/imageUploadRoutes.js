const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { storage } = require('../config/cloudinaryConfig');
const { uploadImage } = require('../controllers/imageUploadController');

const router = express.Router();
const upload = multer({ storage });

router.post('/image', protect, upload.single('image'), uploadImage);
// // router.post('/image', upload.single('image'), (req, res) => {
// //   if (!req.file) {
// //     return res.status(400).send('No file uploaded.');
// //   }
// //   console.log(err);
// //   res.send('File uploaded successfully.');
// // });
// router.post('/image', upload.single('image'), (req, res) => {
//   console.log('req.body:', req.body);
//   console.log('req.file:', req.file);
//   if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
//   res.json({ url: req.file.path });
// });


module.exports = router; 