const { json } = require('express');
const ProductModel=require('../models/productModel')

async function allProductController(req,res){
    try {
        const allProduct=await ProductModel.find().sort({createdAt:-1}) //sort from newest to oldest
        res.json({message:"All products fetched successfully",data:allProduct,success:true,error:false})

    } catch (error) {
        res.status(400).json({
            message:"Error fetching products",
            error:true,
            success:false,
        });
    }
}

module.exports=allProductController;