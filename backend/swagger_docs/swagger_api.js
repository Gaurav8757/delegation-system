import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Delegation Management System API",
      version: "1.0.0",
      description:
        "Full-stack Delegation System REST API with Role-Based Access Control (RBAC). " +
        "Use the **Authorize** button to paste your JWT token (without 'Bearer ' prefix).",
    },
    servers: [
      {
        url: process.env.HTTP_URL || "http://localhost:4000",
        description: process.env.NODE_ENV === "production" ? "Production" : "Development",
      },
    ],
    // JWT Bearer Auth
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token. Obtain it from POST /api/auth/login",
        },
      },
      // Reusable response schemas
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error description" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: { type: "string", example: "Invalid email address" },
                },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Gaurav Kumar" },
            email: { type: "string", example: "gaurav@delegation.com" },
            role: {
              type: "string",
              enum: ["superadmin", "admin", "user"],
              example: "user",
            },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Delegation: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Review Q1 Report" },
            description: { type: "string", example: "Please review the Q1 financial report" },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              example: "pending",
            },
            assigned_to_id: { type: "integer", example: 3 },
            assigned_to_name: { type: "string", example: "Priya Sharma" },
            created_by_id: { type: "integer", example: 2 },
            created_by_name: { type: "string", example: "Admin User" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        ActivityLog: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            user_id: { type: "integer", example: 5 },
            user_name: { type: "string", example: "Gaurav Kumar" },
            user_role: { type: "string", example: "user" },
            action: { type: "string", example: "User logged in" },
            created_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
    // Apply Bearer auth globally — individual routes can override with security: []
    security: [{ bearerAuth: [] }],
    // Tag groups for sidebar organisation in Swagger UI
    tags: [
      { name: "Auth",        description: "Registration, login, logout and profile" },
      { name: "Users",       description: "User management — superadmin / admin" },
      { name: "Delegations", description: "Delegation CRUD and status management" },
      { name: "Reports",     description: "Dashboard stats and activity logs for charts" },
    ],
  },
  // Scan all route files for @swagger JSDoc comments
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);