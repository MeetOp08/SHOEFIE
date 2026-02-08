import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const Product = ({ product }) => {
    const dispatch = useDispatch();

    const addToCartHandler = (e) => {
        e.preventDefault(); // Prevent navigating to product page
        dispatch(addToCart({ ...product, qty: 1 }));
        toast.success('Added to bag');
    };

    return (
        <div className="card group h-full flex flex-col relative">
            {/* Discount Badge */}
            {product.discount > 0 && (
                <span className="absolute top-3 left-3 z-10 bg-accent text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    -{product.discount}%
                </span>
            )}

            {/* Image Container */}
            <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-secondary rounded-t-xl aspect-[4/5]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />

                {/* Quick Add Button (Visible on Hover) */}
                <button
                    onClick={addToCartHandler}
                    className="absolute bottom-4 right-4 bg-white text-text-main p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-white"
                    title="Quick Add"
                >
                    <FaPlus />
                </button>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">
                        {typeof product.brand === 'object' ? product.brand.name : product.brand}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                        <FaStar />
                        <span className="text-text-muted">({product.numReviews})</span>
                    </div>
                </div>

                <Link to={`/product/${product._id}`} className="mb-2">
                    <h3 className="text-lg font-display font-semibold text-text-main leading-tight group-hover:text-accent transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-sm text-text-muted line-clamp-2 mb-4 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-baseline gap-2 mt-auto">
                    {product.discountPrice && product.discountPrice > 0 ? (
                        <>
                            <span className="text-xl font-bold text-text-main">₹{product.discountPrice.toLocaleString()}</span>
                            <span className="text-sm text-text-muted line-through">₹{product.price.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="text-xl font-bold text-text-main">₹{product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Product;
