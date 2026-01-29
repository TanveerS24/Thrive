import mongoose from 'mongoose';

const goalStatusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    completedTasks: [{
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        completedDays: [{
            type: String,
        }],
    }],
}, { timestamps: true });

export default mongoose.model('GoalStatus', goalStatusSchema, "GoalStatus");