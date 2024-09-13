const UserModel = require('../models/UserModel');

async function checkEmail(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
                error: true,
            });
        }

        // Use lean() for performance, select('-password') to exclude the password
        const user = await UserModel.findOne({ email })
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
            });
        }

        return res.status(200).json({
            message: 'Email verified',
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        });
    }
}

module.exports = checkEmail;
