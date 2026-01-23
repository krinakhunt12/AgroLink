
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import { QUERY_KEYS } from '../constants/query-keys';
import { useToast } from '../components/Toast';

export const useProducts = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // Fetch all products
    const { data: productsData, isLoading, isError, error } = useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.ALL(),
        queryFn: async () => {
            const res = await productsAPI.getAll();
            // Map _id to id if not present (backend consistency fix)
            return res.data.map((p: any) => ({ ...p, id: p._id || p.id }));
        },
        staleTime: 5 * 60 * 1000,
    });

    // Create Product Mutation
    const createProductMutation = useMutation({
        mutationFn: productsAPI.create,
        onSuccess: () => {
            showToast('પ્રોડક્ટ સફળતાપૂર્વક ઉમેરવામાં આવી!', 'success');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL() });
        },
        onError: (err: any) => {
            showToast(err.message || 'પ્રોડક્ટ ઉમેરવામાં નિષ્ફળ.', 'error');
        }
    });

    // Update Product Mutation
    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => productsAPI.update(id, data),
        onSuccess: () => {
            showToast('પ્રોડક્ટ અપડેટ થઈ.', 'success');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL() });
        },
        onError: (err: any) => {
            showToast(err.message || 'અપડેટ નિષ્ફળ.', 'error');
        }
    });

    // Delete Product Mutation
    const deleteProductMutation = useMutation({
        mutationFn: productsAPI.delete,
        onSuccess: () => {
            showToast('પ્રોડક્ટ ડિલીટ થઈ.', 'success');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL() });
        },
        onError: (err: any) => {
            showToast(err.message || 'ડિલીટ નિષ્ફળ.', 'error');
        }
    });

    return {
        products: productsData || [],
        isLoading: isLoading,
        isError,
        error,
        createProduct: createProductMutation.mutate,
        isCreating: createProductMutation.isPending,
        updateProduct: updateProductMutation.mutate,
        isUpdating: updateProductMutation.isPending,
        deleteProduct: deleteProductMutation.mutate,
        isDeleting: deleteProductMutation.isPending,
    };
};
