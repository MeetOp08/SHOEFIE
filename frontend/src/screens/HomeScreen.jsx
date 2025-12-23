import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Hero from '../components/Hero';
import FilterSidebar from '../components/FilterSidebar';
import { FaArrowLeft } from 'react-icons/fa';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();

    const [categoryFilter, setCategoryFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');

    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
        category: categoryFilter,
        brand: brandFilter,
    });

    return (
        <>
            {!keyword && !categoryFilter && !brandFilter ? (
                <Hero />
            ) : (
                <div className="container mx-auto px-4 py-8">
                    <Link to='/' className='btn-outline px-4 py-2 inline-flex items-center text-sm mb-4' onClick={() => { setCategoryFilter(''); setBrandFilter(''); }}>
                        <FaArrowLeft className="mr-2" /> Clear Filters / Go Back
                    </Link>
                </div>
            )}

            <div className="container mx-auto px-4 py-12">
                {!keyword && !categoryFilter && !brandFilter && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-accent mb-2">Latest Arrivals</h2>
                        <div className="h-1 w-24 bg-accent mx-auto rounded"></div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-1/4">
                        <FilterSidebar
                            setCategoryFilter={setCategoryFilter}
                            setBrandFilter={setBrandFilter}
                        />
                    </aside>

                    {/* Product Grid */}
                    <main className="w-full md:w-3/4">
                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message variant='danger'>
                                {error?.data?.message || error.error}
                            </Message>
                        ) : (
                            <>
                                {data.products.length === 0 ? (
                                    <Message>No products found for this selection.</Message>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {data.products.map((product) => (
                                            <Product key={product._id} product={product} />
                                        ))}
                                    </div>
                                )}
                                <Paginate
                                    pages={data.pages}
                                    page={data.page}
                                    keyword={keyword ? keyword : ''}
                                />
                            </>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default HomeScreen;
