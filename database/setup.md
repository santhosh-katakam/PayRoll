# Database Setup Instructions

## MongoDB Installation and Setup

### 1. Install MongoDB

#### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Install MongoDB Compass (GUI tool) if desired

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org
```

### 2. Start MongoDB Service

#### Windows:
MongoDB should start automatically as a Windows service. If not:
```cmd
net start MongoDB
```

#### macOS:
```bash
brew services start mongodb/brew/mongodb-community
```

#### Linux:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Verify Installation

Open a terminal/command prompt and run:
```bash
mongosh
```

You should see the MongoDB shell prompt.

### 4. Database Structure

The payroll system uses the following database structure:

**Database Name:** `payroll`

**Collections:**
- `employees` - Employee information and salary structure
- `salaries` - Monthly salary records and payment status

### 5. Connection Details

- **Host:** localhost
- **Port:** 27017 (default)
- **Database:** payroll
- **Connection String:** `mongodb://localhost:27017/payroll`

### 6. Sample Data

The application will automatically create the database and collections when you:
1. Add your first employee
2. Process your first salary

### 7. Backup and Restore

#### Backup:
```bash
mongodump --db payroll --out ./backup
```

#### Restore:
```bash
mongorestore --db payroll ./backup/payroll
```

### 8. Troubleshooting

#### Common Issues:

1. **Connection refused:**
   - Ensure MongoDB service is running
   - Check if port 27017 is available

2. **Permission denied:**
   - On Linux/macOS, ensure proper permissions for MongoDB data directory
   - Default data directory: `/var/lib/mongodb` (Linux) or `/usr/local/var/mongodb` (macOS)

3. **Service won't start:**
   - Check MongoDB logs for errors
   - Windows: Event Viewer
   - Linux/macOS: `/var/log/mongodb/mongod.log`

### 9. MongoDB Compass (GUI)

For a visual interface to manage your database:
1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Connect using: `mongodb://localhost:27017`
3. Navigate to the `payroll` database to view collections and data
