import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Auth', authSchema, "Auth");