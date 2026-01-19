# Application Logger Usage Guide

## Overview

The Application Logger replaces all `console.log` statements with structured, trackable logging that includes:
- **Feature Name** - Which feature/module the log is from
- **Screen Name** - Which screen/page the log is from (frontend)
- **Endpoint** - Which API endpoint (backend)
- **Log Level** - DEBUG, INFO, WARN, ERROR, SUCCESS
- **Category** - API, UI, AUTH, NAVIGATION, etc.
- **Metadata** - Additional context
- **Error Tracking** - Full error objects with stack traces

---

## Frontend Logger

### Import

```typescript
import logger, { LogCategory } from '../utils/logger';
```

### Basic Usage

```typescript
// Info logging
logger.info(LogCategory.UI, 'Component rendered', {
  featureName: 'Home',
  screenName: 'HomePage'
});

// Error logging
logger.error(LogCategory.API, 'Failed to fetch data', error, {
  featureName: 'Products',
  screenName: 'Marketplace'
});

// Success logging
logger.success(LogCategory.USER_ACTION, 'Product added to cart', {
  featureName: 'Cart',
  screenName: 'ProductDetail',
  productId: '123'
});

// Warning logging
logger.warn(LogCategory.DATA, 'Cache is stale', {
  featureName: 'Cache',
  screenName: 'Home'
});

// Debug logging (only in development)
logger.debug(LogCategory.PERFORMANCE, 'Render time', {
  featureName: 'Home',
  renderTime: 150
});
```

### Specialized Methods

#### API Logging

```typescript
// API Request
logger.apiRequest('GET', '/api/products', {
  featureName: 'Products',
  screenName: 'Marketplace'
});

// API Response
logger.apiResponse('GET', '/api/products', 200, {
  featureName: 'Products',
  screenName: 'Marketplace',
  recordCount: 50
});

// API Error
logger.apiError('POST', '/api/cart', error, {
  featureName: 'Cart',
  screenName: 'Cart'
});
```

#### User Actions

```typescript
logger.userAction('Clicked Add to Cart', 'ProductDetail', {
  featureName: 'Cart',
  productId: '123',
  quantity: 2
});

logger.userAction('Submitted Form', 'Register', {
  featureName: 'Auth',
  formType: 'registration'
});
```

#### Navigation

```typescript
logger.navigation('/home', '/marketplace', {
  featureName: 'Navigation',
  trigger: 'button_click'
});
```

#### Performance

```typescript
logger.performance('Page Load Time', 1250, 'ms', {
  featureName: 'Performance',
  screenName: 'Home'
});

logger.performance('API Response Time', 350, 'ms', {
  featureName: 'API',
  endpoint: '/api/products'
});
```

#### Component Lifecycle

```typescript
import { useEffect } from 'react';
import logger from '../utils/logger';

const MyComponent = () => {
  useEffect(() => {
    logger.componentLifecycle('MyComponent', 'mount', {
      featureName: 'MyFeature'
    });

    return () => {
      logger.componentLifecycle('MyComponent', 'unmount', {
        featureName: 'MyFeature'
      });
    };
  }, []);

  return <div>Content</div>;
};
```

---

## Backend Logger

### Import

```javascript
import logger, { LogCategory } from '../utils/logger.js';
```

### Basic Usage

```javascript
// Info logging
logger.info(LogCategory.API, 'Request received', {
  featureName: 'Products',
  endpoint: '/api/products',
  method: 'GET'
});

// Error logging
logger.error(LogCategory.DATABASE, 'Query failed', error, {
  featureName: 'Products',
  collection: 'products'
});

// Success logging
logger.success(LogCategory.API, 'Response sent', {
  featureName: 'Products',
  endpoint: '/api/products',
  statusCode: 200
});
```

### Specialized Methods

#### API Request/Response

```javascript
// Log incoming request
logger.apiRequest(req.method, req.path, {
  featureName: 'Products',
  userId: req.user?.id
});

// Log response
logger.apiResponse(req.method, req.path, res.statusCode, {
  featureName: 'Products',
  responseTime: Date.now() - startTime
});
```

#### External API Calls

```javascript
// Request to external API
logger.externalApiRequest('MarketPriceAPI', 'GET', url, {
  featureName: 'MarketPrice',
  endpoint: '/api/market-prices'
});

// Response from external API
logger.externalApiResponse('MarketPriceAPI', 'GET', url, response.status, {
  featureName: 'MarketPrice',
  recordsReceived: response.data.records.length
});

// Error from external API
logger.externalApiError('MarketPriceAPI', 'GET', url, error, {
  featureName: 'MarketPrice',
  endpoint: '/api/market-prices'
});
```

#### Database Operations

```javascript
logger.database('INSERT', 'products', {
  featureName: 'Products',
  documentId: product._id
});

logger.database('UPDATE', 'users', {
  featureName: 'Users',
  userId: user._id
});
```

#### Authentication

```javascript
logger.auth('Login Success', userId, {
  featureName: 'Auth',
  method: 'email'
});

logger.auth('Token Refresh', userId, {
  featureName: 'Auth'
});
```

#### Middleware

```javascript
logger.middleware('AuthMiddleware', 'Token validated', {
  featureName: 'Auth',
  userId: req.user.id
});

logger.middleware('RateLimiter', 'Request allowed', {
  featureName: 'Security',
  ip: req.ip
});
```

---

## Real-World Examples

### Example 1: API Service with Logging

