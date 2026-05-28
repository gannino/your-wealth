# Deployment Guide

This guide covers deploying Your Wealth to GitHub Pages using GitHub Actions CI/CD.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [GitHub Pages Configuration](#github-pages-configuration)
- [GitHub Actions Workflow](#github-actions-workflow)
- [Deployment Verification](#deployment-verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ A GitHub account
- ✅ Repository created on GitHub
- ✅ Git remote configured (`git remote add origin <repo-url>`)
- ✅ Node.js 18+ and npm installed locally

---

## Initial Setup

### 1. Configure Git Remote

```bash
# Add your GitHub repository as origin
git remote add origin https://github.com/gannino/your-wealth.git

# Verify remote is configured
git remote -v
```

### 2. Update Repository References

Before pushing, update these placeholders with your actual GitHub username:

**Files to update:**
- `README.md` (line 3, 24, 114)
- `.github/workflows/ci-cd.yml` (automatic, but verify)

**Replace `gannino` with your actual GitHub username.**

### 3. Initial Push to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Add CI/CD pipeline for GitHub Pages"

# Push to main branch
git push -u origin main
```

---

## GitHub Pages Configuration

### Step 1: Enable GitHub Pages

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Pages**
3. Under **Build and deployment**, configure:
   - **Source**: `GitHub Actions`
   - Click **Save**

![GitHub Pages Settings](https://docs.github.com/assets/cb-47662/mw-1440/images/help/pages/publishing-source-drop-down.png)

### Step 2: Configure Permissions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - Click **Save**

### Step 3: Enable Pages (if needed)

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Ensure **Allow GitHub Actions to create and approve pull requests** is checked
4. Click **Save**

---

## GitHub Actions Workflow

### What the Pipeline Does

The `.github/workflows/ci-cd.yml` workflow:

**On every push/PR:**
1. ✅ Checks out code
2. ✅ Sets up Node.js 20
3. ✅ Installs dependencies (`npm ci`)
4. ✅ Runs linter (`npm run lint`)
5. ✅ Runs tests (`npm test`)
6. ✅ Builds application (`npm run build`)

**On push to main only:**
7. ✅ Deploys to GitHub Pages

### Workflow Status

Check your workflow status at:
```
https://github.com/gannino/your-wealth/actions
```

### Build Logs

View detailed logs for each workflow run to troubleshoot any issues.

---

## Deployment Verification

### 1. Check Workflow Status

After pushing to `main`, the workflow should start automatically.

**Success indicators:**
- ✅ Green checkmark in the Actions tab
- ✅ All jobs passed (build-and-test, deploy)
- ✅ Deployment job shows your site URL

### 2. Access Your Deployed Site

Your app will be available at:
```
https://gannino.github.io/your-wealth/
```

### 3. Verify Key Features

Test the deployed site:

- [ ] Homepage loads correctly
- [ ] Navigation works (all routes accessible)
- [ ] Training modules load and function
- [ ] Assessments work and save to localStorage
- [ ] Financial plan generation works
- [ ] All assets (CSS, JS, images) load properly

### 4. Check Console for Errors

Open browser DevTools (F12) and check:
- Console for JavaScript errors
- Network tab for failed requests (404s)
- Application tab for localStorage functionality

---

## Troubleshooting

### Issue: Workflow fails with "Build failed"

**Cause:** TypeScript errors or missing dependencies

**Solution:**
```bash
# Run build locally first
cd your-wealth
npm run build

# Fix any errors, then commit and push
git add .
git commit -m "Fix build errors"
git push
```

### Issue: Deployed site shows blank page

**Cause:** Base path mismatch or 404 errors

**Solution:**
1. Check `vite.config.ts` has correct base path:
   ```typescript
   base: '/your-wealth/' // Must match repo name
   ```

2. Check browser console for 404 errors
3. Verify `dist/` contains `index.html`

### Issue: GitHub Pages shows 404

**Cause:** Pages not enabled or wrong source

**Solution:**
1. Go to Settings → Pages
2. Ensure Source is set to "GitHub Actions"
3. Wait 1-2 minutes for DNS propagation

### Issue: Tests fail in CI but pass locally

**Cause:** Environment differences

**Solution:**
- Ensure `package.json` scripts use `--run` flag for CI
- Check Node.js version matches (20)
- Review test logs in Actions tab

### Issue: Assets not loading (CSS/JS 404)

**Cause:** Base path configuration

**Solution:**
- Verify `VITE_GITHUB_PAGES_BASE` is set in workflow
- Check `vite.config.ts` base path matches repo name

### Issue: localStorage not working

**Cause:** Some browsers restrict localStorage on `file://` protocol

**Solution:**
- This only affects local preview, not deployed site
- Use `npm run dev` for local development
- Deployed site (https://) will work fine

---

## Custom Domain (Optional)

### Set Up Custom Domain

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `wealth.yourdomain.com`)
3. Click **Save**

### DNS Configuration

Add these records to your DNS provider:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | gannino.github.io |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

### Enable HTTPS

1. In Pages settings, check **Enforce HTTPS**
2. Wait for SSL certificate to provision (may take up to 24 hours)

---

## Environment Variables

### Current Environment Variables

The workflow uses these environment variables:

```yaml
VITE_GITHUB_PAGES_BASE: /your-wealth/
```

### Adding New Variables

To add environment variables for your app:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add variable (e.g., `VITE_API_URL`)
4. Reference in workflow:
   ```yaml
   env:
     VITE_API_URL: ${{ secrets.VITE_API_URL }}
   ```

---

## Rollback Procedure

### If Deployment Breaks Something

1. **Identify the bad commit:**
   ```bash
   git log --oneline
   ```

2. **Revert the commit:**
   ```bash
   git revert <commit-hash>
   ```

3. **Push the revert:**
   ```bash
   git push origin main
   ```

This will automatically trigger a new deployment with the fixed code.

---

## Performance Optimization

### Current Build Size

- Initial bundle: ~279 KB (46% reduction from initial)
- Total dist size: ~2 MB (includes all assets)

### Optimization Tips

1. **Code splitting** already configured in Vite
2. **Tree shaking** removes unused code
3. **Minification** enabled in production build
4. **Source maps** generated for debugging

---

## Monitoring

### Check Deployment Health

1. **GitHub Actions tab** - View workflow runs
2. **GitHub Pages status** - Check deployment logs
3. **Uptime monitoring** - Use external service (optional)

### Analytics (Optional)

Add analytics to track usage:

1. Google Analytics
2. Plausible (privacy-friendly)
3. Umami (self-hosted)

---

## Security Considerations

### Current Security Measures

- ✅ XSS protection via DOMPurify
- ✅ No server-side code execution
- ✅ No external API calls for data
- ✅ All data stored locally (localStorage)

### Best Practices

- Keep dependencies updated (`npm audit`)
- Review GitHub Actions logs regularly
- Enable branch protection on `main`
- Require PR reviews before merge

---

## Support

For deployment issues:

1. Check [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review [GitHub Pages documentation](https://docs.github.com/en/pages)
3. Open an issue in this repository

---

**Last Updated:** 2026-05-27
