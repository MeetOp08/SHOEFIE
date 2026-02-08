import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetOrderAnalyticsQuery } from '../../slices/ordersApiSlice';
import { FaChartLine, FaShoppingBag, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const DashboardScreen = () => {
    const { data: analytics, isLoading, error } = useGetOrderAnalyticsQuery();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold text-text-main mb-8">Admin Dashboard</h1>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Total Sales */}
                        <div className="bg-white rounded-xl shadow-sm border border-border-color p-6 border-l-4 border-l-green-500 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-text-muted text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
                                <p className="text-3xl font-bold text-text-main mt-1">${analytics.totalSales}</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-full text-green-600 text-2xl">
                                <FaMoneyBillWave />
                            </div>
                        </div>

                        {/* Total Orders */}
                        <div className="bg-white rounded-xl shadow-sm border border-border-color p-6 border-l-4 border-l-accent flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-text-muted text-sm font-semibold uppercase tracking-wider">Total Orders</p>
                                <p className="text-3xl font-bold text-text-main mt-1">{analytics.totalOrders}</p>
                            </div>
                            <div className="bg-orange-100 p-4 rounded-full text-accent text-2xl">
                                <FaShoppingBag />
                            </div>
                        </div>

                        {/* Total Users */}
                        <div className="bg-white rounded-xl shadow-sm border border-border-color p-6 border-l-4 border-l-blue-500 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-text-muted text-sm font-semibold uppercase tracking-wider">Total Users</p>
                                <p className="text-3xl font-bold text-text-main mt-1">{analytics.totalUsers}</p>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-full text-blue-600 text-2xl">
                                <FaUsers />
                            </div>
                        </div>
                    </div>

                    {/* Sales Chart Section (Simple Bar Visual) */}
                    <div className="bg-white rounded-xl shadow-sm border border-border-color p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-text-main">Sales Overview (Last 7 Days)</h2>
                            <FaChartLine className="text-text-muted text-xl" />
                        </div>

                        {analytics.dailySales.length === 0 ? (
                            <div className="text-center text-text-muted py-12">No sales data for the last 7 days</div>
                        ) : (
                            <div className="h-64 flex items-end space-x-4">
                                {(() => {
                                    const maxSales = Math.max(...analytics.dailySales.map(d => d.sales));
                                    return analytics.dailySales.map((item) => {
                                        const heightPercent = maxSales > 0 ? (item.sales / maxSales) * 100 : 0;
                                        return (
                                            <div key={item._id} className="flex-1 flex flex-col items-center group">
                                                <div className="relative w-full flex justify-center items-end h-full">
                                                    <div
                                                        className="w-full bg-accent/20 hover:bg-accent rounded-t transition-all duration-300 relative group-hover:scale-y-105 origin-bottom"
                                                        style={{ height: `${heightPercent}%` }}
                                                    ></div>
                                                    <div className="absolute -top-8 text-xs text-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                        ${item.sales}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-text-muted mt-2 font-mono">{item._id.substring(5)}</div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardScreen;
