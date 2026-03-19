import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetOrderAnalyticsQuery } from '../../slices/ordersApiSlice';
import { FaChartLine, FaShoppingBag, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import '../../styles/admin/DashboardScreen.css';

const DashboardScreen = () => {
    const { data: analytics, isLoading, error } = useGetOrderAnalyticsQuery();

    return (
        <div className="container-custom admin-dashboard-container">
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="admin-stats-grid">
                        {/* Total Sales */}
                        <div className="admin-stat-card sales">
                            <div>
                                <p className="admin-stat-label">Total Revenue</p>
                                <p className="admin-stat-value">${analytics.totalSales}</p>
                            </div>
                            <div className="admin-stat-icon-wrap sales">
                                <FaMoneyBillWave />
                            </div>
                        </div>

                        {/* Total Orders */}
                        <div className="admin-stat-card orders">
                            <div>
                                <p className="admin-stat-label">Total Orders</p>
                                <p className="admin-stat-value">{analytics.totalOrders}</p>
                            </div>
                            <div className="admin-stat-icon-wrap orders">
                                <FaShoppingBag />
                            </div>
                        </div>

                        {/* Total Users */}
                        <div className="admin-stat-card users">
                            <div>
                                <p className="admin-stat-label">Total Users</p>
                                <p className="admin-stat-value">{analytics.totalUsers}</p>
                            </div>
                            <div className="admin-stat-icon-wrap users">
                                <FaUsers />
                            </div>
                        </div>
                    </div>

                    {/* Sales Chart Section (Simple Bar Visual) */}
                    <div className="admin-chart-section">
                        <div className="admin-chart-header">
                            <h2 className="admin-chart-title">Sales Overview (Last 7 Days)</h2>
                            <FaChartLine className="admin-chart-header-icon" />
                        </div>

                        {analytics.dailySales.length === 0 ? (
                            <div className="admin-chart-empty">No sales data for the last 7 days</div>
                        ) : (
                            <div className="admin-chart-bars">
                                {(() => {
                                    const maxSales = Math.max(...analytics.dailySales.map(d => d.sales));
                                    return analytics.dailySales.map((item) => {
                                        const heightPercent = maxSales > 0 ? (item.sales / maxSales) * 100 : 0;
                                        return (
                                            <div key={item._id} className="admin-chart-bar-container">
                                                <div className="admin-chart-bar-wrap">
                                                    <div
                                                        className="admin-chart-bar-inner"
                                                        style={{ height: `${heightPercent}%` }}
                                                    ></div>
                                                    <div className="admin-chart-bar-tooltip">
                                                        ${item.sales}
                                                    </div>
                                                </div>
                                                <div className="admin-chart-bar-date">{item._id.substring(5)}</div>
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
