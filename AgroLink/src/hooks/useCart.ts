import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { useToast } from '../components/Toast';
import { ordersAPI } from '../services/api';
import AppLogger from '../utils/logger';

export interface CartItem extends Product {
    quantity: number;
}

export const useCart = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const { showToast } = useToast();

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('agro_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                AppLogger.error("Failed to parse cart from localStorage", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('agro_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((product: Product, quantity: number = 1) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                showToast("આ પ્રોડક્ટ પહેલેથી જ કાર્ટમાં છે.", 'info');
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            showToast("પ્રોડક્ટ કાર્ટમાં ઉમેરવામાં આવી છે!", 'success');
            return [...prevItems, { ...product, quantity }];
        });
    }, [showToast]);

    const removeFromCart = useCallback((productId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem('agro_cart');
    }, []);

    const checkout = useCallback(async (deliveryAddress: string) => {
        if (items.length === 0) return;

        try {
            // Create an order for each item in the cart
            const promises = items.map(item =>
                ordersAPI.create({
                    productId: item.id,
                    quantity: item.quantity,
                    deliveryAddress,
                    paymentMethod: 'cash'
                })
            );

            await Promise.all(promises);
            showToast("ઓર્ડર સફળતાપૂર્વક મૂકવામાં આવ્યો છે!", 'success');
            clearCart();
            return true;
        } catch (error) {
            AppLogger.error("Checkout failed", error);
            showToast("ચેકઆઉટમાં ભૂલ થઈ. ફરી પ્રયાસ કરો.", 'error');
            return false;
        }
    }, [items, clearCart, showToast]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        subtotal
    };
};
