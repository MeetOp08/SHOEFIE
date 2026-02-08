const shippingUpdateTemplate = (order) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #333;">SHOEFIE</h1>
        </div>
        <h2 style="color: #2196F3;">Your Order Has Shipped!</h2>
        <p>Good news, ${order.shippingAddress.fullName}!</p>
        <p>Your order and exciting new shoes are on their way to you.</p>
        
        <h3>Tracking Information:</h3>
        <p><strong>Tracking Number:</strong> ${order.trackingId}</p>
        <p><strong>Carrier:</strong> ${order.deliveryPartner}</p>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}</p>
            <p><a href="https://www.google.com/search?q=${order.deliveryPartner}+tracking+${order.trackingId}" style="display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Track Your Package</a></p>
        </div>
        
        <h3>Order Items:</h3>
        <ul>
            ${order.orderItems.map(item => `<li>${item.name} x ${item.qty}</li>`).join('')}
        </ul>
        
        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e0e0e0;" />
        
        <p style="text-align: center; font-size: 12px; color: #888;">
            Need help? Contact us at <a href="mailto:support@shoefie.com">support@shoefie.com</a>
        </p>
      </div>
    `;
};

module.exports = shippingUpdateTemplate;
