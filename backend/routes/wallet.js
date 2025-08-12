const express = require('express');
const { body, validationResult } = require('express-validator');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const addFundsValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required')
];

const paymentValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('reference').trim().notEmpty().withMessage('Reference is required')
];

// @route   GET /api/wallet
// @desc    Get user wallet
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    let wallet = await Wallet.getByUserId(req.user.id);
    
    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await Wallet.createForUser(req.user.id);
    }

    res.json({
      success: true,
      data: wallet
    });
  } catch (error) {
    console.error('Error getting wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/wallet/transactions
// @desc    Get wallet transactions
// @access  Private
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    let wallet = await Wallet.getByUserId(req.user.id);
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    const transactions = await Wallet.getTransactions(wallet.id, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/wallet/add-funds
// @desc    Add funds to wallet
// @access  Private
router.post('/add-funds', authenticateToken, addFundsValidation, async (req, res) => {
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

    const { amount, description, reference } = req.body;
    
    let wallet = await Wallet.getByUserId(req.user.id);
    if (!wallet) {
      wallet = await Wallet.createForUser(req.user.id);
    }

    const result = await Wallet.addFunds(wallet.id, parseFloat(amount), description, reference);

    // Create notification
    await Notification.createPaymentNotification(req.user.id, amount, 'CREDIT');

    res.json({
      success: true,
      message: 'Funds added successfully',
      data: {
        newBalance: result.newBalance,
        transaction: {
          type: 'CREDIT',
          amount: parseFloat(amount),
          description,
          reference
        }
      }
    });

  } catch (error) {
    console.error('Error adding funds:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/wallet/payment
// @desc    Process payment from wallet
// @access  Private
router.post('/payment', authenticateToken, paymentValidation, async (req, res) => {
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

    const { amount, description, reference } = req.body;
    
    let wallet = await Wallet.getByUserId(req.user.id);
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    const result = await Wallet.processPayment(wallet.id, parseFloat(amount), description, reference);

    // Create notification
    await Notification.createPaymentNotification(req.user.id, amount, 'DEBIT');

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        newBalance: result.newBalance,
        transaction: {
          type: 'DEBIT',
          amount: parseFloat(amount),
          description,
          reference
        }
      }
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    
    if (error.message === 'Insufficient balance') {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/wallet/balance
// @desc    Get wallet balance
// @access  Private
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    let wallet = await Wallet.getByUserId(req.user.id);
    
    if (!wallet) {
      wallet = await Wallet.createForUser(req.user.id);
    }

    res.json({
      success: true,
      data: {
        balance: wallet.balance
      }
    });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 