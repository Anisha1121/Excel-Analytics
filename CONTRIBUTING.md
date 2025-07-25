# Contributing to Excel Analytics Platform

We're excited that you're interested in contributing to Excel Analytics Platform! This document provides guidelines and information for contributors.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contributing Guidelines](#contributing-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation](#documentation)
9. [Bug Reports](#bug-reports)
10. [Feature Requests](#feature-requests)
11. [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at [conduct@excelanalytics.com](mailto:conduct@excelanalytics.com).

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Git** (latest version)
- **MongoDB** (v4.4 or higher)
- **Code Editor** (VS Code recommended)

### First Contribution

1. **Fork the Repository**: Click "Fork" on GitHub
2. **Clone Your Fork**: 
   ```bash
   git clone https://github.com/YOUR_USERNAME/Excel-Analytics.git
   cd Excel-Analytics
   ```
3. **Install Dependencies**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```
4. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Environment

Follow the [Installation Guide](./docs/INSTALLATION.md) to set up your development environment.

## Development Setup

### Environment Configuration

#### Backend (.env)
```env
# Development Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-analytics-dev
JWT_SECRET=development-secret-key
FRONTEND_URL=http://localhost:5173

# Debug Settings
DEBUG=excel-analytics:*
LOG_LEVEL=debug

# Development Features
HOT_RELOAD=true
MOCK_EXTERNAL_APIS=true
```

#### Frontend (.env)
```env
# Development Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Excel Analytics (Dev)
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK_DATA=true
```

### Development Scripts

#### Backend Development
```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

#### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Lint code
npm run lint

# Format code
npm run format
```

### Database Setup

#### Development Database
```bash
# Start MongoDB locally
mongod --dbpath ./data/db

# Create development database
mongo
use excel-analytics-dev
```

#### Test Database
```bash
# Automated test database setup
npm run test:setup-db
```

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

#### 🐛 Bug Fixes
- Fix existing functionality
- Improve error handling
- Performance optimizations

#### ✨ New Features
- Chart type additions
- UI enhancements
- API improvements
- 3D visualization features

#### 📚 Documentation
- API documentation
- User guides
- Code comments
- Tutorial creation

#### 🧪 Testing
- Unit tests
- Integration tests
- End-to-end tests
- Performance tests

#### 🎨 Design
- UI/UX improvements
- Accessibility enhancements
- Mobile responsiveness
- Theme development

### Contribution Process

1. **Check Existing Issues**: Look for related issues or discussions
2. **Create Issue**: If none exists, create one describing your contribution
3. **Discuss**: Get feedback from maintainers before major changes
4. **Implement**: Work on your contribution
5. **Test**: Ensure all tests pass
6. **Document**: Update relevant documentation
7. **Submit**: Create a pull request

### Branch Naming Convention

Use descriptive branch names:
```bash
# Features
feature/3d-chart-animations
feature/user-dashboard-redesign

# Bug fixes
fix/chart-export-error
fix/memory-leak-in-3d-renderer

# Documentation
docs/api-documentation-update
docs/installation-guide-improvement

# Refactoring
refactor/chart-component-structure
refactor/api-response-format
```

## Pull Request Process

### Before Submitting

1. **Update Dependencies**: Ensure all dependencies are up to date
2. **Run Tests**: All tests must pass
3. **Lint Code**: Fix all linting errors
4. **Update Documentation**: Include relevant documentation updates
5. **Test Manually**: Verify your changes work as expected

### Pull Request Template

When creating a pull request, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Include screenshots or GIFs for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

### Review Process

1. **Automated Checks**: GitHub Actions will run tests
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

### Merge Requirements

- ✅ All CI/CD checks pass
- ✅ At least one maintainer approval
- ✅ No merge conflicts
- ✅ Documentation updated
- ✅ Tests pass

## Coding Standards

### General Principles

- **Consistency**: Follow existing code patterns
- **Readability**: Write self-documenting code
- **Performance**: Consider performance implications
- **Security**: Follow security best practices
- **Accessibility**: Ensure UI is accessible

### JavaScript/TypeScript Style

#### Code Formatting
We use Prettier for consistent code formatting:
```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

#### ESLint Configuration
Follow our ESLint rules:
```bash
# Lint code
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

#### Naming Conventions
```javascript
// Variables and functions: camelCase
const chartData = [];
function createChart() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:5000';

// Components: PascalCase
function ChartComponent() {}

// Files: kebab-case
chart-component.jsx
api-client.js
```

### React/Frontend Standards

#### Component Structure
```javascript
// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Component
function ChartComponent({ data, onUpdate }) {
  // Hooks
  const [loading, setLoading] = useState(false);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [data]);
  
  // Event handlers
  const handleUpdate = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="chart-component">
      {/* JSX */}
    </div>
  );
}

// PropTypes
ChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
  onUpdate: PropTypes.func,
};

// Default props
ChartComponent.defaultProps = {
  onUpdate: () => {},
};

export default ChartComponent;
```

#### Hooks Usage
```javascript
// Custom hooks
function useChartData(fileId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Data fetching logic
  }, [fileId]);
  
  return { data, loading, error };
}
```

### Backend/Node.js Standards

#### Express Route Structure
```javascript
// routes/charts.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const chartController = require('../controllers/chartController');

