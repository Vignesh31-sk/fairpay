const express = require('express');
const { body, validationResult } = require('express-validator');
const Grievance = require('../models/Grievance');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createGrievanceValidation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters long'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority level')
];

const responseValidation = [
  body('message').trim().isLength({ min: 5 }).withMessage('Response message must be at least 5 characters long')
];

// @route   GET /api/grievances
// @desc    Get user grievances
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const grievances = await Grievance.getByUserId(req.user.id);
    
    res.json({
      success: true,
      data: grievances
    });
  } catch (error) {
    console.error('Error getting grievances:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/grievances/:id
// @desc    Get grievance by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const grievance = await Grievance.findById(id);
    
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Check if user owns this grievance or is admin
    if (grievance.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this grievance'
      });
    }

    // Get responses for this grievance
    const responses = await Grievance.getResponses(id);

    res.json({
      success: true,
      data: {
        ...grievance,
        responses
      }
    });
  } catch (error) {
    console.error('Error getting grievance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/grievances
// @desc    Create new grievance
// @access  Private
router.post('/', authenticateToken, createGrievanceValidation, async (req, res) => {
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

    const { title, description, category, priority } = req.body;
    const userId = req.user.id;

    const grievance = await Grievance.create({
      userId,
      title,
      description,
      category,
      priority: priority || 'MEDIUM'
    });

    // Create notification for admin
    await Notification.createSystemNotification(
      'admin', // This would be replaced with actual admin user ID
      'New Grievance Filed',
      `A new grievance has been filed: ${title}`,
      'GRIEVANCE',
      { grievanceId: grievance.id, category, priority }
    );

    res.status(201).json({
      success: true,
      message: 'Grievance created successfully',
      data: grievance
    });

  } catch (error) {
    console.error('Error creating grievance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/grievances/:id/response
// @desc    Add response to grievance
// @access  Private
router.post('/:id/response', authenticateToken, responseValidation, async (req, res) => {
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
    const { message } = req.body;
    const userId = req.user.id;

    // Check if grievance exists
    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Check if user owns this grievance or is admin
    if (grievance.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this grievance'
      });
    }

    const response = await Grievance.addResponse(id, {
      userId,
      message,
      isAdmin: false // This would be determined by user role
    });

    res.status(201).json({
      success: true,
      message: 'Response added successfully',
      data: response
    });

  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/grievances/:id/status
// @desc    Update grievance status (admin only)
// @access  Private
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    // Check if grievance exists
    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // This would check if user is admin
    // For now, we'll allow it but in production you'd check user role
    await Grievance.updateStatus(id, status, adminResponse);

    // Create notification for user
    await Notification.createSystemNotification(
      grievance.user_id,
      'Grievance Status Updated',
      `Your grievance "${grievance.title}" status has been updated to ${status}`,
      'GRIEVANCE',
      { grievanceId: id, status }
    );

    res.json({
      success: true,
      message: 'Grievance status updated successfully'
    });

  } catch (error) {
    console.error('Error updating grievance status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/grievances/:id
// @desc    Delete grievance
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if grievance exists and belongs to user
    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    if (grievance.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this grievance'
      });
    }

    await Grievance.delete(id);

    res.json({
      success: true,
      message: 'Grievance deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting grievance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/grievances/stats/overview
// @desc    Get grievance statistics (admin)
// @access  Private
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await Grievance.getStatistics();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting grievance statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 