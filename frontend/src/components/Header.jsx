import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import SearchBox from './SearchBox';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
            setIsMenuOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    // Sticky Navbar Effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);


    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
            <nav className='container mx-auto px-4 flex justify-between items-center'>
                {/* Logo */}
                <Link to='/' className='text-3xl font-display font-bold text-accent tracking-wider z-50'>
                    SHOEFIE
                </Link>

                {/* Desktop Search - Hidden on Mobile */}
                <div className="hidden md:block w-1/3">
                    <SearchBox />
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to='/cart' className='relative group'>
                        <div className="flex items-center text-white hover:text-accent transition-colors">
                            <FaShoppingCart className='text-xl mr-2' />
                            <span className="font-semibold">Cart</span>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-accent text-primary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                                </span>
                            )}
                        </div>
                    </Link>

                    {userInfo ? (
                        <div className="relative group">
                            <button className="flex items-center text-white hover:text-accent font-semibold transition-colors focus:outline-none">
                                <FaUser className="mr-2" /> {userInfo.name}
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 mt-2 w-48 bg-gray-dark border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                <Link to='/profile' className="block px-4 py-2 hover:bg-gray-700 hover:text-accent rounded-t-lg">Profile</Link>
                                {userInfo.isAdmin && (
                                    <>
                                        <Link to='/admin/productlist' className="block px-4 py-2 hover:bg-gray-700 hover:text-accent">Products</Link>
                                        <Link to='/admin/orderlist' className="block px-4 py-2 hover:bg-gray-700 hover:text-accent">Orders</Link>
                                        <Link to='/admin/userlist' className="block px-4 py-2 hover:bg-gray-700 hover:text-accent">Users</Link>
                                    </>
                                )}
                                <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400 hover:text-red-300 rounded-b-lg">
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to='/login' className='btn-primary px-6 py-2 text-sm'>
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden z-50">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-secondary focus:outline-none text-2xl">
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Overlay Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-primary/95 backdrop-blur-xl z-40 flex flex-col pt-24 px-6 items-center space-y-8 md:hidden"
                        >
                            <SearchBox />

                            <Link to='/cart' className="text-2xl font-semibold flex items-center" onClick={() => setIsMenuOpen(false)}>
                                <FaShoppingCart className="mr-3 text-accent" /> Cart
                                {cartItems.length > 0 && <span className="ml-2 bg-accent text-primary text-sm px-2 py-0.5 rounded-full">{cartItems.reduce((a, c) => a + c.qty, 0)}</span>}
                            </Link>

                            {userInfo ? (
                                <>
                                    <Link to='/profile' className="text-xl hover:text-accent" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                                    {userInfo.isAdmin && (
                                        <div className="flex flex-col items-center space-y-4 border-t border-gray-700 pt-4 w-full">
                                            <span className="text-gray-400 text-sm uppercase tracking-widest">Admin</span>
                                            <Link to='/admin/productlist' onClick={() => setIsMenuOpen(false)}>Products</Link>
                                            <Link to='/admin/orderlist' onClick={() => setIsMenuOpen(false)}>Orders</Link>
                                            <Link to='/admin/userlist' onClick={() => setIsMenuOpen(false)}>Users</Link>
                                        </div>
                                    )}
                                    <button onClick={logoutHandler} className="text-xl text-red-500 flex items-center mt-4">
                                        <FaSignOutAlt className="mr-2" /> Logout
                                    </button>
                                </>
                            ) : (
                                <Link to='/login' className='btn-primary w-full text-center' onClick={() => setIsMenuOpen(false)}>
                                    Sign In
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Header;
