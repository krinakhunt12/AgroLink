# Authentication & Role-Based Dashboard System

## 🎯 Overview

This application implements a complete authentication lifecycle with role-based dashboard layouts. The system ensures clean separation between public pages and authenticated dashboards, with proper logout flow and TanStack Query cache management.

---

## 🔐 Authentication Flow

### Login Process

1. **User enters credentials** (phone + password)
2. **TanStack Query mutation** handles the API call
3. **Token & user data** saved to localStorage
4. **Role-based redirect**:
   - **Farmer** → `/dashboard`
   - **Buyer** → `/buyer/dashboard`
5. **TanStack Query cache** initialized for the user

### Logout Process

1. **User clicks logout** button (in dashboard sidebar/header)
2. **Clear auth data** from localStorage
3. **Clear TanStack Query cache** completely
4. **Redirect to landing page** (`/`)
5. **Show success toast**

---

## 🏗️ Architecture

### Route Structure

```
Public Routes (Landing Page UI)
├── / (Home)
├── /market (Marketplace)
├── /product/:id (Product Details)
├── /cart (Shopping Cart)
├── /ai-advisor (AI Assistant)
├── /help (Help Center)
├── /about (About Us)
├── /news (News & Updates)
├── /terms (Terms of Service)
└── /privacy (Privacy Policy)

Auth Routes (No UI)
├── /login
└── /register

Farmer Dashboard (Protected, Separate Layout)
├── /dashboard (Overview)
├── /dashboard/products (Manage Products)
├── /dashboard/products/new (Add Product)
├── /dashboard/orders (View Orders)
├── /dashboard/bids (Manage Bids)
└── /dashboard/profile (Profile Settings)

Buyer Dashboard (Protected, Separate Layout)
├── /buyer/dashboard (Overview)
├── /buyer/marketplace (Browse Products)
├── /buyer/product/:id (Product Details)
├── /buyer/cart (Shopping Cart)
├── /buyer/orders (My Orders)
├── /buyer/wishlist (Wishlist)
└── /buyer/profile (Profile Settings)
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── layouts/
│   │   └── DashboardLayout.tsx       # Role-based dashboard layout
│   ├── ProtectedRoute.tsx            # Route protection & role checking
│   ├── Navbar.tsx                    # Public pages navbar
│   └── Footer.tsx                    # Public pages footer
├── pages/
│   ├── Login.tsx                     # Login page (uses TanStack Query)
│   ├── Register.tsx                  # Registration page
│   ├── FarmerDashboardHome.tsx       # Farmer dashboard overview
│   ├── FarmerDashboard.tsx           # Farmer products management
│   ├── BuyerDashboard.tsx            # Buyer dashboard overview
│   └── ... (other pages)
├── hooks/
│   └── api/
│       └── useAuthQuery.ts           # Auth mutations & queries
└── router.tsx                        # Centralized routing
```

---

## 🔒 Protected Routes

### ProtectedRoute Component

```typescript
<ProtectedRoute requiredRole="farmer">
  <DashboardLayout userType="farmer" />
</ProtectedRoute>
```

**Features:**
- ✅ Checks if user is authenticated
- ✅ Validates user role matches required role
- ✅ Redirects to login if not authenticated
- ✅ Redirects to correct dashboard if wrong role
- ✅ Preserves intended destination for post-login redirect

---

## 🎨 Dashboard Layout

### Features

**Desktop:**
- Persistent sidebar with navigation
- User info display
- Logout button at bottom
- Clean, professional design

**Mobile:**
- Collapsible drawer menu
- Header with hamburger button
- Touch-friendly navigation
- Responsive overlay

### Navigation Items

**Farmer Dashboard:**
- ડેશબોર્ડ (Dashboard)
- મારા ઉત્પાદનો (My Products)
- ઓર્ડર્સ (Orders)
- બિડ્સ (Bids)
- પ્રોફાઇલ (Profile)

**Buyer Dashboard:**
- ડેશબોર્ડ (Dashboard)
- માર્કેટપ્લેસ (Marketplace)
- કાર્ટ (Cart)
- મારા ઓર્ડર્સ (My Orders)
- વિશલિસ્ટ (Wishlist)
- પ્રોફાઇલ (Profile)

---

## 🔄 Logout Implementation

### Code Example

```typescript
const handleLogout = () => {
  try {
    // 1. Clear auth data
    authAPI.logout();
    
    // 2. Clear TanStack Query cache
    queryClient.clear();
    
    // 3. Show success message
    showToast('લોગઆઉટ સફળ રહ્યું!', 'success');
    
    // 4. Log the action
    AppLogger.info('Auth', { message: 'User logged out successfully' });
    
    // 5. Redirect to landing page
    navigate('/', { replace: true });
  } catch (error) {
    AppLogger.error('Auth', error);
    showToast('લોગઆઉટમાં ભૂલ થઈ', 'error');
  }
};
```

