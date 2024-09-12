const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');

async function registerUser(req, res) {
    try {
        const { name, email, password, profile_pic } = req.body;

        const checkEmail = await UserModel.findOne({ email });

        if (checkEmail) {
            return res
                .status(400)
                .json({ message: 'Already User exists', error: true });
        }

        // Password into hashPassword
        const salt = bcryptjs.getSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashPassword,
            profile_pic,
        };

        const user = new UserModel(payload);
        const userSave = await user.save();
        return res.status(201).json({
            message: 'User Created Successfully',
            data: userSave,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
        });
    }
}

module.exports = registerUser;
