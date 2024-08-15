const productModel=require('../models/productModel')
async function uploadProductController(req, res) {
    try {
        const product= new productModel(req.body) 
        const savedProduct=await product.save()
        res.status(201).json({message:"Product uploaded successfully",error:false,success:true,data:savedProduct});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Some error has occured',error:true, success:false });
    }
}
module.exports = uploadProductController;