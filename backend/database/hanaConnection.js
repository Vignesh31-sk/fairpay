const hanaClient = require("@sap/hana-client");
require('dotenv').config({ path: './config.env' });

class HanaConnection {
  constructor() {
    this.connectionPool = [];
    this.maxConnections = 10;
    this.currentConnections = 0;
  }

  // Get connection parameters from environment variables
  getConnectionParams() {
    return {
      serverNode: process.env.HANA_SERVER,
      uid: process.env.HANA_UID,
      pwd: process.env.HANA_PWD,
      schema: process.env.HANA_SCHEMA || 'SYSTEM'
    };
  }

  // Create a new connection
  createConnection() {
    return hanaClient.createConnection();
  }

  // Get connection from pool or create new one
  async getConnection() {
    if (this.connectionPool.length > 0) {
      return this.connectionPool.pop();
    }

    if (this.currentConnections < this.maxConnections) {
      const conn = this.createConnection();
      this.currentConnections++;
      
      try {
        await this.connect(conn);
        return conn;
      } catch (error) {
        this.currentConnections--;
        throw error;
      }
    }

    throw new Error('Maximum connections reached');
  }

  // Connect to HANA
  async connect(conn) {
    return new Promise((resolve, reject) => {
      const params = this.getConnectionParams();
      
      conn.connect(params, (err) => {
        if (err) {
          console.error('❌ HANA Connection failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Connected to SAP HANA successfully!');
          resolve(conn);
        }
      });
    });
  }

  // Execute query
  async executeQuery(sql, params = []) {
    const conn = await this.getConnection();
    
    return new Promise((resolve, reject) => {
      conn.exec(sql, params, (err, result) => {
        if (err) {
          console.error('Query error:', err.message);
          reject(err);
        } else {
          resolve(result);
        }
        
        // Return connection to pool
        this.returnConnection(conn);
      });
    });
  }

  // Execute query with callback
  executeQueryWithCallback(sql, params = [], callback) {
    this.getConnection().then(conn => {
      conn.exec(sql, params, (err, result) => {
        if (err) {
          console.error('Query error:', err.message);
          callback(err, null);
        } else {
          callback(null, result);
        }
        
        // Return connection to pool
        this.returnConnection(conn);
      });
    }).catch(err => {
      callback(err, null);
    });
  }

  // Return connection to pool
  returnConnection(conn) {
    if (this.connectionPool.length < this.maxConnections) {
      this.connectionPool.push(conn);
    } else {
      conn.disconnect();
      this.currentConnections--;
    }
  }

