const easyinvoice = require("easyinvoice");
const Order = require("../models/OrderModel");
require("dotenv").config();
async function createInvoiceController(req, res) {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    var data = {
      apiKey: process.env.INVOICE_API_KEY,
      
      images: {
        logo: "https://github.com/sujal0311/temp/blob/main/OIG4.z91PgW.jpeg?raw=true",
        
      },
      // Your own data
      sender: {
        company: "Rupeekart",
        email: "rupeekart2024@gmail.com"
      },
      // Your recipient
      client: {
        company: order.shippingAddress.name,
        address: order.shippingAddress.address,
        zip: order.shippingAddress.zip,
        city: order.shippingAddress.city,
        country: order.shippingAddress.country,
        custom1: order.shippingAddress.phone,
      },
      information: {
        // Invoice number
        number:order.orderId,
        // Invoice date
        date: new Date(order.createdAt).toLocaleDateString(),
      },
      
      // The products you would like to see on your invoice
      products: order.productDetails.map((product) => ({
        quantity: product.quantity,
        description: product.productName,
        taxRate: 0,
        price: product.price ,
      })),
      // The message you would like to display on the bottom of your invoice
      bottomNotice: "Thank you for your order!",
      // Settings to customize your invoice
      settings: {
        currency: order.currency || "INR", // Defaults to INR
        marginTop: 25, // Defaults to '25'
        marginRight: 25, // Defaults to '25'
        marginLeft: 25, // Defaults to '25'
        marginBottom: 25, // Defaults to '25'
        format: "A4", // Defaults to A4
      },
    };

    // Create your invoice! Easy!
    const invoice = await easyinvoice.createInvoice(data);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${orderId}.pdf`
    );
    // console.log(invoice.pdf)
    res.json({
        success: true,
        pdf: invoice.pdf,
      });
  } catch (err) {
    res.status(500).json({
      message: err.message || "An unexpected error occurred",
      error: true,
      success: false,
    });
  }
}

module.exports = createInvoiceController;
