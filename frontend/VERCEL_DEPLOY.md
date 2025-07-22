# Vercel Deployment Instructions for Frontend

## Deploy Frontend to Vercel

### Step 1: Create Vercel Project
1. Go to https://vercel.com/
2. Click "Add New" → "Project"
3. Import your GitHub repository

### Step 2: Configure Project
- **Framework Preset**: Vite
- **Root Directory**: frontend
- **Build Command**: npm run build
- **Output Directory**: dist
- **Install Command**: npm install

### Step 3: Environment Variables
Add this environment variable:
```
VITE_API_URL=https://excel-analytics-backend.onrender.com/api
```

### Step 4: Deploy
- Click "Deploy"
- Get your frontend URL: https://excel-analytics-frontend.vercel.app

### Note:
- Update the CORS configuration in backend once you have your actual Vercel URL
