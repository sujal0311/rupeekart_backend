const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token || req.headers['authorization'];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not Logged In",
                error: false
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: true
                });
            }
            // console.log(decode);
            req.userId = decode?.id;
            next();
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Unauthorized"
        });
    }
}

module.exports = authToken;
