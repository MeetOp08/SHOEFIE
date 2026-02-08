const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');


dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Security Headers
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Production Setup
// Production Setup
const rootDir = path.resolve();
const environment = (process.env.NODE_ENV || 'development').trim();

if (environment === 'production') {
    app.use(express.static(path.join(rootDir, '/frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(rootDir, 'frontend', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send(`API is running... (Environment: ${environment})`);
    });
}

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const couponRoutes = require('./routes/couponRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ... (previous code)

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
);

app.get('/api/config/razorpay', (req, res) =>
    res.send({ keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890' })
);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log('Server ready for logout verification');
});

