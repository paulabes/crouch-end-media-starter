# Check Site

Run quality checks on the site for consistency and issues.

## Usage
```
/check-site
```

## Instructions

Perform these checks:

### 1. Build Verification
```bash
npm run build
```
Ensure no TypeScript or build errors.

### 2. Design Consistency
Check all pages follow the design system defined in `site.config.ts`:
- Primary color matches config
- Cream background: `#F5F4F0`
- Fonts: Inter (h1-h3), Space Grotesk (body, h4-h6)
- Consistent spacing: `py-20 md:py-28` or `py-32` for sections

### 3. Image Audit
- All images have alt text
- No broken image paths
- Hero images sized appropriately

### 4. SEO Check
- All pages have unique titles
- Meta descriptions present and under 160 chars
- Proper heading hierarchy (h1 -> h2 -> h3)
- Canonical URLs set

### 5. Accessibility
- Interactive elements have focus states
- Forms have proper labels
- Skip-to-content link present

### 6. Config Consistency
- All components pull from `site.config.ts`
- No hardcoded business names or contact info outside config
- `astro.config.mjs` site URL matches `siteConfig.siteUrl`

### 7. Link Verification
Check internal links are valid:
- Navigation links
- Footer links
- CTA buttons
- Service page links

## Output

Report findings with:
- File path and line number for issues
- Severity (error, warning, suggestion)
- Recommended fix
