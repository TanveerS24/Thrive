import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

export const hashEmail = (email) => {
    // Use SHA-256 for consistent hashing - same email always produces same hash
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
}