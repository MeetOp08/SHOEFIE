# SHOEFIE E-Commerce Platform

SHOEFIE is a full-stack e-commerce application for selling shoes, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

-   **User Authentication**: JWT based login/register.
-   **Product Management**: Admin can add, edit, delete products.
-   **Shopping Cart**: Add items, adjust quantity, checkout.
-   **Order Management**: Place orders, simulate payment (PayPal/Razorpay), track status.
-   **Admin Dashboard**: Manage users, products, and orders.
-   **Responsive Design**: Mobile-first UI with Tailwind CSS.

## Tech Stack

-   **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose).
-   **Payments**: PayPal (Simulated for Demo), Cash on Delivery.

## Setup Instructions

### Prerequisites
-   Node.js (v14+)
-   MongoDB Atlas URI or Local MongoDB

### 1. Clone the repository / Open folder
ensure you are in the root directory.

### 2. Install Dependencies

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

### 3. Environment Configuration

Create a `.env` file in the `backend` folder with the following:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 4. Data Seeding (Optional)

Populate the database with sample users and products:

```bash
# from root
cd backend
npm run seed
```

**Default Users:**
-   Admin: `admin@example.com` / `password123`
-   User: `john@example.com` / `password123`

### 5. Running the App

**Backend:**
```bash
cd backend
npm run dev
```
(Server runs on http://localhost:5000)

**Frontend:**
```bash
cd frontend
npm run dev
```
(Client runs on http://localhost:5173 or similar)

## Project Structure

-   `/backend`: API, Models, Controllers.
-   `/frontend`: React App (Pages, Components, Redux).

## License

MIT
