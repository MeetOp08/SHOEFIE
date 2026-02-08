const deliveryConfirmationTemplate = (order) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #333;">SHOEFIE</h1>
        </div>
        <h2 style="color: #4CAF50;">Delivered!</h2>
        <p>Hi ${order.shippingAddress.fullName},</p>
        <p>Your package has been delivered to:</p>
        
        <h3>${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}</h3>
        
        <p>We hope you love your new shoes!</p>
        
        <p>If you have any issues, please check our Returns Policy or contact us.</p>
        
        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e0e0e0;" />
        
        <p style="text-align: center; font-size: 12px; color: #888;">
            Need help? Contact us at <a href="mailto:support@shoefie.com">support@shoefie.com</a>
        </p>
      </div>
    `;
};

module.exports = deliveryConfirmationTemplate;
