const { v4: uuidv4 } = require('uuid');
const hanaConnection = require('../database/hanaConnection');

class Wallet {
  constructor() {
    this.tableName = 'WALLETS';
  }

  // Create wallet for user
  async createForUser(userId) {
    const id = uuidv4();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO ${this.tableName} 
      (id, user_id, balance, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      await hanaConnection.executeQuery(sql, [id, userId, 0, now, now]);
      return { id, userId, balance: 0, createdAt: now };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  // Get wallet by user ID
  async getByUserId(userId) {
    const sql = `
      SELECT w.id, w.user_id, w.balance, w.created_at, w.updated_at,
             u.name as user_name, u.email as user_email
      FROM ${this.tableName} w
      LEFT JOIN USERS u ON w.user_id = u.id
      WHERE w.user_id = ?
    `;

    try {
      const result = await hanaConnection.executeQuery(sql, [userId]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting wallet by user ID:', error);
      throw error;
    }
  }

  // Update wallet balance
  async updateBalance(walletId, newBalance) {
    const sql = `
      UPDATE ${this.tableName} 
      SET balance = ?, updated_at = ? 
      WHERE id = ?
    `;

    try {
      await hanaConnection.executeQuery(sql, [newBalance, new Date().toISOString(), walletId]);
      return true;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      throw error;
    }
  }

  // Add transaction
  async addTransaction(transactionData) {
    const { walletId, type, amount, description, reference } = transactionData;
    const id = uuidv4();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO WALLET_TRANSACTIONS 
      (id, wallet_id, type, amount, description, reference, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await hanaConnection.executeQuery(sql, [id, walletId, type, amount, description, reference, now]);
      return { id, walletId, type, amount, description, reference, createdAt: now };
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  // Get transactions for wallet
  async getTransactions(walletId, limit = 50, offset = 0) {
    const sql = `
      SELECT id, wallet_id, type, amount, description, reference, created_at
      FROM WALLET_TRANSACTIONS 
      WHERE wallet_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    try {
      return await hanaConnection.executeQuery(sql, [walletId, limit, offset]);
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  // Process payment
  async processPayment(walletId, amount, description, reference) {
    try {
      // Get current wallet
      const wallet = await this.getByUserId(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Update balance
      const newBalance = wallet.balance - amount;
      await this.updateBalance(wallet.id, newBalance);

      // Add transaction
      await this.addTransaction({
        walletId: wallet.id,
        type: 'DEBIT',
        amount,
        description,
        reference
      });

      return { success: true, newBalance };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Add funds
  async addFunds(walletId, amount, description, reference) {
    try {
      // Get current wallet
      const wallet = await this.getByUserId(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Update balance
      const newBalance = wallet.balance + amount;
      await this.updateBalance(wallet.id, newBalance);

      // Add transaction
      await this.addTransaction({
        walletId: wallet.id,
        type: 'CREDIT',
        amount,
        description,
        reference
      });

      return { success: true, newBalance };
    } catch (error) {
      console.error('Error adding funds:', error);
      throw error;
    }
  }
}

module.exports = new Wallet(); 