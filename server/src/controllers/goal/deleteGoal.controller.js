import Goal from '../../models/goals.model.js';
import GoalStatus from '../../models/goalStatus.model.js';

const deleteGoal = async (req, res) => {
    try {
        const { goalId } = req.params;

        // Delete goal
        await Goal.findByIdAndDelete(goalId);

        // Delete goal status
        await GoalStatus.deleteMany({ goal: goalId });

        return res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Error deleting goal:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default deleteGoal;
