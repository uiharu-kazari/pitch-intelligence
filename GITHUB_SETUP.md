# GitHub Setup Instructions

## Creating a Private Repository

### Option 1: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not already installed
brew install gh

# Authenticate with GitHub
gh auth login

# Create a private repository
gh repo create football-xg-analytics \
  --private \
  --source=. \
  --remote=origin \
  --push \
  --description "Football/Soccer Expected Goals Analytics Dashboard - AQX Hackathon"
```

### Option 2: Using GitHub Web Interface

1. Go to https://github.com/new
2. Fill in repository name: `football-xg-analytics`
3. Set to **Private**
4. Add description: "Football/Soccer Expected Goals Analytics Dashboard - AQX Hackathon"
5. Click "Create repository"

Then locally:
```bash
git remote add origin https://github.com/YOUR_USERNAME/football-xg-analytics.git
git branch -M main
git push -u origin main
```

## Before Making Public

### Checklist:
- [ ] All features working correctly
- [ ] No sensitive data in commits
- [ ] `.gitignore` properly configured
- [ ] Documentation complete
- [ ] Build passes: `npm run build`
- [ ] API returns correct data
- [ ] No console errors in browser

### Making Public When Ready:

1. Go to repository Settings
2. Scroll to "Danger Zone"
3. Click "Make this repository public"
4. Confirm the action

Or via CLI:
```bash
gh repo edit --visibility public
```

## Submission to Devpost

### Required Information:
- **Project Name**: Football Analytics - Expected Goals Dashboard
- **Description**: [Use content from SUBMISSION.md]
- **Repository Link**: https://github.com/YOUR_USERNAME/football-xg-analytics (will be public)
- **Website/Demo**: http://your-deployed-site.com (if deployed)
- **Hashtags**: #sports-analytics #football #xg #python #react #data-science

### Deployment Options (Optional):

**Option 1: Vercel (Fastest for Frontend)**
```bash
npm install -g vercel
vercel deploy
```

**Option 2: Heroku + Static Frontend**
```bash
# Backend to Heroku
heroku create your-app-name
git push heroku main

# Frontend deployed via Vercel
vercel deploy --prod
```

**Option 3: Full Stack on Railway**
```bash
npm install -g railway
railway init
railway up
```

## Repo Structure for Judges

```
football-xg-analytics/
├── README.md                 # Quick start guide
├── SUBMISSION.md            # Project description for judges
├── PROJECT_GUIDE.md         # Detailed technical documentation
├── GITHUB_SETUP.md          # This file
│
├── server/                  # Backend (Express.js)
│   ├── index.js
│   └── data.js
│
├── client/                  # Frontend (React)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── styles/
│   ├── dist/               # Built production files
│   └── package.json
│
├── package.json            # Root package config
└── .gitignore             # Git ignore rules
```

## Commit History

Judges will see:
1. Initial commit: Project structure
2. Port configuration fix (if needed)
3. Any feature enhancements
4. Documentation updates

Keep commits atomic and well-documented.

## Quick Commands

```bash
# View git history
git log --oneline

# Show current status
git status

# Add and commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Switch to public (when ready)
gh repo edit --visibility public
```
