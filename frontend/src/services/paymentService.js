import axios from 'axios';

const API_URL = '/api/payment';

// Create Stripe Checkout Session
const createCheckoutSession = async (orderId) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // Auth header is usually handled by axios interceptor or cookie
        },
    };

    const response = await axios.post(`${API_URL}/create-checkout-session`, { orderId }, config);

    return response.data;
};

// Function to handle webhook manually (if needed from frontend, though usually backend-to-backend)
// Keeping it simple as per requirement for "service"
const paymentService = {
    createCheckoutSession,
};

export default paymentService;
