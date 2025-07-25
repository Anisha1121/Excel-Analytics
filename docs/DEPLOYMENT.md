# Deployment Guide

This guide covers deploying the Excel Analytics Platform to various environments including development, staging, and production.

## Table of Contents

1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Configuration](#database-configuration)
6. [Environment Variables](#environment-variables)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Security Configuration](#security-configuration)
10. [Performance Optimization](#performance-optimization)
11. [Troubleshooting](#troubleshooting)

## Overview

### Architecture

The Excel Analytics Platform uses a modern three-tier architecture:
- **Frontend**: React.js SPA hosted on Vercel
- **Backend**: Node.js/Express API hosted on Render
- **Database**: MongoDB Atlas (cloud-hosted)

### Deployment Environments

- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

## Environment Setup

### Development Environment

#### Local Setup
```bash
# Clone repository
git clone https://github.com/Anisha1121/Excel-Analytics.git
cd Excel-Analytics

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with local configuration
npm run dev

# Frontend setup (new terminal)
cd ../frontend
npm install
cp .env.example .env
# Edit .env with local configuration
npm run dev
```

#### Docker Development
```bash
# Start all services with Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

### Staging Environment

Staging environment mirrors production for testing:
```bash
# Deploy to staging
npm run deploy:staging

# Or manually
NODE_ENV=staging npm run build
npm run deploy
```

### Production Environment

Production deployment with optimizations:
```bash
# Deploy to production
npm run deploy:production

# Or manually
NODE_ENV=production npm run build
npm run deploy
```

## Frontend Deployment

### Vercel Deployment

#### Automatic Deployment
1. **Connect Repository**: Link GitHub repository to Vercel
2. **Configure Build**: Vercel auto-detects Vite configuration
3. **Set Environment Variables**: Configure in Vercel dashboard
4. **Deploy**: Automatic deployment on push to main branch

#### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Vercel Configuration
Create `vercel.json` in frontend directory:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {},
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Build Optimization
```bash
# Production build with optimizations
npm run build

# Analyze bundle size
npm run analyze

# Preview production build
npm run preview
```

### Alternative Frontend Hosting

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy

# Production deployment
netlify deploy --prod
```

#### AWS S3 + CloudFront
```bash
# Build application
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Backend Deployment

### Render Deployment

#### Automatic Deployment
1. **Connect Repository**: Link GitHub repository to Render
2. **Configure Service**: Select Node.js service
3. **Set Build Command**: `npm install`
4. **Set Start Command**: `npm start`
5. **Configure Environment Variables**: Add via Render dashboard

#### Manual Deployment
```bash
# Create render.yaml
cat > render.yaml << EOF
services:
  - type: web
    name: excel-analytics-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
EOF

# Deploy via Render CLI or connect GitHub
```

#### Render Configuration
Create `render.yaml` in project root:
```yaml
services:
  - type: web
    name: excel-analytics-backend
    env: node
    plan: starter
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromDatabase:
          name: excel-analytics-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        value: https://excel-analytics.vercel.app

databases:
  - name: excel-analytics-db
    databaseName: excel-analytics
    user: excelanalytics
```

### Alternative Backend Hosting

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create excel-analytics-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Create Procfile
echo "web: cd backend && npm start" > Procfile

# Deploy
git push heroku main
```

#### DigitalOcean App Platform
```yaml
# .do/app.yaml
name: excel-analytics
services:
- name: backend
  source_dir: backend
  github:
    repo: Anisha1121/Excel-Analytics
    branch: main
    deploy_on_push: true
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${DATABASE_URL}
    type: SECRET
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY backend/ .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
USER nodejs

EXPOSE 5000

CMD ["npm", "start"]
```

```bash
# Build and run Docker container
docker build -t excel-analytics-backend .
docker run -p 5000:5000 --env-file .env excel-analytics-backend
```

#### Kubernetes Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: excel-analytics-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: excel-analytics-backend
  template:
    metadata:
      labels:
        app: excel-analytics-backend
    spec:
      containers:
      - name: backend
        image: excel-analytics-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: production
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: mongodb-uri
```

## Database Configuration

### MongoDB Atlas Setup

#### Create Cluster
1. **Sign up**: Create MongoDB Atlas account
2. **Create Cluster**: Choose free tier or paid option
3. **Configure Security**: Set up database user and IP whitelist
4. **Get Connection String**: Copy connection string for application

#### Connection Configuration
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### Database Optimization
```javascript
// Database indexes for performance
const setupIndexes = async () => {
  await User.createIndexes();
  await Chart.createIndexes();
  await File.createIndexes();
  
  // Custom indexes
  await User.collection.createIndex({ email: 1 }, { unique: true });
  await Chart.collection.createIndex({ userId: 1, createdAt: -1 });
  await File.collection.createIndex({ userId: 1, uploadDate: -1 });
};
```

### Alternative Database Options

#### Self-Hosted MongoDB
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Configure MongoDB
sudo nano /etc/mongod.conf
```

#### MongoDB Docker
```yaml
# docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:4.4
    container_name: excel-analytics-db
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: excel-analytics
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro

volumes:
  mongodb_data:
```

## Environment Variables

### Frontend Environment Variables

#### Development (.env.development)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Excel Analytics (Dev)
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_3D_CHARTS=true
VITE_ENABLE_CHART_EXPORT=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=true

# Third-party Services
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=
```

#### Production (.env.production)
```env
# API Configuration
VITE_API_URL=https://excel-analytics-backend.onrender.com/api

# App Configuration
VITE_APP_NAME=Excel Analytics
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_3D_CHARTS=true
VITE_ENABLE_CHART_EXPORT=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false

# Third-party Services
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Backend Environment Variables

#### Development (.env.development)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/excel-analytics-dev

# Authentication
JWT_SECRET=dev-secret-key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Logging
LOG_LEVEL=debug

# External APIs
OPENAI_API_KEY=
SENDGRID_API_KEY=
```

#### Production (.env.production)
```env
# Server Configuration
NODE_ENV=production
PORT=10000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/excel-analytics

# Authentication
JWT_SECRET=super-secure-production-secret
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=https://excel-analytics.vercel.app

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
HELMET_ENABLED=true
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=info

# External APIs
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG.xxx
```

### Environment Variable Management

#### Using dotenv-vault
```bash
# Install dotenv-vault
npm install dotenv-vault

# Create encrypted .env.vault
npx dotenv-vault new
npx dotenv-vault push
npx dotenv-vault pull

# Use in production
DOTENV_KEY=dotenv://:key_xxx npx dotenv-vault run npm start
```

#### Using AWS Parameter Store
```javascript
// config/parameters.js
const AWS = require('aws-sdk');
const ssm = new AWS.SSM({ region: 'us-east-1' });

const getParameter = async (name) => {
  const params = {
    Name: name,
    WithDecryption: true
  };
  
  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

module.exports = { getParameter };
```

## CI/CD Pipeline

### GitHub Actions

#### Frontend Deployment Workflow
```yaml
# .github/workflows/frontend-deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run tests
        run: |
          cd frontend
          npm test
      
      - name: Build application
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_APP_NAME: Excel Analytics
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: frontend
          vercel-args: '--prod'
```

#### Backend Deployment Workflow
```yaml
# .github/workflows/backend-deploy.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: |
          cd backend
          npm test
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://127.0.0.1:27017/test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

#### Complete CI/CD Pipeline
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install and test frontend
        run: |
          cd frontend
          npm ci
          npm run lint
          npm test
          npm run build

  test-backend:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install and test backend
        run: |
          cd backend
          npm ci
          npm run lint
          npm test
        env:
          MONGODB_URI: mongodb://127.0.0.1:27017/test

  deploy:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy Frontend
        # Frontend deployment steps
      
      - name: Deploy Backend
        # Backend deployment steps
```

### Alternative CI/CD Platforms

#### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "16"

test-frontend:
  stage: test
  image: node:$NODE_VERSION
  script:
    - cd frontend
    - npm ci
    - npm test

test-backend:
  stage: test
  image: node:$NODE_VERSION
  services:
    - mongo:4.4
  variables:
    MONGODB_URI: mongodb://mongo:27017/test
  script:
    - cd backend
    - npm ci
    - npm test

deploy-production:
  stage: deploy
  script:
    - npm run deploy:production
  only:
    - main
```

#### Jenkins Pipeline
```groovy
// Jenkinsfile
pipeline {
    agent any
    
    tools {
        nodejs '16'
    }
    
    stages {
        stage('Install Dependencies') {
            parallel {
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test'
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            when {
                branch 'main'
            }
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm run deploy:production'
            }
        }
    }
}
```

## Monitoring and Logging

### Application Monitoring

#### Frontend Monitoring (Sentry)
```javascript
// frontend/src/utils/monitoring.js
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});

export default Sentry;
```

#### Backend Monitoring (Winston + Sentry)
```javascript
// backend/config/logger.js
const winston = require('winston');
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### Performance Monitoring

#### Web Vitals Tracking
```javascript
// frontend/src/utils/analytics.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to Google Analytics
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### Backend Performance Monitoring
```javascript
// backend/middleware/performance.js
const responseTime = require('response-time');
const logger = require('../config/logger');

const performanceMonitoring = responseTime((req, res, time) => {
  const log = {
    method: req.method,
    url: req.url,
    responseTime: time,
    statusCode: res.statusCode,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  };
  
  if (time > 1000) {
    logger.warn('Slow request detected', log);
  } else {
    logger.info('Request completed', log);
  }
});

module.exports = performanceMonitoring;
```

### Health Checks

#### Backend Health Check
```javascript
// backend/routes/health.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  };
  
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    
    health.database = 'Connected';
    res.status(200).json(health);
  } catch (error) {
    health.status = 'ERROR';
    health.database = 'Disconnected';
    health.error = error.message;
    res.status(503).json(health);
  }
});

module.exports = router;
```

#### Uptime Monitoring
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    volumes:
      - uptime-kuma:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped

volumes:
  uptime-kuma:
```

## Security Configuration

### SSL/TLS Configuration

#### Vercel (Automatic)
Vercel provides automatic SSL/TLS certificates for custom domains.

#### Render (Automatic)
Render provides automatic SSL/TLS certificates for all deployments.

#### Custom SSL Setup (Nginx)
```nginx
# /etc/nginx/sites-available/excel-analytics
server {
    listen 443 ssl http2;
    server_name api.excelanalytics.com;
    
    ssl_certificate /etc/letsencrypt/live/api.excelanalytics.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.excelanalytics.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Security Headers

#### Backend Security Middleware
```javascript
// backend/middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

module.exports = { limiter, securityHeaders };
```

### Authentication Security

#### JWT Security
```javascript
// backend/config/jwt.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m',
    issuer: 'excel-analytics',
    audience: 'excel-analytics-users',
  });
  
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
    issuer: 'excel-analytics',
    audience: 'excel-analytics-users',
  });
  
  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
```

#### Password Security
```javascript
// backend/utils/password.js
const bcrypt = require('bcryptjs');
const validator = require('validator');

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  
  return password.length >= minLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasNonalphas;
};

module.exports = { hashPassword, validatePassword };
```

## Performance Optimization

### Frontend Optimization

#### Build Optimization
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'chart.js'],
  },
});
```

#### Code Splitting
```javascript
// Lazy loading components
import { lazy, Suspense } from 'react';

const Chart3D = lazy(() => import('./components/Chart3D'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chart3d" element={<Chart3D />} />
        </Routes>
      </Router>
    </Suspense>
  );
}
```

#### Asset Optimization
```javascript
// Image optimization
import { defineConfig } from 'vite';
import { imageOptimize } from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    imageOptimize({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.65, 0.8] },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
    }),
  ],
});
```

### Backend Optimization

#### Caching Strategy
```javascript
// backend/middleware/cache.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.sendResponse(body);
    };
    
    next();
  };
};

