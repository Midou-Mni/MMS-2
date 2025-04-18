const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAffiliateStudents,
  getStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/student.controller');
const { protect } = require('../middleware/auth.middleware');

// All student routes are protected
router.use(protect);

// Routes accessible to all authenticated users
router.post('/', createStudent);
router.get('/', getAffiliateStudents);
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router; 