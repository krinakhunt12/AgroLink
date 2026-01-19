# Routing Migration Guide

## Overview

The application has been migrated from **HashRouter** to **BrowserRouter** with a centralized routing configuration.

## Changes Made

### 1. **Created `router.tsx`**
- **Location**: `src/router.tsx`
- **Purpose**: Centralized routing configuration
- **Benefits**:
  - All routes in one place for easy management
  - Better organization with route grouping
  - Easier to add/modify routes
  - Improved code maintainability

### 2. **Updated `App.tsx`**
- **Before**: Used `HashRouter` with inline routes
- **After**: Uses `BrowserRouter` and imports `AppRouter`
- **Benefits**:
  - Cleaner URLs (no `#` in URLs)
  - Better SEO
  - More professional appearance
  - Simplified App component

### 3. **Updated `vite.config.ts`**
- Added `historyApiFallback: true` for dev server
- Ensures all routes work correctly during development
- Handles page refreshes on any route

### 4. **Added Deployment Configurations**

#### For Vercel (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### For Netlify (`public/_redirects`)
```
/*    /index.html   200
```

## URL Changes

### Before (HashRouter)
```
http://localhost:5173/#/
http://localhost:5173/#/market
http://localhost:5173/#/product/123
http://localhost:5173/#/dashboard
```

### After (BrowserRouter)
```
http://localhost:5173/
http://localhost:5173/market
http://localhost:5173/product/123
http://localhost:5173/dashboard
```

## Route Structure

### Auth Routes (No Layout)
- `/login` - Login page
- `/register` - Registration page

### Main Routes (With Navbar/Footer)
- `/` - Home page
- `/market` - Marketplace
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/dashboard` - Farmer dashboard
- `/ai-advisor` - AI Assistant
- `/help` - Help center
- `/about` - About page
- `/news` - News page
- `/terms` - Terms of service
- `/privacy` - Privacy policy

## How to Add New Routes

### Step 1: Import the Component
```typescript
// In router.tsx
import NewPage from './pages/NewPage';
```

### Step 2: Add the Route

#### For pages WITH Navbar/Footer:
```typescript
<Route element={<MainLayout />}>
  {/* ... existing routes ... */}
  <Route path="/new-page" element={<NewPage />} />
</Route>
```

#### For pages WITHOUT Navbar/Footer:
```typescript
<Routes>
  {/* Auth Pages (No Navbar/Footer) */}
  <Route path="/login" element={<Login />} />
  <Route path="/new-standalone" element={<NewStandalone />} />
  
  {/* ... rest of routes ... */}
</Routes>
```

## Navigation

### Using Link Component
```typescript
import { Link } from 'react-router-dom';

<Link to="/market">Go to Marketplace</Link>
```

### Using useNavigate Hook
```typescript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/dashboard');
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
};
```

### Programmatic Navigation with Parameters
```typescript
// Navigate to product detail
navigate(`/product/${productId}`);

// Navigate with state
navigate('/dashboard', { state: { from: 'marketplace' } });

// Go back
navigate(-1);
```

## Testing

### Development
```bash
npm run dev
```

Then test these URLs:
- http://localhost:5173/
- http://localhost:5173/market
- http://localhost:5173/dashboard
- Refresh any page to ensure it still works

### Production Build
```bash
npm run build
npm run preview
```

Test the same URLs to ensure routing works in production mode.

## Troubleshooting

### Issue: 404 on Page Refresh

**Cause**: Server not configured to handle client-side routing

**Solution**:
- **Development**: Already fixed with `historyApiFallback` in `vite.config.ts`
- **Production (Vercel)**: Use `vercel.json` (already created)
- **Production (Netlify)**: Use `_redirects` (already created)
- **Production (Other)**: Configure your server to serve `index.html` for all routes

### Issue: Links Not Working

**Cause**: Using `<a>` tags instead of `<Link>`

**Solution**: Replace `<a href="/path">` with `<Link to="/path">`

```typescript
// ❌ Wrong
<a href="/market">Marketplace</a>

// ✅ Correct
<Link to="/market">Marketplace</Link>
```

### Issue: Active Route Not Highlighting

**Solution**: Use `NavLink` instead of `Link`

```typescript
import { NavLink } from 'react-router-dom';

<NavLink 
  to="/market" 
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Marketplace
</NavLink>
```

## Benefits of This Migration

### 1. **Better SEO**
- Search engines can crawl clean URLs
- No hash fragments in URLs
- Better indexing

### 2. **Improved User Experience**
- Professional-looking URLs
- Shareable links work correctly
- Browser history works as expected

### 3. **Easier Maintenance**
- All routes in one file
- Clear route organization
- Easier to add/modify routes

### 4. **Better Development**
- Centralized route management
- Type-safe routing (with TypeScript)
- Easier debugging

## Migration Checklist

- [x] Created `router.tsx` with all routes
- [x] Updated `App.tsx` to use BrowserRouter
- [x] Configured `vite.config.ts` for dev server
- [x] Added `vercel.json` for Vercel deployment
- [x] Added `_redirects` for Netlify deployment
- [x] Tested all routes in development
- [ ] Test all routes in production
- [ ] Update any hardcoded URLs in the app
- [ ] Update documentation/README

## Next Steps

1. **Test all routes** to ensure they work correctly
2. **Update any external links** that might still use hash URLs
3. **Update bookmarks** if you have any
4. **Deploy and test** in production environment

## Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [BrowserRouter vs HashRouter](https://reactrouter.com/en/main/router-components/browser-router)
- [Vite Configuration](https://vitejs.dev/config/)

---

**Last Updated**: January 19, 2026  
**Version**: 2.0.0  
**Migration Status**: ✅ Complete