module.exports = cacheMiddleware;
```

#### Database Optimization
```javascript
// backend/models/Chart.js
const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  // Schema definition
}, {
  timestamps: true,
});

// Indexes for performance
chartSchema.index({ userId: 1, createdAt: -1 });
chartSchema.index({ type: 1 });
chartSchema.index({ 'metadata.tags': 1 });

// Virtual for computed fields
chartSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

module.exports = mongoose.model('Chart', chartSchema);
```

#### Compression and Gzip
```javascript
// backend/app.js
const compression = require('compression');

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
}));
```

### CDN Configuration

#### Cloudflare Setup
```javascript
// Cloudflare Page Rules
const pageRules = [
  {
    url: "*.excelanalytics.com/assets/*",
    settings: {
      cacheLevel: "cache_everything",
      edgeCacheTtl: 31536000, // 1 year
    }
  },
  {
    url: "api.excelanalytics.com/*",
    settings: {
      cacheLevel: "bypass",
    }
  }
];
```

#### AWS CloudFront
```yaml
# cloudformation/cloudfront.yml
Resources:
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: excel-analytics.vercel.app
            Id: frontend-origin
            CustomOriginConfig:
              HTTPPort: 443
              OriginProtocolPolicy: https-only
        DefaultCacheBehavior:
          TargetOriginId: frontend-origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
        PriceClass: PriceClass_100
        ViewerCertificate:
          AcmCertificateArn: !Ref SSLCertificate
          SslSupportMethod: sni-only
