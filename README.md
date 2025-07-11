# Payroll Management System

A comprehensive payroll management system built with Node.js, Express, MongoDB, and vanilla JavaScript. This system provides complete employee management, salary processing, payment management, statement generation, and reporting capabilities.

## 📁 Project Structure

```
payroll_mgt/
├── 📁 backend/                 ← Backend Server & API
│   ├── server.js              ← Main server file
│   ├── package.json           ← Backend dependencies
│   ├── models/                ← Database models
│   │   ├── Employee.js        ← Employee schema
│   │   └── Salary.js          ← Salary schema
│   └── routes/                ← API routes
│       ├── employee.js        ← Employee endpoints
│       └── salary.js          ← Salary endpoints
├── 📁 frontend/               ← Frontend UI
│   └── index.html             ← Main application UI
├── 📁 database/               ← Database configuration
│   ├── config.js              ← Database settings
│   ├── setup.md               ← Setup instructions
│   └── README.md              ← Database documentation
├── package-root.json          ← Root project configuration
└── README.md                  ← This file
```

## Features

### Employee Management
- Add, edit, and delete employees
- Store comprehensive employee information including personal details, salary structure, and bank details
- Department and position management
- Automatic calculation of gross and net salary based on allowances and deductions

### Salary Processing
- Monthly salary processing for employees
- Attendance tracking (working days, present days, absent days)
- Overtime calculation with configurable rates
- Flexible allowances and deductions
- Automatic calculation of absent deductions
- Payment status tracking

### Salary Statements
- Generate detailed salary statements for any employee and period
- Professional formatting with complete breakdown of earnings and deductions
- Employee information display
- Attendance summary
- Payment status and remarks

### Reports
- Monthly payroll summary reports
- Total employees, gross salary, deductions, and net salary
- Payment status breakdown
- Visual dashboard with key metrics

## Project Structure

```
payroll-management-system/
│
├── backend/
│   ├── server.js              # Main server file
│   ├── models/
│   │   ├── Employee.js        # Employee data model
│   │   └── Salary.js          # Salary data model
│   └── routes/
│       ├── employee.js        # Employee management routes
│       └── salary.js          # Salary processing routes
│
├── frontend/
│   └── index.html             # Complete web interface
│
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone or download the project**
   ```bash
   cd payroll_mgt
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Setup MongoDB database**
   - Follow instructions in `database/setup.md`
   - Ensure MongoDB is running on `localhost:27017`

4. **Start the application**
   ```bash
   # From the backend directory
   npm start

   # Or for development with auto-restart
   npm run dev
   ```

5. **Access the application**
   - Open your browser and go to: `http://localhost:3001`
   - The frontend will be served automatically by the backend server

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```

4. **Start the application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and go to: `http://localhost:3000`

## API Endpoints

### Employee Management
- `GET /api/employees` - Get all active employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee
- `GET /api/employees/:id/salary-details` - Get employee salary details

### Salary Processing
- `GET /api/salary` - Get salary records (with optional filters)
- `GET /api/salary/:employeeId/:month/:year` - Get specific salary record
- `POST /api/salary` - Create salary record
- `PUT /api/salary/:employeeId/:month/:year` - Update salary record
- `DELETE /api/salary/:employeeId/:month/:year` - Delete salary record
- `GET /api/salary/:employeeId/:month/:year/statement` - Generate salary statement
- `PATCH /api/salary/:employeeId/:month/:year/payment` - Update payment status
- `GET /api/salary/summary/:month/:year` - Get monthly summary report

## Data Models

### Employee Model
- Employee ID, Name, Email, Phone
- Department, Position, Date of Joining
- Base Salary
- Allowances (House Rent, Transport, Medical, Other)
- Deductions (Provident Fund, Tax, Insurance, Other)
- Bank Details (Account Number, Bank Name, IFSC Code)
- Status (Active/Inactive)

### Salary Model
- Employee ID, Month, Year
- Working Days, Present Days, Absent Days
- Overtime Hours and Rate
- Base Salary and Allowances
- Deductions
- Gross Salary, Total Deductions, Net Salary
- Payment Status, Payment Date, Payment Method
- Remarks

## Usage Guide

### Adding Employees
1. Go to the "Employee Management" tab
2. Fill in all required employee information
3. Set allowances and deductions as needed
4. Add bank details for salary transfers
5. Click "Add Employee"

### Processing Salary
1. Go to the "Salary Processing" tab
2. Select an employee from the dropdown
3. Choose the month and year
4. Enter attendance details (working days, present days)
5. Add overtime hours if applicable
6. Set any additional allowances or deductions
7. Click "Process Salary"

### Generating Salary Statements
1. Go to the "Salary Statements" tab
2. Select employee, month, and year
3. Click "Generate Statement"
4. View the detailed salary statement

### Viewing Reports
1. Go to the "Reports" tab
2. Select month and year
3. Click "Generate Report"
4. View the payroll summary with key metrics

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with responsive design
- **Additional**: CORS, dotenv, moment.js, bcryptjs, jsonwebtoken

## Features in Detail

### Automatic Calculations
- Gross Salary = Base Salary + All Allowances
- Net Salary = Gross Salary - All Deductions
- Absent Deduction = (Base Salary / Working Days) × Absent Days
- Overtime Allowance = Overtime Hours × Overtime Rate

### Data Validation
- Unique employee IDs and email addresses
- Required field validation
- Date range validation
- Numeric field validation

### User Interface
- Responsive design for desktop and mobile
- Tab-based navigation
- Real-time form validation
- Success/error message notifications
- Professional salary statement formatting

## Development

### Adding New Features
1. Create new routes in the appropriate route file
2. Add corresponding frontend functions
3. Update the UI as needed
4. Test thoroughly

### Database Schema
The system uses MongoDB with two main collections:
- `employees` - Employee master data
- `salaries` - Monthly salary records

### Error Handling
- Comprehensive error handling in API routes
- User-friendly error messages in the frontend
- Validation at both frontend and backend levels

## License

This project is licensed under the MIT License.

## Support

For support or questions, please refer to the code comments or create an issue in the project repository.
