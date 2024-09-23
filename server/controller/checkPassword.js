const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function checkPassword(req, res) {
    try {
        const { password, userId } = req.body;

        const user = await UserModel.findById(userId);

        const verifyPassword = await bcryptjs.compare(password, user.password);

        if (!verifyPassword) {
            return res.status(400).json({
                message: 'Please check password',
                error: true,
            });
        }

        // Create JWT token
        const tokenData = {
            id: user._id,
            email: user.email,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d',
        });

        // Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Make it secure only in production
            sameSite: 'strict', // Helps prevent CSRF attacks
        };

        // Return response with token and user data
        return res.cookie('token', token, cookieOptions).status(200).json({
            message: 'Login successfully!',
            token,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        });
    }
}

module.exports = checkPassword;
