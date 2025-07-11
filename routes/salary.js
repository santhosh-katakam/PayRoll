const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');

// Get all salary records
router.get('/', async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;
    let filter = {};
    
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    if (employeeId) filter.employeeId = employeeId;
    
    const salaries = await Salary.find(filter).sort({ year: -1, month: -1 });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get salary summary for a period (MUST come before /:employeeId/:month/:year)
router.get('/summary/:month/:year', async (req, res) => {
  try {
    const { month, year } = req.params;
    console.log(`Getting summary for ${month}/${year}`);

    const salaries = await Salary.find({
      month: parseInt(month),
      year: parseInt(year)
    });

    console.log(`Found ${salaries.length} salary records`);

    // Always return a summary, even if no records exist
    const summary = {
      totalEmployees: salaries.length,
      totalGrossSalary: salaries.reduce((sum, s) => sum + (s.grossSalary || s.baseSalary || 0), 0),
      totalDeductions: salaries.reduce((sum, s) => sum + (s.totalDeductions || 0), 0),
      totalNetSalary: salaries.reduce((sum, s) => sum + (s.netSalary || s.baseSalary || 0), 0),
      paymentStatus: {
        paid: salaries.filter(s => s.paymentStatus === 'paid').length,
        pending: salaries.filter(s => s.paymentStatus === 'pending' || !s.paymentStatus).length,
        cancelled: salaries.filter(s => s.paymentStatus === 'cancelled').length
      }
    };

    if (salaries.length === 0) {
      summary.message = `No salary records found for ${month}/${year}`;
    }

    console.log('Summary:', summary);
    return res.json(summary);
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get salary by employee and period
router.get('/:employeeId/:month/:year', async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;
    const salary = await Salary.findByEmployeeAndPeriod(
      employeeId, 
      parseInt(month), 
      parseInt(year)
    );
    
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update salary record
router.post('/', async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId, isActive: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if salary record already exists
    const existingSalary = await Salary.findByEmployeeAndPeriod(
      employeeId,
      month,
      year
    );

    if (existingSalary) {
      // Update existing salary record instead of failing
      const salaryData = {
        ...req.body,
        baseSalary: req.body.baseSalary || employee.baseSalary,
        allowances: {
          ...employee.allowances,
          ...req.body.allowances
        },
        deductions: {
          ...employee.deductions,
          ...req.body.deductions
        }
      };

      Object.assign(existingSalary, salaryData);
      const updatedSalary = await existingSalary.save();
      return res.status(200).json(updatedSalary);
    }

    // Create new salary record with employee's base salary
    const salaryData = {
      ...req.body,
      baseSalary: req.body.baseSalary || employee.baseSalary,
      allowances: {
        ...employee.allowances,
        ...req.body.allowances
      },
      deductions: {
        ...employee.deductions,
        ...req.body.deductions
      }
    };

    const salary = new Salary(salaryData);
    const savedSalary = await salary.save();
    res.status(201).json(savedSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update salary record
router.put('/:employeeId/:month/:year', async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;
    const salary = await Salary.findOneAndUpdate(
      { employeeId, month: parseInt(month), year: parseInt(year) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete salary record
router.delete('/:employeeId/:month/:year', async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;
    const salary = await Salary.findOneAndDelete({
      employeeId,
      month: parseInt(month),
      year: parseInt(year)
    });

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate salary statement
router.get('/:employeeId/:month/:year/statement', async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;

    // Get salary record
    const salary = await Salary.findByEmployeeAndPeriod(
      employeeId,
      parseInt(month),
      parseInt(year)
    );

    if (!salary) {
      return res.status(404).json({
        message: `No salary record found for employee ${employeeId} for ${month}/${year}. Please process salary first.`
      });
    }

    // Get employee details
    const employee = await Employee.findOne({ employeeId, isActive: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Generate comprehensive salary statement
    const statement = {
      employee: {
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        department: employee.department,
        position: employee.position,
        dateOfJoining: employee.dateOfJoining,
        bankDetails: employee.bankDetails
      },
      salaryDetails: salary.generateStatement(),
      generatedAt: new Date()
    };

    res.json(statement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update payment status
router.patch('/:employeeId/:month/:year/payment', async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;
    const { paymentStatus, paymentDate, paymentMethod, remarks } = req.body;

    const salary = await Salary.findOneAndUpdate(
      { employeeId, month: parseInt(month), year: parseInt(year) },
      {
        paymentStatus,
        paymentDate: paymentDate || new Date(),
        paymentMethod,
        remarks
      },
      { new: true }
    );

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Clear test salary data (for development/testing only)
router.delete('/test-data/clear', async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not allowed in production' });
    }

    // Delete salary records for test employees
    const result = await Salary.deleteMany({
      employeeId: { $regex: /^(TEST|VERIFY|EMP\d+|SALARY|WORKFLOW)/ }
    });

    res.json({
      message: `Cleared ${result.deletedCount} test salary records`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
