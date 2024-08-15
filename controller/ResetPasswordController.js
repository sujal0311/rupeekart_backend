const UserModel = require('../models/userModels');
const ResetPasswordTokenModel = require('../models/resetPasswordTokenModel');
const bcrypt = require('bcrypt');

async function ResetPasswordController(req, res) {
  try {
    const { token, newPassword } = req.body;
    
    const resetToken = await ResetPasswordTokenModel.findOne({ token });
    
    if (!resetToken) {
      return res.status(400).json({ error: true, success: false, message: "Invalid or expired token" });
    }

    const user = await UserModel.findById(resetToken.user);
    console.log("User Found:", user);
    if (!user) {
      return res.status(400).json({ error: true, success: false, message: "User not found" });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    console.log("Password Updated Successfully");

    // Delete the token after successful password reset
    await ResetPasswordTokenModel.deleteOne({ _id: resetToken._id });
    console.log("Reset Token Deleted");

    return res.status(200).json({ error: false, success: true, message: "Password has been reset" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = ResetPasswordController;
