const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const hanaConnection = require('../database/hanaConnection');

class User {
  constructor() {
    this.tableName = 'USERS';
  }

  // Create new user
  async create(userData) {
    const { name, email, phone, password } = userData;
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO ${this.tableName} 
      (ID, NAME, EMAIL, PHONE, PASSWORD_HASH, CREATED_AT, UPDATED_AT) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        id, name, email, phone, passwordHash, now, now
      ]);

      return {
        id,
        name,
        email,
        phone,
        isVerified: false,
        kycStatus: 'PENDING',
        createdAt: now
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by email or phone
  async findByEmailOrPhone(identifier) {
    const sql = `
      SELECT ID, NAME, EMAIL, PHONE, PASSWORD_HASH, IS_VERIFIED, KYC_STATUS, CREATED_AT 
      FROM ${this.tableName} 
      WHERE EMAIL = ? OR PHONE = ?
    `;

    try {
      const result = await hanaConnection.executeQuery(sql, [identifier, identifier]);
      if (result.length > 0) {
        const user = result[0];
        return {
          id: user.ID,
          name: user.NAME,
          email: user.EMAIL,
          phone: user.PHONE,
          password_hash: user.PASSWORD_HASH,
          is_verified: user.IS_VERIFIED,
          kyc_status: user.KYC_STATUS,
          created_at: user.CREATED_AT
        };
      }
      return null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  // Find user by ID
  async findById(id) {
    const sql = `
      SELECT ID, NAME, EMAIL, PHONE, IS_VERIFIED, KYC_STATUS, CREATED_AT 
      FROM ${this.tableName} 
      WHERE ID = ?
    `;

    try {
      const result = await hanaConnection.executeQuery(sql, [id]);
      if (result.length > 0) {
        const user = result[0];
        return {
          id: user.ID,
          name: user.NAME,
          email: user.EMAIL,
          phone: user.PHONE,
          is_verified: user.IS_VERIFIED,
          kyc_status: user.KYC_STATUS,
          created_at: user.CREATED_AT
        };
      }
      return null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Update user verification status
  async updateVerificationStatus(id, isVerified, kycStatus = 'VERIFIED') {
    const sql = `
      UPDATE ${this.tableName} 
      SET IS_VERIFIED = ?, KYC_STATUS = ?, UPDATED_AT = ? 
      WHERE ID = ?
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        isVerified, kycStatus, new Date().toISOString(), id
      ]);
      return true;
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(id, updateData) {
    const { name, email, phone } = updateData;
    const sql = `
      UPDATE ${this.tableName} 
      SET NAME = ?, EMAIL = ?, PHONE = ?, UPDATED_AT = ? 
      WHERE ID = ?
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        name, email, phone, new Date().toISOString(), id
      ]);
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(user, password) {
    if (!user || !user.password_hash) {
      return false;
    }
    return bcrypt.compare(password, user.password_hash);
  }

  // Check if email exists
  async emailExists(email) {
    const sql = `SELECT ID FROM ${this.tableName} WHERE EMAIL = ?`;
    try {
      const result = await hanaConnection.executeQuery(sql, [email]);
      return result.length > 0;
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw error;
    }
  }

  // Check if phone exists
  async phoneExists(phone) {
    const sql = `SELECT ID FROM ${this.tableName} WHERE PHONE = ?`;
    try {
      const result = await hanaConnection.executeQuery(sql, [phone]);
      return result.length > 0;
    } catch (error) {
      console.error('Error checking phone existence:', error);
      throw error;
    }
  }

  // Get all users (for admin purposes)
  async getAllUsers() {
    const sql = `
      SELECT ID, NAME, EMAIL, PHONE, IS_VERIFIED, KYC_STATUS, CREATED_AT 
      FROM ${this.tableName} 
      ORDER BY CREATED_AT DESC
    `;

    try {
      const result = await hanaConnection.executeQuery(sql);
      return result.map(user => ({
        id: user.ID,
        name: user.NAME,
        email: user.EMAIL,
        phone: user.PHONE,
        is_verified: user.IS_VERIFIED,
        kyc_status: user.KYC_STATUS,
        created_at: user.CREATED_AT
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Delete user (for admin purposes)
  async deleteUser(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE ID = ?`;
    try {
      await hanaConnection.executeQuery(sql, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = new User(); 