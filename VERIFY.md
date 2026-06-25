# Verification Checklist

## ✅ Pre-Submission Tests

### 1. Backend API
- [ ] Server runs on port 8000
- [ ] `/api/teams` returns 12 teams
- [ ] Each team has xG stats calculated
- [ ] Response time < 100ms

Test:
```bash
curl http://localhost:8000/api/teams | jq 'length'
# Expected: 12

curl http://localhost:8000/api/teams | jq '.[0] | keys'
# Should include: id, name, stats, goalsFor, etc.
```

### 2. Frontend React App
- [ ] Vite dev server runs on port 3000
- [ ] App loads without console errors
- [ ] Dashboard renders all 4 charts
- [ ] Team table is sortable
- [ ] Insights section displays key findings
- [ ] Responsive on mobile (tested via DevTools)

Test:
```bash
# In browser: http://localhost:3000
# Check browser console (F12) for errors
# Try clicking column headers in team table
# Verify charts are interactive (hover tooltips)
```

### 3. Data Integrity
- [ ] All 12 teams present in dashboard
- [ ] Manchester City shows highest xG Diff
- [ ] xG calculations are consistent
- [ ] No NaN or undefined values in charts

Test:
```bash
curl http://localhost:8000/api/teams | jq '
  map({name: .name, xGDiff: .stats.xGDiff}) |
  sort_by(.xGDiff) |
  reverse |
  .[0:3]
'
```

Expected top 3 by xG Diff:
1. Manchester City (~+18.3)
2. Liverpool (~+13.8)
3. Arsenal (~+5.8)

### 4. Production Build
- [ ] Build completes without errors: `npm run build`
- [ ] dist/ folder contains index.html
- [ ] JavaScript files are minified
- [ ] CSS is included

Test:
```bash
npm run build
ls -la client/dist/
```

### 5. Git Status
- [ ] All changes committed
- [ ] No uncommitted files
- [ ] Git history is clean

Test:
```bash
git status
# Should show: "nothing to commit, working tree clean"

git log --oneline | head -5
# Should show recent commits with good messages
```

### 6. Documentation
- [ ] README.md is comprehensive
- [ ] SUBMISSION.md addresses all judges' criteria
- [ ] PROJECT_GUIDE.md explains xG methodology
- [ ] No broken links in documentation

### 7. Deployment Readiness
- [ ] .gitignore includes node_modules/
- [ ] No .env files committed
- [ ] package.json has proper scripts
- [ ] No hardcoded localhost URLs (proxied correctly)

## 🎯 Pre-Public Checklist

Before making repo public:

### Code Quality
- [ ] No console.log() left in production code
- [ ] No commented-out code blocks
- [ ] Proper error handling in API calls
- [ ] Consistent code formatting

### Security
- [ ] No API keys in code
- [ ] No passwords or secrets committed
- [ ] CORS properly configured
- [ ] No XSS vulnerabilities (React auto-escapes)

### Performance
- [ ] Frontend bundles < 600KB gzipped
- [ ] API responds in < 100ms
- [ ] No infinite loops or memory leaks
- [ ] Lazy loading for images (if any)

### Accessibility
- [ ] Chart labels are descriptive
- [ ] Color not sole means of information
- [ ] Alt text on visualizations
- [ ] Keyboard navigable

## 📋 Final Checklist

Before submitting to Devpost:

- [ ] Git repo created (private or public)
- [ ] All documentation complete
- [ ] No build errors
- [ ] API working locally
- [ ] Frontend renders correctly
- [ ] All 12 teams showing in dashboard
- [ ] Charts are interactive
- [ ] Insights section populated
- [ ] README easy to understand
- [ ] SUBMISSION.md addresses judging criteria
- [ ] Git history looks professional
- [ ] Ready for judges to fork and run

## 🚀 Deployment Verification

If deployed to production:

- [ ] Frontend loads from https
- [ ] API is accessible and responsive
- [ ] CORS headers correct
- [ ] Database/data is fresh
- [ ] Analytics working
- [ ] No 404s or 500s
- [ ] Mobile experience good
- [ ] Link in Devpost submission is valid

---

**Last Updated**: June 26, 2026
**Time Remaining**: ~13 hours until deadline
