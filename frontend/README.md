# Frontend - Excel Analytics Platform

React.js frontend application for the Excel Analytics Platform.

## Features

- **User Authentication**: Login/register with JWT
- **File Upload**: Drag-and-drop Excel file upload interface
- **Data Preview**: Display uploaded Excel data in tables
- **Chart Builder**: Interactive column selection for X/Y axes
- **Visualizations**: 2D charts (Chart.js) and 3D charts (Three.js)
- **Export**: Download charts as PNG or PDF
- **Dashboard**: User history and analytics
- **Admin Panel**: User management and platform statistics

## Tech Stack

- **React 18** with JavaScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Chart.js** for 2D charts
- **Three.js** for 3D visualizations
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** for form handling
- **React Query** for data fetching

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components (Button, Modal, etc.)
│   │   ├── charts/         # Chart components (2D/3D)
│   │   ├── upload/         # File upload components
│   │   └── dashboard/      # Dashboard components
│   ├── pages/              # Page components
│   │   ├── Auth/          # Login/Register pages
│   │   ├── Dashboard/     # User dashboard
│   │   ├── Upload/        # File upload page
│   │   ├── Analytics/     # Chart creation page
│   │   └── Admin/         # Admin panel
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service functions
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── contexts/           # React contexts (Auth, Theme)
│   └── styles/             # Global styles
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Excel Analytics Platform
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Key Components

### Authentication
- Login/Register forms with validation
- JWT token management
- Protected routes
- Role-based access control

### File Upload
- Drag-and-drop interface
- File type validation (.xls, .xlsx)
- Upload progress indicator
- Error handling

### Chart Builder
- Column selection dropdowns
- Chart type selection (bar, line, pie, 3D)
- Real-time preview
- Export functionality

### Dashboard
- Upload history
- Chart gallery
- Usage statistics
- Quick actions

## API Integration

The frontend communicates with the backend API for:
- User authentication
- File upload and processing
- Data retrieval
- Chart generation
- User management (admin)

## Deployment

### Build
```bash
npm run build
```

### Deploy
The `dist` folder can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
