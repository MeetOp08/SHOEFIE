import { apiSlice } from './apiSlice';

export const inventoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getInventory: builder.query({
            query: () => ({
                url: '/api/inventory',
            }),
            keepUnusedDataFor: 5,
        }),
        getLowStockProducts: builder.query({
            query: () => ({
                url: '/api/inventory/low-stock',
            }),
            keepUnusedDataFor: 5,
        }),
        restockProduct: builder.mutation({
            query: ({ productId, amount }) => ({
                url: `/api/inventory/restock/${productId}`,
                method: 'PUT',
                body: { amount },
            }),
        }),
        updateThreshold: builder.mutation({
            query: ({ productId, threshold }) => ({
                url: `/api/inventory/threshold/${productId}`,
                method: 'PUT',
                body: { threshold },
            }),
        }),
    }),
});

export const {
    useGetInventoryQuery,
    useGetLowStockProductsQuery,
    useRestockProductMutation,
    useUpdateThresholdMutation,
} = inventoryApiSlice;
