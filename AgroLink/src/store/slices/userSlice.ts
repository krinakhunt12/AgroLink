import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Profile {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'blocked';
    role: 'farmer' | 'buyer';
    registeredAt: string;
}

interface UserState {
    farmers: Profile[];
    buyers: Profile[];
    loading: boolean;
    error: string | null;
    filters: {
        search: string;
        status: 'all' | 'active' | 'blocked';
    };
}

const initialState: UserState = {
    farmers: [
        { id: '1', name: 'Ramesh Kumar', email: 'ramesh@agri.com', status: 'active', role: 'farmer', registeredAt: '2025-10-12' },
        { id: '2', name: 'Suresh Patil', email: 'suresh@agri.com', status: 'blocked', role: 'farmer', registeredAt: '2025-11-01' },
    ],
    buyers: [
        { id: '101', name: 'AgroCorp India', email: 'procure@agrocorp.com', status: 'active', role: 'buyer', registeredAt: '2025-09-20' },
    ],
    loading: false,
    error: null,
    filters: {
        search: '',
        status: 'all',
    },
};

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (type: 'farmer' | 'buyer', { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            return [];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<UserState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        toggleUserStatus: (state, action: PayloadAction<{ id: string; type: 'farmer' | 'buyer' }>) => {
            const list = action.payload.type === 'farmer' ? state.farmers : state.buyers;
            const user = list.find(u => u.id === action.payload.id);
            if (user) {
                user.status = user.status === 'active' ? 'blocked' : 'active';
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, toggleUserStatus } = userSlice.actions;
export default userSlice.reducer;
