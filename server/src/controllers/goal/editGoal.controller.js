import Goal from '../../models/goals.model.js';

const editGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        const { title, description, tasks } = req.body;

        // Find goal
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Update title and description
        if (title) goal.title = title;
        if (description !== undefined) goal.description = description;

        // Update task names and targetDays
        if (tasks && Array.isArray(tasks)) {
            tasks.forEach((updatedTask) => {
                const taskIndex = goal.tasks.findIndex(
                    t => t._id.toString() === updatedTask._id.toString()
                );
                if (taskIndex !== -1) {
                    if (updatedTask.name) goal.tasks[taskIndex].name = updatedTask.name;
                    if (updatedTask.targetDays) goal.tasks[taskIndex].targetDays = updatedTask.targetDays;
                }
            });
        }

        await goal.save();

        return res.status(200).json({
            message: 'Goal updated successfully',
            goal: goal,
        });
    } catch (error) {
        console.error('Error editing goal:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default editGoal;
