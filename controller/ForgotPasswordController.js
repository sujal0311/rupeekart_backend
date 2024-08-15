const UserModel = require("../models/userModels");
const ResetPasswordTokenModel = require("../models/resetPasswordTokenModel");
const { v4: uuid } = require("uuid");
const { sendMail } = require("./helpers/sendMail");
require("dotenv").config();

async function ForgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ error: true, success: false, message: "User not found" });
    }

    const token = await ResetPasswordTokenModel.create({
      user: user._id,
      token: uuid(),
    });

    const url = `${process.env.FRONTEND_URL}/forgot-password/${token.token}`;
    console.log("Reset password URL:", url);

    sendMail(
      email,
      "Reset Password",
      `Click on the link to reset your password: ${url}`,
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
           font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 600px;
            margin: auto;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
             color: #4CAF50;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            color: #555555;
        }
        .content p {
            margin: 10px 0;
        }
        .details {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 15px;
            margin-top: 20px;
            line-height: 1.6;
        }
        .details h3 {
            margin: 0;
            color: #333333;
            font-size: 16px;
        }
        .details p {
            margin: 5px 0;
            color: #555555;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #777777;
            font-size: 12px;
        }
        .reset-button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://github.com/sujal0311/temp/blob/main/OIG4.z91PgW.jpeg?raw=true" alt="Rupeekart Logo">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>We received a request to reset your password. Click the button below to reset your password:</p>
            <div class="details">
                <h3>Reset Your Password</h3>
                <p><strong>This link is valid for 10 minutes only.</strong></p>
                <p style="text-align: center;">
                    <a href=${url} class="reset-button">Reset Password</a>
                </p>
            </div>
        </div>
        <p>If you did not request a password reset, please ignore this email.</p>
        <div class="footer">
                       <p>&copy; 2024 Rupeekart. All rights reserved.</p>

        </div>
    </div>
</body>
</html>

`
    );

    return res
      .status(200)
      .json({
        error: false,
        success: true,
        message: "Password reset link sent to your email",
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = ForgotPasswordController;
