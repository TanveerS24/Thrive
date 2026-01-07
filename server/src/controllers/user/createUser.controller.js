import User from '../../models/user.model.js';
import Auth from '../../models/auth.model.js';
import Goal from '../../models/goals.model.js';
import GoalStatus from '../../models/goalStatus.model.js';

import { hashPassword, hashEmail  } from '../../utils/hash.util.js';
import { encrypt } from '../../utils/encryption.util.js';
const createUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;
        const emailHash = await hashEmail(email);
        const existingUser = await User.findOne({ emailHash });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const encryptedEmail = encrypt(email);
        const encryptedUsername = encrypt(username);
        const newUser = new User({
            name: encryptedUsername,
            email: encryptedEmail,
            emailHash: emailHash,
        });
        await newUser.save();

        const hashedPassword = await hashPassword(password);
        const newAuth = new Auth({
            user: newUser._id,
            password: hashedPassword,
        });
        await newAuth.save();

        const goal = new Goal({
            user: newUser._id,
            title: "My Task Collection",
            description: "",
            tasks: [{
                name: "Use this app",
                targetDays: 21,
            }],
        });
        await goal.save();

        const currentDate = new Date();
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        
        const goalStatus = new GoalStatus({
            user: newUser._id,
            goal: goal._id,
            month: monthName,
            year: year,
            completedTasks: [{
                taskId: goal.tasks[0]._id,
                completedDays: [],
            }],
        });
        await goalStatus.save();

        return res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default createUser;