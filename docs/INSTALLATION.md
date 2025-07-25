# Installation Guide

This guide will help you set up the Excel Analytics Platform on your local machine or server.

## System Requirements

### Minimum Requirements
- **OS**: Windows 10, macOS 10.15, or Ubuntu 18.04+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Internet connection for dependencies

### Software Requirements
- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher (comes with Node.js)
- **Git**: Latest version
- **MongoDB**: Version 4.4 or higher (local or Atlas)

## Pre-Installation Steps

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

**Verify installation:**
```bash
node --version
npm --version
```

### 2. Install Git
Download and install Git from [git-scm.com](https://git-scm.com/)

**Verify installation:**
```bash
git --version
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
1. Download MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Create a database named `excel-analytics`

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Whitelist your IP address

## Installation Steps

### Step 1: Clone Repository
```bash
git clone https://github.com/Anisha1121/Excel-Analytics.git
cd Excel-Analytics
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Environment Configuration
Create `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/excel-analytics
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/excel-analytics

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 2.4 Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will start on http://localhost:5000

### Step 3: Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend
```bash
cd ../frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Environment Configuration
Create `.env` file in the frontend directory:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Excel Analytics
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_3D_CHARTS=true
VITE_ENABLE_CHART_EXPORT=true
VITE_ENABLE_ANALYTICS=true
```

#### 3.4 Start Frontend Server
```bash
npm run dev
```

The frontend server will start on http://localhost:5173

### Step 4: Verify Installation

1. **Backend Health Check**:
   - Visit http://localhost:5000/health
   - Should return: `{"status": "OK", "message": "Server is running"}`

2. **Frontend Access**:
   - Visit http://localhost:5173
   - Should see the Excel Analytics login page

3. **Database Connection**:
   - Check backend console for database connection messages
   - Should see: `"Connected to MongoDB"`

## Post-Installation Configuration

### 1. Create Admin User (Optional)
```bash
cd backend
npm run create-admin
```

Follow the prompts to create an admin user.

### 2. Test File Upload
1. Register a new user account
2. Login to the application
3. Upload a sample Excel file
4. Generate a chart to verify functionality

### 3. Configure Email (Optional)
Add email configuration to backend `.env`:
```env
# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@excelanalytics.com
```

## Development Tools Setup

### 1. VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- GitLens
- Thunder Client (for API testing)

### 2. Browser Extensions (Recommended)
- React Developer Tools
- Redux DevTools (if using Redux)

## Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if port 5000 is in use
netstat -an | grep 5000

# Use different port in .env
PORT=5001
```

#### Frontend Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Error
```bash
# Check MongoDB service status
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

#### Permission Errors
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm
```

### Environment-Specific Issues

#### Windows
```bash
# If you get execution policy errors:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### macOS
```bash
# If you get permission errors:
sudo xcode-select --install
```

#### Linux
```bash
# Install build essentials:
sudo apt-get install build-essential
```

## Performance Optimization

### 1. Backend Optimization
```env
# Add to .env for production
NODE_ENV=production
ENABLE_COMPRESSION=true
ENABLE_CACHING=true
```

### 2. Frontend Optimization
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### 3. Database Optimization
- Create indexes for frequently queried fields
- Enable MongoDB compression
- Set up connection pooling

## Security Configuration

### 1. Backend Security
```env
# Add to .env
CORS_ORIGIN=https://yourdomain.com
HELMET_ENABLED=true
RATE_LIMIT_ENABLED=true
```

### 2. File Upload Security
```env
ALLOWED_EXTENSIONS=.xlsx,.xls
MAX_FILES_PER_USER=100
VIRUS_SCAN_ENABLED=false
```

## Docker Installation (Alternative)

### 1. Using Docker Compose
```bash
# Clone repository
git clone https://github.com/Anisha1121/Excel-Analytics.git
cd Excel-Analytics

# Start with Docker Compose
docker-compose up -d
```

### 2. Docker Configuration
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: excel-analytics

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/excel-analytics
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## Next Steps

After successful installation:

1. **Read the User Guide**: [USER_GUIDE.md](./USER_GUIDE.md)
2. **Check API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. **Review Contributing Guidelines**: [../CONTRIBUTING.md](../CONTRIBUTING.md)
4. **Set up Monitoring**: Configure logging and monitoring tools

## Support

If you encounter issues during installation:

1. **Check Logs**: Review console output for error messages
2. **GitHub Issues**: [Create an issue](https://github.com/Anisha1121/Excel-Analytics/issues)
3. **Documentation**: Check other documentation files
4. **Community**: Join our Discord server for help

## Updating

To update to the latest version:

```bash
# Pull latest changes
git pull origin master

# Update backend dependencies
cd backend
npm install
npm run migrate # if database migrations exist

# Update frontend dependencies
cd ../frontend
npm install

# Rebuild and restart
npm run build
```

---

**Installation complete!** 🎉

Your Excel Analytics Platform should now be running at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
