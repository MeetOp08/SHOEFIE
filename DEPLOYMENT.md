# Shoefie Deployment Guide

This guide details how to deploy the Shoefie MERN application to production using **Render** (easiest for full-stack) or **Vercel + Render** (Backend/Frontend split).

## Method 1: Single Service Deployment (Recommended for simplicity)

Deploy both the Frontend and Backend as a single service on **Render**.

1.  **Push your code to GitHub**.
2.  Login to [Render.com](https://render.com).
3.  Click **New +** and select **Web Service**.
4.  Connect your GitHub repository.
5.  Configure the service:
    *   **Name**: `shoefie-app`
    *   **Environment**: `Node`
    *   **Build Command**: `npm run build`
        *   *(This runs the root `build` script which installs verified deps and builds the React frontend)*
    *   **Start Command**: `npm start`
6.  **Environment Variables** (Add these in the "Environment" tab):
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: (Your MongoDB Atlas Connection String)
    *   `JWT_SECRET`: (A random strong string)
    *   `PAYPAL_CLIENT_ID`: (Optional for demo)
    *   `CLOUDINARY_...`: (Your Cloudinary credentials for images)
7.  **Click Create Web Service**.

Render will now build your frontend, start your backend, and serve the frontend via the backend's static file serving logic.

---

## Method 2: Split Deployment (Frontend Vercel / Backend Render)

If you prefer to host the frontend separately on Vercel for better edge performance.

### 1. Backend (Render)
1.  Create a **Web Service** on Render connected to your repo.
2.  **Root Directory**: `backend`
3.  **Build Command**: `npm install`
4.  **Start Command**: `node server.js`
5.  **Environment Variables**: Same as above.

### 2. Frontend (Vercel)
1.  Login to [Vercel](https://vercel.com).
2.  Import your GitHub repository.
3.  **Root Directory**: `frontend`
4.  **Build Command**: `vite build` (Default)
5.  **Output Directory**: `dist` (Default)
6.  **Environment Variables**:
    *   `VITE_API_URL`: (The URL of your deployed Render Backend, e.g., `https://shoefie-backend.onrender.com`)
    *   *Note*: You need to update your frontend API calls to use this variable instead of proxying to localhost.

---

## Post-Deployment Checklist
1.  **Database**: Ensure your IP whitelist on MongoDB Atlas includes `0.0.0.0/0` (Allow Access from Anywhere) or the specific IP of your hosting provider.
2.  **Admin User**: If you seeded data, log in with `admin@example.com` / `password123`.
3.  **Images**: If using local uploads, they will **disappear** on free tier hosting (ephemeral file systems). *Strongly recommended* to configure Cloudinary in `.env` for persistent image storage.
