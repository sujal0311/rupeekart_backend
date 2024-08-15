const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const Order = require("../models/OrderModel");
const UserModel = require("../models/userModels");
const { sendMail } = require("./helpers/sendMail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



exports.createOrder = async (req, res) => {
  const { amount, shippingAddress, productDetails } = req.body;
  const userId = req.userId;
  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save the order details in MongoDB
    const newOrder = new Order({
      orderId: order.id,
      userId: userId,
      receipt: order.receipt,
      amount: order.amount,
      currency: order.currency,
      status: "pending", // Initial status
      shippingAddress: shippingAddress,
      productDetails: productDetails,
    });

    await newOrder.save();

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {
    try {
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "paid" },
        { new: true }
      );

      const productDetailsHTML = updatedOrder.productDetails
        .map(
          (product) => `
        <tr>
          <td>${product.productName}</td>
          <td>${product.quantity}</td>
          <td>₹${product.price}</td>
        </tr>
      `
        )
        .join("");

      const emailHTML = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f8f8;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            font-size: 22px;
            margin-bottom: 15px;
            color: #4CAF50;
            font-weight: 500;
        }
        .content p {
            line-height: 1.6;
            margin-bottom: 10px;
        }
        .address-section, .order-section, .product-section {
            margin-bottom: 20px;
        }
        .product-details {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .product-details th, .product-details td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: left;
            font-size: 14px;
        }
        .product-details th {
            background-color: #f2f2f2;
            font-weight: 600;
        }
        .footer {
            background-color: #4CAF50;
            color: #fff;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            border-top: 1px solid #ddd;
        }
        .footer p {
            margin: 0;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
        </div>
        <div class="content">
            <h2>Thank you for your purchase, ${
              updatedOrder.shippingAddress.name
            }!</h2>
            <p>Your order has been successfully placed. Here are the details:</p>

            <div class="address-section">
                <h3>Shipping Address</h3>
                <p>Name: ${updatedOrder.shippingAddress.name}</p>
                <p>Address: ${updatedOrder.shippingAddress.address}</p>
                <p>City: ${updatedOrder.shippingAddress.city}, ${
        updatedOrder.shippingAddress.state
      }</p>
                <p>ZIP: ${updatedOrder.shippingAddress.zip}</p>
                <p>Country: ${updatedOrder.shippingAddress.country}</p>
                <p>Phone: ${updatedOrder.shippingAddress.phone}</p>
            </div>

            <div class="order-section">
                <h3>Order Details</h3>
                <p>Order ID: ${updatedOrder.orderId}</p>
                <p>Receipt: ${updatedOrder.receipt}</p>
                <p>Amount: ₹${(updatedOrder.amount / 100).toFixed(2)}</p>
                <p>Status: ${updatedOrder.status}</p>
            </div>

            <div class="product-section">
                <h3>Product Details</h3>
                <table class="product-details">
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                    ${productDetailsHTML}
                </table>
            </div>
        </div>
        <div class="footer">
            <p>Thank you for shopping with us!</p>
        </div>
    </div>
</body>
</html>
`;

const user = await UserModel.findById(req.userId );
const email = user.email;

      sendMail(
        email,
        "Order successfully booked",
        "Your order has been successfully placed",
        emailHTML
      );

      res.json({ success: true, order: updatedOrder });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.json({ success: false, message: "Payment verification failed" });
  }
};
