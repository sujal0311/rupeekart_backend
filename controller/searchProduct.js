const productModel = require("../models/productModel");

const searchProduct = async (req, res) => {
    try {
        const query = req.query.q;
        console.log(query);
        const products = await productModel.find({
            "$or": [
                { productName: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        console.log(products);
        res.status(200).json({
            data: products,
            message: "Search Product list",
            error: false,
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "An unexpected error occurred",
            error: true,
            success: false
        });
    }
};

module.exports = searchProduct;
