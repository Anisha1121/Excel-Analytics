# Backend - Excel Analytics Platform

Node.js/Express backend API for the Excel Analytics Platform.

## Features

- **Authentication**: JWT-based user authentication and authorization
- **File Upload**: Multer middleware for Excel file uploads
- **Excel Processing**: SheetJS for parsing .xls and .xlsx files
- **Data Storage**: MongoDB for user data, file metadata, and analytics
- **API Routes**: RESTful API for all frontend operations
- **Security**: Password hashing, input validation, and rate limiting
- **Admin Features**: User management and platform analytics

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **SheetJS** for Excel file parsing
- **bcrypt** for password hashing
- **Joi** for input validation
- **helmet** for security headers
- **cors** for cross-origin requests
- **express-rate-limit** for rate limiting

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── fileController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js        # JWT authentication
│   │   ├── upload.js      # File upload (Multer)
│   │   ├── validation.js  # Input validation
│   │   └── errorHandler.js
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── File.js
│   │   └── Analytics.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── files.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── services/          # Business logic
│   │   ├── excelService.js
│   │   ├── chartService.js
│   │   └── emailService.js
│   ├── utils/             # Utility functions
│   │   ├── database.js
│   │   ├── logger.js
│   │   └── helpers.js
│   └── config/            # Configuration files
│       ├── database.js
│       ├── jwt.js
│       └── multer.js
├── uploads/               # Temporary file storage
├── tests/                 # Test files
├── .env.example
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/excel-analytics

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=./uploads

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS
FRONTEND_URL=http://localhost:3000
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### File Management
- `POST /api/files/upload` - Upload Excel file
- `GET /api/files` - Get user's uploaded files
- `GET /api/files/:id` - Get specific file data
- `DELETE /api/files/:id` - Delete file
- `POST /api/files/:id/analyze` - Generate chart from file data

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/analytics` - Get user's analytics history

### Admin Routes
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/stats` - Platform statistics

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### File Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  filename: String,
  originalName: String,
  size: Number,
  mimetype: String,
  uploadDate: Date,
  data: Mixed, // Parsed Excel data
  metadata: {
    sheets: Array,
    columns: Array,
    rowCount: Number
  }
}
```

### Analytics Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  fileId: ObjectId,
  chartType: String,
  xAxis: String,
  yAxis: String,
  chartConfig: Mixed,
  createdAt: Date
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Prevent API abuse
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **File Validation**: Restrict to Excel files only

## Excel Processing

The backend uses SheetJS to:
1. Parse uploaded Excel files
2. Extract sheet names and data
3. Convert to JSON format
4. Validate data structure
5. Store processed data in MongoDB

## Error Handling

Centralized error handling with:
- Custom error classes
- Detailed error logging
- User-friendly error messages
- HTTP status codes
- Stack trace in development

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Deployment

### Environment Setup
1. Set production environment variables
2. Configure MongoDB connection
3. Set up file storage (local or cloud)
4. Configure email service (if using)

### Deploy Options
- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS EC2**: Full control with PM2 process manager
- **DigitalOcean**: Droplet with Docker
- **Railway**: Simple deployment platform
