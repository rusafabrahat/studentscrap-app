require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const app = express();

// CORS configuration (strict for production)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// body parser
app.use(express.json({ limit: '15mb' }));

// mongodb connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// cloudinary configuration (with CORS)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// multer + cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "studentscrap",
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    quality: 'auto',
    fetch_format: 'auto',
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed!'), false);
  }
});

// routes
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');
    res.status(201).json({
      url: req.file.path,
      _id: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// proxy route for CORS images (critical for html2canvas)
app.get('/api/proxy-image', async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(res);
  } catch (err) {
    res.status(500).send('Failed to fetch image');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));