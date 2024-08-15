const productModel = require("../models/productModel");

const filterProductController = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];
    const brandList = req?.body?.brands || [];
    const minPrice = req?.body?.minPrice || {}; 
    const maxPrice=req?.body?.maxPrice || {};
    const query = {};

    // Filter by category if provided
    if (categoryList.length > 0) {
      query.category = { "$in": categoryList };
    }

    // Filter by brand if provided
    if (brandList.length > 0) {
      query.brandName = { "$in": brandList };
    }

    // Filter by price range if provided
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.sellingPrice = { 
        "$gte": minPrice, 
        "$lte": maxPrice
      };
    }

    // Fetch all matching products without pagination
    const products = await productModel.find(query);

    res.json({
      data: products,
      message: "Products retrieved successfully",
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = filterProductController;
