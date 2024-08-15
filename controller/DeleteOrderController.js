const Order = require("../models/OrderModel");

async function DeleteOrderController(req, res) {
  try {
    const { orderId } = req.body;
    console.log(orderId);
    // Find the order by ID and update its status
    const updatedOrder = await Order.findOneAndDelete({ _id: orderId });

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }
    console.log("deleted order", updatedOrder);
    res.json({
      message: "Order Deleted",
      data: updatedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error deleting order", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while deleting the order ",
    });
  }
}

module.exports = DeleteOrderController;
