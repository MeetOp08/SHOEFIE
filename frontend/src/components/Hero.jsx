import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="relative h-[80vh] w-full bg-primary flex items-center overflow-hidden">
            {/* Background Gradient/Image Placeholder */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=2012"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            <div className="container mx-auto px-4 z-20 relative">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Step Into <br />
                        <span className="text-accent">Greatness</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
                        Discover the exclusive collection of premium footwear designed for those who dare to stand out. Comfort meets luxury.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/search/nike" className="btn-primary">
                            Shop Now
                        </Link>
                        <Link to="/search/new" className="btn-outline">
                            View Collection
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
