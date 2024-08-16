const Order = require('../models/OrderModel');

async function UserOrdersController(req,res){
    try{
    const orders = await Order.find().sort({createdAt:-1})
    // console.log("orders",orders)
      res.json({
        success: true,
        orders,
      });
    }
    catch{
        res.status(500).json({
            success: false,
            error: 'An error occurred while fetching orders',
          });
    }
}
module.exports=UserOrdersController