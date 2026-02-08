import { ORDERS_URL, PAYPAL_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: order,
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: details,
            }),
        }),
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/myorders`,
            }),
            keepUnusedDataFor: 5,
        }),
        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status, ...data }) => ({
                url: `${ORDERS_URL}/${orderId}/${status}`,
                method: 'PUT',
                body: data,
            }),
        }),
        getRazorpayKey: builder.query({
            query: () => ({
                url: '/api/config/razorpay',
            }),
            keepUnusedDataFor: 5,
        }),
        getOrderAnalytics: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/analytics`,
            }),
            keepUnusedDataFor: 5,
        }),
        verifyPayment: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay/verify`,
                method: 'POST',
                body: details,
            }),
        }),
        createCheckoutSession: builder.mutation({
            query: (orderId) => ({
                url: '/api/payment/create-checkout-session',
                method: 'POST',
                body: { orderId },
            }),
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
    useGetRazorpayKeyQuery,
    useUpdateOrderStatusMutation,
    useGetOrderAnalyticsQuery,
    useVerifyPaymentMutation,
    useCreateCheckoutSessionMutation,
} = ordersApiSlice;
