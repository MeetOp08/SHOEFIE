import { Link } from 'react-router-dom';
import '../styles/Paginate.css';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return (
        pages > 1 && (
            <div className='paginate-container'>
                {[...Array(pages).keys()].map((x) => (
                    <Link
                        key={x + 1}
                        to={
                            !isAdmin
                                ? keyword
                                    ? `/search/${keyword}/page/${x + 1}`
                                    : `/page/${x + 1}`
                                : `/admin/productlist/${x + 1}`
                        }
                        className={`paginate-link ${x + 1 === page ? 'active' : ''}`}
                    >
                        {x + 1}
                    </Link>
                ))}
            </div>
        )
    );
};

export default Paginate;
