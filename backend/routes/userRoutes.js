const express = require('express');
const { 
  register, 
  login, 
  logout, 
  getUserProfile, 
  bookmark, 
  getUserBookmarks, 
  removebookmark, 
  getCount, 
  userData, 
  createAdmin, 
  createContentCreator,
  deleteUser,      
  blockUser        
} = require('../controllers/userController');
const authenticateUser = require('../middleware/authMiddleware');
const router = express.Router();

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/create-admin', authenticateUser, authorizeAdmin, createAdmin);
router.post('/create-content-creator', authenticateUser, authorizeAdmin, createContentCreator);
router.delete('/delete/:id', authenticateUser, authorizeAdmin, deleteUser);
router.put('/block/:id', authenticateUser, authorizeAdmin, blockUser);
router.get('/getCount', authenticateUser, authorizeAdmin, getCount);
router.get('/userData', authenticateUser, authorizeAdmin, userData);
router.get("/profile", authenticateUser, getUserProfile);
router.post('/bookmark', authenticateUser, bookmark);
router.get('/getbookmark', authenticateUser, getUserBookmarks);
router.post('/removebookmark', authenticateUser, removebookmark);

module.exports = router;