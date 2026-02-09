import axios from 'axios';

const API_URL = '/api/products';

// Create new product (Admin)
const createProduct = async (productData) => {
    const userInfo = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null;

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    const response = await axios.post(API_URL, productData, config);
    return response.data;
};

const productService = {
    createProduct,
};

export default productService;
