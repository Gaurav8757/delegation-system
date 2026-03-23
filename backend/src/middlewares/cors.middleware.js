import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

// CORS policy
export const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];

// CORS middleware
export const corsPolicy = cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    methods: (process.env.ALLOWED_METHODS || "GET,POST,PUT,DELETE").split(","),
    allowedHeaders: (process.env.ALLOWED_HEADERS || "Content-Type,Authorization").split(","),
    credentials: true,
});
