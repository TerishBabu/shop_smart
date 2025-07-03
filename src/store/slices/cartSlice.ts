import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, Product } from '../../types';

const initialState: CartState = {
    items: [],
    wishlist: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        toggleWishlist: (state, action: PayloadAction<number>) => {
            const index = state.wishlist.indexOf(action.payload);
            if (index > -1) {
                state.wishlist.splice(index, 1);
            } else {
                state.wishlist.push(action.payload);
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, toggleWishlist, clearCart } = cartSlice.actions;
export default cartSlice.reducer;