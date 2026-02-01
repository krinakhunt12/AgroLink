// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Auth API
export const authAPI = {
    // Register new user
    register: async (userData: {
        name: string;
        phone: string;
        email?: string;
        password: string;
        userType: 'farmer' | 'buyer';
        location: string;
        language?: string;
    }) => {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        // Save token to localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Login user
    login: async (credentials: { phone: string; password: string }) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // Save token to localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Admin Login
    adminLogin: async (credentials: { email: string; password: string }) => {
        const data = await apiRequest('/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // Save token to localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Google Login
    googleLogin: async (data: { token: string; userType?: 'farmer' | 'buyer' }) => {
        const response = await apiRequest('/auth/google', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        // Save token to localStorage
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    // Get current user
    getMe: async () => {
        return await apiRequest('/auth/me');
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Refresh user data from server
    refreshUser: async () => {
        try {
            const data = await apiRequest('/auth/me');
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                return data.user;
            }
            return null;
        } catch (error) {
            console.error('Failed to refresh user:', error);
            return null;
        }
    },

    // Forgot password
    forgotPassword: async (email: string) => {
        return await apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    // Reset password
    resetPassword: async (resetToken: string, email: string, password: string) => {
        return await apiRequest(`/auth/reset-password/${resetToken}?email=${email}`, {
            method: 'PUT',
            body: JSON.stringify({ password }),
        });
    },
};

// Products API
export const productsAPI = {
    // Get all products with optional filters
    getAll: async (filters?: {
        category?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        isNegotiable?: boolean;
    }) => {
        const queryParams = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, String(value));
                }
            });
        }

        const endpoint = `/products${queryParams.toString() ? `?${queryParams}` : ''}`;
        return await apiRequest(endpoint);
    },

    // Get single product
    getById: async (id: string) => {
        return await apiRequest(`/products/${id}`);
    },

    // Create product (farmer only)
    create: async (productData: FormData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: productData, // FormData for file upload
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create product');
        }
        return data;
    },

    // Update product (farmer only)
    update: async (id: string, productData: FormData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: productData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update product');
        }
        return data;
    },

    // Delete product (farmer only)
    delete: async (id: string) => {
        return await apiRequest(`/products/${id}`, { method: 'DELETE' });
    },

    // Get farmer's products
    getByFarmer: async (farmerId: string) => {
        return await apiRequest(`/products/farmer/${farmerId}`);
    },
};

