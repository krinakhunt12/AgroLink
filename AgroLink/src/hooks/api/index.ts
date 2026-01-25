/**
 * Centralized API Hooks Export
 * 
 * Import all your API hooks from here for consistency
 * Example: import { useProducts, useCreateProduct } from '@/hooks/api';
 */

// Products
export {
    useProducts,
    useProduct,
    useProductsByFarmer,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
} from './useProductsQuery';

// Bids
export {
    useMyBids,
    useProductBids,
    useCreateBid,
    useUpdateBidStatus,
} from './useBidsQuery';

// Orders
export {
    useOrders,
    useOrder,
    useCreateOrder,
    useUpdateOrderStatus,
} from './useOrdersQuery';

// Users
export {
    useUserProfile,
    useUpdateProfile,
} from './useUsersQuery';

// Categories
export {
    useCategories,
} from './useCategoriesQuery';

// Auth
export {
    useMe,
    useRegister,
    useLogin,
    useLogout,
} from './useAuthQuery';
