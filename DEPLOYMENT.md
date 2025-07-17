# Deployment Guide for quietloudlab

This guide will help you deploy the quietloudlab website to production.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A web hosting service

## Quick Start

1. **Build for Production**
   ```bash
   node build.js
   ```
   This will create a `dist/` directory with optimized files.

2. **Upload to Your Web Server**
   Upload all contents of the `dist/` directory to your web server's public directory.

## Hosting Options

### 1. Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `node build.js`
3. Set publish directory: `dist`
4. Deploy automatically on git push

### 2. Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts

### 3. GitHub Pages

1. Enable GitHub Pages in your repository settings
2. Set source to `/docs` or `/gh-pages` branch
3. Copy `dist/` contents to the selected directory

### 4. Traditional Web Hosting

1. Run the build script: `node build.js`
2. Upload all files from `dist/` to your web server's public directory
3. Ensure your server supports `.htaccess` files (Apache)

## Domain Configuration

1. **Update URLs**: Replace `quietloudlab.com` with your actual domain in:
   - `index.html` (meta tags)
   - `sitemap.xml`
   - `site.webmanifest`

2. **SSL Certificate**: Ensure your hosting provider offers SSL/HTTPS

3. **DNS Configuration**: Point your domain to your hosting provider

## Performance Optimization

The build process automatically:
- ✅ Minifies CSS, JavaScript, and HTML
- ✅ Optimizes asset loading with preload directives
- ✅ Implements browser caching
- ✅ Enables gzip compression
- ✅ Adds security headers

## Monitoring & Analytics

Consider adding:
- Google Analytics
- Google Search Console
- Performance monitoring (Lighthouse CI)

## Post-Deployment Checklist

- [ ] Test the website on multiple devices
- [ ] Verify all forms work correctly
- [ ] Check page load speed (aim for <3 seconds)
- [ ] Test mobile responsiveness
- [ ] Verify SSL certificate is working
- [ ] Submit sitemap to search engines
- [ ] Test social media sharing (Open Graph tags)

## Troubleshooting

### Common Issues

1. **Forms not working**: Ensure your hosting provider allows POST requests
2. **Video not loading**: Check video file permissions and MIME types
3. **Font not loading**: Verify font file paths and CORS settings
4. **HTTPS redirects**: Ensure `.htaccess` is supported by your server

### Performance Issues

1. **Slow loading**: Check if gzip compression is enabled
2. **Large file sizes**: Ensure minification completed successfully
3. **Caching issues**: Clear browser cache and check cache headers

## Security Considerations

The site includes:
- Content Security Policy (CSP)
- XSS Protection
- Clickjacking Protection
- MIME Type Sniffing Protection
- Secure Referrer Policy

## Support

For deployment issues, check:
1. Your hosting provider's documentation
2. Browser developer tools for errors
3. Server error logs

## Maintenance

- Regularly update dependencies
- Monitor performance metrics
- Keep SSL certificates current
- Update content as needed 