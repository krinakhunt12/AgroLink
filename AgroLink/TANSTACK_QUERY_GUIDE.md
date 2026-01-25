# TanStack Query Implementation Guide

## 📋 Overview

This application now uses **TanStack Query (React Query)** for all API data fetching and mutations. This ensures:

✅ **Automatic data refresh** when data is created, updated, or deleted  
✅ **No manual refetch calls** needed in components  
✅ **No page reloads** to refresh data  
✅ **Optimized caching** and background refetching  
✅ **Clean, maintainable code** with separation of concerns

---

## 🏗️ Architecture

### Directory Structure

```
src/
├── lib/
│   ├── queryClient.ts      # Global QueryClient configuration
│   └── queryKeys.ts         # Centralized query keys
├── hooks/
│   ├── api/                 # TanStack Query hooks
│   │   ├── index.ts         # Barrel export
│   │   ├── useProductsQuery.ts
│   │   ├── useBidsQuery.ts
│   │   ├── useOrdersQuery.ts
│   │   ├── useUsersQuery.ts
│   │   ├── useCategoriesQuery.ts
│   │   └── useAuthQuery.ts
│   ├── useMarketplace.ts    # Updated to use TanStack Query
│   ├── useFarmerDashboard.ts # Updated to use TanStack Query
│   └── useCart.ts           # Updated to use TanStack Query
└── main.tsx                 # QueryClientProvider setup
```

---

## 🔑 Core Concepts

### 1. Query Keys

All query keys are centralized in `src/lib/queryKeys.ts`:

```typescript
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: Record<string, any>) => 
      [...queryKeys.products.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
  },
  // ... more keys
};
```

**Benefits:**
- Type-safe
- Predictable
- Easy to invalidate related queries
- No typos or inconsistencies

### 2. Global Configuration

Configured in `src/lib/queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,         // 10 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});
```

---

## 📖 Usage Examples

### Reading Data (Queries)

```typescript
import { useProducts } from '@/hooks/api';

function ProductList() {
  const { data: products = [], isLoading, error } = useProducts();
  
  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;
  
  return <div>{products.map(p => <ProductCard key={p.id} {...p} />)}</div>;
}
```

### Writing Data (Mutations)

```typescript
import { useCreateProduct } from '@/hooks/api';

function AddProduct() {
  const createProduct = useCreateProduct();
  
  const handleSubmit = async (formData: FormData) => {
    try {
      await createProduct.mutateAsync(formData);
      // ✅ All product queries automatically refetch!
      // ✅ Success toast shown automatically
      // ✅ No manual refetch needed
    } catch (error) {
      // ✅ Error toast shown automatically
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

---

## 🔄 Automatic Invalidation

When you perform a mutation, related queries are **automatically invalidated** and refetched:

### Product Mutations

```typescript
// ✅ Creating a product invalidates:
queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

// ✅ Updating a product invalidates:
queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

// ✅ Deleting a product invalidates:
queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
```

### Order Mutations

```typescript
// ✅ Creating an order invalidates:
queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
queryClient.invalidateQueries({ queryKey: queryKeys.products.all }); // Stock might change
```

### Bid Mutations

```typescript
// ✅ Creating a bid invalidates:
queryClient.invalidateQueries({ queryKey: queryKeys.bids.all });
queryClient.invalidateQueries({ queryKey: queryKeys.bids.productBids(productId) });

// ✅ Updating bid status invalidates:
queryClient.invalidateQueries({ queryKey: queryKeys.bids.all });
queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }); // Accepted bids create orders
```

---

## 📝 Migration Examples

### Before (Manual Refetch)

```typescript
// ❌ OLD WAY - Manual refetch
const submitCrop = async () => {
  try {
    await productsAPI.create(data);
    showToast("Success!", 'success');
    fetchDashboardData(); // ❌ Manual refetch
  } catch (error) {
    showToast("Error!", 'error');
  }
};
```

### After (Automatic Invalidation)

```typescript
// ✅ NEW WAY - Automatic refetch
const createProduct = useCreateProduct();

const submitCrop = async () => {
  try {
    await createProduct.mutateAsync(data);
    // ✅ Toast shown automatically by mutation
    // ✅ Data refetched automatically
  } catch (error) {
    // ✅ Error toast shown automatically
  }
};
```

---

## 🎯 Best Practices

### 1. Always Use Hooks from `hooks/api`

```typescript
// ✅ Good
import { useProducts, useCreateProduct } from '@/hooks/api';

// ❌ Bad - Don't call API directly
import { productsAPI } from '@/services/api';
```

### 2. Handle Loading States

```typescript
const { data, isLoading, error } = useProducts();

if (isLoading) return <Loader />;
if (error) return <Error />;
return <ProductList products={data} />;
```

### 3. Use Mutation States

```typescript
const createProduct = useCreateProduct();

<button disabled={createProduct.isPending}>
  {createProduct.isPending ? 'Creating...' : 'Create'}
</button>
```

### 4. Leverage Optimistic Updates (Advanced)

For instant UI updates before server confirmation:

```typescript
const updateProduct = useMutation({
  mutationFn: productsAPI.update,
  onMutate: async (newProduct) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.products.all });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(queryKeys.products.all);
    
    // Optimistically update
    queryClient.setQueryData(queryKeys.products.all, (old) => [...old, newProduct]);
    
    return { previous };
  },
  onError: (err, newProduct, context) => {
    // Rollback on error
    queryClient.setQueryData(queryKeys.products.all, context.previous);
  },
});
```

---

## 🐛 Debugging

### React Query Devtools

The devtools are automatically included in development mode:

```typescript
// In main.tsx
<ReactQueryDevtools initialIsOpen={false} />
```

**Features:**
- View all queries and their states
- See cache data
- Manually trigger refetches
- Monitor mutations
- Inspect query keys

**Access:** Look for the React Query icon in the bottom-left corner of your app.

---

## 📊 Query States

| State | Description |
|-------|-------------|
| `isLoading` | Initial fetch in progress |
| `isFetching` | Any fetch in progress (including background) |
| `isError` | Query encountered an error |
| `isSuccess` | Query completed successfully |
| `data` | The actual data returned |
| `error` | Error object if query failed |

---

## 🔒 Rules to Follow

### ✅ DO

- Use `useQuery` for all read operations
- Use `useMutation` for all write operations
- Let TanStack Query handle refetching via invalidation
- Keep query keys consistent and centralized
- Show loading/error states in UI
- Disable actions during mutations

### ❌ DON'T

- Call API functions directly in components
- Manually refetch data after mutations
- Reload the page to refresh data
- Create ad-hoc query keys
- Forget to handle loading/error states
- Allow actions while mutations are pending

---

## 🚀 Performance Benefits

1. **Automatic Caching**: Data is cached for 5 minutes (configurable)
2. **Background Refetching**: Stale data is refetched in the background
3. **Deduplication**: Multiple components requesting same data = single request
4. **Window Focus Refetching**: Data refreshes when user returns to tab
5. **Retry Logic**: Failed requests are retried once automatically
6. **Garbage Collection**: Unused cache is cleaned after 10 minutes

---

## 📚 Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Mutations Guide](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [Invalidation Guide](https://tanstack.com/query/latest/docs/react/guides/query-invalidation)

---

## 🎉 Summary

With TanStack Query implemented:

✅ All APIs automatically refresh on data changes  
✅ No manual refetch calls anywhere  
✅ No page reloads needed  
✅ Clean, maintainable, scalable code  
✅ Excellent developer experience  
✅ Optimized performance  

**The data flow is now fully reactive and automatic!** 🚀
