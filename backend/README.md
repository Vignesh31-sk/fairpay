# FairPay Backend API

A comprehensive Node.js/Express backend API for the FairPay Indian worker payment platform, built with SAP HANA database integration.

## 🚀 Features

- **RESTful API** with Express.js
- **SAP HANA Integration** for enterprise-grade data persistence
- **JWT Authentication** with bcrypt password hashing
- **File Upload Support** for KYC documents
- **Real-time Data** synchronization
- **Comprehensive Data Seeding** for realistic testing

## 📋 Prerequisites

- Node.js (v16 or higher)
- SAP HANA database access
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `config.env` file in the backend directory:

```env
PORT=3001
DB_HOST=your-hana-host
DB_PORT=39015
DB_USER=SYSTEM
DB_PASSWORD=your-password
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://your-frontend-url
NODE_ENV=development
```

### 3. Database Setup
The application will automatically create the required tables on startup:

- **USERS** - User authentication and basic info
- **PERSONAL_DATA** - Extended user profile information
- **KYC_DOCUMENTS** - Identity verification documents
- **JOBS** - Job listings and opportunities
- **WALLETS** - User wallet balances
- **WALLET_TRANSACTIONS** - Payment history
- **NOTIFICATIONS** - User notifications
- **GRIEVANCES** - Support tickets
- **GRIEVANCE_RESPONSES** - Ticket responses

### 4. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in config.env).

## 📊 API Endpoints

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Personal Data
```
POST /api/personal-data
GET  /api/personal-data
```

### Jobs
```
GET  /api/jobs
GET  /api/jobs/:id
POST /api/jobs
PUT  /api/jobs/:id
DELETE /api/jobs/:id
GET  /api/jobs/search
GET  /api/jobs/user/my-jobs
```

### Wallet
```
GET  /api/wallet/balance
GET  /api/wallet/transactions
POST /api/wallet/add-funds
POST /api/wallet/payment
```

### Notifications
```
GET  /api/notifications
GET  /api/notifications/unread-count
PUT  /api/notifications/:id/read
PUT  /api/notifications/mark-all-read
DELETE /api/notifications/:id
```

### Grievances
```
GET  /api/grievances
GET  /api/grievances/:id
POST /api/grievances
POST /api/grievances/:id/response
PUT  /api/grievances/:id/status
DELETE /api/grievances/:id
GET  /api/grievances/stats/overview
```

### Health Check
```
GET /health
```

## 🌱 Data Seeding

To populate the database with realistic test data:

```bash
node seed-data.js
```

This will create:
- **1000+ realistic Indian worker profiles** across all states
- **200+ job listings** in various categories
- **Wallet data** with transaction history
- **Notifications** for various events
- **Grievances** with different statuses
- **KYC documents** for verification

### Seeded Data Includes:
- Users from all major Indian states
- Realistic Indian names and contact information
- Job categories: construction, transport, manufacturing, agriculture, services, retail, hospitality, logistics
- Salary ranges from ₹8,000 to ₹40,000
- Transaction amounts from ₹500 to ₹5,000
- Various notification types and grievance categories

## 🔧 Development

### Running in Development Mode
```bash
npm start
```

### Running with Nodemon (Auto-restart)
```bash
npm run dev
```

### Database Connection Test
```bash
node testConnection.js
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### API Testing Examples

#### User Signup
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "password123"
  }'
```

#### Get Jobs (with authentication)
```bash
curl -X GET http://localhost:3001/api/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📁 Project Structure

```
backend/
├── database/
│   └── hanaConnection.js    # SAP HANA connection management
├── models/
│   ├── User.js             # User model and authentication
│   ├── PersonalData.js     # Personal data model
│   ├── KYCDocument.js      # KYC document model
│   ├── Job.js              # Job model
│   ├── Wallet.js           # Wallet and transaction model
│   ├── Notification.js     # Notification model
│   └── Grievance.js        # Grievance model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── jobs.js             # Job management routes
│   ├── wallet.js           # Wallet routes
│   ├── notifications.js    # Notification routes
│   └── grievances.js       # Grievance routes
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── uploads/                # File upload directory
├── server.js               # Main server file
├── seed-data.js            # Data seeding script
├── config.env              # Environment variables
└── package.json            # Dependencies and scripts
```

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Properly configured CORS for frontend integration
- **Environment Variables**: Sensitive data stored in environment variables
- **SQL Injection Protection**: Parameterized queries for all database operations

## 📈 Performance Optimizations

- **Connection Pooling**: Efficient SAP HANA connection management
- **Query Optimization**: Optimized database queries with proper indexing
- **Error Handling**: Comprehensive error handling and logging
- **Rate Limiting**: Built-in rate limiting for API endpoints
- **Compression**: Response compression for better performance

## 🚀 Production Deployment

### Environment Setup
```bash
# Set production environment
NODE_ENV=production

# Update config.env with production values
PORT=3001
DB_HOST=production-hana-host
DB_PASSWORD=production-password
JWT_SECRET=production-jwt-secret
```

### Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "fairpay-backend"

# Using Docker
docker build -t fairpay-backend .
docker run -p 3001:3001 fairpay-backend
```

## 🔍 Monitoring and Logging

The application includes comprehensive logging:
- Database connection status
- API request/response logging
- Error tracking and debugging
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**FairPay Backend** - Enterprise-grade API for Indian worker payment platform. 