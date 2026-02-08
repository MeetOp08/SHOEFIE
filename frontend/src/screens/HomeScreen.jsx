import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import FilterSidebar from '../components/FilterSidebar';
import { useState } from 'react';

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
        <div className="min-h-screen bg-primary pb-20">
            {/* Hero Section (Optional Placeholder) */}
            {!keyword && !categoryFilter && !brandFilter && (
                <div className="bg-secondary mb-12 py-16 md:py-24 text-center border-b border-border-color">
                    <div className="container-custom">
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-text-main mb-4">
                            New Season Arrivals
                        </h1>
                        <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
                            Check out the latest trends in footwear. Premium comfort meets modern style.
                        </p>
                        <Link to="/search/all" className="btn-primary inline-flex">
                            Shop Collection
                        </Link>
                    </div>
                </div>
            )}

            <div className="container-custom">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Sidebar Filter */}
                    <aside className="w-full lg:w-1/4">
                        <FilterSidebar
                            setCategoryFilter={setCategoryFilter}
                            setBrandFilter={setBrandFilter}
                        />
                    </aside>

                    {/* Product Grid */}
                    <main className="w-full lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-display font-bold text-text-main">
                                {keyword ? `Results for "${keyword}"` : 'Latest Products'}
                            </h2>
                            <span className="text-text-muted text-sm">
                                Showing {data?.products?.length || 0} results
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20"><Loader /></div>
                        ) : error ? (
                            <Message variant='danger'>{error?.data?.message || error.error}</Message>
                        ) : (
                            <>
                                {data.products.length === 0 ? (
                                    <Message>No products found.</Message>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {data.products.map((product) => (
                                            <Product key={product._id} product={product} />
                                        ))}
                                    </div>
                                )}
                                <div className="mt-12">
                                    <Paginate
                                        pages={data.pages}
                                        page={data.page}
                                        keyword={keyword ? keyword : ''}
                                    />
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
