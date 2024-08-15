const mongoose=require('mongoose')

const productsSchema=mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage: [],
    description: String,
    price: Number,
    sellingPrice: Number,
},{ timestamps: true })

module.exports=mongoose.model('product',productsSchema)