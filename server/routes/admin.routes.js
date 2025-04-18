const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getDashboardStats
} = require('../controllers/admin.controller');
const { getAllStudents } = require('../controllers/student.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// All admin routes are protected
router.use(protect);
router.use(admin);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Dashboard stats
router.get('/stats/dashboard', getDashboardStats);

// Students management
router.get('/students', getAllStudents);

module.exports = router; 