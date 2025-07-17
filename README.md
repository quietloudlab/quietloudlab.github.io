# quietloudlab - Critical Design & Innovation Studio

A modern, interactive website for quietloudlab, a critical design and innovation studio exploring the spaces between people, systems, technology, and futures.

## Features

- **Interactive Typography**: Custom Distort font with real-time distortion effects
- **Glass Morphism UI**: Modern glass pane grid background with refraction effects
- **Video Background**: Immersive video background with optimized loading
- **Responsive Design**: Fully responsive across all devices
- **Performance Optimized**: Built with performance in mind
- **SEO Ready**: Comprehensive meta tags and structured data
- **PWA Support**: Progressive Web App capabilities
- **Contact Forms**: Integrated contact and email signup forms

## Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Font**: Custom Distort Variable Font
- **Forms**: Formspree integration
- **Build Tools**: Node.js with minification pipeline
- **Hosting**: Ready for any static hosting service

## Quick Start

### Development

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd distortfontdemo
   ```

2. **Start local development server**
   ```bash
   # Using Python (included)
   python3 https_server.py
   
   # Or using Node.js
   npx serve .
   
   # Or using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   - Development: `http://localhost:8000`
   - HTTPS (Python): `https://localhost:8444`

### Production Build

1. **Install dependencies and build**
   ```bash
   node build.js
   ```

2. **Deploy the `dist/` directory**
   Upload all contents to your web server.

## Project Structure

```
distortfontdemo/
├── index.html              # Main HTML file
├── style.css               # Styles with glass morphism effects
├── script.js               # Interactive JavaScript
├── fonts/                  # Custom Distort font
│   └── Distort-VariableVF.ttf
├── assets/                 # Images and video
│   ├── img/
│   └── video/
├── build.js                # Build script for production
├── .htaccess               # Apache server configuration
├── robots.txt              # SEO configuration
├── sitemap.xml             # Search engine sitemap
├── site.webmanifest        # PWA manifest
├── 404.html                # Custom error page
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

## Customization

### Colors & Styling
- Primary colors are defined in CSS custom properties
- Glass morphism effects can be adjusted in `.glass-pane` styles
- Typography effects are controlled in `script.js` CONFIG object

### Content
- Update text content in `index.html`
- Modify meta tags for SEO
- Update contact form endpoints in forms

### Performance
- Adjust performance settings in `script.js` CONFIG object
- Modify caching rules in `.htaccess`
- Update preload directives in HTML head

## Performance Features

- **Asset Optimization**: Automatic minification of CSS, JS, and HTML
- **Lazy Loading**: Video and images load efficiently
- **Browser Caching**: Aggressive caching for static assets
- **Compression**: Gzip compression enabled
- **Preloading**: Critical resources preloaded
- **Adaptive Performance**: JavaScript adapts to device capabilities

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Comment complex JavaScript functions
- Follow semantic HTML structure
- Use descriptive class names

### Performance
- Keep JavaScript bundle size minimal
- Optimize images before adding to assets
- Test on mobile devices regularly
- Monitor Core Web Vitals

### Accessibility
- Maintain proper heading hierarchy
- Ensure sufficient color contrast
- Provide alt text for images
- Test with screen readers

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Recommended Hosting
- **Netlify**: Easy deployment with automatic builds
- **Vercel**: Great for static sites with edge functions
- **GitHub Pages**: Free hosting for open source projects
- **Traditional Web Hosting**: Upload `dist/` contents

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to quietloudlab.

## Contact

For questions or support:
- Email: brandon@quietloudlab.com
- LinkedIn: [quietloudlab](https://www.linkedin.com/company/quietloudlab)

---

Built with ❤️ by quietloudlab 