```typescript
// services/productService.ts
import axios from 'axios';
import logger, { LogCategory } from '../utils/logger';

export const fetchProducts = async () => {
  const featureName = 'Products';
  const screenName = 'Marketplace';
  
  try {
    logger.apiRequest('GET', '/api/products', { featureName, screenName });
    
    const startTime = Date.now();
    const response = await axios.get('/api/products');
    const responseTime = Date.now() - startTime;
    
    logger.apiResponse('GET', '/api/products', response.status, {
      featureName,
      screenName,
      recordCount: response.data.length,
      responseTime
    });
    
    logger.performance('API Response Time', responseTime, 'ms', {
      featureName,
      endpoint: '/api/products'
    });
    
    return response.data;
  } catch (error) {
    logger.apiError('GET', '/api/products', error, { featureName, screenName });
    throw error;
  }
};
```

### Example 2: Component with Logging

```typescript
// components/ProductCard.tsx
import React, { useState } from 'react';
import logger, { LogCategory } from '../utils/logger';

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  
  const handleAddToCart = async () => {
    const featureName = 'Cart';
    const screenName = 'ProductCard';
    
    logger.userAction('Clicked Add to Cart', screenName, {
      featureName,
      productId: product.id,
      productName: product.name
    });
    
    setLoading(true);
    
    try {
      logger.apiRequest('POST', '/api/cart', { featureName, screenName });
      
      const response = await addToCart(product.id);
      
      logger.apiResponse('POST', '/api/cart', 200, {
        featureName,
        screenName,
        productId: product.id
      });
      
      logger.success(LogCategory.USER_ACTION, 'Product added to cart', {
        featureName,
        screenName,
        productId: product.id
      });
    } catch (error) {
      logger.error(LogCategory.API, 'Failed to add to cart', error, {
        featureName,
        screenName,
        productId: product.id
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

### Example 3: Backend Controller with Logging

```javascript
// controllers/product.controller.js
import logger, { LogCategory } from '../utils/logger.js';
import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  const featureName = 'Products';
  const endpoint = '/api/products';
  
  try {
    logger.apiRequest(req.method, endpoint, { featureName });
    
    logger.database('FIND', 'products', { featureName });
    const products = await Product.find();
    
    logger.success(LogCategory.DATABASE, 'Products fetched', {
      featureName,
      count: products.length
    });
    
    logger.apiResponse(req.method, endpoint, 200, {
      featureName,
      recordCount: products.length
    });
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to fetch products', error, {
      featureName,
      endpoint
    });
    
    logger.apiResponse(req.method, endpoint, 500, {
      featureName,
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};
```

---

## Log Categories

| Category | Usage |
|----------|-------|
| `API` | API requests/responses |
| `UI` | UI rendering, component updates |
| `AUTH` | Authentication, authorization |
| `NAVIGATION` | Route changes, navigation |
| `DATA` | Data fetching, caching |
| `PERFORMANCE` | Performance metrics |
| `USER_ACTION` | User interactions |
| `SYSTEM` | System events |
| `DATABASE` | Database operations (backend) |
| `EXTERNAL_API` | External API calls (backend) |
| `MIDDLEWARE` | Middleware execution (backend) |
| `VALIDATION` | Data validation (backend) |

---

## Log Levels

| Level | When to Use |
|-------|-------------|
| `DEBUG` | Development debugging (not shown in production) |
| `INFO` | General information |
| `SUCCESS` | Successful operations |
| `WARN` | Warning conditions |
| `ERROR` | Error conditions |

---

## Best Practices

### 1. Always Include Feature and Screen Names

```typescript
// ✅ Good
logger.info(LogCategory.API, 'Fetching data', {
  featureName: 'Products',
  screenName: 'Marketplace'
});

// ❌ Bad
logger.info(LogCategory.API, 'Fetching data');
```

### 2. Log User Actions

```typescript
logger.userAction('Clicked Submit', 'RegisterForm', {
  featureName: 'Auth',
  formData: { email: user.email } // Don't log passwords!
});
```

### 3. Log API Calls

```typescript
// Before API call
logger.apiRequest('POST', '/api/orders', { featureName: 'Orders' });

// After API call
logger.apiResponse('POST', '/api/orders', response.status, {
  featureName: 'Orders',
  orderId: response.data.id
});
```

### 4. Log Errors with Context

```typescript
try {
  await saveData();
} catch (error) {
  logger.error(LogCategory.DATA, 'Failed to save', error, {
    featureName: 'DataSync',
    screenName: 'Settings',
    dataType: 'userPreferences'
  });
}
```

### 5. Use Performance Logging

```typescript
const startTime = Date.now();
await heavyOperation();
const duration = Date.now() - startTime;

logger.performance('Heavy Operation', duration, 'ms', {
  featureName: 'DataProcessing'
});
```

---

## Utility Methods

### Export Logs

```typescript
// Get all logs
const logs = logger.getLogs();

// Get error logs only
const errors = logger.getLogsByLevel(LogLevel.ERROR);

// Get API logs only
const apiLogs = logger.getLogsByCategory(LogCategory.API);

// Export as JSON
const json = logger.exportLogs();

// Download logs file
logger.downloadLogs();
```

---

## Migration from console.log

### Before

```typescript
console.log('Fetching products');
console.error('Error:', error);
console.warn('Cache is stale');
```

### After

```typescript
logger.info(LogCategory.API, 'Fetching products', {
  featureName: 'Products',
  screenName: 'Marketplace'
});

logger.error(LogCategory.API, 'Failed to fetch', error, {
  featureName: 'Products',
  screenName: 'Marketplace'
});

logger.warn(LogCategory.DATA, 'Cache is stale', {
  featureName: 'Cache'
});
```

---

**Replace all console.log statements with structured logger calls for better debugging and monitoring!** 🎯
