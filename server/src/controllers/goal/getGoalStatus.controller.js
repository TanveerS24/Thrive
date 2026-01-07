import GoalStatus from '../../models/goalStatus.model.js';

const getGoalStatus = async (req, res) => {
    try {
        const { goalId } = req.params;

        const goalStatus = await GoalStatus.findOne({ goal: goalId });

        if (!goalStatus) {
            return res.status(404).json({ message: 'Goal status not found' });
        }

        return res.status(200).json(goalStatus);
    } catch (error) {
        console.error('Error fetching goal status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default getGoalStatus;
