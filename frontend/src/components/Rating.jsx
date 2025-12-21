import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#D4AF37' }) => {
    return (
        <div className='flex items-center space-x-1 mb-2'>
            <div className="flex text-accent">
                {[1, 2, 3, 4, 5].map((index) => (
                    <span key={index} style={{ color }}>
                        {value >= index ? (
                            <FaStar />
                        ) : value >= index - 0.5 ? (
                            <FaStarHalfAlt />
                        ) : (
                            <FaRegStar />
                        )}
                    </span>
                ))}
            </div>
            {text && <span className='ml-2 text-sm text-gray-400 font-semibold'>{text}</span>}
        </div>
    );
};

export default Rating;
