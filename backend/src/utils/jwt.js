import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

// generate token
export const generateToken = (payload) => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE });
    } catch (error) {
        throw error;
    }
};

// verify token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        throw error;
    }
};

// decode token
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        throw error;
    }
};
