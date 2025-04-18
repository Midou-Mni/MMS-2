const Student = require('../models/Student.model');

// @desc    Create a new student
// @route   POST /api/students
// @access  Private (Affiliate)
exports.createStudent = async (req, res) => {
  try {
    // Add the current user (affiliate) as the student's affiliate
    req.body.affiliate = req.user.id;
    
    const student = await Student.create(req.body);
    
    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all students for the affiliate
// @route   GET /api/students
// @access  Private (Affiliate)
exports.getAffiliateStudents = async (req, res) => {
  try {
    const students = await Student.find({ affiliate: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all students (for admin)
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('affiliate', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private (Affiliate - only their own students)
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Check if the student belongs to the logged in affiliate
    if (student.affiliate.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this student'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Affiliate - only their own students)
exports.updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Check if the student belongs to the logged in affiliate
    if (student.affiliate.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this student'
      });
    }
    
    student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Affiliate - only their own students)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Check if the student belongs to the logged in affiliate
    if (student.affiliate.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this student'
      });
    }
    
    await Student.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 