const express = require('express');
const { body, validationResult } = require('express-validator');
const PersonalData = require('../models/PersonalData');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const personalDataValidation = [
  body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters long'),
  body('occupation').trim().isLength({ min: 2 }).withMessage('Occupation must be at least 2 characters long'),
  body('education').optional().trim(),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('skills').optional().trim()
];

// @route   POST /api/personal-data
// @desc    Create personal data for user
// @access  Private
router.post('/', authenticateToken, personalDataValidation, async (req, res) => {
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

    const { age, location, occupation, education, experience, skills } = req.body;
    const userId = req.user.id;

    // Check if personal data already exists
    const existingData = await PersonalData.getByUserId(userId);
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: 'Personal data already exists for this user'
      });
    }

    // Create personal data
    const personalData = await PersonalData.create(userId, {
      age,
      location,
      occupation,
      education,
      experience,
      skills
    });

    res.status(201).json({
      success: true,
      message: 'Personal data created successfully',
      data: {
        personalData: {
          id: personalData.id,
          age: personalData.age,
          location: personalData.location,
          occupation: personalData.occupation,
          education: personalData.education,
          experience: personalData.experience,
          skills: personalData.skills,
          createdAt: personalData.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Create personal data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/personal-data
// @desc    Get personal data for current user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const personalData = await PersonalData.getByUserId(userId);

    if (!personalData) {
      return res.status(404).json({
        success: false,
        message: 'Personal data not found'
      });
    }

    res.json({
      success: true,
      data: {
        personalData: {
          id: personalData.ID,
          age: personalData.AGE,
          location: personalData.LOCATION,
          occupation: personalData.OCCUPATION,
          education: personalData.EDUCATION,
          experience: personalData.EXPERIENCE,
          skills: personalData.SKILLS,
          createdAt: personalData.CREATED_AT,
          updatedAt: personalData.UPDATED_AT
        }
      }
    });

  } catch (error) {
    console.error('Get personal data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/personal-data
// @desc    Update personal data for current user
// @access  Private
router.put('/', authenticateToken, personalDataValidation, async (req, res) => {
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

    const userId = req.user.id;
    const { age, location, occupation, education, experience, skills } = req.body;

    // Check if personal data exists
    const existingData = await PersonalData.getByUserId(userId);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Personal data not found'
      });
    }

    // Update personal data
    await PersonalData.update(userId, {
      age,
      location,
      occupation,
      education,
      experience,
      skills
    });

    res.json({
      success: true,
      message: 'Personal data updated successfully'
    });

  } catch (error) {
    console.error('Update personal data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/personal-data
// @desc    Delete personal data for current user
// @access  Private
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if personal data exists
    const existingData = await PersonalData.getByUserId(userId);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Personal data not found'
      });
    }

    // Delete personal data
    await PersonalData.delete(userId);

    res.json({
      success: true,
      message: 'Personal data deleted successfully'
    });

  } catch (error) {
    console.error('Delete personal data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 