const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createJobValidation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Job title must be at least 5 characters long'),
  body('description').trim().isLength({ min: 20 }).withMessage('Job description must be at least 20 characters long'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('salaryMin').isNumeric().withMessage('Minimum salary must be a number'),
  body('salaryMax').isNumeric().withMessage('Maximum salary must be a number'),
  body('requirements').trim().notEmpty().withMessage('Job requirements are required')
];

// @route   GET /api/jobs
// @desc    Get all active jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.getAllActive();
    
    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/jobs/search
// @desc    Search jobs
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const jobs = await Job.search(q);
    
    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error getting job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/jobs
// @desc    Create new job
// @access  Private
router.post('/', authenticateToken, createJobValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, company, location, salaryMin, salaryMax, requirements } = req.body;
    const createdBy = req.user.id;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salaryMin: parseFloat(salaryMin),
      salaryMax: parseFloat(salaryMax),
      requirements,
      createdBy
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });

  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private
router.put('/:id', authenticateToken, createJobValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { title, description, company, location, salaryMin, salaryMax, requirements, status } = req.body;

    // Check if job exists and belongs to user
    const existingJob = await Job.findById(id);
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    await Job.update(id, {
      title,
      description,
      company,
      location,
      salaryMin: parseFloat(salaryMin),
      salaryMax: parseFloat(salaryMax),
      requirements,
      status: status || existingJob.status
    });

    res.json({
      success: true,
      message: 'Job updated successfully'
    });

  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if job exists and belongs to user
    const existingJob = await Job.findById(id);
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.delete(id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/jobs/user/my-jobs
// @desc    Get user's jobs
// @access  Private
router.get('/user/my-jobs', authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.getByUser(req.user.id);
    
    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error getting user jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 