# Vercel Deployment Instructions for Frontend

## Deploy Frontend to Vercel

1. Go to https://vercel.com/
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Set "Root Directory" to: frontend
5. Framework Preset: Vite
6. Build Command: npm run build
7. Output Directory: dist
8. Install Command: npm install

## Environment Variables to Add:
- VITE_API_URL=https://your-backend-url.up.railway.app/api

## Deploy and get your frontend URL
