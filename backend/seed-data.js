const User = require('./models/User');
const PersonalData = require('./models/PersonalData');
const KYCDocument = require('./models/KYCDocument');
const Job = require('./models/Job');
const Wallet = require('./models/Wallet');
const Notification = require('./models/Notification');
const Grievance = require('./models/Grievance');
const hanaConnection = require('./database/hanaConnection');

// Indian states and cities
const states = [
  { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'] },
  { name: 'Delhi', cities: ['New Delhi', 'Delhi', 'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad'] },
  { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'] },
  { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Vellore'] },
  { name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'] },
  { name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Ghaziabad'] },
  { name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman'] },
  { name: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Adilabad'] },
  { name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'] },
  { name: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'] },
  { name: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'] },
  { name: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'] },
  { name: 'Punjab', cities: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'] },
  { name: 'Haryana', cities: ['Gurgaon', 'Faridabad', 'Panipat', 'Yamunanagar', 'Rohtak', 'Hisar'] },
  { name: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'] },
  { name: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur'] },
  { name: 'Assam', cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tinsukia'] },
  { name: 'Jharkhand', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh'] },
  { name: 'Chhattisgarh', cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Jagdalpur'] },
  { name: 'Uttarakhand', cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur'] }
];

// Indian names (first names and surnames)
const firstNames = [
  'Rajesh', 'Amit', 'Suresh', 'Ramesh', 'Kumar', 'Anil', 'Sunil', 'Mohan', 'Vijay', 'Prakash',
  'Rahul', 'Arun', 'Deepak', 'Sanjay', 'Ajay', 'Vikram', 'Manish', 'Naresh', 'Dinesh', 'Ravi',
  'Priya', 'Anita', 'Sunita', 'Rekha', 'Meena', 'Kavita', 'Sangeeta', 'Pooja', 'Neha', 'Ritu',
  'Jyoti', 'Lakshmi', 'Sita', 'Radha', 'Gita', 'Maya', 'Asha', 'Uma', 'Kiran', 'Shanti'
];

const lastNames = [
  'Kumar', 'Singh', 'Sharma', 'Verma', 'Patel', 'Gupta', 'Yadav', 'Raj', 'Kaur', 'Chopra',
  'Malhotra', 'Kapoor', 'Joshi', 'Reddy', 'Naik', 'Khan', 'Ali', 'Hussain', 'Ahmed', 'Khan',
  'Pillai', 'Nair', 'Menon', 'Krishnan', 'Iyer', 'Rao', 'Gowda', 'Shetty', 'Hegde', 'Bhat'
];

// Job categories and titles
const jobCategories = [
  { category: 'construction', titles: ['Mason', 'Carpenter', 'Electrician', 'Plumber', 'Painter', 'Welder', 'Laborer'] },
  { category: 'transport', titles: ['Driver', 'Delivery Partner', 'Truck Driver', 'Auto Driver', 'Taxi Driver'] },
  { category: 'manufacturing', titles: ['Factory Worker', 'Machine Operator', 'Assembly Worker', 'Quality Inspector'] },
  { category: 'agriculture', titles: ['Farm Worker', 'Harvester', 'Irrigation Worker', 'Crop Care Worker'] },
  { category: 'services', titles: ['Housekeeper', 'Cook', 'Security Guard', 'Gardener', 'Maintenance Worker'] },
  { category: 'retail', titles: ['Sales Assistant', 'Store Helper', 'Warehouse Worker', 'Stock Clerk'] },
  { category: 'hospitality', titles: ['Hotel Staff', 'Restaurant Worker', 'Kitchen Helper', 'Cleaning Staff'] },
  { category: 'logistics', titles: ['Warehouse Assistant', 'Loading Worker', 'Packing Worker', 'Inventory Helper'] }
];

// Skills for different job categories
const skillsByCategory = {
  construction: ['Brick Laying', 'Concrete Work', 'Steel Fixing', 'Formwork', 'Plastering', 'Tiling'],
  transport: ['Driving', 'Route Planning', 'Vehicle Maintenance', 'Customer Service', 'GPS Navigation'],
  manufacturing: ['Machine Operation', 'Quality Control', 'Assembly', 'Safety Procedures', 'Maintenance'],
  agriculture: ['Crop Management', 'Irrigation', 'Harvesting', 'Pest Control', 'Soil Preparation'],
  services: ['Cleaning', 'Cooking', 'Security', 'Maintenance', 'Customer Service'],
  retail: ['Sales', 'Inventory Management', 'Customer Service', 'Cash Handling', 'Product Knowledge'],
  hospitality: ['Food Service', 'Housekeeping', 'Customer Service', 'Kitchen Operations', 'Safety'],
  logistics: ['Warehouse Operations', 'Inventory Management', 'Loading/Unloading', 'Safety Procedures']
};

// Education levels
const educationLevels = [
  'Primary School', 'Secondary School', 'Higher Secondary', 'Diploma', 'ITI', 'Graduate', 'Post Graduate'
];

// Generate random phone number
function generatePhoneNumber() {
  const prefixes = ['6', '7', '8', '9'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const remaining = Math.floor(Math.random() * 90000000) + 10000000;
  return `+91${prefix}${remaining}`;
}

// Generate random email
function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const numbers = Math.floor(Math.random() * 999);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${numbers}@${domain}`;
}

// Generate random salary range
function generateSalaryRange() {
  const baseSalaries = [8000, 12000, 15000, 18000, 22000, 25000, 30000, 35000, 40000];
  const base = baseSalaries[Math.floor(Math.random() * baseSalaries.length)];
  const min = base;
  const max = base + Math.floor(Math.random() * 5000) + 1000;
  return { min, max };
}

// Generate random date within last 2 years
function generateRandomDate() {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate random transaction
function generateTransaction(userId, type) {
  const amounts = [500, 800, 1200, 1500, 2000, 2500, 3000, 3500, 4000, 5000];
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  const descriptions = [
    'Delivery Payment', 'Construction Work', 'Factory Shift', 'Agricultural Work',
    'Transport Service', 'Warehouse Work', 'Retail Sales', 'Hospitality Service'
  ];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  return {
    id: require('uuid').v4(),
    user_id: userId,
    type: type,
    amount: amount,
    description: description,
    status: type === 'credit' ? 'completed' : 'pending',
    created_at: generateRandomDate().toISOString()
  };
}

// Generate random notification
function generateNotification(userId, type) {
  const notifications = {
    job: [
      'New job posted in your area',
      'Your job application was accepted',
      'Job payment received',
      'Job completed successfully'
    ],
    payment: [
      'Payment received for your work',
      'Wallet credited with ₹{amount}',
      'Payment processed successfully',
      'Withdrawal completed'
    ],
    system: [
      'Profile updated successfully',
      'KYC verification completed',
      'Account verified',
      'Welcome to FairPay!'
    ]
  };
  
  const messages = notifications[type] || notifications.system;
  const message = messages[Math.floor(Math.random() * messages.length)];
  
  return {
    id: require('uuid').v4(),
    user_id: userId,
    type: type,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Update`,
    message: message,
    is_read: Math.random() > 0.7,
    created_at: generateRandomDate().toISOString()
  };
}

// Generate random grievance
function generateGrievance(userId) {
  const categories = ['payment_issue', 'job_mismatch', 'workplace_safety', 'harassment', 'other'];
  const urgencies = ['normal', 'urgent'];
  const statuses = ['pending', 'in_progress', 'resolved', 'closed'];
  
  const grievances = [
    'Payment not received for completed work',
    'Job description different from actual work',
    'Safety equipment not provided',
    'Unsafe working conditions',
    'Payment delayed',
    'Work hours not as agreed',
    'Poor working conditions',
    'Transportation issues',
    'Equipment malfunction',
    'Communication problems with supervisor'
  ];
  
  return {
    id: require('uuid').v4(),
    user_id: userId,
    title: grievances[Math.floor(Math.random() * grievances.length)],
    description: 'Detailed description of the issue and requested resolution.',
    category: categories[Math.floor(Math.random() * categories.length)],
    urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    created_at: generateRandomDate().toISOString()
  };
}

// Generate random job
function generateJob() {
  const category = jobCategories[Math.floor(Math.random() * jobCategories.length)];
  const title = category.titles[Math.floor(Math.random() * category.titles.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  const city = state.cities[Math.floor(Math.random() * state.cities.length)];
  const salary = generateSalaryRange();
  
  return {
    id: require('uuid').v4(),
    title: title,
    description: `Looking for experienced ${title.toLowerCase()} in ${city}, ${state.name}. Good pay and working conditions.`,
    company: `${city} ${category.category.charAt(0).toUpperCase() + category.category.slice(1)} Services`,
    location: `${city}, ${state.name}`,
    category: category.category,
    salary_min: salary.min,
    salary_max: salary.max,
    requirements: 'Experience preferred, hardworking, reliable',
    status: 'active',
    created_at: generateRandomDate().toISOString()
  };
}

// Main seeding function
async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');
    
    const totalUsers = 1000;
    const users = [];
    
    // Generate users
    console.log(`👥 Creating ${totalUsers} users...`);
    for (let i = 0; i < totalUsers; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const email = generateEmail(firstName, lastName);
      const phone = generatePhoneNumber();
      const password = 'password123';
      
      try {
        const user = await User.create({ name, email, phone, password });
        users.push(user);
        
        if (i % 100 === 0) {
          console.log(`✅ Created ${i + 1} users...`);
        }
      } catch (error) {
        if (error.message.includes('already registered')) {
          // Skip if user already exists
          continue;
        }
        console.error(`Error creating user ${i}:`, error.message);
      }
    }
    
    console.log(`✅ Created ${users.length} users successfully`);
    
    // Generate personal data for users
    console.log('📝 Creating personal data...');
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const state = states[Math.floor(Math.random() * states.length)];
      const city = state.cities[Math.floor(Math.random() * state.cities.length)];
      const jobCategory = jobCategories[Math.floor(Math.random() * jobCategories.length)];
      const skills = skillsByCategory[jobCategory.category];
      
      const personalData = {
        user_id: user.id,
        age: Math.floor(Math.random() * 30) + 20, // 20-50 years
        location: `${city}, ${state.name}`,
        occupation: jobCategory.titles[Math.floor(Math.random() * jobCategory.titles.length)],
        education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
        experience: Math.floor(Math.random() * 15) + 1, // 1-15 years
        skills: skills.slice(0, Math.floor(Math.random() * 3) + 2).join(', ') // 2-4 skills
      };
      
      try {
        await PersonalData.create(personalData);
      } catch (error) {
        console.error(`Error creating personal data for user ${i}:`, error.message);
      }
    }
    
    // Generate wallets and transactions
    console.log('💰 Creating wallets and transactions...');
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        // Create wallet
        await Wallet.createForUser(user.id);
        
        // Generate random balance
        const balance = Math.floor(Math.random() * 50000) + 1000;
        await Wallet.updateBalance(user.id, balance);
        
        // Generate transactions (5-15 per user)
        const transactionCount = Math.floor(Math.random() * 10) + 5;
        for (let j = 0; j < transactionCount; j++) {
          const transaction = generateTransaction(user.id, Math.random() > 0.3 ? 'credit' : 'pending');
          await Wallet.addTransaction(transaction);
        }
      } catch (error) {
        console.error(`Error creating wallet for user ${i}:`, error.message);
      }
    }
    
    // Generate notifications
    console.log('🔔 Creating notifications...');
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        // Generate 3-8 notifications per user
        const notificationCount = Math.floor(Math.random() * 5) + 3;
        for (let j = 0; j < notificationCount; j++) {
          const types = ['job', 'payment', 'system'];
          const type = types[Math.floor(Math.random() * types.length)];
          const notification = generateNotification(user.id, type);
          await Notification.create(notification);
        }
      } catch (error) {
        console.error(`Error creating notifications for user ${i}:`, error.message);
      }
    }
    
    // Generate grievances
    console.log('📝 Creating grievances...');
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        // 30% of users have grievances
        if (Math.random() < 0.3) {
          const grievanceCount = Math.floor(Math.random() * 2) + 1; // 1-2 grievances
          for (let j = 0; j < grievanceCount; j++) {
            const grievance = generateGrievance(user.id);
            await Grievance.create(grievance);
          }
        }
      } catch (error) {
        console.error(`Error creating grievances for user ${i}:`, error.message);
      }
    }
    
    // Generate jobs
    console.log('💼 Creating jobs...');
    const jobCount = 200; // Create 200 jobs
    for (let i = 0; i < jobCount; i++) {
      try {
        const job = generateJob();
        await Job.create(job);
      } catch (error) {
        console.error(`Error creating job ${i}:`, error.message);
      }
    }
    
    // Generate KYC documents for some users
    console.log('🆔 Creating KYC documents...');
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        // 70% of users have KYC documents
        if (Math.random() < 0.7) {
          const kycData = {
            user_id: user.id,
            document_type: Math.random() > 0.5 ? 'Aadhaar' : 'PAN',
            document_number: Math.random().toString(36).substring(2, 15),
            verification_status: Math.random() > 0.2 ? 'VERIFIED' : 'PENDING'
          };
          await KYCDocument.create(kycData);
        }
      } catch (error) {
        console.error(`Error creating KYC for user ${i}:`, error.message);
      }
    }
    
    console.log('🎉 Data seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Jobs: ${jobCount}`);
    console.log(`   - Wallets: ${users.length}`);
    console.log(`   - Notifications: ~${users.length * 5}`);
    console.log(`   - Grievances: ~${Math.floor(users.length * 0.3)}`);
    console.log(`   - KYC Documents: ~${Math.floor(users.length * 0.7)}`);
    
  } catch (error) {
    console.error('❌ Error during data seeding:', error);
  }
}

// Run the seeding
seedData(); 