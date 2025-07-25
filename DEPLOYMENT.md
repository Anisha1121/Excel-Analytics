# Deployment Guide for Excel Analytics Platform

## Render Deployment Setup

### Prerequisites
1. GitHub repository pushed with latest changes
2. Render account created
3. MongoDB Atlas database (or other MongoDB hosting)

### Backend Deployment Steps

#### 1. Create Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `Excel-Analytics`

#### 2. Service Configuration
- **Name**: `excel-analytics-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: Leave blank (will use repository root)

#### 3. Environment Variables (CRITICAL!)
Add these environment variables in Render dashboard:

**Required Variables:**
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-64-characters-minimum
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-url.onrender.com
```

**Optional Variables:**
```bash
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_ENABLED=true
LOG_LEVEL=info
```

**Email Configuration (for forgot password):**
```bash
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
FROM_EMAIL=noreply@excelanalytics.com
```

#### 4. Database Setup (MongoDB Atlas)
1. Create MongoDB Atlas account: https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Create database user and password
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string and add to `MONGODB_URI`

### Frontend Deployment Steps

#### 1. Create Static Site on Render
1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Select the repository: `Excel-Analytics`

#### 2. Static Site Configuration
- **Name**: `excel-analytics-frontend`
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

#### 3. Environment Variables for Frontend
```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

### Common Deployment Issues & Solutions

#### Issue 1: Build Fails with "crypto" module error
**Solution**: Remove `crypto` from dependencies (it's built-in)
```bash
# This is already fixed in the updated package.json
```

#### Issue 2: MongoDB connection fails
**Solutions**:
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

#### Issue 3: Environment variables not set
**Solutions**:
- Add all required environment variables in Render dashboard
- Generate a strong JWT_SECRET (64+ characters)
- Set correct MONGODB_URI from Atlas

#### Issue 4: CORS errors
**Solutions**:
- Set correct FRONTEND_URL in backend environment variables
- Ensure frontend is calling correct backend URL

#### Issue 5: File upload fails
**Solutions**:
- Render's ephemeral filesystem means uploaded files don't persist
- Consider using cloud storage (AWS S3, Cloudinary) for production

### Deployment Commands

After fixing issues, commit and push changes:

```bash
git add .
git commit -m "fix: Remove crypto dependency and update Render config"
git push origin master
```

Render will automatically redeploy when you push to the connected branch.

### Post-Deployment Checklist

1. ✅ Backend service starts successfully
2. ✅ Database connection established
3. ✅ Frontend builds and deploys
4. ✅ API endpoints respond correctly
5. ✅ Authentication works
6. ✅ File upload functionality works
7. ✅ Email service works (forgot password)

### Monitoring & Logs

- **Backend logs**: Available in Render dashboard under your web service
- **Build logs**: Check build process for errors
- **Runtime logs**: Monitor application errors and performance

### Production Considerations

1. **Database**: Use MongoDB Atlas or dedicated database hosting
2. **File Storage**: Implement cloud storage for file uploads
3. **Email Service**: Use professional email service (SendGrid, Mailgun)
4. **Monitoring**: Set up error monitoring (Sentry, LogRocket)
5. **SSL**: Render provides SSL certificates automatically
6. **Custom Domain**: Configure custom domain in Render dashboard

### Support

If deployment issues persist:
1. Check Render service logs
2. Verify all environment variables are set
3. Test database connection
4. Review build and runtime logs
5. Contact Render support if needed

---

**Next Steps**: After successful deployment, update the frontend API URL and test all functionality.
