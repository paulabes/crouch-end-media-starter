# Localhost

Start the local development server.

## Instructions

1. **Start the dev server**:
```bash
npm run dev
```

2. **Open in browser**: http://localhost:4321

3. **Watch for**:
   - Build errors in terminal
   - Hot reload working correctly
   - Console errors in browser dev tools

## Common Issues

### Port already in use
```bash
npx kill-port 4321
npm run dev
```

### Dependencies out of sync
```bash
rm -rf node_modules
npm install
npm run dev
```

### Astro cache issues
```bash
rm -rf .astro
npm run dev
```
