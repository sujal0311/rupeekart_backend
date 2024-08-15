async function userLogout(req,res){
    try{
        res.clearCookie('token')
        res.status(200).json({success:true,message: 'Logout successful',error:false})
    }catch(err){
        res.status(500).json({message: err.message})
    }
    
}
module.exports = userLogout