const addToCartModel = require("../models/cartProduct")

const EmptyCartController = async(req,res)=>{
    try{
        const currentUserId = req.userId 
        console.log(currentUserId)
        const deleteProduct = await addToCartModel.deleteMany({ userId:currentUserId})
        console.log(deleteProduct)
        res.json({
            message : "All Products Deleted From Cart",
            error : false,
            success : true,
            data : deleteProduct
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = EmptyCartController