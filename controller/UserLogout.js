async function userLogout(req, res) {
    try {
        res.clearCookie('token', {
            path: '/', // Make sure the path matches the one used when setting the cookie
            secure: true, // Make sure it's the same as when setting the cookie
            httpOnly: true, // Make sure it's the same as when setting the cookie
            sameSite: 'None' // Make sure it's the same as when setting the cookie
        });

        res.status(200).json({ success: true, message: 'Logout successful', error: false });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = userLogout;
