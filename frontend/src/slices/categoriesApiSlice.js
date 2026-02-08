import { apiSlice } from './apiSlice';

const CATEGORIES_URL = '/api/categories';

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: CATEGORIES_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: CATEGORIES_URL,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `${CATEGORIES_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: (data) => ({
                url: `${CATEGORIES_URL}/${data.id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
} = categoriesApiSlice;
