import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Hero from '../components/Hero';
import { FaArrowLeft } from 'react-icons/fa';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();

    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
    });

    return (
        <>
            {!keyword ? (
                <Hero />
            ) : (
                <div className="container mx-auto px-4 py-8">
                    <Link to='/' className='btn-outline px-4 py-2 inline-flex items-center text-sm mb-4'>
                        <FaArrowLeft className="mr-2" /> Go Back
                    </Link>
                </div>
            )}

            <div className="container mx-auto px-4 py-12">
                {!keyword && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-accent mb-2">Latest Arrivals</h2>
                        <div className="h-1 w-24 bg-accent mx-auto rounded"></div>
                    </div>
                )}

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {data.products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))}
                        </div>
                        <Paginate
                            pages={data.pages}
                            page={data.page}
                            keyword={keyword ? keyword : ''}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default HomeScreen;
