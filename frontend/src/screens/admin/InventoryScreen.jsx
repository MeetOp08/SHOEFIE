import { useState } from 'react';
import { useGetInventoryQuery, useRestockProductMutation } from '../../slices/inventoryApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import StockBadge from '../../components/StockBadge';
import { toast } from 'react-toastify';
import { FaExclamationTriangle, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

const InventoryScreen = () => {
    const { data: products, isLoading, error, refetch } = useGetInventoryQuery();
    const [restockProduct, { isLoading: loadingRestock }] = useRestockProductMutation();

    const [restockId, setRestockId] = useState(null);
    const [amount, setAmount] = useState('');

    const lowStockCount = products?.filter(p => p.countInStock <= p.lowStockThreshold).length;

    const handleRestock = async (id) => {
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        try {
            await restockProduct({ productId: id, amount }).unwrap();
            toast.success('Stock updated successfully');
            setRestockId(null);
            setAmount('');
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold text-text-main mb-6">Inventory Management</h1>

            {lowStockCount > 0 && (
                <Message variant="warning" className="mb-6 flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    Warning: {lowStockCount} products are low on stock!
                </Message>
            )}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-border-color text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    <th className="py-4 px-6">Product</th>
                                    <th className="py-4 px-6">Reference</th>
                                    <th className="py-4 px-6">Current Stock</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6">Threshold</th>
                                    <th className="py-4 px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color">
                                {products.map((product) => (
                                    <tr key={product._id} className={product.countInStock <= product.lowStockThreshold ? "bg-red-50 hover:bg-red-100/50" : "hover:bg-gray-50"}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-text-main">{product.name}</div>
                                                    <div className="text-sm text-text-muted">{product.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-text-muted font-mono">{product._id.substring(0, 8)}...</td>
                                        <td className="py-4 px-6 text-sm font-bold text-text-main">{product.countInStock}</td>
                                        <td className="py-4 px-6">
                                            <StockBadge stock={product.countInStock} threshold={product.lowStockThreshold} />
                                        </td>
                                        <td className="py-4 px-6 text-sm text-text-muted">{product.lowStockThreshold}</td>
                                        <td className="py-4 px-6">
                                            {restockId === product._id ? (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        className="w-20 px-2 py-1 text-sm border rounded focus:ring-accent focus:border-accent"
                                                        placeholder="Qty"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                    />
                                                    <button
                                                        onClick={() => handleRestock(product._id)}
                                                        disabled={loadingRestock}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => setRestockId(null)}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => { setRestockId(product._id); setAmount(''); }}
                                                    className="btn-outline py-1 px-3 text-xs flex items-center"
                                                >
                                                    <FaPlus className="mr-1" /> Restock
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryScreen;
