const { v4: uuidv4 } = require('uuid');
const hanaConnection = require('../database/hanaConnection');

class Grievance {
  constructor() {
    this.tableName = 'GRIEVANCES';
  }

  // Create grievance
  async create(grievanceData) {
    const { userId, title, description, category, priority } = grievanceData;
    const id = uuidv4();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO ${this.tableName} 
      (id, user_id, title, description, category, priority, status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        id, userId, title, description, category, priority, 'OPEN', now, now
      ]);

      return {
        id,
        userId,
        title,
        description,
        category,
        priority,
        status: 'OPEN',
        createdAt: now
      };
    } catch (error) {
      console.error('Error creating grievance:', error);
      throw error;
    }
  }

  // Get grievances by user
  async getByUserId(userId) {
    const sql = `
      SELECT g.id, g.title, g.description, g.category, g.priority, g.status, g.created_at, g.updated_at,
             u.name as user_name, u.email as user_email
      FROM ${this.tableName} g
      LEFT JOIN USERS u ON g.user_id = u.id
      WHERE g.user_id = ?
      ORDER BY g.created_at DESC
    `;

    try {
      return await hanaConnection.executeQuery(sql, [userId]);
    } catch (error) {
      console.error('Error getting grievances by user ID:', error);
      throw error;
    }
  }

  // Get grievance by ID
  async findById(id) {
    const sql = `
      SELECT g.id, g.title, g.description, g.category, g.priority, g.status, g.created_at, g.updated_at,
             u.name as user_name, u.email as user_email
      FROM ${this.tableName} g
      LEFT JOIN USERS u ON g.user_id = u.id
      WHERE g.id = ?
    `;

    try {
      const result = await hanaConnection.executeQuery(sql, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error finding grievance by ID:', error);
      throw error;
    }
  }

  // Update grievance status
  async updateStatus(id, status, adminResponse = null) {
    const sql = `
      UPDATE ${this.tableName} 
      SET status = ?, admin_response = ?, updated_at = ? 
      WHERE id = ?
    `;

    try {
      await hanaConnection.executeQuery(sql, [status, adminResponse, new Date().toISOString(), id]);
      return true;
    } catch (error) {
      console.error('Error updating grievance status:', error);
      throw error;
    }
  }

  // Add response to grievance
  async addResponse(grievanceId, responseData) {
    const { userId, message, isAdmin } = responseData;
    const id = uuidv4();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO GRIEVANCE_RESPONSES 
      (id, grievance_id, user_id, message, is_admin, created_at) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      await hanaConnection.executeQuery(sql, [id, grievanceId, userId, message, isAdmin, now]);
      return { id, grievanceId, userId, message, isAdmin, createdAt: now };
    } catch (error) {
      console.error('Error adding grievance response:', error);
      throw error;
    }
  }

  // Get responses for grievance
  async getResponses(grievanceId) {
    const sql = `
      SELECT r.id, r.grievance_id, r.user_id, r.message, r.is_admin, r.created_at,
             u.name as user_name
      FROM GRIEVANCE_RESPONSES r
      LEFT JOIN USERS u ON r.user_id = u.id
      WHERE r.grievance_id = ?
      ORDER BY r.created_at ASC
    `;

    try {
      return await hanaConnection.executeQuery(sql, [grievanceId]);
    } catch (error) {
      console.error('Error getting grievance responses:', error);
      throw error;
    }
  }

  // Get all grievances (admin)
  async getAll(limit = 50, offset = 0, status = null) {
    let sql = `
      SELECT g.id, g.title, g.description, g.category, g.priority, g.status, g.created_at, g.updated_at,
             u.name as user_name, u.email as user_email
      FROM ${this.tableName} g
      LEFT JOIN USERS u ON g.user_id = u.id
    `;

    const params = [];
    if (status) {
      sql += ' WHERE g.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY g.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    try {
      return await hanaConnection.executeQuery(sql, params);
    } catch (error) {
      console.error('Error getting all grievances:', error);
      throw error;
    }
  }

  // Get grievance statistics
  async getStatistics() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) as closed
      FROM ${this.tableName}
    `;

    try {
      const result = await hanaConnection.executeQuery(sql);
      return result[0];
    } catch (error) {
      console.error('Error getting grievance statistics:', error);
      throw error;
    }
  }

  // Delete grievance
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    try {
      await hanaConnection.executeQuery(sql, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting grievance:', error);
      throw error;
    }
  }
}

module.exports = new Grievance(); 