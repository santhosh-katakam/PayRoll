// Database configuration for Payroll Management System

const config = {
  // MongoDB connection settings
  mongodb: {
    url: 'mongodb://localhost:27017/payroll',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // Database name
  dbName: 'payroll',
  
  // Collections
  collections: {
    employees: 'employees',
    salaries: 'salaries'
  },
  
  // Connection timeout
  connectionTimeout: 10000,
  
  // Retry settings
  retryWrites: true,
  retryReads: true
};

module.exports = config;
