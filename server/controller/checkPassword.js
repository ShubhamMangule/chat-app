const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function checkPassword(req, res) {
    try {
        const { password, userId } = req.body;

        // Validate request body
        if (!password || !userId) {
            return res.status(400).json({
                message: 'Password and userId are required',
                error: true,
            });
        }

        // Fetch user from the database
        const user = await UserModel.findById(userId).select('+password'); // Explicitly select the password if it's excluded by default

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
            });
        }

        // Verify the password
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid password',
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
        return res
            .cookie('token', token, cookieOptions)
            .status(200)
            .json({
                message: 'Login successfully!',
                token,
                data: {
                    id: user._id,
                    email: user.email,
                },
            });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        });
    }
}

module.exports = checkPassword;
