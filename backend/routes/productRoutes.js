const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    createProductReview,
    getTopProducts,
    getBrands,
    getCategories,
    getReviews,
    deleteReview,
    createBrand,
    deleteBrand
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getProducts).post(protect, admin, upload.array('images'), createProduct);
router.route('/reviews').get(protect, admin, getReviews);
router.route('/reviews/:productId/:reviewId').delete(protect, admin, deleteReview);
router.route('/top').get(getTopProducts);
router.route('/brands').get(getBrands).post(protect, admin, createBrand);
router.route('/brands/:id').delete(protect, admin, deleteBrand);
router.route('/categories').get(getCategories);
router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
