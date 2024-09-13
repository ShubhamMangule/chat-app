async function logout(req, res) {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        return res.cookie('token', '', cookieOptions).status(200).json({
            message: 'Session out',
            success: true,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: error.message || error, error: true });
    }
}

module.exports = logout;
