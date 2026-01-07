import GoalStatus from '../../models/goalStatus.model.js';

const toggleCompletedTask = async (req, res) => {
    try {
        const { goalStatusId, taskId } = req.params;

        // Find goal status
        const goalStatus = await GoalStatus.findById(goalStatusId);
        if (!goalStatus) {
            return res.status(404).json({ message: 'Goal status not found' });
        }

        // Find the task in completedTasks
        const completedTaskIndex = goalStatus.completedTasks.findIndex(
            ct => ct.taskId.toString() === taskId
        );

        if (completedTaskIndex === -1) {
            return res.status(404).json({ message: 'Task not found in goal status' });
        }

        // Get current date (without time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if today's date already exists in completedDays
        const dateIndex = goalStatus.completedTasks[completedTaskIndex].completedDays.findIndex(
            date => {
                const existingDate = new Date(date);
                existingDate.setHours(0, 0, 0, 0);
                return existingDate.getTime() === today.getTime();
            }
        );

        if (dateIndex !== -1) {
            // Remove today's date if it exists
            goalStatus.completedTasks[completedTaskIndex].completedDays.splice(dateIndex, 1);
        } else {
            // Add today's date if it doesn't exist
            goalStatus.completedTasks[completedTaskIndex].completedDays.push(today);
        }

        await goalStatus.save();

        return res.status(200).json({
            message: dateIndex !== -1 ? 'Task completion removed' : 'Task marked as completed',
            goalStatus: goalStatus,
        });
    } catch (error) {
        console.error('Error toggling completed task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default toggleCompletedTask;