// Bids API
export const bidsAPI = {
    // Create a bid (buyer only)
    create: async (bidData: {
        productId: string;
        amount: number;
        quantity: number;
        message?: string;
    }) => {
        return await apiRequest('/bids', {
            method: 'POST',
            body: JSON.stringify(bidData),
        });
    },

    // Get my bids (buyer only)
    getMyBids: async () => {
        return await apiRequest('/bids/my-bids');
    },

    // Get bids for a product (farmer only)
    getProductBids: async (productId: string) => {
        return await apiRequest(`/bids/product/${productId}`);
    },

    // Update bid status (farmer only)
    updateStatus: async (bidId: string, status: 'accepted' | 'rejected') => {
        return await apiRequest(`/bids/${bidId}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

// Orders API
export const ordersAPI = {
    // Create order (buyer only)
    create: async (orderData: {
        productId: string;
        quantity: number;
        deliveryAddress: string;
        paymentMethod: 'cash' | 'upi' | 'bank_transfer';
        notes?: string;
    }) => {
        return await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    // Get all orders (role-based)
    getAll: async () => {
        return await apiRequest('/orders');
    },

    // Get single order
    getById: async (id: string) => {
        return await apiRequest(`/orders/${id}`);
    },

    // Update order status (farmer only)
    updateStatus: async (id: string, status: string) => {
        return await apiRequest(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

// Users API
export const usersAPI = {
    // Get user profile
    getProfile: async (userId: string) => {
        return await apiRequest(`/users/${userId}`);
    },

    // Update profile
    updateProfile: async (profileData: FormData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: profileData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update profile');
        }

        // Update user in localStorage
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Submit verification documents (farmer only)
    submitVerification: async (verificationData: FormData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: verificationData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit verification');
        }

        // Update user in localStorage with new verification status
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Delete account
    deleteAccount: async () => {
        return await apiRequest('/users/me', { method: 'DELETE' });
    },
};

// Categories API
export const categoriesAPI = {
    getAll: async () => {
        return await apiRequest('/categories');
    },
};

// YouTube API
export const youtubeAPI = {
    getVideos: async (query?: string) => {
        const endpoint = `/youtube/videos${query ? `?q=${encodeURIComponent(query)}` : ''}`;
        return await apiRequest(endpoint);
    },
    // New RSS-based agriculture videos (No API Key required)
    getAgricultureVideos: async () => {
        return await apiRequest('/agriculture-videos/latest');
    },
};

// News API
export const newsAPI = {
    getLatestAgricultureNews: async () => {
        return await apiRequest('/agriculture-news/latest');
    },
};

// Schemes API
export const schemesAPI = {
    getLatestAgricultureSchemes: async () => {
        return await apiRequest('/agriculture-schemes/latest');
    },
};

// Intelligence & Blockchain API
export const intelligenceAPI = {
    // Get crop price prediction
    predictPrice: async (data: any) => {
        return await apiRequest('/intelligence/predict-price', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Analyze Demand-Supply gap
    analyzeGap: async (data: any) => {
        return await apiRequest('/intelligence/analyze-gap', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Evaluate Buyer Trust
    evaluateBuyer: async (buyerId: string, history: any) => {
        return await apiRequest(`/intelligence/buyer-trust/${buyerId}`, {
            method: 'POST',
            body: JSON.stringify(history),
        });
    },

    // Get Farmer Profit analytics
    getProfitDashboard: async (transactions: any[]) => {
        return await apiRequest('/intelligence/profit-dashboard', {
            method: 'POST',
            body: JSON.stringify(transactions),
        });
    },

    // Check MSP and Policy awareness
    getPolicyAwareness: async (params: any) => {
        const queryParams = new URLSearchParams(params).toString();
        return await apiRequest(`/intelligence/policy-awareness?${queryParams}`);
    },

    // Blockchain: Seal a trade
    sealTrade: async (tradeData: any) => {
        return await apiRequest('/intelligence/blockchain/seal', {
            method: 'POST',
            body: JSON.stringify(tradeData),
        });
    },

    // Blockchain: Verify ledger
    verifyBlockchain: async () => {
        return await apiRequest('/intelligence/blockchain/verify');
    },

    // Smart Contracts: Initiate Escrow
    startContract: async (contractData: any) => {
        return await apiRequest('/intelligence/contracts/start-escrow', {
            method: 'POST',
            body: JSON.stringify(contractData),
        });
    },

    // Smart Contracts: Dispatch order
    dispatchTrade: async (contractId: string) => {
        return await apiRequest(`/intelligence/contracts/dispatch/${contractId}`, {
            method: 'POST',
        });
    },

    // Smart Contracts: Confirm delivery
    confirmDelivery: async (contractId: string) => {
        return await apiRequest(`/intelligence/contracts/confirm-delivery/${contractId}`, {
            method: 'POST',
        });
    },

    // Smart Contracts: Get status
    getContractStatus: async (contractId: string) => {
        return await apiRequest(`/intelligence/contracts/get/${contractId}`);
    },

    // AI Anomaly Detection: Audit a transaction
    auditTransaction: async (auditData: { transaction_data: any; user_data: any }) => {
        return await apiRequest('/intelligence/audit', {
            method: 'POST',
            body: JSON.stringify(auditData),
        });
    }
};

export default {
    auth: authAPI,
    products: productsAPI,
    bids: bidsAPI,
    orders: ordersAPI,
    users: usersAPI,
    categories: categoriesAPI,
    youtube: youtubeAPI,
    news: newsAPI,
    schemes: schemesAPI,
    intelligence: intelligenceAPI,
};
