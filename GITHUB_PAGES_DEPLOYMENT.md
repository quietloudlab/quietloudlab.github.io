# GitHub Pages Deployment Guide

This guide will help you deploy your quietloudlab website to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your computer
- Domain name (quietloudlab.com) configured

## Step 1: Prepare Your Repository

1. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it: `quietloudlab.github.io` (this is the special name for GitHub Pages)
   - Make it public
   - Don't initialize with README (we'll push our existing code)

2. **Initialize Git in your local project**
   ```bash
   cd /path/to/your/distortfontdemo
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Connect to GitHub repository**
   ```bash
   git remote add origin https://github.com/yourusername/quietloudlab.github.io.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Configure GitHub Pages

1. **Go to repository settings**
   - Navigate to your repository on GitHub
   - Click "Settings" tab

2. **Enable GitHub Pages**
   - Scroll down to "Pages" section in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch
   - Select "/ (root)" folder
   - Click "Save"

3. **Wait for deployment**
   - GitHub will build and deploy your site
   - You'll see a green checkmark when deployment is complete
   - Your site will be available at: `https://yourusername.github.io`

## Step 3: Configure Custom Domain

1. **Add custom domain**
   - In the Pages settings, under "Custom domain"
   - Enter: `quietloudlab.com`
   - Check "Enforce HTTPS"
   - Click "Save"

2. **Configure DNS**
   - Go to your domain registrar (where you bought quietloudlab.com)
   - Add these DNS records:
     ```
     Type: A
     Name: @
     Value: 185.199.108.153
     TTL: 3600
     
     Type: A
     Name: @
     Value: 185.199.109.153
     TTL: 3600
     
     Type: A
     Name: @
     Value: 185.199.110.153
     TTL: 3600
     
     Type: A
     Name: @
     Value: 185.199.111.153
     TTL: 3600
     ```

3. **Wait for DNS propagation**
   - DNS changes can take 24-48 hours
   - You can check propagation with: `dig quietloudlab.com`

## Step 4: Set Up Automatic Deployment

1. **Create GitHub Actions workflow**
   Create file: `.github/workflows/deploy.yml`
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
       - name: Checkout
         uses: actions/checkout@v3
         
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           
       - name: Install dependencies
         run: npm install
         
       - name: Build
         run: npm run build
         
       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist
   ```

2. **Update repository settings**
   - Go back to Pages settings
   - Change source to "Deploy from a branch"
   - Select "gh-pages" branch
   - Click "Save"

## Step 5: Build Process

Since GitHub Pages doesn't support `.htaccess` files, the Vite build automatically excludes it:

1. **Build for production**
   ```bash
   npm run build
     // Remove .htaccess for GitHub Pages
   ];
   ```

2. **Create a GitHub Pages specific 404 page**
   GitHub Pages uses Jekyll, so we need a Jekyll-compatible 404 page.

## Step 6: Test Your Deployment

1. **Check your site**
   - Visit `https://quietloudlab.com`
   - Test all functionality
   - Check mobile responsiveness

2. **Verify HTTPS**
   - Ensure the site loads with HTTPS
   - Check for mixed content warnings

3. **Test forms**
   - Submit test contact form
   - Verify email signup works

## Step 7: SEO and Analytics

1. **Submit to search engines**
   - Google Search Console: Add your domain
   - Submit sitemap: `https://quietloudlab.com/sitemap.xml`
   - Bing Webmaster Tools: Add your domain

2. **Add analytics (optional)**
   - Google Analytics 4
   - Add tracking code to your HTML

## Troubleshooting

### Common Issues

1. **Site not loading**
   - Check DNS propagation
   - Verify GitHub Pages is enabled
   - Check repository settings

2. **HTTPS not working**
   - Ensure "Enforce HTTPS" is checked
   - Wait for SSL certificate to provision

3. **Custom domain not working**
   - Verify DNS records are correct
   - Check domain registrar settings
   - Wait for DNS propagation

4. **Build failures**
   - Check GitHub Actions logs
   - Verify Node.js version compatibility
   - Check for missing dependencies

### Performance Tips

1. **Optimize images**
   - Use WebP format where possible
   - Compress images before uploading

2. **Monitor performance**
   - Use Lighthouse for performance audits
   - Monitor Core Web Vitals

## Maintenance

### Regular Tasks
- Monitor GitHub Pages status
- Check for security updates
- Review analytics data
- Test site functionality

### Updates
- Push changes to main branch
- GitHub Actions will automatically rebuild and deploy
- Monitor deployment status

## Support

- [GitHub Pages Documentation](https://pages.github.com/)
- [GitHub Pages Help](https://help.github.com/en/github/working-with-github-pages)
- [Custom Domain Help](https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site)

---

Your site will be live at: `https://quietloudlab.com` 