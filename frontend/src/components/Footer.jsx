import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-text-main pt-20 pb-10 text-white border-t border-gray-800">
            <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand */}
                <div className="col-span-1">
                    <Link to='/' className='text-3xl font-display font-bold text-white tracking-tight mb-6 block'>
                        SHOE<span className="text-accent">FIE</span>.
                    </Link>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                        Elevating your sneaker game with premium selections. Authentic styles, unmatched comfort, delivered globally.
                    </p>
                    <div className="flex space-x-5">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-accent"><FaFacebook size={18} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-accent"><FaTwitter size={18} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-accent"><FaInstagram size={18} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-accent"><FaLinkedin size={18} /></a>
                    </div>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="text-white text-lg font-bold mb-6 tracking-wide">Shop</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link to="/search/men" className="hover:text-accent transition-colors">Men's Sneakers</Link></li>
                        <li><Link to="/search/women" className="hover:text-accent transition-colors">Women's Sneakers</Link></li>
                        <li><Link to="/search/kids" className="hover:text-accent transition-colors">Kids' Collection</Link></li>
                        <li><Link to="/search/new" className="hover:text-accent transition-colors">New Arrivals</Link></li>
                        <li><Link to="/search/sale" className="hover:text-accent transition-colors">Sale</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-white text-lg font-bold mb-6 tracking-wide">Support</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link to="/profile" className="hover:text-accent transition-colors">My Account</Link></li>
                        <li><Link to="/tracking" className="hover:text-accent transition-colors">Track Order</Link></li>
                        <li><Link to="/faq" className="hover:text-accent transition-colors">FAQs</Link></li>
                        <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Support</Link></li>
                        <li><Link to="/returns" className="hover:text-accent transition-colors">Returns & Exchange</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-white text-lg font-bold mb-6 tracking-wide">Stay Updated</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Subscribe to our newsletter for exclusive drops and 10% off your first order.
                    </p>
                    <form className="flex flex-col space-y-3">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-accent text-sm"
                        />
                        <button className="btn-primary w-full py-3 text-sm">Subscribe</button>
                    </form>
                </div>
            </div>

            <div className="container-custom pt-8 border-t border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} SHOEFIE. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/cookie" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
