import User from '../../models/user.model.js';
import auth from '../../models/auth.model.js';

import { hashEmail, comparePassword } from '../../utils/hash.util.js';

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailHash = await hashEmail(email);
        const existingUser = await User.findOne({ emailHash });

        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const existingAuth = await auth.findOne({ user: existingUser._id });
        const isPasswordValid = await comparePassword(password, existingAuth.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        return res.status(200).json({ message: 'Login successful', userId: existingUser._id, username: existingUser.name });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default loginUser;