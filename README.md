# Shoefie - Premium E-Commerce Platform

Shoefie is a modern, high-performance shoe e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). It features a "Light Premium" design system, focusing on user experience, aesthetic appeal, and robust functionality.

![Shoefie Banner](https://via.placeholder.com/1200x400?text=Shoefie+Premium+Store)

## 🚀 Key Features

### User Experience (Customers)
-   **Premium UI/UX**: Clean, airy design with smooth transitions and glassmorphism effects.
-   **Product Discovery**: Advanced filtering, search with suggestions, and categorized browsing.
-   **Wishlist**: Save favorite items for later.
-   **Seamless Checkout**: Multi-step checkout process with **Stripe** integration and Cash on Delivery.
-   **Order Tracking**: Visual tracking timeline from "Ordered" to "Delivered".
-   **Email Notifications**: Automated emails for Order Confirmation, Shipping Updates, and Delivery.
-   **User Dashboard**: Manage profile, addresses, and view order history.

### Admin Dashboard
-   **Analytics**: View sales trends, total revenue, and user growth.
-   **Inventory Management**: Track stock levels, set low-stock thresholds, and restock products.
-   **Order Fulfillment**: Process orders (Confirm -> Pack -> Ship -> Deliver) and update tracking status.
-   **Product Management**: Create, edit, and delete products with image upload support.
-   **User Management**: View and manage customer accounts.

---

## 🛠 Tech Stack

-   **Frontend**: React.js (Vite), Redux Toolkit (State Management), Tailwind CSS (Styling), Framer Motion (Animations).
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose ODM).
-   **Authentication**: JWT (JSON Web Tokens).
-   **Payments**: Stripe (Integrated), PayPal (Configured), Razorpay option.
-   **Email**: Nodemailer (SMTP).
-   **Image Upload**: Cloudinary.

---

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v16+)
-   MongoDB (Local or Atlas URI)
-   Stripe Account (for payments)
-   Cloudinary Account (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/shoefie.git
cd shoefie
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Payment Gateways
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PAYPAL_CLIENT_ID=your_paypal_client_id

# Email Service (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FROM_EMAIL=noreply@shoefie.com
FROM_NAME=SHOEFIE
ADMIN_EMAIL=admin@shoefie.com

# Image Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Install Dependencies
**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Run the Application
**Development Mode (Concurrent):**
Open two terminals:

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`.

---

## 🧪 Testing

A comprehensive testing plan is available in [`TESTING_PLAN.md`](./TESTING_PLAN.md).
It covers Unit, Integration, API, and Security testing scenarios.

## 🎨 Design System

We follow a strict "Light Premium" design language. See [`frontend/DESIGN_SYSTEM.md`](./frontend/DESIGN_SYSTEM.md) for details on typography, colors, and components.

## 📄 License

This project is licensed under the MIT License.
