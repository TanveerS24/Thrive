import GoalStatus from '../../models/goalStatus.model.js';

const getGoalStatus = async (req, res) => {
    try {
        const { goalId } = req.params;

        const goalStatus = await GoalStatus.findOne({ goal: goalId });

        if (!goalStatus) {
            return res.status(404).json({ message: 'Goal status not found' });
        }

        // Normalize completedDays to YYYY-MM-DD format
        goalStatus.completedTasks = goalStatus.completedTasks.map(ct => {
            return {
                ...ct.toObject(),
                completedDays: ct.completedDays.map(dateValue => {
                    // If it's already in YYYY-MM-DD format, keep it
                    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                        return dateValue;
                    }
                    // Otherwise convert ISO timestamp to YYYY-MM-DD
                    const date = new Date(dateValue);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                })
            };
        });

        return res.status(200).json(goalStatus);
    } catch (error) {
        console.error('Error fetching goal status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default getGoalStatus;
