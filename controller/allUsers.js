const userModel=require('../models/userModels')
async function allUsers(req,res){
    try{
        const allUsers=await userModel.find();
        return res.status(200).json({message: "All users fetch successfully", data: allUsers ,success:true,error:false});
    }catch(error){
        return res.status(500).json({ message: error.message ,error:true});
    }
}
module.exports=allUsers;