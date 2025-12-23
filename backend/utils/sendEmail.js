const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if SMTP credentials are provided
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log('----------------------------------------------------');
        console.log('🚧 WARNING: SMTP Credentials missing in .env');
        console.log('📧 SIMULATING EMAIL SENDING:');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message.substring(0, 50)}...`);
        console.log('----------------------------------------------------');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail', // Default to gmail
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME || 'SHOEFIE Support'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;
