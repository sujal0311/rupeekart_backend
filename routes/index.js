const express = require("express");

const router = express.Router();

const UserSignupController = require("../controller/UserSignup");
const UserSigninController = require("../controller/UserSignin");
const userDetailsController = require("../controller/UserDetails");
const userLogout = require("../controller/UserLogout");
const authToken = require("../middleware/authToken");
const allUsers = require("../controller/allUsers");
const updateUser = require("../controller/updateUser");
const uploadProduct = require("../controller/uploadProduct");
const allproducts = require("../controller/allProducts");
const updateProductController = require("../controller/updateProduct");
const getCategoryProductOne = require("../controller/getCategoryProductOne");
const getCategoryWiseProduct = require("../controller/getCategoryWiseProduct");
const getProductDetailsController = require("../controller/getProductDetails");
const searchProduct = require('../controller/searchProduct');
const filterProductController = require('../controller/filterProduct');

const addToCartController = require('../controller/addToCartController');
const countAddToCartProduct = require('../controller/countAddToCartProduct');
const addToCartViewProduct = require('../controller/addToCartViewProduct');
const updateAddToCartProduct = require('../controller/updateAddToCartProduct');
const deleteAddToCartProduct = require('../controller/deleteAddToCartProduct');
const EmptyCartController=require("../controller/EmptyCartController")
const ForgotPasswordController = require('../controller/ForgotPasswordController');
const ResetPasswordController = require('../controller/ResetPasswordController');
const MyOrdersController=require('../controller/MyOrdersController')
// Razorpay Controllers
const UserOrdersController=require("../controller/UserOrdersController")
const razorpayController = require('../controller/razorpayController');
const SingleOrderController=require('../controller/SingleOrderController')
const sendNotificationController=require("../controller/sendNotificationController")
const getNotificationController=require("../controller/getNotificationController")
const countNotifications=require("../controller/countNotifications")
const UpdateOrderStatusController=require("../controller/UpdateOrderStatusController")
const DeleteOrderController=require("../controller/DeleteOrderController")
const createInvoiceController=require("../controller/createInvoiceController")
const { createTicket, getUserTickets, getAllTickets ,updateTicketStatus} = require("../controller/TicketController")
// User Authentication
router.post("/signup", UserSignupController);
router.post("/signin", UserSigninController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userlogout", userLogout);
router.post("/forgot-password", ForgotPasswordController);
router.post('/reset-password', ResetPasswordController);

// Admin Panel
router.get("/all-users", allUsers);
router.post("/update-user", updateUser);

// Products
router.post("/upload-product", uploadProduct);
router.get("/get-product", allproducts);
router.post("/update-product", updateProductController);
router.get("/get-categoryProduct", getCategoryProductOne);
router.post("/category-product", getCategoryWiseProduct);
router.post("/product-details", getProductDetailsController);
router.get("/search", searchProduct);
router.post("/filter-product", filterProductController);
router.get("/my-orders",authToken,MyOrdersController.getUserOrders)
router.post("/get-order",SingleOrderController.getSingleOrder)
router.get("/all-orders",UserOrdersController)
router.post("/delete-order",DeleteOrderController)

// User Add to Cart
router.post("/addtocart", authToken, addToCartController);
router.get("/countAddToCartProduct", authToken, countAddToCartProduct);
router.get("/view-card-product", authToken, addToCartViewProduct);
router.post("/update-cart-product", authToken, updateAddToCartProduct);
router.post("/delete-cart-product", authToken, deleteAddToCartProduct);
router.post("/empty-cart-products", authToken, EmptyCartController);

// Razorpay Payment Routes
router.post("/create-order", authToken,razorpayController.createOrder);
router.post("/verify-payment",authToken, razorpayController.verifyPayment);
router.post("/update-order-status",UpdateOrderStatusController)
// notifications
router.post("/send-notification",sendNotificationController)
router.get("/get-notification",getNotificationController)
router.get("/count-notifications", countNotifications);
// create invoice
router.post("/generate-invoice", createInvoiceController);
// tickets
router.post('/tickets', authToken, createTicket);
router.get('/tickets', authToken, getUserTickets);
// admin ticket
router.get('/admin/tickets', getAllTickets);
router.post('/admin/updateTicketStatus', updateTicketStatus);

module.exports = router;
