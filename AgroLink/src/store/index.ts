import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import aiReducer from './slices/aiSlice';
import systemReducer from './slices/systemSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        marketplace: marketplaceReducer,
        ai: aiReducer,
        system: systemReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: import.meta.env.MODE !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
