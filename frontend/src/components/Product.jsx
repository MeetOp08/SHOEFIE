import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text }) => {
    return (
        <div className='flex items-center mb-2'>
            {[1, 2, 3, 4, 5].map((index) => (
                <span key={index} className='text-yellow-500'>
                    {value >= index ? (
                        <FaStar />
                    ) : value >= index - 0.5 ? (
                        <FaStarHalfAlt />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
            ))}
            <span className='ml-2 text-gray-600 text-sm'>{text && text}</span>
        </div>
    );
};

const ProductCard = ({ product }) => {
    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300'>
            <Link to={`/product/${product._id}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-48 object-cover object-center'
                />
            </Link>
            <div className='p-4'>
                <Link to={`/product/${product._id}`}>
                    <h2 className='text-lg font-semibold text-gray-800 mb-2 truncate'>
                        {product.name}
                    </h2>
                </Link>
                <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                />
                <h3 className='text-xl font-bold text-gray-900 mt-2'>${product.price}</h3>
            </div>
        </div>
    );
};

export default ProductCard;
