import { useState } from 'react';
import { useGetInventoryQuery, useRestockProductMutation } from '../../slices/inventoryApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import StockBadge from '../../components/StockBadge';
import { toast } from 'react-toastify';
import { FaExclamationTriangle, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import '../../styles/admin/InventoryScreen.css';

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
        <div className="container-custom admin-inv-container">
            <h1 className="admin-inv-title">Inventory Management</h1>

            {lowStockCount > 0 && (
                <Message variant="warning" className="admin-inv-warning">
                    <FaExclamationTriangle className="admin-inv-warning-icon" />
                    Warning: {lowStockCount} products are low on stock!
                </Message>
            )}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <div className="admin-inv-card">
                    <div className="admin-inv-table-wrapper">
                        <table className="admin-inv-table">
                            <thead className="admin-inv-thead">
                                <tr>
                                    <th className="admin-inv-th">Product</th>
                                    <th className="admin-inv-th">Reference</th>
                                    <th className="admin-inv-th">Current Stock</th>
                                    <th className="admin-inv-th">Status</th>
                                    <th className="admin-inv-th">Threshold</th>
                                    <th className="admin-inv-th">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className={`admin-inv-tr ${product.countInStock <= product.lowStockThreshold ? 'low-stock' : ''}`}>
                                        <td className="admin-inv-td">
                                            <div className="admin-inv-product-flex">
                                                <div className="admin-inv-img-wrap">
                                                    <img className="admin-inv-img" src={product.image} alt="" />
                                                </div>
                                                <div className="admin-inv-product-info">
                                                    <div className="admin-inv-product-name">{product.name}</div>
                                                    <div className="admin-inv-product-brand">{product.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="admin-inv-td admin-inv-td-ref">{product._id.substring(0, 8)}...</td>
                                        <td className="admin-inv-td admin-inv-td-stock">{product.countInStock}</td>
                                        <td className="admin-inv-td">
                                            <StockBadge stock={product.countInStock} threshold={product.lowStockThreshold} />
                                        </td>
                                        <td className="admin-inv-td admin-inv-td-thresh">{product.lowStockThreshold}</td>
                                        <td className="admin-inv-td">
                                            {restockId === product._id ? (
                                                <div className="admin-inv-restock-inline">
                                                    <input
                                                        type="number"
                                                        className="admin-inv-restock-input"
                                                        placeholder="Qty"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                    />
                                                    <button
                                                        onClick={() => handleRestock(product._id)}
                                                        disabled={loadingRestock}
                                                        className="admin-inv-btn-confirm"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => setRestockId(null)}
                                                        className="admin-inv-btn-cancel"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => { setRestockId(product._id); setAmount(''); }}
                                                    className="btn-outline admin-inv-btn-trigger"
                                                >
                                                    <FaPlus className="admin-inv-btn-icon" /> Restock
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
