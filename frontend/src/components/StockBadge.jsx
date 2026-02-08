import React from 'react';

const StockBadge = ({ stock, threshold = 5 }) => {
    if (stock <= 0) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
            </span>
        );
    } else if (stock <= threshold) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">
                Low Stock ({stock} left)
            </span>
        );
    } else {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock ({stock})
            </span>
        );
    }
};

export default StockBadge;
