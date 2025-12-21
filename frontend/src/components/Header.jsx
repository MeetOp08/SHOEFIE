import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa'; // Icons
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className='bg-gray-800 text-white'>
            <nav className='container mx-auto px-4 py-3 flex justify-between items-center'>
                <Link to='/' className='text-2xl font-bold tracking-wider'>SHOEFIE</Link>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="focus:outline-none">
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className={`flex-col md:flex-row md:flex items-center gap-6 ${isMenuOpen ? 'flex absolute top-14 left-0 w-full bg-gray-800 p-4 z-50' : 'hidden md:flex'}`}>
                    <SearchBox />

                    <Link to='/cart' className='flex items-center hover:text-gray-300'>
                        <FaShoppingCart className='mr-1' /> Cart
                        {cartItems.length > 0 && (
                            <span className='bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-1'>
                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {userInfo ? (
                        <div className='relative group'>
                            <button className='flex items-center hover:text-gray-300 focus:outline-none'>
                                {userInfo.name} <FaUser className='ml-1' />
                            </button>
                            <div className='absolute right-0 w-48 bg-white text-black rounded-md shadow-lg py-1 hidden group-hover:block z-50'>
                                <Link to='/profile' className='block px-4 py-2 hover:bg-gray-100'>Profile</Link>
                                <button onClick={logoutHandler} className='block w-full text-left px-4 py-2 hover:bg-gray-100'>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <Link to='/login' className='flex items-center hover:text-gray-300'>
                            <FaUser className='mr-1' /> Sign In
                        </Link>
                    )}

                    {userInfo && userInfo.isAdmin && (
                        <div className='relative group'>
                            <button className='flex items-center hover:text-gray-300 focus:outline-none'>
                                Admin
                            </button>
                            <div className='absolute right-0 w-48 bg-white text-black rounded-md shadow-lg py-1 hidden group-hover:block z-50'>
                                <Link to='/admin/productlist' className='block px-4 py-2 hover:bg-gray-100'>Products</Link>
                                <Link to='/admin/userlist' className='block px-4 py-2 hover:bg-gray-100'>Users</Link>
                                <Link to='/admin/orderlist' className='block px-4 py-2 hover:bg-gray-100'>Orders</Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
