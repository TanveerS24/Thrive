import Goal from '../../models/goals.model.js';

const getUserGoals = async (req, res) => {
    try {
        const { userId } = req.params;

        const goals = await Goal.find({ user: userId });

        return res.status(200).json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default getUserGoals;
