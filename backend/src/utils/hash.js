import argon from "argon2";

// hash password
export const hashPassword = async (password) => {
    try {
        return await argon.hash(password);
    } catch (error) {
        throw error;
    }
};

// verify password
export const verifyPassword = async (password, hash) => {
    try {
        return await argon.verify(hash, password);
    } catch (error) {
        throw error;
    }
};
