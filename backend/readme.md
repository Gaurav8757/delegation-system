# 🔐 Delegation Management System (RBAC) — Backend API

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

A production-grade, secure REST API for a **Delegation Management System** featuring robust **Role-Based Access Control (RBAC)**. Built specifically for developers and recruiters to demonstrate high-standard backend engineering.

---

## 🚀 Key Features

*   **Secure Authentication**: JWT-based stateless auth with 24h expiry.
*   **Granular RBAC**: 3 distinct roles (**Super Admin**, **Admin**, **User**) with strict permission guards.
*   **Security Hardened**: Helmet headers, global & auth-specific rate limiting, Argon2 hashing, and Zod input sanitization.
*   **Activity Logging**: Tracks every critical action (Login, Create User, Delete Task) in the `activity_logs` table.
*   **Chart-Ready Reports**: Optimized endpoints for dashboard visualizations (Delegation stats, User distribution).
*   **Automated Migrations**: One-command setup for hosted/free MySQL databases.
*   **Live Documentation**: Interactive Swagger UI at `/api-docs`.

---

## 🏗️ Database Architecture (MySQL)

Designed for high performance and integrity with foreign key constraints and `utf8mb4` charset.

### 1. `users` Table
Stores user accounts and roles.
| Field | Type | Attributes | Description |
|:---|:---|:---|:---|
| `id` | `INT` | PK, AI, UNSIGNED | Unique User ID |
| `name` | `VARCHAR(100)` | NOT NULL | Full name |
| `email` | `VARCHAR(150)` | UNIQUE, NOT NULL | Login email |
| `password` | `VARCHAR(255)` | NOT NULL | Argon2 hashed password |
| `role` | `ENUM` | NOT NULL | `superadmin`, `admin`, `user` |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Account creation time |

### 2. `delegations` Table
Stores tasks/delegations assigned to users.
| Field | Type | Attributes | Description |
|:---|:---|:---|:---|
| `id` | `INT` | PK, AI, UNSIGNED | Unique Delegation ID |
| `title` | `VARCHAR(200)` | NOT NULL | Task title |
| `description` | `TEXT` | NULL | Detailed notes |
| `assigned_to`| `INT` | FK → users.id | User responsible for task |
| `created_by` | `INT` | FK → users.id | Admin/Superadmin who created it |
| `status` | `ENUM` | NOT NULL | `pending`, `in-progress`, `completed`|
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation time |

### 3. `activity_logs` Table
Audit trail for system actions.
| Field | Type | Attributes | Description |
|:---|:---|:---|:---|
| `id` | `INT` | PK, AI, UNSIGNED | Unique Log ID |
| `user_id` | `INT` | FK → users.id | Action performer |
| `action` | `VARCHAR(255)` | NOT NULL | Description (e.g., "Created Admin") |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Log time |

---

## 🔑 Database Test Credentials (phpmyadmin)

### Log in
| Server: | sql12.freesqldatabase.com |
| Username: | sql12820813 |
| Password: | igv2CNE72b |


## 🔑 Server Test Credentials

Use these pre-seeded accounts to test the API flows:

| Role | Email | Password | Access Level |
|:---|:---|:---|:---|
| **Super Admin** | `superadmin@delegation.com` | `SuperAdmin@123` | Full system control |
| **Admin** | `admin1@delegation.com` | `Admin@123` | Management & Setup |
| **Simple User** | `user1@delegation.com` | `User@123` | Task Execution |

---

## 🌐 API Documentation

### **Live API Base URL**: `https://delegation-system-production-ce24.up.railway.app/api`

Detailed endpoint map. All protected routes require a `Bearer <JWT>` token in the `Authorization` header.

### 🔐 Auth Module (`/api/auth`)
| Method | Endpoint | Description | Payload Example |
|:---|:---|:---|:---|
| `POST` | `/register` | Public registration | `{ name, email, password }` |
| `POST` | `/login` | Public login | `{ email, password }` → Returns JWT |
| `GET` | `/me` | Get profile | Returns self user object |
| `POST` | `/logout` | Audit logout | Client must drop token side-side |

### 👥 User Module (`/api/users`) — *RBAC Guarded*
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/` | Super Admin | List all users (Excl. Superadmins) |
| `POST` | `/` | Super/Admin | Create Admin or User accounts |
| `PATCH` | `/:id/role` | Super Admin | Promote/Demote roles |
| `DELETE`| `/:id` | Super Admin | Permanent account removal |

### 📋 Delegation Module (`/api/delegations`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/` | Super/Admin | View all company delegations |
| `GET` | `/my` | Any Auth | View tasks assigned to YOU |
| `POST` | `/` | Super/Admin | Delegate task to a specific user |
| `PATCH` | `/:id/status`| Any Auth | Update status (Users only own tasks) |
| `DELETE`| `/:id` | Super Admin | Remove delegation |

### 📊 Reports Module (`/api/reports`)
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/dashboard`| Summary Counts: Delegations by status, Users by role |
| `GET` | `/activity` | Activity Logs (Superadmin: All, Others: Own only) |

---

## 🛡️ Security Implementation

1.  **Rate Limiting**: Prevent Brute Force (Auth: 10 req/15min, Global: 100 req/15min).
2.  **Argon2 Hashing**: Resists GPU/ASIC cracking far better than bcrypt.
3.  **Zod Sanitization**: All incoming data is parsed and stripped of unknown fields.
4.  **Ownership Check**: A `user` cannot update a delegation unless it belongs to them (checked in service layer).
5.  **Role Protection**: `Superadmin` role cannot be deleted or created via API after initial seeding.

---

## ⚙️ Quick Start

### 1. Installation
```bash
npm install
cp .env.example .env  # Fill in your Database credentials
```

### 2. Database Migration (Required once)
```bash
npm run migrate       # Creates tables on your DB
npm run seed          # populates with Recruiter Test Credentials
```

### 3. Run
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Interactive Documentation: **`https://delegation-system-production.up.railway.app/api-docs`**

---

## 📦 Dependencies

- **Express v5** (Experimental next-gen performance)
- **MySQL2** (Promise-based high speed pool)
- **Helmet / CORS / Rate-Limit** (Triple-layer HTTP headers handled 16+ layers of security)
- **JsonWebToken** (Stateless authentication)
- **Argon2** (Next-gen hashing)
- **Swagger-UI** (API Documentation)
- **Zod** (Schema-first validation)

---
*Created with ❤️ by **Er. Gaurav Kumar** for Full Stack Technical Assessment.*
