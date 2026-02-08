const paymentSuccessTemplate = (order) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #333;">SHOEFIE</h1>
        </div>
        <h2 style="color: #66bb6a;">Payment Successful!</h2>
        <p>Hi ${order.shippingAddress.fullName},</p>
        <p>Thank you for your payment!</p>
        
        <h3>Order ID: ${order._id}</h3>
        <p><strong>Payment Status:</strong> Paid</p>
        <p><strong>Amount Paid:</strong> $${order.totalPrice}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Transaction ID:</strong> ${order.paymentResult?.id || 'N/A'}</p>
        
        <p>We will notify you once your order is shipped.</p>
        
        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e0e0e0;" />
        
        <p style="text-align: center; font-size: 12px; color: #888;">
            Need help? Contact us at <a href="mailto:support@shoefie.com">support@shoefie.com</a>
        </p>
      </div>
    `;
};

module.exports = paymentSuccessTemplate;
