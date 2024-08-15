const User=require('../models/userModels');
const bcrypt = require('bcrypt');
const { sendMail } = require('./helpers/sendMail');
async function UserSignupController(req,res){
    try {
        console.log(req.body);
        const { email, password,name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        if(!email || !password || !name){
            return res.status(400).json({error:"Please provide all fields"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if(!hashedPassword){
            return res.status(500).json({error:"Error in hashing password"});
        }
        const payload={
            ...req.body,role:"General",
            password:hashedPassword,
        }
        const user = new User(payload);
        const saveUser = await user.save();
        sendMail(email,"Welcome to Rupeekart", `Hi ${name} Thank you for registering with us.`,`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Rupeekart</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            text-align: center;
            line-height: 1.6;
        }
        .content h1 {
            color: #4CAF50;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://github.com/sujal0311/temp/blob/main/OIG4.z91PgW.jpeg?raw=true" alt="Rupeekart Logo">
        </div>
        <div class="content">
            <h1>Welcome to Rupeekart!</h1>
            <p>Hi ${name},</p>
            <p>Thank you for signing up with Rupeekart. We're excited to have you on board.</p>
            <p>Start exploring the best deals and offers tailored just for you.</p>
            <a href="http://localhost:5173" class="button">Explore Now</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 Rupeekart. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`)
        res.status(201).json({
            message:"User created successfully",
            user:saveUser,
            error:false,
            success:true,
        })}
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports=UserSignupController;