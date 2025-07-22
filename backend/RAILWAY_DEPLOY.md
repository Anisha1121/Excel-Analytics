# Railway Deployment Instructions for Backend

## Deploy Backend to Railway

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Choose "backend" folder as root directory
6. Add environment variables:
   - MONGODB_URI=mongodb+srv://anishas1121:ApkGvDtsba3dr0Hl@user-auth-excel.l27zuuz.mongodb.net/excel-analytics
   - JWT_SECRET=excel-analytics-super-secret-jwt-key-2025-change-in-production
   - NODE_ENV=production
   - PORT=5000
7. Deploy

## Your backend will be available at: https://your-app-name.up.railway.app
