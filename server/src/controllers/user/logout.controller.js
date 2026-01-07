const logout = async (req, res) => {
    try {
        // Clear the session
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to logout' });
            }
            
            // Clear the session cookie
            res.clearCookie('thrive.sid');
            return res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.error('Error logging out:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default logout;
