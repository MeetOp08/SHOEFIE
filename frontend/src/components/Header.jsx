import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import SearchBox from './SearchBox';

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border-color">
            <nav className="container-custom h-20 flex items-center justify-between">

                {/* 1. Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-text-main text-2xl focus:outline-none"
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* 2. Brand Logo */}
                <Link to='/' className="flex items-center gap-1 group">
                    <span className="text-2xl font-display font-bold text-text-main tracking-tight group-hover:text-accent transition-colors">
                        SHOE<span className="text-accent">FIE</span>.
                    </span>
                </Link>

                {/* 3. Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to='/' className="text-text-main font-medium hover:text-accent transition-colors">Home</Link>
                    <Link to='/search/men' className="text-text-main font-medium hover:text-accent transition-colors">Men</Link>
                    <Link to='/search/women' className="text-text-main font-medium hover:text-accent transition-colors">Women</Link>
                    <Link to='/search/kids' className="text-text-main font-medium hover:text-accent transition-colors">Kids</Link>
                </div>

                {/* 4. Actions (Search, Cart, Profile) */}
                <div className="flex items-center gap-6">
                    <div className="hidden lg:block w-64">
                        <SearchBox />
                    </div>

                    <Link to='/cart' className="relative text-text-main hover:text-accent transition-colors">
                        <FaShoppingCart className="text-xl" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {userInfo ? (
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-text-main font-medium hover:text-accent transition-colors">
                                <FaUser />
                                <span className="hidden sm:inline">{userInfo.name.split(' ')[0]}</span>
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 mt-4 w-48 bg-white border border-border-color rounded-lg shadow-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                <Link to='/profile' className="block px-4 py-3 text-sm text-text-main hover:bg-secondary rounded-t-lg">Profile</Link>
                                {userInfo.isAdmin && (
                                    <Link to='/admin/dashboard' className="block px-4 py-3 text-sm text-text-main hover:bg-secondary">Dashboard</Link>
                                )}
                                <button onClick={logoutHandler} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-secondary rounded-b-lg font-medium">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to='/login' className="text-sm font-medium bg-secondary px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-all">
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-border-color p-4 space-y-4 shadow-soft">
                    <SearchBox />
                    <div className="flex flex-col gap-2">
                        <Link to='/' className="p-2 font-medium text-text-main" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to='/search/men' className="p-2 font-medium text-text-main" onClick={() => setIsMenuOpen(false)}>Men</Link>
                        <Link to='/search/women' className="p-2 font-medium text-text-main" onClick={() => setIsMenuOpen(false)}>Women</Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
