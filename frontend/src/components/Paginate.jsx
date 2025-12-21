import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return (
        pages > 1 && (
            <div className='flex justify-center mt-4'>
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
                        className={`px-3 py-1 border rounded mx-1 ${x + 1 === page ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                    >
                        {x + 1}
                    </Link>
                ))}
            </div>
        )
    );
};

export default Paginate;
