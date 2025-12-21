import { Row, Col } from 'react-bootstrap'; // Need to remove Bootstrap refs
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();
    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
    });

    return (
        <>
            {!keyword ? (
                <div className="mb-4">
                    {/* Hero or Carousel could go here */}
                    <h1 className="text-3xl font-bold mb-6">Latest Products</h1>
                </div>
            ) : (
                <Link to='/' className='btn btn-light mb-4 text-blue-500 hover:text-blue-700'>
                    Go Back
                </Link>
            )}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {data.products.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>

                    {/* Pagination (Simplified) */}
                    <div className='flex justify-center mt-8 space-x-2'>
                        {[...Array(data.pages).keys()].map(x => (
                            <Link
                                key={x + 1}
                                to={keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`}
                                className={`px-3 py-1 border rounded ${x + 1 === data.page ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default HomeScreen;
