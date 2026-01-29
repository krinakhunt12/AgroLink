import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SystemState {
    health: {
        api: 'healthy' | 'warning' | 'down';
        database: 'healthy' | 'warning' | 'down';
        mlServices: 'healthy' | 'warning' | 'down';
    };
    logs: {
        id: string;
        timestamp: string;
        service: string;
        message: string;
        type: 'info' | 'error' | 'warning';
    }[];
    metrics: {
        cpuUsage: number;
        memoryUsage: number;
        responseTime: number;
    };
}

const initialState: SystemState = {
    health: {
        api: 'healthy',
        database: 'healthy',
        mlServices: 'healthy',
    },
    logs: [],
    metrics: {
        cpuUsage: 42,
        memoryUsage: 64,
        responseTime: 124,
    },
};

const systemSlice = createSlice({
    name: 'system',
    initialState,
    reducers: {
        setHealthStatus: (state, action: PayloadAction<Partial<SystemState['health']>>) => {
            state.health = { ...state.health, ...action.payload };
        },
        addLog: (state, action: PayloadAction<SystemState['logs'][0]>) => {
            state.logs.unshift(action.payload);
            if (state.logs.length > 100) state.logs.pop();
        },
        updateMetrics: (state, action: PayloadAction<Partial<SystemState['metrics']>>) => {
            state.metrics = { ...state.metrics, ...action.payload };
        },
    },
});

export const { setHealthStatus, addLog, updateMetrics } = systemSlice.actions;
export default systemSlice.reducer;
