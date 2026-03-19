import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaCaretDown } from 'react-icons/fa';
import '../styles/Header.css';

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
        <header className="header">
            <div className="header-container">
                <div className="header-inner">

                    {/* LEFT SECTION: Brand Logo */}
                    <div className="header-logo-wrapper">
                        <Link to="/" className="header-logo">
                            <span className="header-logo-text">
                                SHOE<span className="header-logo-accent">FIE</span>
                            </span>
                        </Link>
                    </div>

                    {/* CENTER SECTION: Search Bar (Desktop) */}
                    <div className="header-search-wrapper">
                        <form onSubmit={searchHandler} className="header-search-form">
                            <input
                                type="text"
                                placeholder="Search for shoes, brands..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="header-search-input"
                            />
                            <button
                                type="submit"
                                className="header-search-btn"
                            >
                                <FaSearch className="text-lg" />
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SECTION: Navigation & Actions */}
                    <div className="header-nav-wrapper">

                        {/* Navigation Links */}
                        <nav className="header-nav">
                            <Link to="/?gender=Men" className="header-nav-link">Men</Link>
                            <Link to="/?gender=Women" className="header-nav-link">Women</Link>
                            <Link to="/?gender=Kids" className="header-nav-link">Kids</Link>
                            <Link to="/search/sports" className="header-nav-link">Sports</Link>
                            <Link to="/search/sale" className="header-nav-link-sale">Sale</Link>
                        </nav>

                        <div className="header-nav-divider"></div>

                        {/* User User & Cart */}
                        <div className="header-actions">
                            {/* Profile Dropdown */}
                            {userInfo ? (
                                <div className="header-profile-dropdown">
                                    <button
                                        onClick={toggleProfileDropdown}
                                        className="header-profile-btn"
                                    >
                                        <FaUser className="text-lg" />
                                        <span>{userInfo.name.split(' ')[0]}</span>
                                        <FaCaretDown className={`header-caret ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <>
                                            <div
                                                className="header-overlay"
                                                onClick={() => setIsProfileOpen(false)}
                                            ></div>
                                            <div className="header-dropdown-menu">
                                                <div className="header-dropdown-user">
                                                    <p className="header-dropdown-label">Signed in as</p>
                                                    <p className="header-dropdown-name">{userInfo.name}</p>
                                                </div>
                                                <Link to="/profile" className="header-dropdown-link" onClick={() => setIsProfileOpen(false)}>
                                                    My Profile
                                                </Link>
                                                <Link to="/wishlist" className="header-dropdown-link" onClick={() => setIsProfileOpen(false)}>
                                                    Wishlist
                                                </Link>
                                                {userInfo.isAdmin && (
                                                    <Link to="/admin/dashboard" className="header-dropdown-link" onClick={() => setIsProfileOpen(false)}>
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={logoutHandler}
                                                    className="header-logout-btn"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="header-login-btn">
                                    <FaUser className="text-lg" />
                                    <span>Log In</span>
                                </Link>
                            )}

                            {/* Cart Icon */}
                            <Link to="/cart" className="header-cart-link">
                                <FaShoppingCart className="header-cart-icon" />
                                {cartItems.length > 0 && (
                                    <span className="header-cart-badge">
                                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Toggle & Cart (Visible on Small Screens) */}
                    <div className="header-mobile-actions">
                        <Link to="/cart" className="header-cart-link">
                            <FaShoppingCart className="header-cart-icon" />
                            {cartItems.length > 0 && (
                                <span className="header-cart-badge">
                                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="header-mobile-toggle"
                        >
                            {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu (Slide Down) */}
                {isMobileMenuOpen && (
                    <div className="header-mobile-menu">
                        {/* Mobile Search */}
                        <form onSubmit={searchHandler} className="header-mobile-search-form">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="header-mobile-search-input"
                            />
                            <button type="submit" className="header-mobile-search-btn">
                                <FaSearch />
                            </button>
                        </form>

                        {/* Mobile Navigation */}
                        <div className="header-mobile-nav">
                            <Link to="/?gender=Men" className="header-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Men</Link>
                            <Link to="/?gender=Women" className="header-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Women</Link>
                            <Link to="/?gender=Kids" className="header-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Kids</Link>
                            <Link to="/search/sports" className="header-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Sports</Link>
                            <Link to="/search/sale" className="header-mobile-nav-link-sale" onClick={() => setIsMobileMenuOpen(false)}>Sale</Link>
                        </div>

                        {/* Mobile User Section */}
                        <div className="header-mobile-user">
                            {userInfo ? (
                                <div className="header-mobile-user-actions">
                                    <div className="header-user-info">
                                        <div className="header-user-avatar">
                                            {userInfo.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="header-dropdown-name">{userInfo.name}</p>
                                            <p className="header-dropdown-label">{userInfo.email}</p>
                                        </div>
                                    </div>
                                    <Link to="/profile" className="header-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                                    <Link to="/wishlist" className="header-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
                                    {userInfo.isAdmin && (
                                        <Link to="/admin/dashboard" className="header-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                                    )}
                                    <button onClick={logoutHandler} className="header-mobile-logout-btn">Sign Out</button>
                                </div>
                            ) : (
                                <div className="header-mobile-user-actions">
                                    <Link to="/login" className="btn-primary header-mobile-login-btn" onClick={() => setIsMobileMenuOpen(false)}>Login / Register</Link>
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
