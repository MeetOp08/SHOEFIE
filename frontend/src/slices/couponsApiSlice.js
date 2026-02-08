import { apiSlice } from './apiSlice';

const COUPONS_URL = '/api/coupons';

export const couponsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => ({
                url: COUPONS_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        createCoupon: builder.mutation({
            query: (data) => ({
                url: COUPONS_URL,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Coupon'],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `${COUPONS_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coupon'],
        }),
        validateCoupon: builder.mutation({
            query: (data) => ({
                url: `${COUPONS_URL}/validate`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useCreateCouponMutation,
    useDeleteCouponMutation,
    useValidateCouponMutation,
} = couponsApiSlice;
