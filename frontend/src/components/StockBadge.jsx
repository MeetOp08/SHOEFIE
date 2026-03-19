import React from 'react';
import '../styles/StockBadge.css';

const StockBadge = ({ stock, threshold = 5 }) => {
    if (stock <= 0) {
        return (
            <span className="stock-badge stock-badge-out">
                Out of Stock
            </span>
        );
    } else if (stock <= threshold) {
        return (
            <span className="stock-badge stock-badge-low">
                Low Stock ({stock} left)
            </span>
        );
    } else {
        return (
            <span className="stock-badge stock-badge-in">
                In Stock ({stock})
            </span>
        );
    }
};

export default StockBadge;
