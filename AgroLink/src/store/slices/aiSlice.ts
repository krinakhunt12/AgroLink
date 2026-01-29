import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Prediction {
    crop: string;
    predictedPrice: number;
    confidence: number;
}

interface AIState {
    predictions: Prediction[];
    anomalies: any[];
    modelHealth: {
        accuracy: number;
        drift: 'low' | 'high' | 'minimal';
    };
    loading: boolean;
    error: string | null;
}

const initialState: AIState = {
    predictions: [],
    anomalies: [],
    modelHealth: {
        accuracy: 94.2,
        drift: 'low',
    },
    loading: false,
    error: null,
};

export const fetchAiAnalytics = createAsyncThunk(
    'ai/fetchAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1200));
            return { predictions: [], anomalies: [] };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        updateModelHealth: (state, action: PayloadAction<Partial<AIState['modelHealth']>>) => {
            state.modelHealth = { ...state.modelHealth, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAiAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAiAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.predictions = action.payload.predictions;
                state.anomalies = action.payload.anomalies;
            });
    },
});

export const { updateModelHealth } = aiSlice.actions;
export default aiSlice.reducer;
