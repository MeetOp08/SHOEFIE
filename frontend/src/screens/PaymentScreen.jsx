import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod, savePaymentProvider } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { FaCreditCard, FaMoneyBillWave, FaWallet, FaUniversity, FaMobileAlt, FaLock } from 'react-icons/fa';

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
            <div
                className={`border rounded-xl mb-4 transition-all duration-200 overflow-hidden ${isSelected
                    ? 'border-accent bg-orange-50/50 ring-1 ring-accent transform scale-[1.01] shadow-md'
                    : 'border-border-color bg-white hover:bg-gray-50'
                    }`}
            >
                <div
                    className="flex items-center p-5 cursor-pointer"
                    onClick={() => {
                        setSelectedMethod(method);
                        setSelectedProvider('');
                    }}
                >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors ${isSelected ? 'border-accent' : 'border-gray-400'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                    </div>

                    <div className="flex-grow">
                        <div className="flex items-center">
                            <span className="font-bold text-text-main text-lg mr-3">{title}</span>
                            <span className="text-2xl text-text-muted">{icon}</span>
                        </div>
                        {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
                    </div>
                </div>

                <div className={`transition-all duration-300 ease-in-out ${isSelected ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5 pl-14 pt-0">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <CheckoutSteps step1 step2 step3 />

            <div className="flex items-end justify-between mb-8 mt-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-main">Payment</h1>
                    <p className="text-text-muted mt-1">Choose your preferred payment method</p>
                </div>
                <div className="flex items-center bg-green-100 px-3 py-1 rounded-full border border-green-200">
                    <FaLock className="text-green-600 mr-2 text-xs" />
                    <span className="text-green-700 text-xs font-bold uppercase tracking-wide">100% Secure</span>
                </div>
            </div>

            {/* Amount Banner */}
            <div className="bg-text-main rounded-xl p-6 mb-8 shadow-lg flex justify-between items-center text-white">
                <div>
                    <p className="text-gray-400 text-sm font-medium">Total Amount Payable</p>
                    <h2 className="text-3xl font-bold mt-1">₹{Number(totalPrice).toLocaleString()}</h2>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <span className="text-accent font-bold text-sm">Save extra on UPI</span>
                </div>
            </div>

            <div className="space-y-2">

                {/* 1. UPI */}
                <PaymentOption method="UPI" title="UPI" icon={<FaMobileAlt />} subtitle="Pay via GPay, PhonePe, Paytm">
                    <div className="space-y-3 mt-3">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                            <label key={app} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedProvider === app ? 'bg-white border-accent shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}>
                                <input
                                    type="radio"
                                    name="upiApp"
                                    value={app}
                                    checked={selectedProvider === app}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    className="hidden"
                                />
                                <span className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${selectedProvider === app ? 'border-accent' : 'border-gray-400'}`}>
                                    {selectedProvider === app && <div className="w-2 h-2 bg-accent rounded-full" />}
                                </span>
                                <span className="text-text-main font-medium">{app}</span>
                            </label>
                        ))}
                    </div>
                </PaymentOption>

                {/* 2. Cards */}
                <PaymentOption method="CARD" title="Credit / Debit Card" icon={<FaCreditCard />} subtitle="Visa, Mastercard, RuPay">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-text-muted text-sm mb-2">You will be redirected to Razorpay secure gateway.</p>
                        <div className="flex space-x-2">
                            <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-blue-800">VISA</div>
                            <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-red-600">MC</div>
                            <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-green-700">RuPay</div>
                        </div>
                    </div>
                </PaymentOption>

                {/* 3. Net Banking */}
                <PaymentOption method="NET_BANKING" title="Net Banking" icon={<FaUniversity />} subtitle="All Major Indian Banks">
                    <div className="relative">
                        <select
                            className="w-full p-3 bg-white border border-border-color rounded-lg text-text-main focus:ring-1 focus:ring-accent focus:border-accent appearance-none cursor-pointer outline-none"
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
                        <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">▼</div>
                    </div>
                </PaymentOption>

                {/* 4. Wallet */}
                <PaymentOption method="WALLET" title="Wallets" icon={<FaWallet />} subtitle="Amazon Pay, Paytm, etc.">
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {['Amazon Pay', 'Paytm Wallet', 'PhonePe Wallet'].map(wallet => (
                            <label key={wallet} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedProvider === wallet ? 'bg-white border-accent shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}>
                                <input
                                    type="radio"
                                    name="walletProvider"
                                    value={wallet}
                                    checked={selectedProvider === wallet}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    className="hidden"
                                />
                                <span className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${selectedProvider === wallet ? 'border-accent' : 'border-gray-400'}`}>
                                    {selectedProvider === wallet && <div className="w-2 h-2 bg-accent rounded-full" />}
                                </span>
                                <span className="text-sm font-medium text-text-main">{wallet}</span>
                            </label>
                        ))}
                    </div>
                </PaymentOption>

                {/* 5. COD */}
                <PaymentOption method="COD" title="Cash on Delivery" icon={<FaMoneyBillWave />} subtitle="Pay at your doorstep">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-text-main text-sm">Pay via Cash or UPI when the order arrives.</p>
                    </div>
                </PaymentOption>

            </div>

            <button
                onClick={submitHandler}
                className="btn-primary w-full mt-8 py-4 text-lg shadow-xl"
            >
                Confirm Payment Method
            </button>
        </div>
    );
};

export default PaymentScreen;
