import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const ivLength = 16; // AES block size

const getSecretKey = () => {
    const secret = process.env.ENCRYPTION_SECRET;
    if (!secret) {
        throw new Error('ENCRYPTION_SECRET environment variable is not set');
    }
    return Buffer.from(secret, 'base64');
};

export const encrypt = (text) => {
    const secretKey = getSecretKey();
    
    if (secretKey.length !== 32) {
        throw new Error('Encryption key must be 32 bytes (256 bits)');
    }
    
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export const decrypt = (encryptedText) => {
    const secretKey = getSecretKey();
    
    if (secretKey.length !== 32) {
        throw new Error('Encryption key must be 32 bytes (256 bits)');
    }
    
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = textParts.join(':');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}