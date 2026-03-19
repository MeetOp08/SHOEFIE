import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../styles/Rating.css';

const Rating = ({ value, text, color = '#D4AF37' }) => {
    return (
        <div className='rating-container'>
            <div className="rating-stars">
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
            {text && <span className='rating-text'>{text}</span>}
        </div>
    );
};

export default Rating;
