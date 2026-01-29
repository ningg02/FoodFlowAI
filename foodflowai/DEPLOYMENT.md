# Deployment Guide

This guide covers deploying your Food Rescue Dashboard to various platforms.

## Quick Deploy Options

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

**Or use Vercel's GitHub integration:**
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite and deploy

### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build your project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

**Or use Netlify's drag-and-drop:**
1. Build: `npm run build`
2. Visit [netlify.com/drop](https://app.netlify.com/drop)
3. Drag your `dist/` folder

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Replace with your repo name
})
```

3. Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

### Render

1. Create a new Static Site on [render.com](https://render.com)
2. Connect your Git repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

### Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Deploy:
```bash
railway up
```

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t food-rescue-dashboard .
docker run -p 8080:80 food-rescue-dashboard
```

## Environment Configuration

For production deployments with environment variables:

1. Create `.env.production`:
```
VITE_API_URL=https://your-api.com
VITE_MAP_API_KEY=your-key-here
```

2. Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Performance Tips

1. **Enable compression** in your hosting config
2. **Add caching headers** for static assets
3. **Use a CDN** for faster global delivery
4. **Optimize images** before deployment
5. **Enable HTTP/2** if available

## Monitoring

Consider adding:
- **Error tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Performance monitoring**: Lighthouse CI

## Custom Domain

Most platforms offer custom domain configuration:
1. Add your domain in the platform dashboard
2. Update DNS records (usually CNAME or A records)
3. Enable SSL/TLS (usually automatic)

## CI/CD

Example GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Troubleshooting

**Build fails:**
- Check Node version (16+)
- Clear node_modules and reinstall
- Check for TypeScript errors

**App doesn't load:**
- Verify base path in vite.config.js
- Check browser console for errors
- Ensure all environment variables are set

**Styling issues:**
- Verify Tailwind CSS is processing
- Check PostCSS configuration
- Clear browser cache

For more help, check the [Vite deployment docs](https://vitejs.dev/guide/static-deploy.html).
