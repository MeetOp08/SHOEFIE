import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-primary border-t border-gray-800 pt-16 pb-8 text-gray-400">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* Brand */}
                <div className="col-span-1">
                    <Link to='/' className='text-3xl font-display font-bold text-accent tracking-wider mb-4 block'>
                        SHOEFIE
                    </Link>
                    <p className="text-sm leading-relaxed mb-6">
                        Redefining the shoe game with premium collection and unmatched comfort. Step up your style today.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-accent transition-colors"><FaFacebook size={20} /></a>
                        <a href="#" className="hover:text-accent transition-colors"><FaTwitter size={20} /></a>
                        <a href="#" className="hover:text-accent transition-colors"><FaInstagram size={20} /></a>
                        <a href="#" className="hover:text-accent transition-colors"><FaLinkedin size={20} /></a>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-white text-lg font-bold mb-6">Quick Links</h3>
                    <ul className="space-y-3">
                        <li><Link to="/search/men" className="hover:text-accent transition-colors">Men's Collection</Link></li>
                        <li><Link to="/search/women" className="hover:text-accent transition-colors">Women's Collection</Link></li>
                        <li><Link to="/search/kids" className="hover:text-accent transition-colors">Kid's Collection</Link></li>
                        <li><Link to="/search/sales" className="hover:text-accent transition-colors">Flash Sales</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-white text-lg font-bold mb-6">Customer Care</h3>
                    <ul className="space-y-3">
                        <li><Link to="/profile" className="hover:text-accent transition-colors">My Account</Link></li>
                        <li><Link to="/cart" className="hover:text-accent transition-colors">Order Tracking</Link></li>
                        <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-white text-lg font-bold mb-6">Newsletter</h3>
                    <p className="text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <form className="flex flex-col space-y-2">
                        <input type="email" placeholder="Enter your email" className="input-field" />
                        <button className="btn-primary w-full py-2">Subscribe</button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-4 border-t border-gray-800 pt-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} SHOEFIE. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
