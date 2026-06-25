# Deployment Guide

## Quick Deploy to Vercel (Easiest)

Vercel is perfect for this project - handles both frontend and backend with zero configuration.

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
# Opens browser to authenticate
```

### Step 3: Deploy
```bash
cd /Users/hina/Downloads/sports-analytics
vercel deploy --prod
```

Vercel will:
- Detect Node.js backend
- Build React frontend  
- Deploy both to live URLs
- Give you a working live link

### Step 4: Submit Link to Devpost
Example link: `https://football-xg-analytics.vercel.app`

---

## Alternative: Manual Deployment

### Option A: Heroku + Vercel (Separate Frontend/Backend)

**Backend to Heroku:**
```bash
cd /Users/hina/Downloads/sports-analytics
heroku create your-app-name
git push heroku main
```

**Frontend to Vercel:**
```bash
cd client
vercel deploy --prod
# Update API endpoint to Heroku URL in vite.config.js
```

### Option B: Railway (All-in-one)

```bash
npm install -g railway
railway init
railway up
```

### Option C: DigitalOcean App Platform

1. Push to GitHub (public repo)
2. Connect GitHub to DigitalOcean
3. Create app from Dockerfile (optional)
4. Deploy

---

## Environment Variables (If Needed)

Create `.env` in project root:
```
PORT=8000
NODE_ENV=production
```

Vercel automatically detects and uses these.

---

## Testing Deployment

After deploying, test:

```bash
# Test API
curl https://your-deployed-url.vercel.app/api/teams | jq 'length'

# Test frontend loads
curl https://your-deployed-url.vercel.app | grep "Football xG"
```

---

## Troubleshooting

### "Port already in use"
- Vercel handles ports automatically
- Ignore if using Vercel

### "API calls failing"
- Check CORS in server/index.js
- Verify API endpoint in client config

### "Build fails"
- Run `npm run build` locally first
- Check for syntax errors: `npm run lint` (if eslint configured)

### "Cannot find module"
- Ensure `node_modules` not in git
- Rebuild locally: `rm -rf node_modules && npm install`

---

## Live URL Format

After deployment, your app will be available at:
```
https://[project-name].vercel.app
```

Use this URL in your Devpost submission!

---

## Keeping Updated

To push updates after deployment:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel automatically redeploys on git push (with GitHub integration).

---

**Recommended: Use Vercel for simplicity and speed!**

Time to deploy: ~3 minutes  
Time to live: ~1 minute
