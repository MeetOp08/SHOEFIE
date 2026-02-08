import React from 'react';
import ReactDOM from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';
import './index.css';

// Admin Routes
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

// Screen imports
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import WishlistScreen from './screens/WishlistScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/admin/UserListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import CouponListScreen from './screens/admin/CouponListScreen';
import DashboardScreen from './screens/admin/DashboardScreen';
import CategoryListScreen from './screens/admin/CategoryListScreen';
import BrandListScreen from './screens/admin/BrandListScreen';
import ReviewListScreen from './screens/admin/ReviewListScreen';

import ProductCreateScreen from './screens/admin/ProductCreateScreen';
import LegalScreen from './screens/LegalScreen';
import Checkout from './screens/Checkout';
import OrderSuccess from './screens/OrderSuccess';
import OrderTrackingPage from './screens/OrderTrackingPage';
import InventoryScreen from './screens/admin/InventoryScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      {/* ... unchanged routes ... */}
      <Route path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/privacy' element={<LegalScreen title="Privacy Policy" />} />
      <Route path='/terms' element={<LegalScreen title="Terms & Conditions" />} />
      <Route path='/returns' element={<LegalScreen title="Return Policy" />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/wishlist' element={<WishlistScreen />} />
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/order-success/:id' element={<OrderSuccess />} />
        <Route path='/order-tracking/:id' element={<OrderTrackingPage />} />
      </Route>

      <Route path='' element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path='/admin/dashboard' element={<DashboardScreen />} />
          <Route path='/admin/inventory' element={<InventoryScreen />} />
          <Route path='/admin/orderlist' element={<OrderListScreen />} />
          <Route path='/admin/productlist' element={<ProductListScreen />} />
          <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />} />
          <Route path='/admin/product/create' element={<ProductCreateScreen />} />
          <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
          <Route path='/admin/userlist' element={<UserListScreen />} />
          <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
          <Route path='/admin/couponlist' element={<CouponListScreen />} />
          <Route path='/admin/categorylist' element={<CategoryListScreen />} />
          <Route path='/admin/brandlist' element={<BrandListScreen />} />
          <Route path='/admin/reviewlist' element={<ReviewListScreen />} />
        </Route>
      </Route>
    </Route>
  )
);

const initialOptions = {
  "client-id": "test",
  currency: "USD",
  intent: "capture",
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={initialOptions}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);