### Why Clear Query Cache?

- Prevents data leakage between users
- Ensures fresh data on next login
- Removes sensitive cached information
- Resets application state completely

---

## 📱 Mobile Responsiveness

### Breakpoints

- **Desktop**: `lg:` (1024px+) - Persistent sidebar
- **Mobile**: `< 1024px` - Drawer menu

### Mobile Features

- ✅ Hamburger menu icon
- ✅ Full-screen overlay drawer
- ✅ Touch-friendly tap targets (44x44px minimum)
- ✅ Smooth animations
- ✅ No horizontal scrolling
- ✅ Responsive grid layouts

---

## 🎯 Design Principles

### ✅ DO

- Keep dashboards completely separate from landing page
- Use clean, flat UI design
- Implement consistent spacing and typography
- Show loading states during authentication
- Disable actions during mutations
- Clear all cached data on logout
- Redirect based on user role

### ❌ DON'T

- Reuse landing page UI inside dashboards
- Show farmer UI to buyers (or vice versa)
- Allow unauthenticated access to protected routes
- Keep stale data after logout
- Forget to handle loading/error states
- Use inconsistent navigation patterns

---

## 🚀 Usage Examples

### Login with Role-Based Redirect

```typescript
// In Login.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await loginMutation.mutateAsync(credentials);
    const user = authAPI.getCurrentUser();
    
    setTimeout(() => {
      if (user?.userType === 'farmer') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/buyer/dashboard', { replace: true });
      }
    }, 500);
  } catch (error) {
    // Error handled by mutation
  }
};
```

### Protect a Route

```typescript
// In router.tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRole="farmer">
      <DashboardLayout userType="farmer" />
    </ProtectedRoute>
  }
>
  <Route index element={<FarmerDashboardHome />} />
  {/* ... more routes */}
</Route>
```

### Check Authentication Status

```typescript
// Anywhere in the app
import { authAPI } from '@/services/api';

const isLoggedIn = authAPI.isAuthenticated();
const currentUser = authAPI.getCurrentUser();
const userRole = currentUser?.userType; // 'farmer' | 'buyer'
```

---

## 🔍 Testing the Flow

### Manual Testing Steps

1. **Login as Farmer**
   - Go to `/login`
   - Enter farmer credentials
   - Should redirect to `/dashboard`
   - Verify farmer navigation items visible
   - Click logout → should go to `/`

2. **Login as Buyer**
   - Go to `/login`
   - Enter buyer credentials
   - Should redirect to `/buyer/dashboard`
   - Verify buyer navigation items visible
   - Click logout → should go to `/`

3. **Protected Route Access**
   - Try accessing `/dashboard` without login
   - Should redirect to `/login`
   - After login, should return to intended page

4. **Role Mismatch**
   - Login as buyer
   - Try accessing `/dashboard` (farmer route)
   - Should redirect to `/buyer/dashboard`

---

## 📊 State Management

### Authentication State

```typescript
// Stored in localStorage
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    id: "123",
    name: "રમેશ પટેલ",
    phone: "9876543210",
    userType: "farmer",
    location: "અમદાવાદ"
  }
}
```

### Query Cache State

- Automatically managed by TanStack Query
- Cleared on logout via `queryClient.clear()`
- Separate cache per user session
- No manual cache management needed

---

## 🎨 UI Components

### Dashboard Stats Card

```tsx
<div className="bg-white rounded-xl p-6 border border-gray-200">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">Label</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">Value</p>
    </div>
    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
      <Icon className="w-6 h-6 text-green-600" />
    </div>
  </div>
</div>
```

### Quick Action Card

```tsx
<Link
  to="/path"
  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
>
  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
    <Icon className="w-6 h-6 text-green-600" />
  </div>
  <h3 className="font-semibold text-gray-900 mb-1">Title</h3>
  <p className="text-sm text-gray-600">Description</p>
</Link>
```

---

## 🎉 Summary

✅ **Complete authentication lifecycle** implemented  
✅ **Role-based dashboards** with separate layouts  
✅ **Proper logout flow** with cache clearing  
✅ **Protected routes** with role validation  
✅ **Mobile responsive** design  
✅ **Clean, professional UI** without landing page elements  
✅ **TanStack Query integration** for data management  
✅ **Predictable navigation** patterns  

**The authentication system is production-ready and follows best practices!** 🚀
