const express = require('express');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const authenticateUser = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

// Routes for both /api/categories and /api/categories/categories
router.get('/', getAllCategories);
router.get('/categories', getAllCategories);

router.post('/', authenticateUser, isAdmin, createCategory);
router.post('/categories', authenticateUser, isAdmin, createCategory);

router.get('/:categoryId', getCategoryById);
router.get('/categories/:categoryId', getCategoryById);

router.put('/:categoryId', authenticateUser, isAdmin, updateCategory);
router.put('/categories/:categoryId', authenticateUser, isAdmin, updateCategory);

router.delete('/:categoryId', authenticateUser, isAdmin, deleteCategory);
router.delete('/categories/:categoryId', authenticateUser, isAdmin, deleteCategory);

module.exports = router;
