const { v4: uuidv4 } = require('uuid');
const hanaConnection = require('../database/hanaConnection');

class Notification {
  constructor() {
    this.tableName = 'NOTIFICATIONS';
  }

  // Create notification
  async create(notificationData) {
    const { userId, title, message, type, data } = notificationData;
    const id = uuidv4();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO ${this.tableName} 
      (id, user_id, title, message, type, data, is_read, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await hanaConnection.executeQuery(sql, [
        id, userId, title, message, type, JSON.stringify(data || {}), false, now
      ]);

      return {
        id,
        userId,
        title,
        message,
        type,
        data,
        isRead: false,
        createdAt: now
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get notifications for user
  async getByUserId(userId, limit = 50, offset = 0) {
    const sql = `
      SELECT id, user_id, title, message, type, data, is_read, created_at
      FROM ${this.tableName} 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const notifications = await hanaConnection.executeQuery(sql, [userId, limit, offset]);
      return notifications.map(notification => ({
        ...notification,
        data: JSON.parse(notification.data || '{}')
      }));
    } catch (error) {
      console.error('Error getting notifications by user ID:', error);
      throw error;
    }
  }

  // Get unread notifications count
  async getUnreadCount(userId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM ${this.tableName} 
      WHERE user_id = ? AND is_read = false
    `;

    try {
      const result = await hanaConnection.executeQuery(sql, [userId]);
      return result[0].count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    const sql = `
      UPDATE ${this.tableName} 
      SET is_read = true 
      WHERE id = ?
    `;

    try {
      await hanaConnection.executeQuery(sql, [notificationId]);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId) {
    const sql = `
      UPDATE ${this.tableName} 
      SET is_read = true 
      WHERE user_id = ?
    `;

    try {
      await hanaConnection.executeQuery(sql, [userId]);
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  async delete(notificationId) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    try {
      await hanaConnection.executeQuery(sql, [notificationId]);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Create system notification
  async createSystemNotification(userId, title, message, type = 'INFO', data = {}) {
    return this.create({
      userId,
      title,
      message,
      type,
      data
    });
  }

  // Create job application notification
  async createJobApplicationNotification(userId, jobTitle, companyName) {
    return this.create({
      userId,
      title: 'Job Application Submitted',
      message: `Your application for ${jobTitle} at ${companyName} has been submitted successfully.`,
      type: 'JOB_APPLICATION',
      data: { jobTitle, companyName }
    });
  }

  // Create payment notification
  async createPaymentNotification(userId, amount, type) {
    const title = type === 'CREDIT' ? 'Funds Added' : 'Payment Processed';
    const message = type === 'CREDIT' 
      ? `$${amount} has been added to your wallet.`
      : `Payment of $${amount} has been processed.`;

    return this.create({
      userId,
      title,
      message,
      type: 'PAYMENT',
      data: { amount, type }
    });
  }

  // Create KYC notification
  async createKycNotification(userId, status) {
    const title = status === 'VERIFIED' ? 'KYC Verified' : 'KYC Update';
    const message = status === 'VERIFIED' 
      ? 'Your KYC verification has been completed successfully.'
      : `Your KYC status has been updated to ${status}.`;

    return this.create({
      userId,
      title,
      message,
      type: 'KYC',
      data: { status }
    });
  }
}

module.exports = new Notification(); 