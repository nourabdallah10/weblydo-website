# Deployment Guide: GitHub Pages + GoDaddy Domain

This guide will walk you through deploying your website to GitHub Pages and connecting it to your GoDaddy domain (weblydo.com).

## Prerequisites
- A GitHub account
- Git installed on your computer
- Access to your GoDaddy account
- Your website files ready (index.html, styles.css, script.js, etc.)

---

## Part 1: Push Code to GitHub

### Step 1: Initialize Git Repository (if not already done)

Open your terminal/command prompt in your project folder (`E:\WeblyDo Website`) and run:

```bash
git init
```

### Step 2: Create .gitignore File (Optional but Recommended)

Create a `.gitignore` file in your project root to exclude unnecessary files:

```
# OS files
.DS_Store
Thumbs.db
desktop.ini

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*

# Temporary files
*.tmp
*.temp
```

### Step 3: Add All Files to Git

```bash
git add .
```

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: WeblyDo website"
```

### Step 5: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Repository name: `weblydo-website` (or any name you prefer)
5. Description: "WeblyDo - Digital Solutions Website"
6. Set visibility to **Public** (required for free GitHub Pages)
7. **DO NOT** initialize with README, .gitignore, or license (you already have files)
8. Click **"Create repository"**

### Step 6: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/weblydo-website.git
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 7: Push Code to GitHub

```bash
git branch -M main
git push -u origin main
```

You'll be prompted for your GitHub username and password (use a Personal Access Token if 2FA is enabled).

---

## Part 2: Set Up GitHub Pages

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **"Settings"** tab (top menu)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **"Save"**

### Step 2: Wait for Deployment

- GitHub will build your site (usually takes 1-2 minutes)
- You'll see a green checkmark when it's ready
- Your site will be available at: `https://YOUR_USERNAME.github.io/weblydo-website/`

### Step 3: Verify Your Site is Live

Visit the GitHub Pages URL to confirm your site is working correctly.

---

## Part 3: Connect GoDaddy Domain to GitHub Pages

### Step 1: Add Custom Domain in GitHub

1. In your repository, go to **Settings** → **Pages**
2. Under **"Custom domain"**, enter: `weblydo.com`
3. Click **"Save"**
4. GitHub will create a `CNAME` file automatically (or you may need to create it manually)

### Step 2: Create CNAME File (if needed)

If GitHub doesn't create it automatically, create a file named `CNAME` in your project root with this content:

```
weblydo.com
```

Then commit and push:

```bash
git add CNAME
git commit -m "Add CNAME file for custom domain"
git push
```

### Step 3: Configure DNS in GoDaddy

1. Log in to your [GoDaddy account](https://www.godaddy.com)
2. Go to **"My Products"** → **"Domains"**
3. Find `weblydo.com` and click **"DNS"** or **"Manage DNS"**

### Step 4: Update DNS Records

You need to add/update these DNS records:

#### Option A: Using A Records (Recommended for root domain)

Delete any existing A records for `@` and add these **4 A records**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 600 |
| A | @ | 185.199.109.153 | 600 |
| A | @ | 185.199.110.153 | 600 |
| A | @ | 185.199.111.153 | 600 |

**Note:** These are GitHub Pages IP addresses (they may change - check [GitHub's documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) for current IPs).

#### Option B: Using CNAME (For www subdomain)

If you also want `www.weblydo.com` to work:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | YOUR_USERNAME.github.io | 600 |

### Step 5: Remove Conflicting Records

- Remove any existing A records pointing to other IPs
- Remove any CNAME records for `@` (root domain can't use CNAME)

### Step 6: Wait for DNS Propagation

- DNS changes can take **24-48 hours** to propagate globally
- Usually works within **1-2 hours** in most regions
- You can check propagation status at: [whatsmydns.net](https://www.whatsmydns.net)

### Step 7: Enable HTTPS (Automatic)

1. Go back to GitHub repository → **Settings** → **Pages**
2. Check **"Enforce HTTPS"** checkbox (appears after DNS is configured)
3. This enables SSL certificate automatically via Let's Encrypt

---

## Part 4: Verify Everything Works

### Check DNS Configuration

Run these commands in terminal to verify DNS:

```bash
# Check A records
dig weblydo.com +short

# Check if pointing to GitHub
nslookup weblydo.com
```

### Test Your Site

1. Visit `http://weblydo.com` (should redirect to HTTPS)
2. Visit `https://weblydo.com` (should show your site)
3. Check that all pages load correctly
4. Test on mobile devices

---

## Troubleshooting

### Issue: Domain not working after 24 hours

**Solutions:**
- Verify DNS records are correct in GoDaddy
- Check GitHub Pages settings show "Custom domain" is configured
- Clear browser cache and try incognito mode
- Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)

### Issue: HTTPS not enabled

**Solutions:**
- Wait 24 hours after DNS configuration
- Go to GitHub Pages settings and check "Enforce HTTPS"
- If still not available, remove and re-add the custom domain

### Issue: Site shows GitHub 404 page

**Solutions:**
- Verify `index.html` is in the root of your repository
- Check that GitHub Pages is enabled and pointing to `main` branch
- Ensure all files are committed and pushed

### Issue: Mixed content warnings

**Solutions:**
- Ensure all external resources use HTTPS
- Check that images, fonts, and scripts load over HTTPS

---

## Additional Notes

### Keeping Your Site Updated

After making changes to your website:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically rebuild your site (usually within 1-2 minutes).

### GitHub Pages Limitations

- Free accounts: Public repositories only
- Build time: ~1-2 minutes per deployment
- Bandwidth: 100 GB/month (usually more than enough)
- Builds: 10 builds/hour limit

### Recommended: Add README.md

Create a `README.md` file in your repository:

```markdown
# WeblyDo Website

Official website for WeblyDo - Digital Solutions Provider

## Technologies Used

- HTML5
- CSS3
- JavaScript
- GitHub Pages

## Live Site

Visit us at: [weblydo.com](https://weblydo.com)
```

---

## Quick Reference Commands

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/weblydo-website.git
git push -u origin main

# Future updates
git add .
git commit -m "Update description"
git push
```

---

## Support Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GoDaddy DNS Help](https://www.godaddy.com/help)
- [GitHub Pages Custom Domain Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

**Good luck with your deployment! 🚀**

