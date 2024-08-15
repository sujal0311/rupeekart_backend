const User=require('../models/userModels')
async function userDetailsController(req,res){
    try{
        const user = await User.findById(req.userId)
        res.status(200).send({
            success:true,
            message:"User Details Fetched Successfully",
            data:user
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in fetching user details",
            error
        })
    }
}

module.exports = userDetailsController