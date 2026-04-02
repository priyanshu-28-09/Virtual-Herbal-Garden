const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createHerb,
  getHerb,
  updateHerb,
  deleteHerb,
  herbb,
  getMyHerbs,
  updateHerbStatus
} = require("../controllers/herbController");
const authenticateUser = require("../middleware/authMiddleware");
const { isAdmin, isContentCreator } = require("../middleware/adminMiddleware");

const router = express.Router();

// Create uploads directories
const uploadsDir = path.join(__dirname, '../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const videosDir = path.join(uploadsDir, 'videos');

[uploadsDir, imagesDir, videosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, imagesDir);
    } else if (file.mimetype.startsWith('video')) {
      cb(null, videosDir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// Routes
router.post("/herbs", authenticateUser, isContentCreator, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), createHerb);

router.get("/herbs", getHerb);
router.get("/herbs/my-herbs/:userId", authenticateUser, getMyHerbs);
router.get("/herbs/:herbId", getHerb);
router.put("/herbs/:herbId", authenticateUser, isContentCreator, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), updateHerb);
router.put("/herbs/status/:herbId", authenticateUser, isAdmin, updateHerbStatus);
router.delete("/herbs/:herbId", authenticateUser, isAdmin, deleteHerb);
router.get('/herbb', herbb);

module.exports = router;