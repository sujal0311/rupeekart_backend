const Order = require('../models/OrderModel');

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId)
    // Fetch orders from the database for the logged-in user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Sort by newest first
    console.log("orders",orders)
    if (orders.length > 0) {
      res.json({
        success: true,
        orders,
      });
    } else {
      res.json({
        success: false,
        message: 'No orders found for this user',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching orders',
    });
  }
};
