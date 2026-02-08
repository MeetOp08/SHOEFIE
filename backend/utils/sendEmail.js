const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your preferred service
        auth: {
            user: process.env.EMAIL_USERNAME, // Set these in your .env
            pass: process.env.EMAIL_PASSWORD, // App Password for Gmail
        },
    });

    // 2. Define Email Options
    const mailOptions = {
        from: `Shoefie Support <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // 3. Send Email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
