# 🚀 Delegation Management System (RBAC) — Full Stack

Welcome to the **Delegation Management System**, a complete solution for task delegation with **Role-Based Access Control (RBAC)**. This project demonstrates a production-grade implementation of a full-stack application using the **MERN** (MySQL + Express + React + Node) stack.

---

## 🌐 Live API Base URL

### **Live API Base URL**: `https://delegation-system-production.up.railway.app/api`

### **Live API Documentation**: `https://delegation-system-yuaa.onrender.com/api-docs`

## Live Frontend URL

### **Live Frontend URL**: `https://delegation-system-gaurav8757s-projects.vercel.app`

---

## 🏗️ Project Architecture

This repository is divided into two main components:

### 🔹 [Backend API (Node.js + Express + MySQL)](./backend/README.md)

The core engine of the system.
- **Security**: JWT Authentication, Argon2 Hashing, Rate Limiting, Helmet headers.
- **Database**: Raw SQL queries with `mysql2` pool, Activity Audit Logs.
- **Documentation**: Interactive [Swagger UI](https://delegation-system-production.up.railway.app/api-docs) (when running locally).
- **Features**: RBAC (Super Admin, Admin, User), Zod Validation, Dashboard Stats.
- 👉 [**Read Backend Documentation**](./backend/README.md)

### 🔹 [Frontend UI (React.js + Vite)](./frontend/README.md)
A modern, responsive dashboard interface.
- **State Management**: Zustand for global state.
- **UI Architecture**: Component-based design, Protected Routes.
- **Charts**: Interactive data visualization for reports.
- **Styling**: Modern, mobile-responsive layout.
- 👉 [**Read Frontend Documentation**](./frontend/README.md)

---

## 🔑 Quick Setup

To get the full system running locally, please follow the setup instructions in each directory:

1.  **Database**: Follow instructions in [backend/README.md](./backend/README.md) to set up your MySQL instance.
2.  **Backend**: `cd backend && npm install && npm run dev`
3.  **Frontend**: `cd frontend && npm install && npm run dev`

---

## 🏆 Project Objectives
- ✅ Full-stack implementation (Frontend + Backend + DB)
- ✅ Secure Role-Based Access Control (Super Admin, Admin, User)
- ✅ Production-ready folder structure
- ✅ Real-time activity auditing
- ✅ Deployment-ready configuration

---
*Created by **Er. Gaurav Kumar***
