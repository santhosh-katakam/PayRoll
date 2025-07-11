const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ 
      employeeId: req.params.id, 
      isActive: true 
    });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    if (error.code === 11000) {
      // Determine which field is duplicate
      const duplicateField = error.keyPattern;
      let message = 'Duplicate data found: ';
      if (duplicateField.employeeId) {
        message += `Employee ID '${req.body.employeeId}' already exists`;
      } else if (duplicateField.email) {
        message += `Email '${req.body.email}' already exists`;
      } else {
        message += 'Employee ID or email already exists';
      }
      res.status(400).json({ message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deactivate employee (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.params.id },
      { isActive: false },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employee salary details
router.get('/:id/salary-details', async (req, res) => {
  try {
    const employee = await Employee.findOne({ 
      employeeId: req.params.id, 
      isActive: true 
    });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const salaryDetails = {
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      baseSalary: employee.baseSalary,
      allowances: employee.allowances,
      deductions: employee.deductions,
      grossSalary: employee.grossSalary,
      netSalary: employee.netSalary
    };
    
    res.json(salaryDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear test data (for development/testing only)
router.delete('/test-data/clear', async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not allowed in production' });
    }

    // Delete test employees (those with IDs starting with TEST, VERIFY, SALARY, or WORKFLOW)
    const result = await Employee.deleteMany({
      employeeId: { $regex: /^(TEST|VERIFY|EMP\d+|SALARY|WORKFLOW)/ }
    });

    res.json({
      message: `Cleared ${result.deletedCount} test employees`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
