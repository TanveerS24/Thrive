import Goal from '../../models/goals.model.js';
import GoalStatus from '../../models/goalStatus.model.js';

const addTask = async (req, res) => {
    try {
        const { goalId } = req.params;
        const { name, targetDays } = req.body;

        // Find goal
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Add new task to goal
        const newTask = {
            name: name,
            targetDays: targetDays,
        };
        goal.tasks.push(newTask);
        await goal.save();

        // Update GoalStatus with new task
        const goalStatus = await GoalStatus.findOne({ goal: goalId });
        if (goalStatus) {
            goalStatus.completedTasks.push({
                taskId: goal.tasks[goal.tasks.length - 1]._id,
                completedDays: [],
            });
            await goalStatus.save();
        }

        return res.status(201).json({
            message: 'Task added successfully',
            goal: goal,
            goalStatus: goalStatus,
        });
    } catch (error) {
        console.error('Error adding task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default addTask;
