const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true
  },
  allowances: {
    houseRent: {
      type: Number,
      default: 0
    },
    transport: {
      type: Number,
      default: 0
    },
    medical: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  deductions: {
    providentFund: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    insurance: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for total allowances
employeeSchema.virtual('totalAllowances').get(function() {
  return (this.allowances.houseRent || 0) + (this.allowances.transport || 0) +
         (this.allowances.medical || 0) + (this.allowances.other || 0);
});

// Virtual for total deductions
employeeSchema.virtual('totalDeductions').get(function() {
  return (this.deductions.providentFund || 0) + (this.deductions.tax || 0) +
         (this.deductions.insurance || 0) + (this.deductions.other || 0);
});

// Virtual for gross salary
employeeSchema.virtual('grossSalary').get(function() {
  return this.baseSalary + this.totalAllowances;
});

// Virtual for net salary
employeeSchema.virtual('netSalary').get(function() {
  return this.grossSalary - this.totalDeductions;
});

// Ensure virtual fields are serialized
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);
