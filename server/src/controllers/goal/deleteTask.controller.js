import Goal from '../../models/goals.model.js';
import GoalStatus from '../../models/goalStatus.model.js';

const deleteTask = async (req, res) => {
    try {
        const { goalId, taskId } = req.params;

        // Find goal
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Remove task from goal
        goal.tasks = goal.tasks.filter(t => t._id.toString() !== taskId);
        await goal.save();

        // Remove from GoalStatus
        const goalStatus = await GoalStatus.findOne({ goal: goalId });
        if (goalStatus) {
            goalStatus.completedTasks = goalStatus.completedTasks.filter(
                ct => ct.taskId.toString() !== taskId
            );
            await goalStatus.save();
        }

        return res.status(200).json({
            message: 'Task deleted successfully',
            goal: goal,
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default deleteTask;
