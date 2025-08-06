const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const KYCDocument = require('../models/KYCDocument');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and PDF files are allowed.'), false);
    }
  }
});

// Validation rules
const kycDocumentValidation = [
  body('documentType').isIn(['AADHAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE']).withMessage('Invalid document type'),
  body('documentNumber').trim().isLength({ min: 1 }).withMessage('Document number is required')
];

// @route   POST /api/kyc/upload
// @desc    Upload KYC document
// @access  Private
router.post('/upload', authenticateToken, upload.single('document'), kycDocumentValidation, async (req, res) => {
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Document file is required'
      });
    }

    const { documentType, documentNumber } = req.body;
    const userId = req.user.id;
    const filePath = req.file.path;

    // Create KYC document record
    const kycDocument = await KYCDocument.create(userId, {
      documentType,
      documentNumber,
      filePath
    });

    res.status(201).json({
      success: true,
      message: 'KYC document uploaded successfully',
      data: {
        document: {
          id: kycDocument.id,
          documentType: kycDocument.documentType,
          documentNumber: kycDocument.documentNumber,
          verificationStatus: kycDocument.verificationStatus,
          createdAt: kycDocument.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Upload KYC document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/kyc/documents
// @desc    Get KYC documents for current user
// @access  Private
router.get('/documents', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const documents = await KYCDocument.getByUserId(userId);

    res.json({
      success: true,
      data: {
        documents: documents.map(doc => ({
          id: doc.ID,
          documentType: doc.DOCUMENT_TYPE,
          documentNumber: doc.DOCUMENT_NUMBER,
          verificationStatus: doc.VERIFICATION_STATUS,
          verifiedAt: doc.VERIFIED_AT,
          createdAt: doc.CREATED_AT
        }))
      }
    });

  } catch (error) {
    console.error('Get KYC documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/kyc/verify
// @desc    Verify KYC documents (admin function)
// @access  Private
router.post('/verify/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status, remarks } = req.body;

    // Get document
    const document = await KYCDocument.getById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update verification status
    const verifiedAt = status === 'VERIFIED' ? new Date().toISOString() : null;
    await KYCDocument.updateVerificationStatus(documentId, status, verifiedAt);

    // If verified, update user verification status
    if (status === 'VERIFIED') {
      await User.updateVerificationStatus(document.USER_ID, true, 'VERIFIED');
    }

    res.json({
      success: true,
      message: 'Document verification status updated successfully',
      data: {
        documentId,
        status,
        verifiedAt
      }
    });

  } catch (error) {
    console.error('Verify KYC document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/kyc/status
// @desc    Get KYC verification status for current user
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const documents = await KYCDocument.getByUserId(userId);

    const verificationStatus = {
      isVerified: user.IS_VERIFIED,
      kycStatus: user.KYC_STATUS,
      documents: documents.map(doc => ({
        id: doc.ID,
        documentType: doc.DOCUMENT_TYPE,
        verificationStatus: doc.VERIFICATION_STATUS,
        verifiedAt: doc.VERIFIED_AT
      }))
    };

    res.json({
      success: true,
      data: {
        verificationStatus
      }
    });

  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/kyc/pending
// @desc    Get pending KYC verifications (admin function)
// @access  Private
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    const pendingDocuments = await KYCDocument.getPendingVerifications();

    res.json({
      success: true,
      data: {
        pendingDocuments: pendingDocuments.map(doc => ({
          id: doc.ID,
          userId: doc.USER_ID,
          userName: doc.NAME,
          userEmail: doc.EMAIL,
          documentType: doc.DOCUMENT_TYPE,
          documentNumber: doc.DOCUMENT_NUMBER,
          createdAt: doc.CREATED_AT
        }))
      }
    });

  } catch (error) {
    console.error('Get pending KYC verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/kyc/documents/:documentId
// @desc    Delete KYC document
// @access  Private
router.delete('/documents/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    // Get document
    const document = await KYCDocument.getById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if user owns the document
    if (document.USER_ID !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete file from filesystem
    if (document.FILE_PATH && fs.existsSync(document.FILE_PATH)) {
      fs.unlinkSync(document.FILE_PATH);
    }

    // Delete from database
    await KYCDocument.delete(documentId);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete KYC document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 