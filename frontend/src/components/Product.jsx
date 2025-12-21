import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Rating from './Rating';

const Product = ({ product }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="card overflow-hidden group h-full flex flex-col"
        >
            <Link to={`/product/${product._id}`} className="relative block overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-white">
                    ${product.price}
                </div>
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`} className="hover:text-accent transition-colors">
                    <h3 className="text-lg font-bold mb-1 line-clamp-1" title={product.name}>
                        {product.name}
                    </h3>
                </Link>

                <div className="mb-2">
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </div>

                <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-xl font-bold text-white">${product.price}</span>
                    <Link to={`/product/${product._id}`} className="text-accent text-sm font-semibold hover:underline">
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default Product;
