const bcrypt = require("bcrypt");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const { sendMail } = require("./helpers/sendMail");
const fetch = require("node-fetch"); 

async function userSignInController(req, res) {
  const ipinfoToken = "7a54519fa4e678";

  const getLocationFromIP = async (ipAddress) => {
    try {
      const response = await fetch(
        `https://ipinfo.io/${ipAddress}?token=${ipinfoToken}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching IP info:", error);
      return null;
    }
  };

  try {
    // Fetch IP address from request headers or fallback to req.ip
    const ipAddress = req.headers["x-forwarded-for"] || req.ip;
    console.log("IP Address:", ipAddress); // Debugging log

    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const tokenData = {
      email: user.email,
      id: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    // Cookie options
    const tokenOption = {
      secure: true,
      httpOnly: true, 
      sameSite: 'None' ,
      maxAge: 8 * 60 * 60 * 1000, 
    };

    // Fetch location data from IP
    const locationData = await getLocationFromIP(ipAddress);
    console.log("Location Data:", locationData); // Debugging log

    // Send login alert email
    sendMail(
      email,
      "Login Alert",
      "You have logged in to Rupeekart",
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Alert</title>
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
            color: #333333;
            margin: 0;
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
        .header img {
            max-width: 150px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://github.com/sujal0311/temp/blob/main/OIG4.z91PgW.jpeg?raw=true" alt="Rupeekart Logo">
        </div>
        <div class="header">
            <h1>Login Alert</h1>
        </div>
        <div class="content">
            <p>Dear User,</p>
            <p>We noticed a new login to your account:</p>
        </div>
        <div class="details">
            <h3>Login Details:</h3>
            <p><strong>IP Address:</strong> ${ipAddress}</p>
            <p><strong>Location:</strong> ${locationData?.city || "Unknown"}, ${locationData?.region || "Unknown"}, ${locationData?.country || "Unknown"}</p>
            <p><strong>Account Email:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div class="content">
            <p>If this was not you, please secure your account immediately by changing your password.</p>
            <p>Thank you for using our service!</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Rupeekart. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
    );

    // Set the cookie and return success response
    return res.cookie("token", token, tokenOption).status(200).json({
      message: "Login successful",
      success: true,
      error: false,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = userSignInController;
