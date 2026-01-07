import Goal from '../../models/goals.model.js';
import GoalStatus from '../../models/goalStatus.model.js';

const createTitle = async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, description, tasks } = req.body;

        // Validate that at least one task exists
        if (!tasks || tasks.length === 0) {
            return res.status(400).json({ message: 'At least one task is required' });
        }

        // Create new goal
        const newGoal = new Goal({
            user: userId,
            title: title,
            description: description || '',
            tasks: tasks,
        });
        await newGoal.save();

        // Create/Update GoalStatus
        const currentDate = new Date();
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();

        const completedTasksArray = tasks.map(task => ({
            taskId: task._id,
            completedDays: [],
        }));

        const goalStatus = new GoalStatus({
            user: userId,
            goal: newGoal._id,
            month: monthName,
            year: year,
            completedTasks: completedTasksArray,
        });
        await goalStatus.save();

        return res.status(201).json({
            message: 'Goal created successfully',
            goal: newGoal,
            goalStatus: goalStatus,
        });
    } catch (error) {
        console.error('Error creating goal title:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default createTitle;
