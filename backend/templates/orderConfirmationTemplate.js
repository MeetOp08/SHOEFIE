const orderConfirmationTemplate = (order) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #333;">SHOEFIE</h1>
        </div>
        <h2 style="color: #4CAF50;">Order Confirmed!</h2>
        <p>Hi ${order.shippingAddress.fullName},</p>
        <p>Thank you for your order. We have received your order and are processing it.</p>
        
        <h3>Order ID: ${order._id}</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: right;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
            ${order.orderItems.map(item => `
            <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px;">${item.name}</td>
                <td style="padding: 10px; text-align: right;">${item.qty}</td>
                <td style="padding: 10px; text-align: right;">$${item.price}</td>
            </tr>
            `).join('')}
        </table>
        
        <div style="margin-top: 20px; text-align: right;">
            <p><strong>Shipping:</strong> $${order.shippingPrice}</p>
            <p><strong>Tax:</strong> $${order.taxPrice}</p>
            <h3><strong>Total:</strong> $${order.totalPrice}</h3>
        </div>
        
        <div style="margin-top: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h3>Shipping Address:</h3>
            <p>${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
            <p>${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
            <p>Phone: ${order.shippingAddress.phone}</p>
        </div>
        
        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e0e0e0;" />
        
        <p style="text-align: center; font-size: 12px; color: #888;">
            Need help? Contact us at <a href="mailto:support@shoefie.com">support@shoefie.com</a>
        </p>
      </div>
    `;
};

module.exports = orderConfirmationTemplate;
