@echo off
echo Starting Excel Analytics Platform Deployment...

echo.
echo Step 1: Installing Vercel CLI globally...
npm install -g vercel

echo.
echo Step 2: Building frontend...
cd frontend
call npm run build
cd ..

echo.
echo Step 3: Login to Vercel (if not already logged in)...
vercel login

echo.
echo Step 4: Deploy to Vercel...
vercel --prod

echo.
echo Step 5: Set environment variables...
echo Please run these commands in your terminal after deployment:
echo vercel env add MONGODB_URI
echo (Enter: mongodb+srv://anishas1121:ApkGvDtsba3dr0Hl@user-auth-excel.l27zuuz.mongodb.net/excel-analytics)
echo.
echo vercel env add JWT_SECRET  
echo (Enter: excel-analytics-super-secret-jwt-key-2025-change-in-production)
echo.
echo vercel env add NODE_ENV
echo (Enter: production)

echo.
echo Deployment complete! Your Excel Analytics Platform should be live.
pause
