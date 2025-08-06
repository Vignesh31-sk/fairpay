const { v4: uuidv4 } = require('uuid');
const hanaConnection = require('../database/hanaConnection');

class KYCDocument {
  constructor() {
    this.tableName = 'KYC_DOCUMENTS';
  }

  // Create KYC document
  async create(userId, documentData) {
    const { documentType, documentNumber, filePath } = documentData;
    const id = uuidv4();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO ${this.tableName} 
      (id, user_id, document_type, document_number, file_path, verification_status, created_at) 
      VALUES (?, ?, ?, ?, ?, 'PENDING', ?)
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        id, userId, documentType, documentNumber, filePath, now
      ]);

      return {
        id,
        userId,
        documentType,
        documentNumber,
        filePath,
        verificationStatus: 'PENDING',
        createdAt: now
      };
    } catch (error) {
      console.error('Error creating KYC document:', error);
      throw error;
    }
  }

  // Get KYC documents by user ID
  async getByUserId(userId) {
    const sql = `
      SELECT id, user_id, document_type, document_number, file_path, verification_status, verified_at, created_at 
      FROM ${this.tableName} 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    try {
      return await hanaConnection.executeQuery(sql, [userId]);
    } catch (error) {
      console.error('Error getting KYC documents:', error);
      throw error;
    }
  }

  // Update verification status
  async updateVerificationStatus(id, status, verifiedAt = null) {
    const sql = `
      UPDATE ${this.tableName} 
      SET verification_status = ?, verified_at = ? 
      WHERE id = ?
    `;

    try {
      await hanaConnection.executeQuery(sql, [status, verifiedAt, id]);
      return true;
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw error;
    }
  }

  // Get document by ID
  async getById(id) {
    const sql = `
      SELECT id, user_id, document_type, document_number, file_path, verification_status, verified_at, created_at 
      FROM ${this.tableName} 
      WHERE id = ?
    `;

    try {
      const result = await hanaConnection.executeQuery(sql, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting KYC document by ID:', error);
      throw error;
    }
  }

  // Delete KYC document
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    try {
      await hanaConnection.executeQuery(sql, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting KYC document:', error);
      throw error;
    }
  }

  // Get all KYC documents (for admin purposes)
  async getAll() {
    const sql = `
      SELECT kd.*, u.name, u.email 
      FROM ${this.tableName} kd 
      JOIN USERS u ON kd.user_id = u.id 
      ORDER BY kd.created_at DESC
    `;

    try {
      return await hanaConnection.executeQuery(sql);
    } catch (error) {
      console.error('Error getting all KYC documents:', error);
      throw error;
    }
  }

  // Get pending verifications
  async getPendingVerifications() {
    const sql = `
      SELECT kd.*, u.name, u.email 
      FROM ${this.tableName} kd 
      JOIN USERS u ON kd.user_id = u.id 
      WHERE kd.verification_status = 'PENDING'
      ORDER BY kd.created_at ASC
    `;

    try {
      return await hanaConnection.executeQuery(sql);
    } catch (error) {
      console.error('Error getting pending verifications:', error);
      throw error;
    }
  }

  // Get verified documents
  async getVerifiedDocuments() {
    const sql = `
      SELECT kd.*, u.name, u.email 
      FROM ${this.tableName} kd 
      JOIN USERS u ON kd.user_id = u.id 
      WHERE kd.verification_status = 'VERIFIED'
      ORDER BY kd.verified_at DESC
    `;

    try {
      return await hanaConnection.executeQuery(sql);
    } catch (error) {
      console.error('Error getting verified documents:', error);
      throw error;
    }
  }
}

module.exports = new KYCDocument(); 