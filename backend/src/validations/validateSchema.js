import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

// Register + userSchema (base)
export const userSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register alias used in routes
export const registerSchema = userSchema.extend({
    role: z.enum(process.env.AUTHORIZE_ROLES.split(',')).optional().default('user'),
});

// Login
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Create delegation (admin / superadmin)
export const createDelegationSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    assigned_to: z
        .number({ invalid_type_error: "assigned_to must be a number" })
        .int()
        .positive("assigned_to must be a positive integer"),
    status: z.enum(['pending', 'in-progress', 'completed']).optional().default('pending'),
});

// Update delegation status (any authenticated user)
export const updateDelegationSchema = z.object({
    status: z.enum(['pending', 'in-progress', 'completed'], {
        errorMap: () => ({ message: "Status must be pending, in-progress, or completed" }),
    }),
});

// Update full delegation (admin / superadmin)
export const updateFullDelegationSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    assigned_to: z
        .number({ invalid_type_error: "assigned_to must be a number" })
        .int()
        .positive("assigned_to must be a positive integer"),
    status: z.enum(['pending', 'in-progress', 'completed']).optional().default('pending'),
});

// Create user by admin / superadmin
export const createUserByAdminSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['admin', 'user'], {
        errorMap: () => ({ message: "Role must be admin or user" }),
    }).optional().default('user'),
});

// Update user role (superadmin only)
export const updateUserRoleSchema = z.object({
    role: z.enum(['superadmin', 'admin', 'user'], {
        errorMap: () => ({ message: "Role must be superadmin, admin, or user" }),
    }),
});

// Update full user (superadmin only)
export const updateUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(['admin', 'user'], {
        errorMap: () => ({ message: "Role must be admin or user" }),
    }),
});
