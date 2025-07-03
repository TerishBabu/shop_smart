import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductState } from '../../types';
import { productService } from '../../services/api';

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
    page: 0,
    hasMore: true,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ page, refresh = false }: { page: number; refresh?: boolean }) => {
        const products = await productService.getProducts(10, page * 10);
        return { products, page, refresh };
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                const { products, page, refresh } = action.payload;

                if (refresh) {
                    state.products = products;
                    state.page = 0;
                } else {
                    state.products = [...state.products, ...products];
                    state.page = page;
                }

                state.hasMore = products.length === 10;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            });
    },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;