import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="container-custom footer-grid">
                {/* Brand */}
                <div className="footer-col-1">
                    <Link to='/' className='footer-brand'>
                        SHOE<span className="footer-brand-accent">FIE</span>.
                    </Link>
                    <p className="footer-desc">
                        Elevating your sneaker game with premium selections. Authentic styles, unmatched comfort, delivered globally.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="footer-social-link"><FaFacebook size={18} /></a>
                        <a href="#" className="footer-social-link"><FaTwitter size={18} /></a>
                        <a href="#" className="footer-social-link"><FaInstagram size={18} /></a>
                        <a href="#" className="footer-social-link"><FaLinkedin size={18} /></a>
                    </div>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="footer-col-title">Shop</h3>
                    <ul className="footer-list">
                        <li><Link to="/search/men" className="footer-link">Men's Sneakers</Link></li>
                        <li><Link to="/search/women" className="footer-link">Women's Sneakers</Link></li>
                        <li><Link to="/search/kids" className="footer-link">Kids' Collection</Link></li>
                        <li><Link to="/search/new" className="footer-link">New Arrivals</Link></li>
                        <li><Link to="/search/sale" className="footer-link">Sale</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="footer-col-title">Support</h3>
                    <ul className="footer-list">
                        <li><Link to="/profile" className="footer-link">My Account</Link></li>
                        <li><Link to="/tracking" className="footer-link">Track Order</Link></li>
                        <li><Link to="/faq" className="footer-link">FAQs</Link></li>
                        <li><Link to="/contact" className="footer-link">Contact Support</Link></li>
                        <li><Link to="/returns" className="footer-link">Returns & Exchange</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="footer-col-title">Stay Updated</h3>
                    <p className="footer-newsletter-text">
                        Subscribe to our newsletter for exclusive drops and 10% off your first order.
                    </p>
                    <form className="footer-form">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="footer-input"
                        />
                        <button className="btn-primary footer-btn">Subscribe</button>
                    </form>
                </div>
            </div>

            <div className="container-custom footer-bottom-container">
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} SHOEFIE. All rights reserved.</p>
                    <div className="footer-legal-links">
                        <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
                        <Link to="/terms" className="footer-legal-link">Terms of Service</Link>
                        <Link to="/cookie" className="footer-legal-link">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
