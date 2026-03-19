import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod, savePaymentProvider } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { FaCreditCard, FaMoneyBillWave, FaWallet, FaUniversity, FaMobileAlt, FaLock } from 'react-icons/fa';
import '../styles/PaymentScreen.css';

const PaymentScreen = () => {
    const [selectedMethod, setSelectedMethod] = useState('UPI');
    const [selectedProvider, setSelectedProvider] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress, totalPrice } = cart;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = () => {
        if (selectedMethod === 'NET_BANKING' && !selectedProvider) {
            toast.error('Please select a bank');
            return;
        }
        if (selectedMethod === 'WALLET' && !selectedProvider) {
            toast.error('Please select a wallet');
            return;
        }

        dispatch(savePaymentMethod(selectedMethod));
        dispatch(savePaymentProvider(selectedProvider || selectedMethod));
        navigate('/placeorder');
    };

    const PaymentOption = ({ method, title, icon, subtitle, children }) => {
        const isSelected = selectedMethod === method;
        return (
            <div className={`payment-option-card ${isSelected ? 'active' : ''}`}>
                <div
                    className="payment-option-header"
                    onClick={() => {
                        setSelectedMethod(method);
                        setSelectedProvider('');
                    }}
                >
                    <div className="payment-radio-outer">
                        {isSelected && <div className="payment-radio-inner" />}
                    </div>

                    <div className="payment-option-info">
                        <div className="payment-option-title-row">
                            <span className="payment-option-title">{title}</span>
                            <span className="payment-option-icon">{icon}</span>
                        </div>
                        {subtitle && <p className="payment-option-subtitle">{subtitle}</p>}
                    </div>
                </div>

                <div className="payment-option-body">
                    <div className="payment-option-body-inner">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-custom payment-container">
            <CheckoutSteps step1 step2 step3 />

            <div className="payment-header">
                <div>
                    <h1 className="payment-title">Payment</h1>
                    <p className="payment-subtitle">Choose your preferred payment method</p>
                </div>
                <div className="payment-secure-badge">
                    <FaLock className="payment-secure-icon" />
                    <span className="payment-secure-text">100% Secure</span>
                </div>
            </div>

            {/* Amount Banner */}
            <div className="payment-amount-banner">
                <div>
                    <p className="payment-banner-label">Total Amount Payable</p>
                    <h2 className="payment-banner-value">₹{Number(totalPrice).toLocaleString()}</h2>
                </div>
                <div className="payment-banner-promo">
                    <span className="payment-promo-text">Save extra on UPI</span>
                </div>
            </div>

            <div className="payment-options-list">

                {/* 1. UPI */}
                <PaymentOption method="UPI" title="UPI" icon={<FaMobileAlt />} subtitle="Pay via GPay, PhonePe, Paytm">
                    <div className="payment-upi-list">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                            <label key={app} className={`payment-provider-label ${selectedProvider === app ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="upiApp"
                                    value={app}
                                    checked={selectedProvider === app}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    className="hidden"
                                />
                                <span className="payment-provider-radio-outer">
                                    {selectedProvider === app && <div className="payment-provider-radio-inner" />}
                                </span>
                                <span className="payment-provider-name">{app}</span>
                            </label>
                        ))}
                    </div>
                </PaymentOption>

                {/* 2. Cards */}
                <PaymentOption method="CARD" title="Credit / Debit Card" icon={<FaCreditCard />} subtitle="Visa, Mastercard, RuPay">
                    <div className="payment-cards-container">
                        <p className="payment-cards-text">You will be redirected to Razorpay secure gateway.</p>
                        <div className="payment-cards-icons">
                            <div className="payment-card-badge visa">VISA</div>
                            <div className="payment-card-badge mc">MC</div>
                            <div className="payment-card-badge rupay">RuPay</div>
                        </div>
                    </div>
                </PaymentOption>

                {/* 3. Net Banking */}
                <PaymentOption method="NET_BANKING" title="Net Banking" icon={<FaUniversity />} subtitle="All Major Indian Banks">
                    <div className="payment-netbank-wrap">
                        <select
                            className="payment-netbank-select"
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            value={selectedProvider}
                        >
                            <option value="" disabled>Select your Bank</option>
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="State Bank of India">State Bank of India</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        </select>
                        <div className="payment-netbank-arrow">▼</div>
                    </div>
                </PaymentOption>

                {/* 4. Wallet */}
                <PaymentOption method="WALLET" title="Wallets" icon={<FaWallet />} subtitle="Amazon Pay, Paytm, etc.">
                    <div className="payment-wallet-grid">
                        {['Amazon Pay', 'Paytm Wallet', 'PhonePe Wallet'].map(wallet => (
                            <label key={wallet} className={`payment-provider-label ${selectedProvider === wallet ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="walletProvider"
                                    value={wallet}
                                    checked={selectedProvider === wallet}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    className="hidden"
                                />
                                <span className="payment-provider-radio-outer">
                                    {selectedProvider === wallet && <div className="payment-provider-radio-inner" />}
                                </span>
                                <span className="payment-wallet-name">{wallet}</span>
                            </label>
                        ))}
                    </div>
                </PaymentOption>

                {/* 5. COD */}
                <PaymentOption method="COD" title="Cash on Delivery" icon={<FaMoneyBillWave />} subtitle="Pay at your doorstep">
                    <div className="payment-cod-container">
                        <p className="payment-cod-text">Pay via Cash or UPI when the order arrives.</p>
                    </div>
                </PaymentOption>

            </div>

            <button
                onClick={submitHandler}
                className="btn-primary payment-submit-btn"
            >
                Confirm Payment Method
            </button>
        </div>
    );
};

export default PaymentScreen;
