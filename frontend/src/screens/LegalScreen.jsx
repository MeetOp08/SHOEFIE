import React, { useEffect } from 'react';
import '../styles/LegalScreen.css';

const LegalScreen = ({ title }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-container">
            <h1 className="legal-title">{title}</h1>
            <p className="legal-date">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="legal-content-card">
                <section>
                    <h2 className="legal-section-title">1. Introduction</h2>
                    <p className="legal-text">
                        Welcome to Shoefie. By accessing our website, you agree to these {title}.
                        This is a placeholder legal document for demonstration purposes. In a real-world scenario,
                        this content would be drafted by legal counsel to ensure compliance with local and international laws.
                    </p>
                </section>

                <section>
                    <h2 className="legal-section-title">2. User Rights & Responsibilities</h2>
                    <p className="legal-text">
                        Users are responsible for maintaining the confidentiality of their account information.
                        Shoefie reserves the right to terminate accounts that violate our community standards or partake in fraudulent activities.
                    </p>
                </section>

                <section>
                    <h2 className="legal-section-title">3. Data Privacy & Security</h2>
                    <p className="legal-text">
                        We take your privacy seriously. All personal data is encrypted and stored securely.
                        We do not sell your data to third parties. For more details, please refer to our Privacy Policy section.
                    </p>
                </section>

                <section>
                    <h2 className="legal-section-title">4. Limitation of Liability</h2>
                    <p className="legal-text">
                        Shoefie shall not be held liable for any indirect, incidental, or consequential damages
                        arising from the use of our services.
                    </p>
                </section>

                <section>
                    <h2 className="legal-section-title">5. Contact Information</h2>
                    <p className="legal-text">
                        If you have any questions regarding this {title}, please contact us at <span className="legal-contact-highlight">legal@shoefie.com</span>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default LegalScreen;