```

## Troubleshooting

### Common Deployment Issues

#### Build Failures

**Frontend Build Fails**
```bash
# Check Node.js version
node --version
npm --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

**Backend Build Fails**
```bash
# Check dependencies
npm audit

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit fix

# Rebuild native modules
npm rebuild
```

#### Runtime Errors

**Database Connection Issues**
```javascript
// Debugging database connection
const mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
```

**CORS Issues**
```javascript
// backend/middleware/cors.js
const cors = require('cors');

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://excel-analytics.vercel.app',
      'https://www.excelanalytics.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
```

#### Performance Issues

**Slow API Responses**
```bash
# Profile API endpoints
npm install clinic
clinic doctor -- node server.js

# Analyze memory usage
clinic heapprofile -- node server.js

# Check for memory leaks
clinic bubbleprof -- node server.js
```

**Large Bundle Sizes**
```bash
# Analyze bundle
npm run build
npm run analyze

# Check for duplicate dependencies
npx webpack-bundle-analyzer dist/static/js/*.js
```

### Debugging Tools

#### Development Tools
```javascript
// Debug configuration
if (process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('combined'));
  app.use(require('cors')({ origin: true, credentials: true }));
}
```

#### Production Debugging
```javascript
// Error tracking in production
const Sentry = require('@sentry/node');

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  Sentry.captureException(reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  Sentry.captureException(error);
  process.exit(1);
});
```

### Recovery Procedures

#### Database Recovery
```bash
# Create database backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/excel-analytics" --out=backup/

# Restore database
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/excel-analytics" backup/excel-analytics/
```

#### Application Recovery
```bash
# Rollback deployment
git revert HEAD
git push origin main

# Emergency maintenance mode
# Set maintenance page in CDN or load balancer
```

---

This deployment guide covers all aspects of deploying the Excel Analytics Platform. For additional help with specific deployment scenarios, contact the development team or refer to the platform-specific documentation.

🚀 **Happy Deploying!**