// Route definitions
router.get('/', authenticateToken, chartController.getCharts);
router.post('/', authenticateToken, chartController.createChart);
router.put('/:id', authenticateToken, chartController.updateChart);
router.delete('/:id', authenticateToken, chartController.deleteChart);

module.exports = router;
```

#### Controller Structure
```javascript
// controllers/chartController.js
const Chart = require('../models/Chart');
const { validationResult } = require('express-validator');

class ChartController {
  async getCharts(req, res) {
    try {
      // Controller logic
      const charts = await Chart.find({ userId: req.user.id });
      res.json({ success: true, data: charts });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}

module.exports = new ChartController();
```

#### Database Models
```javascript
// models/Chart.js
const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['bar', 'line', 'pie', 'scatter', 'bar3d', 'surface3d']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chart', chartSchema);
```

### CSS/Styling Standards

#### Tailwind CSS Usage
```jsx
// Use semantic class combinations
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Chart Title</h2>
  <div className="chart-container h-64 w-full"></div>
</div>
```

#### Custom CSS Classes
```css
/* Use BEM methodology for custom classes */
.chart-component {
  /* Component styles */
}

.chart-component__header {
  /* Element styles */
}

.chart-component--loading {
  /* Modifier styles */
}
```

## Testing Guidelines

### Testing Philosophy

- **Test-Driven Development**: Write tests before implementation when possible
- **Coverage Goals**: Aim for 80%+ code coverage
- **Test Types**: Unit, integration, and end-to-end tests
- **Quality over Quantity**: Focus on meaningful tests

### Frontend Testing

#### Unit Tests (Jest + Testing Library)
```javascript
// __tests__/ChartComponent.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartComponent from '../ChartComponent';

describe('ChartComponent', () => {
  const mockData = [
    { x: 1, y: 2 },
    { x: 2, y: 4 }
  ];

  it('renders chart with data', () => {
    render(<ChartComponent data={mockData} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('calls onUpdate when data changes', () => {
    const mockOnUpdate = jest.fn();
    render(<ChartComponent data={mockData} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByText('Update Chart'));
    expect(mockOnUpdate).toHaveBeenCalled();
  });
});
```

#### Integration Tests
```javascript
// __tests__/integration/ChartCreation.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Chart Creation Flow', () => {
  it('creates a chart from uploaded file', async () => {
    render(<App />);
    
    // Upload file
    const fileInput = screen.getByLabelText(/upload file/i);
    const file = new File(['test,data\n1,2'], 'test.csv', {
      type: 'text/csv'
    });
    
    await userEvent.upload(fileInput, file);
    
    // Create chart
    await userEvent.click(screen.getByText(/create chart/i));
    
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });
});
```

### Backend Testing

#### Unit Tests (Jest + Supertest)
```javascript
// __tests__/controllers/chartController.test.js
const request = require('supertest');
const app = require('../app');
const Chart = require('../models/Chart');

describe('Chart Controller', () => {
  beforeEach(async () => {
    await Chart.deleteMany({});
  });

  describe('GET /api/charts', () => {
    it('returns user charts', async () => {
      const token = 'valid-jwt-token';
      
      const response = await request(app)
        .get('/api/charts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
```

#### Integration Tests
```javascript
// __tests__/integration/chartApi.test.js
describe('Chart API Integration', () => {
  it('creates, reads, updates, and deletes charts', async () => {
    // Create user and get token
    const { token } = await createTestUser();
    
    // Create chart
    const createResponse = await request(app)
      .post('/api/charts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Chart',
        type: 'bar',
        data: { x: [1, 2], y: [3, 4] }
      })
      .expect(201);
      
    const chartId = createResponse.body.data.id;
    
    // Read chart
    await request(app)
      .get(`/api/charts/${chartId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    // Update chart
    await request(app)
      .put(`/api/charts/${chartId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Chart' })
      .expect(200);
      
    // Delete chart
    await request(app)
      .delete(`/api/charts/${chartId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});
```

### End-to-End Testing

#### Cypress Tests
```javascript
// cypress/integration/chart-creation.spec.js
describe('Chart Creation', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
  });

  it('creates a chart from Excel file', () => {
    // Upload file
    cy.get('[data-testid="file-upload"]').attachFile('sample.xlsx');
    cy.wait('@fileUpload');
    
    // Navigate to chart creation
    cy.get('[data-testid="create-chart-btn"]').click();
    
    // Configure chart
    cy.get('[data-testid="chart-type-select"]').select('bar');
    cy.get('[data-testid="x-axis-select"]').select('Category');
    cy.get('[data-testid="y-axis-select"]').select('Value');
    
    // Create chart
    cy.get('[data-testid="create-chart-submit"]').click();
    
    // Verify chart creation
    cy.get('[data-testid="chart-canvas"]').should('be.visible');
    cy.url().should('include', '/charts/');
  });
});
```

### Test Data Management

#### Mock Data
```javascript
// __tests__/mocks/chartData.js
export const mockChartData = {
  bar: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales',
      data: [100, 150, 200],
      backgroundColor: 'rgba(54, 162, 235, 0.2)'
    }]
  },
  
  scatter3d: {
    x: [1, 2, 3, 4, 5],
    y: [2, 4, 1, 5, 3],
    z: [1, 3, 2, 4, 5],
    mode: 'markers',
    type: 'scatter3d'
  }
};
```

#### Test Utilities
```javascript
// __tests__/utils/testHelpers.js
export const createTestUser = async () => {
  const user = await User.create({
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User'
  });
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return { user, token };
};

export const uploadTestFile = async (token) => {
  return request(app)
    .post('/api/files/upload')
    .set('Authorization', `Bearer ${token}`)
    .attach('file', path.join(__dirname, 'fixtures/sample.xlsx'));
};
```

## Documentation

### Code Documentation

#### JSDoc Comments
```javascript
/**
 * Creates a new chart from uploaded data
 * @param {Object} chartConfig - Chart configuration object
 * @param {string} chartConfig.type - Type of chart (bar, line, pie, etc.)
 * @param {Array} chartConfig.data - Chart data array
 * @param {string} chartConfig.title - Chart title
 * @param {Object} chartConfig.options - Chart styling options
 * @returns {Promise<Object>} Created chart object
 * @throws {ValidationError} When chart configuration is invalid
 */
async function createChart(chartConfig) {
  // Implementation
}
```

#### README Updates
When adding new features, update relevant README sections:
- Feature list
- API endpoints
- Configuration options
- Usage examples

#### API Documentation
Update OpenAPI/Swagger documentation for API changes:
```yaml
# docs/api-spec.yaml
paths:
  /api/charts:
    post:
      summary: Create a new chart
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChartRequest'
      responses:
        201:
          description: Chart created successfully
```

### Documentation Types

#### User Documentation
- Installation guides
- User manuals
- Tutorials
- FAQ sections

#### Developer Documentation
- API references
- Code architecture
- Setup instructions
- Contributing guidelines

#### Technical Documentation
- Database schemas
- System architecture
- Deployment guides
- Performance optimization

## Bug Reports

### Before Reporting

1. **Search Existing Issues**: Check if the bug is already reported
2. **Reproduce**: Ensure you can reproduce the issue consistently
3. **Minimal Example**: Create a minimal reproduction case
4. **Environment**: Note your environment details

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Screenshots
If applicable, add screenshots

## Environment
- OS: [e.g. Windows 10, macOS 11.0]
- Browser: [e.g. Chrome 91, Firefox 89]
- Node.js: [e.g. 16.3.0]
- Version: [e.g. 1.2.3]

## Additional Context
Any other context about the problem
```

### Bug Severity Levels

- **Critical**: System crashes, data loss, security vulnerabilities
- **High**: Major feature broken, significant performance issues
- **Medium**: Minor feature issues, cosmetic problems
- **Low**: Typos, minor UI inconsistencies

## Feature Requests

### Feature Request Process

1. **Check Roadmap**: Review existing roadmap and issues
2. **Discuss**: Start a discussion for major features
3. **Proposal**: Create detailed feature proposal
4. **Feedback**: Gather community feedback
5. **Implementation**: Begin development after approval

### Feature Request Template

```markdown
## Feature Summary
Brief description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
Detailed description of the proposed feature

## Alternatives Considered
Other solutions you considered

## Use Cases
How would this feature be used?

## Implementation Ideas
Technical implementation suggestions

## Additional Context
Screenshots, mockups, or examples
```

### Feature Evaluation Criteria

- **User Value**: How much value does this provide users?
- **Technical Feasibility**: How difficult is implementation?
- **Maintenance Cost**: Long-term maintenance requirements
- **Breaking Changes**: Impact on existing functionality
- **Community Interest**: How many users want this feature?

## Community

### Communication Channels

#### GitHub
- **Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Pull Requests**: Code contributions
- **Wiki**: Community documentation

#### Social Media
- **Twitter**: [@ExcelAnalytics](https://twitter.com/excelanalytics)
- **LinkedIn**: [Excel Analytics Page](https://linkedin.com/company/excel-analytics)

#### Development Chat
- **Discord**: [Join our server](https://discord.gg/excel-analytics)
- **Slack**: [Development workspace](https://excel-analytics.slack.com)

### Community Guidelines

#### Be Respectful
- Treat all community members with respect
- Be patient with newcomers
- Provide constructive feedback
- Avoid inflammatory language

#### Be Helpful
- Answer questions when you can
- Share knowledge and resources
- Provide clear, detailed responses
- Point people to relevant documentation

#### Be Collaborative
- Work together on solutions
- Credit others for their contributions
- Share your improvements with the community
- Participate in discussions constructively

### Recognition

#### Contributor Recognition
- **GitHub Profile**: Listed in contributors
- **Release Notes**: Mentioned in release notes
- **Hall of Fame**: Featured on project website
- **Swag**: Project stickers and merchandise

#### Contribution Levels
- **First-time Contributor**: Welcome package
- **Regular Contributor**: Special recognition
- **Core Contributor**: Additional privileges
- **Maintainer**: Full project access

## Getting Help

### Where to Get Help

1. **Documentation**: Check existing documentation first
2. **GitHub Issues**: Search for similar problems
3. **Community Chat**: Ask in Discord or Slack
4. **Email**: Contact maintainers directly

### Providing Help

- **Answer Questions**: Help other community members
- **Review Pull Requests**: Provide feedback on contributions
- **Improve Documentation**: Fix typos and add clarifications
- **Mentor Newcomers**: Guide new contributors

---

Thank you for contributing to Excel Analytics Platform! Your contributions help make this project better for everyone. 🚀

For questions about contributing, contact us at [contribute@excelanalytics.com](mailto:contribute@excelanalytics.com).
