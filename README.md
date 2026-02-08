# Shoefie - Premium E-Commerce Platform

Shoefie is a modern, high-performance shoe e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). It features a "Light Premium" design system, focusing on user experience, aesthetic appeal, and robust functionality.

![Shoefie Banner](https://via.placeholder.com/1200x400?text=Shoefie+Premium+Store)

## 🚀 Key Features

### User Experience (Customers)
-   **Premium UI/UX**: clean, airy design with smooth transitions and glassmorphism effects.
-   **Product Discovery**: Advanced filtering, search with suggestions, and categorized browsing.
-   **Wishlist**: Save favorite items for later.
-   **Seamless Checkout**: Multi-step checkout process with simulated payment integration (Stripe/PayPal ready).
-   **Order Tracking**: Visual tracking timeline from "Ordered" to "Delivered".
-   **User Dashboard**: Manage profile, addresses, and view order history.

### Admin Dashboard
-   **Analytics**: View sales trends, total revenue, and user growth.
-   **Product Management**: Create, edit, and delete products with image upload support.
-   **Order Management**: Process orders (Pack, Ship, Deliver) and update tracking status.
-   **User Management**: View and manage customer accounts.
-   **Inventory Control**: Track stock levels and pricing.

---

## 🛠 Tech Stack

-   **Frontend**: React.js (Vite), Redux Toolkit (State Management), Tailwind CSS (Styling), Framer Motion (Animations).
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose ODM).
-   **Authentication**: JWT (JSON Web Tokens).
-   **Payments**: Razorpay / PayPal (Integration ready).

---

## 🎨 Design System

We follow a strict "Light Premium" design language documented in [`frontend/DESIGN_SYSTEM.md`](./frontend/DESIGN_SYSTEM.md).

-   **Colors**: Stone Gray backgrounds with Burnt Orange accents.
-   **Typography**: Poppins (Headings) & Inter (Body).
-   **Components**: Card-based architecture with consistent spacing and interactivity.

---

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v16+)
-   MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/shoefie.git
cd shoefie
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
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

Visit `http://localhost:5173` (or the port shown in your terminal).

## 📄 License

This project is licensed under the MIT License.
