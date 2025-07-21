# Development Guide

This document provides detailed guidance for developing the Excel Analytics Platform.

## Architecture Overview

The Excel Analytics Platform follows a client-server architecture:

```
┌─────────────┐    HTTP/REST    ┌─────────────┐    MongoDB    ┌─────────────┐
│   Frontend  │ ◄────────────► │   Backend   │ ◄───────────► │  Database   │
│  (React)    │                │ (Node.js)   │               │ (MongoDB)   │
└─────────────┘                └─────────────┘               └─────────────┘
```

## Development Workflow

### 1. Setting Up the Development Environment

#### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git
- VS Code (recommended)

#### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd excel-analytics

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Development Process

#### Backend Development
1. Start MongoDB service
2. Configure environment variables
3. Run development server: `npm run dev`
4. API available at `http://localhost:5000`

#### Frontend Development
1. Ensure backend is running
2. Run development server: `npm run dev`
3. Application available at `http://localhost:3000`

### 3. Feature Development Guidelines

#### Adding New Features
1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement backend API endpoints first
3. Add corresponding frontend components
4. Write tests for both backend and frontend
5. Update documentation
6. Create pull request

#### Code Style
- Use TypeScript for frontend
- Follow ESLint configurations
- Use Prettier for code formatting
- Write meaningful commit messages

## API Design Patterns

### RESTful Endpoints
- `GET /api/resource` - Get all resources
- `GET /api/resource/:id` - Get specific resource
- `POST /api/resource` - Create new resource
- `PUT /api/resource/:id` - Update resource
- `DELETE /api/resource/:id` - Delete resource

### Response Format
```javascript
// Success Response
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Database Design

### Collections
1. **users** - User accounts and profiles
2. **files** - Uploaded Excel files and metadata
3. **analytics** - Chart generation history
4. **sessions** - User sessions (if using session-based auth)

### Relationships
- User → Files (One-to-Many)
- User → Analytics (One-to-Many)
- File → Analytics (One-to-Many)

## Frontend Component Structure

### Component Hierarchy
```
App
├── AuthProvider
├── Router
│   ├── PublicRoutes
│   │   ├── Login
│   │   └── Register
│   └── ProtectedRoutes
│       ├── Dashboard
│       ├── Upload
│       ├── Analytics
│       └── Admin (admin only)
```

### State Management
- **React Context** for global state (user, theme)
- **React Query** for server state
- **Local state** for component-specific data

## Testing Strategy

### Backend Testing
- **Unit Tests**: Individual functions and utilities
- **Integration Tests**: API endpoints
- **Database Tests**: Model operations

### Frontend Testing
- **Unit Tests**: Components and hooks
- **Integration Tests**: User workflows
- **E2E Tests**: Critical user paths

### Testing Tools
- **Backend**: Jest, Supertest
- **Frontend**: Jest, React Testing Library, Cypress

## Deployment Strategy

### Development Environment
- Local MongoDB
- Hot reloading for both frontend and backend
- Debug mode enabled

### Staging Environment
- Cloud MongoDB (Atlas)
- Production build with source maps
- Limited user access for testing

### Production Environment
- Optimized builds
- Environment variables secured
- Monitoring and logging enabled
- Automated backups

## Security Considerations

### Authentication
- JWT tokens with appropriate expiration
- Refresh token mechanism
- Password strength requirements
- Account lockout after failed attempts

### File Upload Security
- File type validation
- File size limits
- Virus scanning (future enhancement)
- Secure file storage

### API Security
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## Performance Optimization

### Backend
- Database indexing
- Query optimization
- Response caching
- File compression

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

## Monitoring and Logging

### Backend Logging
- Request/response logging
- Error tracking
- Performance metrics
- Database query logging

### Frontend Monitoring
- Error boundary implementation
- User interaction tracking
- Performance monitoring
- Console error tracking

## Contribution Guidelines

### Code Review Process
1. Feature development in separate branch
2. Pull request with description
3. Code review by team member
4. Automated tests must pass
5. Merge after approval

### Documentation Requirements
- API endpoint documentation
- Component documentation
- README updates for new features
- Inline code comments for complex logic

## Troubleshooting Common Issues

### Backend Issues
- MongoDB connection problems
- JWT token expiration
- File upload failures
- Excel parsing errors

### Frontend Issues
- CORS errors
- API communication failures
- Chart rendering problems
- State management issues

### Development Tips
- Use browser developer tools
- Check network tab for API issues
- Use MongoDB Compass for database inspection
- Use React Developer Tools for component debugging
