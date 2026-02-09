import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaHeart, FaCaretDown } from 'react-icons/fa';

const Header = () => {
    const [keyword, setKeyword] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            setIsProfileOpen(false);
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    const searchHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
            setIsMobileMenuOpen(false);
        } else {
            navigate('/');
        }
    };

    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm font-sans">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-20 gap-4">

                    {/* LEFT SECTION: Brand Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-1 group">
                            <span className="text-2xl font-display font-bold text-gray-900 tracking-tight group-hover:text-accent transition-colors">
                                SHOE<span className="text-accent">FIE</span>
                            </span>
                        </Link>
                    </div>

                    {/* CENTER SECTION: Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <form onSubmit={searchHandler} className="w-full relative">
                            <input
                                type="text"
                                placeholder="Search for shoes, brands..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full pl-5 pr-12 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all bg-gray-50 hover:bg-white text-sm"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-accent transition-colors rounded-r-full"
                            >
                                <FaSearch className="text-lg" />
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SECTION: Navigation & Actions */}
                    <div className="hidden lg:flex items-center gap-6">

                        {/* Navigation Links */}
                        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
                            <Link to="/?gender=Men" className="hover:text-accent transition-colors">Men</Link>
                            <Link to="/?gender=Women" className="hover:text-accent transition-colors">Women</Link>
                            <Link to="/?gender=Kids" className="hover:text-accent transition-colors">Kids</Link>
                            <Link to="/search/sports" className="hover:text-accent transition-colors">Sports</Link>
                            <Link to="/search/sale" className="text-red-500 hover:text-red-600 transition-colors font-semibold">Sale</Link>
                        </nav>

                        <div className="h-6 w-px bg-gray-200 mx-2"></div>

                        {/* User User & Cart */}
                        <div className="flex items-center gap-5">
                            {/* Profile Dropdown */}
                            {userInfo ? (
                                <div className="relative">
                                    <button
                                        onClick={toggleProfileDropdown}
                                        className="flex items-center gap-2 text-gray-700 hover:text-accent transition-colors font-medium text-sm focus:outline-none"
                                    >
                                        <FaUser className="text-lg" />
                                        <span>{userInfo.name.split(' ')[0]}</span>
                                        <FaCaretDown className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10 cursor-default"
                                                onClick={() => setIsProfileOpen(false)}
                                            ></div>
                                            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-20 py-1 animate-fadeIn">
                                                <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                                                    <p className="text-xs text-gray-500">Signed in as</p>
                                                    <p className="text-sm font-bold text-gray-900 truncate">{userInfo.name}</p>
                                                </div>
                                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                    My Profile
                                                </Link>
                                                <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                    Wishlist
                                                </Link>
                                                {userInfo.isAdmin && (
                                                    <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={logoutHandler}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-accent transition-colors flex items-center gap-2">
                                    <FaUser className="text-lg" />
                                    <span>Log In</span>
                                </Link>
                            )}

                            {/* Cart Icon */}
                            <Link to="/cart" className="relative text-gray-700 hover:text-accent transition-colors group">
                                <FaShoppingCart className="text-xl group-hover:scale-110 transition-transform" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border border-white">
                                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Toggle & Cart (Visible on Small Screens) */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <Link to="/cart" className="relative text-gray-700">
                            <FaShoppingCart className="text-xl" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
                                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 focus:outline-none p-1"
                        >
                            {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu (Slide Down) */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 py-4 bg-white animate-slideDown absolute left-0 right-0 shadow-lg px-4 flex flex-col gap-4">
                        {/* Mobile Search */}
                        <form onSubmit={searchHandler} className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent text-sm"
                            />
                            <button type="submit" className="absolute right-3 top-2 text-gray-400">
                                <FaSearch />
                            </button>
                        </form>

                        {/* Mobile Navigation */}
                        <div className="flex flex-col gap-2 font-medium text-gray-700">
                            <Link to="/?gender=Men" className="py-2 border-b border-gray-50 hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Men</Link>
                            <Link to="/?gender=Women" className="py-2 border-b border-gray-50 hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Women</Link>
                            <Link to="/?gender=Kids" className="py-2 border-b border-gray-50 hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Kids</Link>
                            <Link to="/search/sports" className="py-2 border-b border-gray-50 hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Sports</Link>
                            <Link to="/search/sale" className="py-2 text-red-500 hover:text-red-600" onClick={() => setIsMobileMenuOpen(false)}>Sale</Link>
                        </div>

                        {/* Mobile User Section */}
                        <div className="pt-2 border-t border-gray-100">
                            {userInfo ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-accent font-bold">
                                            {userInfo.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{userInfo.name}</p>
                                            <p className="text-xs text-gray-500">{userInfo.email}</p>
                                        </div>
                                    </div>
                                    <Link to="/profile" className="text-sm text-gray-600 hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                                    <Link to="/wishlist" className="text-sm text-gray-600 hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
                                    {userInfo.isAdmin && (
                                        <Link to="/admin/dashboard" className="text-sm text-gray-600 hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                                    )}
                                    <button onClick={logoutHandler} className="text-sm text-red-500 text-left font-medium mt-2">Sign Out</button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link to="/login" className="btn-primary w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Login / Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
