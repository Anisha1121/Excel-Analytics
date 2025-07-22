# Render Deployment Instructions for Backend

## Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com/
2. Sign up with GitHub

### Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your repository
4. Configure:
   - **Name**: excel-analytics-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Instance Type**: Free

### Step 3: Add Environment Variables
Add these environment variables in Render dashboard:

```
MONGODB_URI=mongodb+srv://anishas1121:ApkGvDtsba3dr0Hl@user-auth-excel.l27zuuz.mongodb.net/excel-analytics
JWT_SECRET=excel-analytics-super-secret-jwt-key-2025-change-in-production
NODE_ENV=production
PORT=10000
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Get your backend URL: https://excel-analytics-backend.onrender.com

### Note:
- Free tier has cold starts (app sleeps after 15 min of inactivity)
- First request after sleep takes ~30 seconds to wake up
- Production apps should use paid tier for always-on service
