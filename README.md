# Excel Analytics Platform

A complete platform for uploading and analyzing Excel files with interactive visualizations.

## Project Structure

```
excel-analytics/
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express backend API
├── docs/             # Project documentation
└── README.md         # This file
```

## Core Features

### Authentication & Security
- ✅ Secure login for users and admins using JWT
- ✅ Role-based access control (user/admin)

### File Processing
- ✅ Upload Excel files (.xls, .xlsx) using Multer
- ✅ Parse and read data using SheetJS
- ✅ File validation and error handling

### Data Visualization
- ✅ Interactive column selection (X and Y axes)
- ✅ Generate 2D/3D charts using Chart.js and Three.js
- ✅ Export charts as PNG or PDF

### User Management
- ✅ Upload and analysis history tracking
- ✅ User dashboard with personal analytics
- ✅ Admin dashboard with usage statistics

### Optional Features
- 🔄 AI-powered insights (OpenAI API integration)
- 🔄 Advanced chart customization
- 🔄 Collaborative features

## Tech Stack

### Frontend
- React.js with JavaScript
- Chart.js for 2D visualizations
- Three.js for 3D visualizations
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- SheetJS for Excel parsing
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

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
