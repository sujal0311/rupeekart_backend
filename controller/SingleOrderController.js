const Order = require('../models/OrderModel');

exports.getSingleOrder = async (req, res) => {
  try {
    const {orderId}=req.body
    console.log(orderId)
    const order = await Order.find({ orderId })
    console.log("order",order)
      res.json({
        success: true,
        order,
      });
    }
  catch (error) {
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching orders',
    });
  }
};
