# Excel Analytics Platform

![Excel Analytics Logo](https://img.shields.io/badge/Excel-Analytics-2ea44f?style=for-the-badge&logo=microsoft-excel)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A comprehensive web platform for Excel file analysis, data visualization, and chart generation with advanced 3D visualization capabilities.

## 🌟 Features

### 📊 **Chart Generation**
- **2D Charts**: Bar, Line, Pie, Scatter charts with Chart.js
- **3D Visualization**: Interactive 3D Bar, Scatter, and Surface charts
- **Real-time Rendering**: Dynamic chart updates with user interactions
- **Export Options**: Save charts as images (PNG, JPEG, PDF)

### 📈 **Data Analysis**
- **Excel File Upload**: Support for .xlsx, .xls files
- **Data Processing**: Automatic data parsing and validation
- **Column Selection**: Choose specific columns for visualization
- **Data Filtering**: Advanced filtering and sorting capabilities

### 🎛️ **Interactive Controls**
- **3D Chart Controls**: 
  - User-controlled camera rotation and zoom
  - Optional auto-rotation
  - Element animations
  - Hover effects with data tooltips
- **Chart Customization**: Axis labels, colors, and styling
- **Responsive Design**: Works on desktop, tablet, and mobile

### 💾 **Data Management**
- **Chart Saving**: Save and retrieve chart configurations
- **File Management**: Upload, store, and manage Excel files
- **User Authentication**: Secure login and registration system
- **Personal Dashboard**: View saved charts and analytics

### 🎨 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful translucent interfaces
- **Dark Mode**: Professional dark theme
- **Animations**: Smooth transitions and micro-interactions
- **Responsive Layout**: Mobile-first design approach

## � Live Demo

**Frontend**: [https://excel-analytics-frontend.vercel.app](https://excel-analytics-frontend.vercel.app)  
**Backend**: [https://excel-analytics-qjvs.onrender.com](https://excel-analytics-qjvs.onrender.com)

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - 2D chart library
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **XLSX** - Excel file processing
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **Git** - Version control
- **GitHub** - Code repository

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Git**

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Anisha1121/Excel-Analytics.git
cd Excel-Analytics
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env with your MongoDB URI and JWT secret

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure API URL
# Edit .env with your backend URL

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🔧 Configuration

### Backend Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/excel-analytics
# or for Atlas: mongodb+srv://username:password@cluster.mongodb.net/excel-analytics

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Excel Analytics
VITE_APP_VERSION=1.0.0
```

## 🎯 Usage Guide

### 1. User Registration & Login
1. Navigate to the registration page
2. Create an account with username, email, and password
3. Login with your credentials

### 2. Upload Excel File
1. Go to the Upload page
2. Select your Excel file (.xlsx or .xls)
3. Choose the worksheet (if multiple sheets exist)
4. Review the data preview

### 3. Generate Charts
1. Navigate to Analytics page
2. Select your uploaded file
3. Choose chart type (Bar, Line, Pie, Scatter, 3D options)
4. Select X and Y axis columns
5. Customize chart appearance
6. Generate and view the chart

### 4. 3D Chart Interactions
- **Rotate**: Click and drag to rotate the view
- **Zoom**: Scroll to zoom in/out
- **Controls**: Use the control panel to toggle features
- **Hover**: Hover over data points for details

### 5. Save and Manage Charts
1. Click "Save Chart" after generating
2. View saved charts in the Saved Charts page
3. Edit or delete charts as needed

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
3. Set environment variables in Vercel dashboard
4. Deploy automatically on Git push

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Configure build settings:
   ```
   Build Command: npm install
   Start Command: npm start
   ```
3. Set environment variables in Render dashboard
4. Deploy automatically on Git push

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Anisha** - Full Stack Developer & Project Lead
- **GitHub**: [@Anisha1121](https://github.com/Anisha1121)

## 🙏 Acknowledgments

- **Chart.js** - Excellent 2D charting library
- **Three.js** - Amazing 3D graphics framework
- **React Three Fiber** - React integration for Three.js
- **Tailwind CSS** - Utility-first CSS framework

---

**Made with ❤️ by [Anisha](https://github.com/Anisha1121)**

*Empowering data-driven decisions through beautiful visualizations*

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Set up environment variables (see respective README files)
5. Start MongoDB service
6. Run the development servers

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- MongoDB default connection: `mongodb://localhost:27017/excel-analytics`

## License

MIT License
