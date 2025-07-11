const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  workingDays: {
    type: Number,
    required: true,
    default: 30
  },
  presentDays: {
    type: Number,
    required: true
  },
  absentDays: {
    type: Number,
    default: 0
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  overtimeRate: {
    type: Number,
    default: 0
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
    overtime: {
      type: Number,
      default: 0
    },
    bonus: {
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
    lateDeduction: {
      type: Number,
      default: 0
    },
    absentDeduction: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  grossSalary: {
    type: Number,
    default: 0
  },
  totalDeductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'cheque'],
    default: 'bank_transfer'
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index for employee, month, and year
salarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

// Pre-save middleware to calculate salary components
salarySchema.pre('save', function(next) {
  // Calculate overtime allowance
  this.allowances.overtime = this.overtimeHours * this.overtimeRate;
  
  // Calculate absent deduction
  const dailySalary = this.baseSalary / this.workingDays;
  this.deductions.absentDeduction = this.absentDays * dailySalary;
  
  // Calculate gross salary
  this.grossSalary = this.baseSalary + 
    this.allowances.houseRent + 
    this.allowances.transport + 
    this.allowances.medical + 
    this.allowances.overtime + 
    this.allowances.bonus + 
    this.allowances.other;
  
  // Calculate total deductions
  this.totalDeductions = 
    this.deductions.providentFund + 
    this.deductions.tax + 
    this.deductions.insurance + 
    this.deductions.lateDeduction + 
    this.deductions.absentDeduction + 
    this.deductions.other;
  
  // Calculate net salary
  this.netSalary = this.grossSalary - this.totalDeductions;
  
  next();
});

// Static method to get salary by employee and period
salarySchema.statics.findByEmployeeAndPeriod = function(employeeId, month, year) {
  return this.findOne({ employeeId, month, year });
};

// Instance method to generate salary statement
salarySchema.methods.generateStatement = function() {
  return {
    employeeId: this.employeeId,
    period: `${this.month}/${this.year}`,
    workingDays: this.workingDays,
    presentDays: this.presentDays,
    absentDays: this.absentDays,
    overtimeHours: this.overtimeHours,
    baseSalary: this.baseSalary,
    allowances: this.allowances,
    deductions: this.deductions,
    grossSalary: this.grossSalary,
    totalDeductions: this.totalDeductions,
    netSalary: this.netSalary,
    paymentStatus: this.paymentStatus,
    paymentDate: this.paymentDate,
    paymentMethod: this.paymentMethod,
    remarks: this.remarks
  };
};

module.exports = mongoose.model('Salary', salarySchema);
