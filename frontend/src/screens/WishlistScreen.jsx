import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaHeartBroken, FaHeart } from 'react-icons/fa';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { addToCart } from '../slices/cartSlice';

const WishlistScreen = () => {
    const { data: wishlist, isLoading, refetch, error } = useGetWishlistQuery();
    const [removeFromWishlist, { isLoading: loadingremove }] = useRemoveFromWishlistMutation();
    const dispatch = useDispatch();

    const removeFromWishlistHandler = async (id) => {
        try {
            await removeFromWishlist(id).unwrap();
            refetch();
            toast.success('Removed from wishlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const addToCartHandler = (product) => {
        dispatch(addToCart({ ...product, qty: 1 }));
        toast.success('Added to Cart');
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh]">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <Link className='group inline-flex items-center text-sm font-medium text-text-muted hover:text-accent mb-4 transition-colors' to='/'>
                        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Continue Shopping
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-text-main">
                        My Wishlist <span className="text-text-muted font-normal text-2xl">{wishlist?.length > 0 && `(${wishlist.length} Items)`}</span>
                    </h1>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center mt-20"><Loader /></div>
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : wishlist.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border-color">
                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaHeartBroken className="text-4xl text-red-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-main mb-3">Your wishlist is empty</h2>
                    <p className="text-text-muted mb-8 max-w-md mx-auto">Explore our premium collection and save your favorites here.</p>
                    <Link to='/' className="btn-primary inline-flex">Explore Collection</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <div key={product._id} className="group bg-white rounded-xl border border-border-color overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
                            {/* Discount Badge */}
                            <div className="absolute top-3 left-3 z-10">
                                {product.countInStock === 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SOLD OUT</span>
                                )}
                            </div>

                            {/* Remove Button (Absolute) */}
                            <button
                                onClick={() => removeFromWishlistHandler(product._id)}
                                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                                disabled={loadingremove}
                                title="Remove from Wishlist"
                            >
                                <FaTrash />
                            </button>

                            <Link to={`/product/${product._id}`} className="aspect-[4/5] overflow-hidden bg-secondary relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                />
                            </Link>

                            <div className="p-5 flex flex-col flex-grow">
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="text-lg font-bold text-text-main mb-1 line-clamp-1 hover:text-accent transition-colors">{product.name}</h3>
                                </Link>
                                <div className="text-sm text-text-muted mb-3">{product.brand}</div>

                                <div className="flex justify-between items-center mt-auto mb-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-text-main">${product.price}</span>
                                    </div>
                                    <div className={`text-sm font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                    </div>
                                </div>

                                <button
                                    onClick={() => addToCartHandler(product)}
                                    disabled={product.countInStock === 0}
                                    className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaShoppingCart /> {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistScreen;
