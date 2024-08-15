const productModel = require("../models/productModel");

const getCategoryProduct = async (req, res) => {
    try {
        const productCategories = await productModel.distinct("category");
        console.log(productCategories);

        // Using Promise.all to fetch one product per category concurrently
        const productByCategory = await Promise.all(
            productCategories.map(category => 
                productModel.findOne({ category }).lean().exec()
            )
        );

        // Filter out any null values (in case no product is found for a category)
        const filteredProductByCategory = productByCategory.filter(product => product !== null);

        res.json({
            message: "Category products fetched successfully",
            data: filteredProductByCategory,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getCategoryProduct;
