const { v4: uuidv4 } = require('uuid');
const hanaConnection = require('../database/hanaConnection');

class Job {
  constructor() {
    this.tableName = 'JOBS';
  }

  // Create new job
  async create(jobData) {
    const { title, description, company, location, salaryMin, salaryMax, requirements, createdBy } = jobData;
    const id = uuidv4();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO ${this.tableName} 
      (id, title, description, company, location, salary_min, salary_max, requirements, status, created_by, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        id, title, description, company, location, salaryMin, salaryMax, requirements, 'ACTIVE', createdBy, now, now
      ]);

      return {
        id,
        title,
        description,
        company,
        location,
        salaryMin,
        salaryMax,
        requirements,
        status: 'ACTIVE',
        createdBy,
        createdAt: now
      };
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  // Get all active jobs
  async getAllActive() {
    const sql = `
      SELECT j.id, j.title, j.description, j.company, j.location, j.salary_min, j.salary_max, j.requirements, j.status, j.created_at,
             u.name as created_by_name
      FROM ${this.tableName} j
      LEFT JOIN USERS u ON j.created_by = u.id
      WHERE j.status = 'ACTIVE'
      ORDER BY j.created_at DESC
    `;

    try {
      return await hanaConnection.executeQuery(sql);
    } catch (error) {
      console.error('Error getting active jobs:', error);
      throw error;
    }
  }

  // Get job by ID
  async findById(id) {
    const sql = `
      SELECT j.id, j.title, j.description, j.company, j.location, j.salary_min, j.salary_max, j.requirements, j.status, j.created_at,
             u.name as created_by_name
      FROM ${this.tableName} j
      LEFT JOIN USERS u ON j.created_by = u.id
      WHERE j.id = ?
    `;

    try {
      const result = await hanaConnection.executeQuery(sql, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error finding job by ID:', error);
      throw error;
    }
  }

  // Get jobs by user
  async getByUser(userId) {
    const sql = `
      SELECT id, title, description, company, location, salary_min, salary_max, requirements, status, created_at
      FROM ${this.tableName} 
      WHERE created_by = ?
      ORDER BY created_at DESC
    `;

    try {
      return await hanaConnection.executeQuery(sql, [userId]);
    } catch (error) {
      console.error('Error getting jobs by user:', error);
      throw error;
    }
  }

  // Update job
  async update(id, updateData) {
    const { title, description, company, location, salaryMin, salaryMax, requirements, status } = updateData;
    const sql = `
      UPDATE ${this.tableName} 
      SET title = ?, description = ?, company = ?, location = ?, salary_min = ?, salary_max = ?, requirements = ?, status = ?, updated_at = ? 
      WHERE id = ?
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        title, description, company, location, salaryMin, salaryMax, requirements, status, new Date().toISOString(), id
      ]);
      return true;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // Delete job
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    try {
      await hanaConnection.executeQuery(sql, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Search jobs
  async search(query) {
    const sql = `
      SELECT j.id, j.title, j.description, j.company, j.location, j.salary_min, j.salary_max, j.requirements, j.status, j.created_at,
             u.name as created_by_name
      FROM ${this.tableName} j
      LEFT JOIN USERS u ON j.created_by = u.id
      WHERE j.status = 'ACTIVE' 
        AND (j.title LIKE ? OR j.description LIKE ? OR j.company LIKE ? OR j.location LIKE ?)
      ORDER BY j.created_at DESC
    `;

    const searchTerm = `%${query}%`;
    try {
      return await hanaConnection.executeQuery(sql, [searchTerm, searchTerm, searchTerm, searchTerm]);
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }
}

module.exports = new Job(); 