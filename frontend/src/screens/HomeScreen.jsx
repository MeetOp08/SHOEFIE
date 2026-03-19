import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import FilterSidebar from '../components/FilterSidebar';
import '../styles/HomeScreen.css';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();

    // Read Query Params
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category') || '';
    const brandFilter = searchParams.get('brand') || '';
    const genderFilter = searchParams.get('gender') || '';

    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
        category: categoryFilter,
        brand: brandFilter,
        gender: genderFilter,
    });

    return (
        <div className="home-container">
            {/* Hero Section (Optional Placeholder) */}
            {!keyword && !categoryFilter && !brandFilter && !genderFilter && (
                <div className="home-hero-banner">
                    <div className="container-custom">
                        <h1 className="home-hero-title">
                            New Season Arrivals
                        </h1>
                        <p className="home-hero-subtitle">
                            Check out the latest trends in footwear. Premium comfort meets modern style.
                        </p>
                        <Link to="/search/all" className="btn-primary home-hero-btn">
                            Shop Collection
                        </Link>
                    </div>
                </div>
            )}

            <div className="container-custom">
                <div className="home-layout">

                    {/* Sidebar Filter */}
                    <aside className="home-sidebar">
                        <FilterSidebar />
                    </aside>

                    {/* Product Grid */}
                    <main className="home-main">
                        <div className="home-header">
                            <h2 className="home-title">
                                {keyword ? `Results for "${keyword}"` : 'Latest Products'}
                            </h2>
                            <span className="home-results-count">
                                Showing {data?.products?.length || 0} results
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="home-loader-container"><Loader /></div>
                        ) : error ? (
                            <Message variant='danger'>{error?.data?.message || error.error}</Message>
                        ) : (
                            <>
                                {data.products.length === 0 ? (
                                    <Message>No products found.</Message>
                                ) : (
                                    <div className="home-grid">
                                        {data.products.map((product) => (
                                            <Product key={product._id} product={product} />
                                        ))}
                                    </div>
                                )}
                                <div className="home-pagination-container">
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
