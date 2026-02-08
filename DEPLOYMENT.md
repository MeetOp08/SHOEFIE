# Shoefie Deployment Guide

This guide details how to deploy the Shoefie MERN application to production. The recommended approach is a **Split Deployment**: Frontend on **Vercel** (for speed) and Backend on **Render** (for free tier Node.js hosting).

---

## 🚀 Phase 1: Backend Deployment (Render)

1.  **Push Code to GitHub**: Ensure your project is in a GitHub repository.
2.  **Sign Up/Login**: Go to [Render.com](https://render.com).
3.  **New Web Service**: Click **New +** > **Web Service**.
4.  **Connect Repo**: Select your `shoefie` repository.
5.  **Configuration**:
    *   **Name**: `shoefie-api`
    *   **Region**: Closest to you (e.g., Singapore/Frankfurt/Oregon).
    *   **Branch**: `main`
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
6.  **Environment Variables**:
    Add the following in the **Environment** tab:
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: `mongodb+srv://...` (Your Atlas Connection String)
    *   `JWT_SECRET`: `(Generate a strong random string)`
    *   `STRIPE_SECRET_KEY`: `(Your Stripe Secret Key)`
    *   `STRIPE_WEBHOOK_SECRET`: `(Your Stripe Webhook Secret)`
    *   `EMAIL_HOST`: `smtp.gmail.com`
    *   `EMAIL_USER`: `(Your Email)`
    *   `EMAIL_PASS`: `(Your App Password)`
    *   `CLOUDINARY_...`: `(Your Cloudinary Keys)`
7.  **Create Service**: Click **Create Web Service**.
    *   *Note*: Render's free tier spins down after inactivity. The first request might take 30-50s.

**Copy your Backend URL**: e.g., `https://shoefie-api.onrender.com`.

---

## 🌐 Phase 2: Frontend Deployment (Vercel)

1.  **Sign Up/Login**: Go to [Vercel.com](https://vercel.com).
2.  **Add New Project**: Import your `shoefie` repository.
3.  **Project Configuration**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: Click `Edit` and select `frontend`.
4.  **Environment Variables**:
    *   `VITE_API_URL`: Paste your Render Backend URL (e.g., `https://shoefie-api.onrender.com`).
        *   *Note*: Ensure your frontend code uses `import.meta.env.VITE_API_URL` for API calls instead of hardcoded `localhost`.
5.  **Deploy**: Click **Deploy**.

Vercel will build your React app and provide a live URL (e.g., `https://shoefie.vercel.app`).

---

## 🛠 Phase 3: Final Configuration

1.  **Update Stripe Webhook**:
    *   Go to Stripe Dashboard > Developers > Webhooks.
    *   Add Endpoint: `https://shoefie-api.onrender.com/api/payment/webhook`.
    *   Select event: `checkout.session.completed`.

2.  **Update MongoDB Access**:
    *   Go to MongoDB Atlas > Network Access.
    *   Ensure `0.0.0.0/0` (Allow Access from Anywhere) is whitelisted so Render can connect.

3.  **Verify Admin Access**:
    *   Visit your Vercel URL.
    *   Login with Admin credentials to verify database connection.

---

## 🐛 Troubleshooting

*   **CORS Errors**: If frontend cannot talk to backend, ensure your backend `server.js` allows the Vercel domain in `cors` origin.
    ```javascript
    app.use(cors({
        origin: ['http://localhost:5173', 'https://shoefie.vercel.app'],
        credentials: true
    }));
    ```
*   **Images Not Loading**: Ensuring Cloudinary is configured correctly. Local uploads will disappear on Render.

You are now live! 🚀
