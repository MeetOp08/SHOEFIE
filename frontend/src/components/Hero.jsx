import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative h-[90vh] w-full bg-primary flex items-center overflow-hidden">
            {/* Video/Image Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=2000&auto=format&fit=crop"
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="container mx-auto px-4 z-20 relative h-full flex items-end pb-20">
                <div className="max-w-4xl opacity-0 animate-[fadeInUp_1s_ease-out_forwards]">
                    <h2 className="text-white text-lg md:text-xl uppercase tracking-[0.3em] mb-4 font-bold">
                        New Collection 2024
                    </h2>
                    <h1 className="text-6xl md:text-9xl font-display font-bold text-white mb-8 leading-none uppercase italic">
                        Defy The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Norms.</span>
                    </h1>

                    <div className="flex flex-col md:flex-row gap-6">
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
