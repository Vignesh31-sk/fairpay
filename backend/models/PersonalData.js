const { v4: uuidv4 } = require('uuid');
const hanaConnection = require('../database/hanaConnection');

class PersonalData {
  constructor() {
    this.tableName = 'PERSONAL_DATA';
  }

  // Create personal data
  async create(userId, personalData) {
    const { age, location, occupation, education, experience, skills } = personalData;
    const id = uuidv4();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO ${this.tableName} 
      (id, user_id, age, location, occupation, education, experience, skills, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        id, userId, age, location, occupation, education, experience, skills, now, now
      ]);

      return {
        id,
        userId,
        age,
        location,
        occupation,
        education,
        experience,
        skills,
        createdAt: now
      };
    } catch (error) {
      console.error('Error creating personal data:', error);
      throw error;
    }
  }

  // Get personal data by user ID
  async getByUserId(userId) {
    const sql = `
      SELECT id, user_id, age, location, occupation, education, experience, skills, created_at, updated_at 
      FROM ${this.tableName} 
      WHERE user_id = ?
    `;

    try {
      const result = await hanaConnection.executeQuery(sql, [userId]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting personal data:', error);
      throw error;
    }
  }

  // Update personal data
  async update(userId, updateData) {
    const { age, location, occupation, education, experience, skills } = updateData;
    const sql = `
      UPDATE ${this.tableName} 
      SET age = ?, location = ?, occupation = ?, education = ?, experience = ?, skills = ?, updated_at = ? 
      WHERE user_id = ?
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        age, location, occupation, education, experience, skills, new Date().toISOString(), userId
      ]);
      return true;
    } catch (error) {
      console.error('Error updating personal data:', error);
      throw error;
    }
  }

  // Delete personal data
  async delete(userId) {
    const sql = `DELETE FROM ${this.tableName} WHERE user_id = ?`;
    try {
      await hanaConnection.executeQuery(sql, [userId]);
      return true;
    } catch (error) {
      console.error('Error deleting personal data:', error);
      throw error;
    }
  }

  // Get all personal data (for admin purposes)
  async getAll() {
    const sql = `
      SELECT pd.*, u.name, u.email 
      FROM ${this.tableName} pd 
      JOIN USERS u ON pd.user_id = u.id 
      ORDER BY pd.created_at DESC
    `;

    try {
      return await hanaConnection.executeQuery(sql);
    } catch (error) {
      console.error('Error getting all personal data:', error);
      throw error;
    }
  }
}

module.exports = new PersonalData(); 