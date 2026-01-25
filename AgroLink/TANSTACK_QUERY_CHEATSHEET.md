# TanStack Query Quick Reference

## 🎯 Common Patterns

### Fetching Data

```typescript
// Single product
const { data: product, isLoading } = useProduct(productId);

// All products
const { data: products = [] } = useProducts();

// Products with filters
const { data: products = [] } = useProducts({ category: 'અનાજ' });

// Farmer's products
const { data: products = [] } = useProductsByFarmer(farmerId);
```

### Creating Data

```typescript
const createProduct = useCreateProduct();

// In handler
await createProduct.mutateAsync(formData);

// Check status
createProduct.isPending  // true while creating
createProduct.isSuccess  // true after success
createProduct.isError    // true if error
```

### Updating Data

```typescript
const updateProduct = useUpdateProduct();

await updateProduct.mutateAsync({ id: productId, data: formData });
```

### Deleting Data

```typescript
const deleteProduct = useDeleteProduct();

await deleteProduct.mutateAsync(productId);
```

## 🔄 All Available Hooks

### Products
- `useProducts(filters?)` - Get all products
- `useProduct(id)` - Get single product
- `useProductsByFarmer(farmerId)` - Get farmer's products
- `useCreateProduct()` - Create product
- `useUpdateProduct()` - Update product
- `useDeleteProduct()` - Delete product

### Bids
- `useMyBids()` - Get user's bids
- `useProductBids(productId)` - Get product's bids
- `useCreateBid()` - Create bid
- `useUpdateBidStatus()` - Update bid status

### Orders
- `useOrders()` - Get all orders
- `useOrder(id)` - Get single order
- `useCreateOrder()` - Create order
- `useUpdateOrderStatus()` - Update order status

### Users
- `useUserProfile(userId)` - Get user profile
- `useUpdateProfile()` - Update profile

### Categories
- `useCategories()` - Get all categories

### Auth
- `useMe()` - Get current user
- `useRegister()` - Register user
- `useLogin()` - Login user
- `useLogout()` - Logout user

## 💡 Quick Tips

1. **Import from one place:**
   ```typescript
   import { useProducts, useCreateProduct } from '@/hooks/api';
   ```

2. **Always handle loading:**
   ```typescript
   if (isLoading) return <Loader />;
   ```

3. **Disable during mutations:**
   ```typescript
   <button disabled={mutation.isPending}>Submit</button>
   ```

4. **No manual refetch needed:**
   ```typescript
   // ❌ Don't do this
   await createProduct.mutateAsync(data);
   refetch(); // Not needed!
   
   // ✅ Do this
   await createProduct.mutateAsync(data);
   // Data automatically refreshes!
   ```

## 🎨 UI Patterns

### Loading State
```typescript
{isLoading && <Loader />}
{!isLoading && <Content data={data} />}
```

### Error State
```typescript
{error && <ErrorMessage message={error.message} />}
```

### Empty State
```typescript
{!isLoading && data.length === 0 && <EmptyState />}
```

### Mutation Button
```typescript
<button 
  onClick={handleSubmit}
  disabled={mutation.isPending}
>
  {mutation.isPending ? 'Saving...' : 'Save'}
</button>
```

## 🚫 Common Mistakes

### ❌ Don't call API directly
```typescript
// Bad
import { productsAPI } from '@/services/api';
const data = await productsAPI.getAll();
```

### ✅ Use hooks instead
```typescript
// Good
import { useProducts } from '@/hooks/api';
const { data } = useProducts();
```

### ❌ Don't manually refetch
```typescript
// Bad
await createProduct.mutateAsync(data);
fetchProducts(); // Not needed!
```

### ✅ Trust automatic invalidation
```typescript
// Good
await createProduct.mutateAsync(data);
// TanStack Query handles the rest!
```

## 🎯 Remember

- **Queries** = Read data (GET)
- **Mutations** = Write data (POST/PUT/DELETE)
- **Invalidation** = Automatic refresh
- **No manual refetch** = Ever!

---

**Everything is automatic. Just use the hooks!** 🚀
