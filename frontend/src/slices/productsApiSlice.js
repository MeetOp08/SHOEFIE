import { PRODUCTS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ keyword, pageNumber, category, brand, gender }) => ({
                url: PRODUCTS_URL,
                params: { keyword, pageNumber, category, brand, gender },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Product'],
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: PRODUCTS_URL,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: UPLOAD_URL,
                method: 'POST',
                body: data,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        getTopProducts: builder.query({
            query: () => `${PRODUCTS_URL}/top`,
            keepUnusedDataFor: 5,
        }),
        getReviews: builder.query({
            query: () => `${PRODUCTS_URL}/reviews`,
            keepUnusedDataFor: 5,
            providesTags: ['Review'],
        }),
        deleteReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/reviews/${data.productId}/${data.reviewId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Review', 'Product'],
        }),
        createBrand: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/brands`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Brands'],
        }),
        deleteBrand: builder.mutation({
            query: (id) => ({
                url: `${PRODUCTS_URL}/brands/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Brands'],
        }),
        getBrands: builder.query({
            query: () => `${PRODUCTS_URL}/brands`,
            keepUnusedDataFor: 5,
            providesTags: ['Brands'],
        }),
        getCategories: builder.query({
            query: () => `${PRODUCTS_URL}/categories`,
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useGetBrandsQuery,
    useGetCategoriesQuery,
    useGetReviewsQuery,
    useDeleteReviewMutation,
    useCreateBrandMutation,
    useDeleteBrandMutation,
} = productsApiSlice;
