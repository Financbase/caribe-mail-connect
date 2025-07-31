# PRMCMS Development Workflow

## Ensuring Development-Production Parity

### The Problem

Different build modes can produce different results:

- **Development mode** (`npm run dev`) - Development optimizations
- **Production build** (`npm run build`) - Production optimizations
- **Development build** (`npm run build:dev`) - Builds with development mode

### The Solution

#### 1. **For Development (Fast Iteration)**

```bash
npm run dev
```

- Fast hot reload
- Development optimizations
- May not match production exactly

#### 2. **For Production Testing (Recommended)**

```bash
npm run preview:prod
```

- Builds production version
- Serves it locally
- **Exactly matches what will be deployed**

#### 3. **For Production Development (Best Practice)**

```bash
npm run dev:prod
```

- Builds production version
- Serves on port 3000
- **Always test this before deploying**

### Workflow Best Practices

#### Daily Development

1. **Start with production build**: `npm run dev:prod`
2. **Make changes**
3. **Test in production mode**: `npm run preview:prod`
4. **Deploy when satisfied**

#### Quick Iterations

1. **Use development mode**: `npm run dev`
2. **Test frequently in production mode**: `npm run preview:prod`
3. **Never deploy without testing production build**

### Why This Matters

#### CSS Differences

- **Development**: CSS may not be optimized
- **Production**: CSS is purged, optimized, and bundled
- **Result**: Different styling behavior

#### JavaScript Differences

- **Development**: Unminified, with dev tools
- **Production**: Minified, optimized, tree-shaken
- **Result**: Different performance and behavior

#### Environment Variables

- **Development**: Uses `.env.local`
- **Production**: Uses Cloudflare environment variables
- **Result**: Different configuration

### Commands Summary

| Command | Purpose | Matches Production |
|---------|---------|-------------------|
| `npm run dev` | Fast development | ❌ No |
| `npm run build` | Build production | ✅ Yes |
| `npm run preview` | Preview built version | ✅ Yes |
| `npm run preview:prod` | Build + preview | ✅ Yes |
| `npm run dev:prod` | Build + preview on port 3000 | ✅ Yes |

### Always Test Production Build Before Deploying

The production build is what gets deployed to Cloudflare Pages. Always test it locally first.
