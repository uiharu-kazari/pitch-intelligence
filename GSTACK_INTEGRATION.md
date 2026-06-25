# ⚙️ Using gstack Skills for Sports Analytics Development

## Overview

[gstack](https://github.com/garrytan/gstack) is an AI-powered software factory that can accelerate development of your sports analytics app. This document shows how to leverage gstack skills for designing, testing, reviewing, and shipping features.

## Getting Started with gstack

### Install gstack
```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

Then add to your `.claude/projects/-Users-hina-Downloads-sports-analytics/` or `CLAUDE.md`:
```
Add a "gstack" section that lists the available skills and recommends using gstack skills for all AI-assisted work.
```

## Available gstack Skills for Sports Analytics

### 1. **Design Skills** - Perfect for UI/UX Enhancements
- `/design-consultation` - Get expert design feedback on the dashboard
- `/design-shotgun` - Generate multiple design direction options
- `/design-html` - Generate production-ready HTML/CSS
- `/design-review` - Review design implementations

**Use Case**: When you want to design a new visualization or improve the dashboard layout.

```
Example: 
You: "Design a new 'Player Performance Comparison' view that shows xG, shots, conversion rates side-by-side"
gstack: Generates design options, component sketches, and production-ready code
```

### 2. **Development Skills** - Feature Implementation
- `/autoplan` - Break down feature requests into implementation steps
- `/review` - Code review with architecture validation
- `/ship` - Prepare PR with tests, docs, and deployment checklist
- `/browse` - Test features in a real browser

**Use Case**: When building new analytics features or fixing bugs.

```
Example:
You: "Build a filter system to show only top/bottom teams by xG difference"
gstack: Plans the feature, implements it, runs QA, prepares PR
```

### 3. **Testing Skills** - Quality Assurance
- `/qa` - Test a live URL with real browser automation
- `/qa-only` - Run QA on a deployed environment
- `/benchmark` - Performance testing and metrics

**Use Case**: Before shipping new features to production.

```
Example:
You: "/qa http://localhost:5173"
gstack: Tests responsiveness, charts rendering, interactions
```

### 4. **Deployment Skills** - Release Management
- `/ship` - Prepare feature for production
- `/land-and-deploy` - Merge and deploy to production
- `/canary` - Canary deployment (gradual rollout)

**Use Case**: When ready to deploy the analytics dashboard.

### 5. **Security Skills** - OWASP Compliance
- `/cso` - Security audit (OWASP + STRIDE)
- `/investigate` - Debug production issues

**Use Case**: Before first production deployment or after security concerns.

```
Example:
You: "/cso"
gstack: Runs OWASP Top 10 audit, identifies risks, suggests mitigations
```

## Workflow Examples

### Adding a New Feature: "Player Stats Heatmap"

1. **Plan the feature**
   ```
   User: Describe what you're building
   gstack /office-hours
   ```
   Gstack asks forcing questions about:
   - What players/positions to show?
   - Which stats are most important?
   - How to visualize (heatmap vs. bubbles)?
   - Mobile experience?

2. **Design the implementation**
   ```
   User: /autoplan
   gstack: Breaks down into:
   - Create Player component
   - Add heatmap data transformation
   - Styling with design system
   - Unit tests
   - Integration test
   ```

3. **Implement**
   ```
   User: [Implements based on autoplan]
   ```

4. **Code review**
   ```
   User: /review
   gstack: Checks architecture, performance, accessibility
   ```

5. **QA test**
   ```
   User: /qa http://localhost:5173
   gstack: Tests new feature on multiple devices
   ```

6. **Ship to production**
   ```
   User: /ship
   gstack: Prepares PR, runs final checks, deploys
   ```

### Improving Performance

```
User: The dashboard feels slow when loading 30+ teams
User: /investigate
gstack: Analyzes rendering, network, memory usage
```

### Design Exploration

```
User: Should we redesign the header? Get 3 concepts
User: /design-shotgun
gstack: Generates 3 different header designs with pros/cons
```

## Using gstack with Your Team

### Set up team mode (recommended)
```bash
(cd ~/.claude/skills/gstack && ./setup --team) && \
~/.claude/skills/gstack/bin/gstack-team-init required && \
git add .claude/ CLAUDE.md && git commit -m "require gstack for AI-assisted work"
```

This ensures all teammates get gstack automatically and stay in sync.

### Share design decisions
Create a `.claude/decisions/` directory with design decisions:
```
.claude/decisions/
├── 001-chart-library.md      (Why Recharts?)
├── 002-color-palette.md      (Design system colors)
├── 003-performance-targets.md (< 1s FCP, 60fps)
└── 004-responsive-strategy.md (Mobile-first)
```

## Key Benefits for Sports Analytics

1. **Rapid Prototyping** - Test new viz concepts in hours, not days
2. **Consistent Quality** - Design reviews before shipping
3. **Better Performance** - Benchmark and optimize data rendering
4. **Mobile-First** - Automatic responsive testing
5. **Scalable** - Add teammates without losing quality
6. **Data Security** - OWASP audits before production

## Recommended Workflow

### Daily Development
1. Start: `npm run dev`
2. Code: Build features locally
3. Review: `/review` before committing
4. Test: `/qa http://localhost:5173` before merging

### Weekly
1. Plan: `/office-hours` for next sprint features
2. Design: `/design-consultation` for major UI changes
3. Performance: `/benchmark` on production URL

### Before Major Release
1. Security: `/cso` - Full security audit
2. Performance: `/benchmark` - Load testing
3. QA: `/qa-only` on staging environment
4. Deploy: `/ship` - Production deployment checklist

## gstack Skills for Analytics Specifically

### Real Examples

**Scenario 1: Add a new metric**
```
You: "Add 'Expected Assists' (xA) to the team stats table"
/autoplan
gstack: Plans data fetch → UI component → styling → tests → deployment
```

**Scenario 2: Improve mobile experience**
```
You: "Dashboard is hard to use on phone. Fix it"
/design-consultation
gstack: Reviews mobile UX, suggests layouts, generates responsive CSS
```

**Scenario 3: Add team comparison**
```
You: "Show 2 teams side-by-side for xG comparison"
/design-shotgun
gstack: 3 design options (vertical split, horizontal split, overlay)
```

**Scenario 4: Performance issues**
```
You: "Loading 50 teams is slow"
/investigate
gstack: Profiles rendering, suggests optimizations (lazy load, virtualization)
```

## Integration with Your Design System

gstack's `/design-html` skill understands your `design-system.css`:
- Uses your color variables automatically
- Respects your spacing scale
- Applies your animations
- Follows your responsive breakpoints

## Next Steps

1. ✅ Design system implemented (you're here!)
2. ⬜ Install gstack skills
3. ⬜ Set up team mode
4. ⬜ Create `.claude/decisions/` for design docs
5. ⬜ Run `/cso` security audit
6. ⬜ Deploy to production with `/ship`

## Resources

- [gstack GitHub](https://github.com/garrytan/gstack)
- [gstack README](https://github.com/garrytan/gstack#quick-start)
- [UI/UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- Your design system: `DESIGN_SYSTEM.md`

## Questions?

Check the gstack docs or review the DESIGN_SYSTEM.md file for color/spacing references that gstack will use when generating code.

---

**Date**: 2026-06-26  
**Status**: Ready for gstack integration  
**Next**: `npm install && npm run dev` then consider running `/cso` for security audit
