const Order = require("../models/OrderModel");

async function UpdateOrderStatusController(req, res) {
  try {
    const { orderId, status } = req.body;

    // Find the order by ID and update its status
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { status },
      { new: true }  // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    res.json({
      message: "Status Updated",
      data: updatedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while updating the order status",
    });
  }
}

module.exports = UpdateOrderStatusController;
