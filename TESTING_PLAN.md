# SHOEFIE Web Application - Testing Plan

## 1. Testing Plan Summary

**Project Name:** SHOEFIE (E-commerce Web Application)
**Tech Stack:** MERN (MongoDB, Express, React, Node.js)
**Testing Types:** Unit, Integration, System, User Interface, API, Security, Payment, Admin Panel.

This document outlines the testing strategy to ensure the SHOEFIE application is robust, secure, and user-friendly. The testing process covers end-to-end functionality from user registration to product delivery and inventory management.

---

## 2. User Side Test Cases

| Test Case ID | Feature Name | Test Steps | Expected Result | Actual Result |
|---|---|---|---|---|
| TC-USR-01 | User Registration | 1. Navigate to Register page<br>2. Fill in Name, Email, Password<br>3. Click Register | User account created and redirected to Home/Dashboard. | |
| TC-USR-02 | User Login | 1. Navigate to Login page<br>2. Enter valid Email & Password<br>3. Click Sign In | Login successful, JWT token stored, redirected to Home. | |
| TC-USR-03 | Add to Cart | 1. Go to Product Details page<br>2. Select Size & Quantity<br>3. Click "Add to Cart" | Item added to cart, cart count updates in header. | |
| TC-USR-04 | Remove from Cart | 1. Go to Cart page<br>2. Click "Remove" icon on an item | Item removed from cart list, total price updates. | |
| TC-USR-05 | Checkout Flow | 1. Go to Cart > Proceed to Checkout<br>2. Fill Shipping Address<br>3. Click Continue | Redirected to Payment selection page. | |
| TC-USR-06 | Stripe Payment Success | 1. Select "Pay with Stripe"<br>2. Enter valid test card details<br>3. Submit Payment | Payment processed, redirected to Order Success page. | |
| TC-USR-07 | Order Confirmation | 1. Complete payment<br>2. View Order Success page | Displays Order ID, "Paid" status, and order summary. | |
| TC-USR-08 | Order History | 1. Go to Profile > My Orders<br>2. Verify list of past orders | List of all user orders displayed correctly. | |
| TC-USR-09 | Email Notification | 1. Place an order<br>2. Check registered email inbox | "Order Confirmation" email received with correct details. | |
| TC-USR-10 | Tracking Status | 1. Go to Order Details<br>2. Click "Track Order" | Tracking page shows current status (e.g., "Shipped"). | |

---

## 3. Admin Side Test Cases

| Test Case ID | Feature Name | Test Steps | Expected Result | Actual Result |
|---|---|---|---|---|
| TC-ADM-01 | Admin Login | 1. Enter Admin credentials<br>2. Click Sign In | Redirected to Admin Dashboard with full access. | |
| TC-ADM-02 | Add Product | 1. Go to Products > Create Product<br>2. Fill details & Upload Image<br>3. Save | Product created and listed in Inventory. | |
| TC-ADM-03 | Edit Product | 1. Click "Edit" on a product<br>2. Change Price/Stock<br>3. Save | Product details updated in database and frontend. | |
| TC-ADM-04 | Delete Product | 1. Click "Delete" on a product<br>2. Confirm deletion | Product removed from list and database. | |
| TC-ADM-05 | View Orders | 1. Go to Order List<br>2. Verify all user orders | Table displays all orders with status and total amount. | |
| TC-ADM-06 | Update Order Status | 1. Open an Order<br>2. Mark as "Shipped"<br>3. Enter Tracking ID | Order status updates to "Shipped", user notified via email. | |
| TC-ADM-07 | View Users | 1. Go to User List<br>2. Verify registered users | List of all users displayed. | |
| TC-ADM-08 | Make Admin | 1. Select a User<br>2. Toggle "Is Admin" check<br>3. Save | User gains admin privileges. | |
| TC-ADM-09 | Inventory Restock | 1. Go to Inventory<br>2. Click "Restock" on low stock item<br>3. Add quantity | Stock count increases, "Low Stock" warning disappears. | |
| TC-ADM-10 | Low Stock Alert | 1. Reduce stock below threshold<br>2. Check Dashboard | Low stock warning/badge displayed for that product. | |

---

## 4. API Testing Checklist

| Method | Endpoint URL | Description | Expected Code |
|---|---|---|---|
| **Auth APIs** | | | |
| POST | `/api/users/login` | Authenticate user & get token | 200 OK |
| POST | `/api/users` | Register a new user | 201 Created |
| **Product APIs** | | | |
| GET | `/api/products` | Fetch all products | 200 OK |
| GET | `/api/products/:id` | Fetch single product details | 200 OK |
| POST | `/api/products` | Create a product (Admin) | 201 Created |
| PUT | `/api/products/:id` | Update a product (Admin) | 200 OK |
| **Order APIs** | | | |
| POST | `/api/orders` | Create a new order | 201 Created |
| GET | `/api/orders/myorders` | Get logged-in user's orders | 200 OK |
| PUT | `/api/orders/:id/pay` | Update order to paid | 200 OK |
| PUT | `/api/orders/:id/ship` | Update order to shipped (Admin) | 200 OK |
| **Payment APIs** | | | |
| POST | `/api/payment/create-checkout-session` | Create Stripe session | 200 OK |
| **Inventory APIs** | | | |
| GET | `/api/inventory` | Get all inventory status (Admin) | 200 OK |
| PUT | `/api/inventory/restock/:id` | Restock specific product (Admin) | 200 OK |

---

## 5. Payment Testing Scenarios

1.  **Successful Stripe Payment:**
    *   **Input:** Valid Stripe test card (e.g., 4242 4242...).
    *   **Expected:** Transaction approved, backend receives success, Order `isPaid` becomes `true`.

2.  **Cancelled Payment:**
    *   **Input:** User cancels on Stripe checkout page.
    *   **Expected:** Redirect back to Order page, Order remains `Not Paid`.

3.  **Webhook Verification:**
    *   **Input:** Simulate `checkout.session.completed` event via Stripe CLI.
    *   **Expected:** Backend validates signature, updates Order status asynchronously.

4.  **Stock Reduction:**
    *   **Input:** Successfully pay for an item with Stock = 5 (Qty = 1).
    *   **Expected:** Stock becomes 4 immediately after payment confirmation.

---

## 6. Security Testing Checklist

*   [ ] **Admin Route Protection:** Verify non-admin users cannot access `/admin/*` routes (Should verify 401 Unauthorized or Redirect).
*   [ ] **JWT Validation:** Ensure Expired or Invalid tokens are rejected by middleware.
*   [ ] **Input Sanitization:** Check for NoSQL injection on login inputs (e.g., `{"$gt": ""}`).
*   [ ] **Secure Headers:** Verify security headers (Helmet) are active on backend responses.
*   [ ] **Environment Variables:** Ensure sensitive keys (Stripe Secret, JWT Secret) are not exposed in frontend bundles.

---

## 7. UI/UX Testing Checklist

*   [ ] **Responsiveness:** Verify layout on Mobile (375px), Tablet (768px), and Desktop (1024px+).
*   [ ] **Form Validation:** Ensure empty fields trigger required validation messages on Register/Login/Shipping forms.
*   [ ] **Loading States:** Verify loaders appear during API calls (e.g., "Loading products...", "Processing payment...").
*   [ ] **Error Handling:** Verify user-friendly error messages (e.g. "Invalid Email or Password") instead of raw JSON errors.
*   [ ] **Navigation:** Check all Header and Footer links are functional and route correctly.

---

This document serves as the formal Testing Plan for the SHOEFIE project.
