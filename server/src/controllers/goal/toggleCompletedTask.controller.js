import GoalStatus from '../../models/goalStatus.model.js';

const toggleCompletedTask = async (req, res) => {
    try {
        console.log('invoked toggleCompletedTask controller');
        const { goalStatusId, taskId } = req.params;
        const { date } = req.body;
        
        console.log('Received date from frontend:', date);

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

        // Use the provided date or fall back to current date
        let dateString;
        if (date) {
            dateString = date; // Already in YYYY-MM-DD format
        } else {
            const today = new Date();
            dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }
        
        console.log('Date string to toggle:', dateString);

        // Check if the date already exists in completedDays
        const dateIndex = goalStatus.completedTasks[completedTaskIndex].completedDays.indexOf(dateString);
        
        console.log('Date index:', dateIndex);
        console.log('Current completedDays:', goalStatus.completedTasks[completedTaskIndex].completedDays);

        if (dateIndex !== -1) {
            // Remove the date if it exists
            goalStatus.completedTasks[completedTaskIndex].completedDays.splice(dateIndex, 1);
        } else {
            // Add the date if it doesn't exist (store as YYYY-MM-DD string)
            goalStatus.completedTasks[completedTaskIndex].completedDays.push(dateString);
        }

        await goalStatus.save();

        console.log('Updated goalStatus:', goalStatus);
        console.log('Final completedDays for task:', goalStatus.completedTasks[completedTaskIndex].completedDays);
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
