import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : null;

const initialState =
    cartFromStorage && cartFromStorage.cartItems
        ? cartFromStorage
        : { cartItems: [], shippingAddress: {}, paymentMethod: 'Razorpay' };

const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find(
                (x) => x._id === item._id && x.size === item.size && x.color === item.color
            );

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id && x.size === existItem.size && x.color === existItem.color
                        ? item
                        : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            // Calculate prices
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            );
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
            state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action) => {
            const { id, size, color } = action.payload; // Payload should now be object or we need to change how we call it
            // Backwards compatibility if payload is just ID (legacy)
            if (typeof action.payload === 'string') {
                state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            } else {
                state.cartItems = state.cartItems.filter(
                    (x) => !(x._id === id && x.size === size && x.color === color)
                );
            }

            // Recalculate prices (Copy-paste logic - ideally extract to helper)
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            );
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
            state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        savePaymentProvider: (state, action) => {
            state.paymentProvider = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearCartItems: (state, action) => {
            state.cartItems = [];
            localStorage.setItem('cart', JSON.stringify(state));
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    savePaymentProvider,
    clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
