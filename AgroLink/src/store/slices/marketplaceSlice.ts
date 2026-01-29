import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Listing {
    id: string;
    cropName: string;
    farmerName: string;
    price: number;
    quantity: string;
    status: 'available' | 'sold' | 'reported';
}

interface MarketplaceState {
    listings: Listing[];
    selectedListing: Listing | null;
    loading: boolean;
    error: string | null;
}

const initialState: MarketplaceState = {
    listings: [
        { id: 'L1', cropName: 'Wheat', farmerName: 'Ramesh Kumar', price: 2450, quantity: '500kg', status: 'available' },
        { id: 'L2', cropName: 'Rice', farmerName: 'Suresh Patil', price: 4800, quantity: '200kg', status: 'available' },
    ],
    selectedListing: null,
    loading: false,
    error: null,
};

export const fetchListings = createAsyncThunk(
    'marketplace/fetchListings',
    async (_, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return []; // Mock
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const marketplaceSlice = createSlice({
    name: 'marketplace',
    initialState,
    reducers: {
        setSelectedListing: (state, action: PayloadAction<Listing | null>) => {
            state.selectedListing = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchListings.fulfilled, (state, action) => {
                state.loading = false;
                state.listings = action.payload;
            });
    },
});

export const { setSelectedListing } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;