    // Initialize database tables
  async initializeTables() {
    try {
      // Create tables if they don't exist (ignore errors if they do exist)
      console.log('📝 Creating USERS table...');
      try {
        await this.executeQuery(`
          CREATE TABLE USERS (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(20) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            kyc_status VARCHAR(20) DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Table USERS created successfully');
      } catch (error) {
        if (error.message.includes('duplicate table name')) {
          console.log('✅ Table USERS already exists');
        } else {
          throw error;
        }
      }

      console.log('📝 Creating PERSONAL_DATA table...');
      try {
        await this.executeQuery(`
          CREATE TABLE PERSONAL_DATA (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            age INTEGER,
            location VARCHAR(100),
            occupation VARCHAR(100),
            education VARCHAR(100),
            experience INTEGER,
            skills TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Table PERSONAL_DATA created successfully');
      } catch (error) {
        if (error.message.includes('duplicate table name')) {
          console.log('✅ Table PERSONAL_DATA already exists');
        } else {
          throw error;
        }
      }

      console.log('📝 Creating KYC_DOCUMENTS table...');
      try {
        await this.executeQuery(`
          CREATE TABLE KYC_DOCUMENTS (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            document_type VARCHAR(50) NOT NULL,
            document_number VARCHAR(100),
            file_path VARCHAR(255),
            verification_status VARCHAR(20) DEFAULT 'PENDING',
            verified_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Table KYC_DOCUMENTS created successfully');
      } catch (error) {
        if (error.message.includes('duplicate table name')) {
          console.log('✅ Table KYC_DOCUMENTS already exists');
        } else {
          throw error;
        }
      }

      console.log('📝 Creating WALLETS table...');
      try {
        await this.executeQuery(`
          CREATE TABLE WALLETS (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            balance DECIMAL(10,2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Table WALLETS created successfully');
      } catch (error) {
        if (error.message.includes('duplicate table name')) {
          console.log('✅ Table WALLETS already exists');
        } else {
          throw error;
        }
      }

      console.log('📝 Creating WALLET_TRANSACTIONS table...');
      try {
        await this.executeQuery(`
          CREATE TABLE WALLET_TRANSACTIONS (
            id VARCHAR(36) PRIMARY KEY,
            wallet_id VARCHAR(36) NOT NULL,
            type VARCHAR(20) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            description TEXT,
            reference VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Table WALLET_TRANSACTIONS created successfully');
      } catch (error) {
        if (error.message.includes('duplicate table name')) {
          console.log('✅ Table WALLET_TRANSACTIONS already exists');
        } else {
          throw error;
        }
      }

      console.log('📝 Creating NOTIFICATIONS table...');
      try {
        await this.executeQuery(`
          CREATE TABLE NOTIFICATIONS (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) DEFAULT 'INFO',
            data TEXT,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Table NOTIFICATIONS created successfully');
      } catch (error) {
        if (error.message.includes('duplicate table name')) {
          console.log('✅ Table NOTIFICATIONS already exists');
        } else {
          throw error;
        }
      }

      console.log('📝 Creating GRIEVANCES table...');
      try {
        await this.executeQuery(`
          CREATE TABLE GRIEVANCES (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            category VARCHAR(100) NOT NULL,
            priority VARCHAR(20) DEFAULT 'MEDIUM',
            status VARCHAR(20) DEFAULT 'OPEN',
            admin_response TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Table GRIEVANCES created successfully');
      } catch (error) {
        if (error.message.includes('duplicate table name')) {
          console.log('✅ Table GRIEVANCES already exists');
        } else {
          throw error;
        }
      }

      console.log('📝 Creating GRIEVANCE_RESPONSES table...');
      try {
        await this.executeQuery(`
          CREATE TABLE GRIEVANCE_RESPONSES (
            id VARCHAR(36) PRIMARY KEY,
            grievance_id VARCHAR(36) NOT NULL,
            user_id VARCHAR(36) NOT NULL,
            message TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Table GRIEVANCE_RESPONSES created successfully');
      } catch (error) {
        if (error.message.includes('duplicate table name')) {
          console.log('✅ Table GRIEVANCE_RESPONSES already exists');
        } else {
          throw error;
        }
      }

      console.log('📝 Creating JOBS table...');
      try {
        await this.executeQuery(`
          CREATE TABLE JOBS (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description TEXT,
            company VARCHAR(100),
            location VARCHAR(100),
            salary_min DECIMAL(10,2),
            salary_max DECIMAL(10,2),
            requirements TEXT,
            status VARCHAR(20) DEFAULT 'ACTIVE',
            created_by VARCHAR(36),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Table JOBS created successfully');
      } catch (error) {
        if (error.message.includes('duplicate table name')) {
          console.log('✅ Table JOBS already exists');
        } else {
          throw error;
        }
      }

      console.log('✅ Database tables initialized successfully!');
    } catch (error) {
      console.error('❌ Error initializing tables:', error.message);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      const result = await this.executeQuery("SELECT CURRENT_USER, CURRENT_TIMESTAMP FROM DUMMY");
      console.log('✅ Connection test successful:', result);
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }

  // Close all connections
  async closeAllConnections() {
    for (const conn of this.connectionPool) {
      conn.disconnect();
    }
    this.connectionPool = [];
    this.currentConnections = 0;
    console.log('✅ All connections closed');
  }
}

// Create singleton instance
const hanaConnection = new HanaConnection();

module.exports = hanaConnection; 