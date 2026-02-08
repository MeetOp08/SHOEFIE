import React, { useEffect } from 'react';

const LegalScreen = ({ title }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl text-gray-300">
            <h1 className="text-4xl font-display font-bold text-white mb-8 border-b border-gray-700 pb-4">{title}</h1>
            <p className="mb-8 text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                    <p className="leading-relaxed">
                        Welcome to Shoefie. By accessing our website, you agree to these {title}.
                        This is a placeholder legal document for demonstration purposes. In a real-world scenario,
                        this content would be drafted by legal counsel to ensure compliance with local and international laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. User Rights & Responsibilities</h2>
                    <p className="leading-relaxed">
                        Users are responsible for maintaining the confidentiality of their account information.
                        Shoefie reserves the right to terminate accounts that violate our community standards or partake in fraudulent activities.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Data Privacy & Security</h2>
                    <p className="leading-relaxed">
                        We take your privacy seriously. All personal data is encrypted and stored securely.
                        We do not sell your data to third parties. For more details, please refer to our Privacy Policy section.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
                    <p className="leading-relaxed">
                        Shoefie shall not be held liable for any indirect, incidental, or consequential damages
                        arising from the use of our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
                    <p className="leading-relaxed">
                        If you have any questions regarding this {title}, please contact us at <span className="text-accent underline">legal@shoefie.com</span>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default LegalScreen;
