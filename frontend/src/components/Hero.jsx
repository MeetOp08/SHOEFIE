import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
    return (
        <div className="hero-container">
            {/* Video/Image Background */}
            <div className="hero-background">
                <div className="hero-overlay" />
                <img
                    src="https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=2000&auto=format&fit=crop"
                    alt="Hero Background"
                    className="hero-image"
                />
            </div>

            <div className="hero-content-wrapper">
                <div className="hero-content">
                    <h2 className="hero-subtitle">
                        New Collection 2024
                    </h2>
                    <h1 className="hero-title">
                        Defy The <span className="hero-title-accent">Norms.</span>
                    </h1>

                    <div className="hero-actions">
                        <Link to="/search/running" className="btn-primary text-center">
                            Shop The Drop
                        </Link>
                        <Link to="/search/all" className="btn-outline text-center">
                            Explore Catalog
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
