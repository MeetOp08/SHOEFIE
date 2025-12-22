import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod, savePaymentProvider } from '../slices/cartSlice';
import { toast } from 'react-toastify';

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
                        ? 'border-[#FA8900] bg-gray-800 shadow-lg ring-1 ring-[#FA8900] transform scale-[1.01]'
                        : 'border-gray-700 bg-gray-900/50 hover:bg-gray-800'
                    }`}
            >
                <div
                    className="flex items-center p-5 cursor-pointer"
                    onClick={() => {
                        setSelectedMethod(method);
                        setSelectedProvider('');
                    }}
                >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${isSelected ? 'border-[#FA8900]' : 'border-gray-500'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#FA8900]" />}
                    </div>

                    <div className="flex-grow">
                        <div className="flex items-center">
                            <span className="font-bold text-white text-lg mr-3">{title}</span>
                            <span className="text-2xl">{icon}</span>
                        </div>
                        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
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
        <div className="container mx-auto px-4 py-8 max-w-2xl text-white">
            <CheckoutSteps step1 step2 step3 />

            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Payment</h1>
                    <p className="text-gray-400 mt-1">Choose your payment method</p>
                </div>
                <div className="flex items-center bg-green-900/30 px-3 py-1 rounded-full border border-green-700/50">
                    <span className="text-green-500 mr-2">🔒</span>
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wide">100% Secure</span>
                </div>
            </div>

            {/* Amount Banner */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 mb-8 border border-gray-700 flex justify-between items-center shadow-lg">
                <div>
                    <p className="text-gray-400 text-sm font-medium">Total Amount</p>
                    <h2 className="text-3xl font-bold text-white mt-1">₹{totalPrice}</h2>
                </div>
                <div className="bg-[#FA8900]/10 px-4 py-2 rounded-lg border border-[#FA8900]/20">
                    <span className="text-[#FA8900] font-bold text-sm">Save ₹50 with UPI</span>
                </div>
            </div>

            <div className="space-y-2">

                {/* 1. UPI */}
                <PaymentOption method="UPI" title="UPI" icon="📱" subtitle="Pay via GPay, PhonePe, Paytm">
                    <div className="space-y-3 mt-3">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                            <label key={app} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedProvider === app ? 'bg-gray-700 border-[#FA8900]' : 'bg-gray-800 border-gray-700 hover:border-gray-500'}`}>
                                <input
                                    type="radio"
                                    name="upiApp"
                                    value={app}
                                    checked={selectedProvider === app}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    className="hidden"
                                />
                                <span className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${selectedProvider === app ? 'border-[#FA8900]' : 'border-gray-500'}`}>
                                    {selectedProvider === app && <div className="w-2 h-2 bg-[#FA8900] rounded-full" />}
                                </span>
                                <span className="text-gray-200 font-medium">{app}</span>
                            </label>
                        ))}
                        <div className="relative">
                            <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedProvider === 'Other UPI' || (selectedProvider && !['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].includes(selectedProvider)) ? 'bg-gray-700 border-[#FA8900]' : 'bg-gray-800 border-gray-700'}`}>
                                <input
                                    type="radio"
                                    name="upiApp"
                                    value="Other UPI"
                                    checked={selectedProvider && !['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].includes(selectedProvider) && selectedProvider !== ''}
                                    onChange={() => setSelectedProvider('Other UPI')}
                                    className="hidden"
                                />
                                <span className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${selectedProvider && !['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].includes(selectedProvider) ? 'border-[#FA8900]' : 'border-gray-500'}`}>
                                    {(selectedProvider && !['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].includes(selectedProvider)) && <div className="w-2 h-2 bg-[#FA8900] rounded-full" />}
                                </span>
                                <input
                                    type="text"
                                    placeholder="Enter UPI ID"
                                    className="bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 w-full p-0 h-auto focus:outline-none"
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </label>
                        </div>
                    </div>
                </PaymentOption>

                {/* 2. Cards */}
                <PaymentOption method="CARD" title="Card" icon="💳" subtitle="Credit / Debit / ATM Card">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <span className="text-gray-300 text-sm">Securely pay via Razorpay</span>
                        <div className="flex space-x-2">
                            <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[10px] font-bold text-blue-800">VISA</div>
                            <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[10px] font-bold text-red-600">MC</div>
                            <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[10px] font-bold text-green-700">RuPay</div>
                        </div>
                    </div>
                </PaymentOption>

                {/* 3. Net Banking */}
                <PaymentOption method="NET_BANKING" title="Net Banking" icon="🏦" subtitle="All Indian banks supported">
                    <div className="relative">
                        <select
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-[#FA8900] focus:border-[#FA8900] appearance-none cursor-pointer outline-none"
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
                        <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">▼</div>
                    </div>
                </PaymentOption>

                {/* 4. Wallet */}
                <PaymentOption method="WALLET" title="Wallets" icon="👛" subtitle="Amazon Pay, Paytm, etc.">
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {['Amazon Pay', 'Paytm Wallet', 'PhonePe Wallet'].map(wallet => (
                            <label key={wallet} className={`flex items-center p-3 rounded-lg border cursor-pointer ${selectedProvider === wallet ? 'bg-gray-700 border-[#FA8900]' : 'bg-gray-800 border-gray-700'}`}>
                                <input
                                    type="radio"
                                    name="walletProvider"
                                    value={wallet}
                                    checked={selectedProvider === wallet}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    className="hidden"
                                />
                                <span className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${selectedProvider === wallet ? 'border-[#FA8900]' : 'border-gray-500'}`}>
                                    {selectedProvider === wallet && <div className="w-2 h-2 bg-[#FA8900] rounded-full" />}
                                </span>
                                <span className="text-sm font-medium text-white">{wallet}</span>
                            </label>
                        ))}
                    </div>
                </PaymentOption>

                {/* 5. COD */}
                <PaymentOption method="COD" title="Cash on Delivery" icon="💵" subtitle="Pay upon delivery">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-300 text-sm">You can pay via Cash or UPI at your doorstep.</p>
                    </div>
                </PaymentOption>

            </div>

            <button
                onClick={submitHandler}
                className="w-full bg-[#FA8900] hover:bg-[#e67e00] text-white font-bold mt-8 py-4 text-lg rounded-xl shadow-xl shadow-[#FA8900]/20 hover:shadow-[#FA8900]/40 transition-all transform hover:-translate-y-1 block"
            >
                Continue to Place Order
            </button>
        </div>
    );
};

export default PaymentScreen;
