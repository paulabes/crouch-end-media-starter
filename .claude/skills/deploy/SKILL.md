# Deploy

Build and deploy the site to Vercel.

## Usage
```
/deploy
```

## Instructions

1. **Run the build** to check for errors:
```bash
npm run build
```

2. **If build succeeds**, commit changes:
```bash
git add -A
git commit -m "Deploy: [brief description of changes]"
git push origin master
```

3. **Vercel auto-deploys** from the master branch

4. **Verify deployment** at the configured site URL

## Pre-deploy Checklist

- [ ] `site.config.ts` fully configured for client
- [ ] All images optimized and properly sized
- [ ] Meta descriptions set for all pages
- [ ] No console errors in dev tools
- [ ] Mobile responsive tested
- [ ] Forms working correctly
- [ ] Environment variables set in Vercel dashboard
- [ ] OG image at `/public/images/og-default.jpg` (1200x630, JPG only)
