# 🚀 Delegation System — Frontend (React 19)

A sophisticated, role-based Task Delegation Dashboard built with **React 19**, **Tailwind CSS 4**, and **TanStack Query 5**. This frontend is designed for high-performance administrative workflows, featuring a premium dark-themed UI and real-time data synchronization.

---

## 🌐 Live API Base URL

### **Live API Base URL**: `https://delegation-system-production.up.railway.app/api`

## Live Frontend URL

### **Live Frontend URL**: `https://delegation-system-gaurav8757s-projects.vercel.app`

---


## 🛠️ Tech Stack & Key Libraries

- **Core**: React 19 (Vite), JavaScript (ESM)
- **Styling**: Tailwind CSS 4 (Modern utility-first framework)
- **State Management**: Zustand (Lightweight client-side state)
- **Data Fetching**: TanStack Query (React Query) v5 (Server-side state & caching)
- **Icons**: Lucide React (Consistent, accessible iconography)
- **Routing**: React Router 7 (Data-aware routing)
- **Charts**: Recharts (Interactive data visualization)
- **Feedback**: React Hot Toast (Real-time user notifications)

---

## 📂 Architecture & Folder Structure

This project follows a **Modular Layered Architecture**, separating UI components, business logic, and API synchronization.

```text
frontend/src/
├── api/            # Centralized API layer (Axios instances & interceptors)
├── assets/         # Branding assets (logo1.png)
├── components/     # UI Design System
│   ├── ui/         # Reusable primitives (Button, Modal, Card, ConfirmModal)
│   └── auth/       # Authentication specific components
├── hooks/          # Cross-cutting concerns & data fetching logic (useUsers, useDelegations)
├── layouts/        # Page wrappers (Sidebar, DashboardLayout)
├── lib/            # Shared utilities (cn helper, tailwind-merge)
├── pages/          # Feature groups (Auth, Dashboard, Users, Delegations, Reports, Settings)
├── routes/         # Centralized routing configuration (AppRoutes, ProtectedRoutes)
├── shared/         # Common global components (Loader, ErrorBoundary)
└── store/          # Global client-state (authStore)
```

---

## 🔐 Authentication & RBAC (Role-Based Access Control)

The frontend implements a robust security layer:
1.  **JWT Persistence**: Tokens are securely stored and automatically injected into every request header via **Axios Interceptors**.
2.  **Protected Routes**: A specialized `<ProtectedRoute />` wrapper blocks unauthorized access based on user roles (`superadmin`, `admin`, `user`).
3.  **Dynamic UI**: The `Sidebar` and `Dashboard` automatically adapt their content, hiding administrative features from standard users.

---

## 📡 API Integration Layer

We use a **Hook-per-Feature** pattern to keep components thin and logic reusable:

- **`apiServices`**: A centralized singleton in `api/api.js` that standardizes `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests.
- **Custom Hooks**: 
    - `useAuth`: Handles login, registration, and session recovery.
    - `useUsers`: Manages the entire User CRUD lifecycle for SuperAdmins.
    - `useDelegations`: Manages task assignments and status transitions.
    - `useReports`: Fetches aggregated system metrics for the dashboard.

---

## 🎨 Design Philosophy

- **Premium UI**: Dark-mode primary theme with vibrant accents and glassmorphism.
- **Micro-Animations**: Subtle "bounce" and "fade-in" effects for smooth transitions.
- **User-Centric Modals**: All deletions and edits are handled via custom, reusable `Modal` and `ConfirmModal` components instead of intrusive browser alerts.
- **Responsiveness**: Fully fluid layout that adapts from mobile-first sidebars to desktop-scale dashboards.

---

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    Create a `.env` file mapping to your backend API:
    ```env
    VITE_API_BASE_URL=https://delegation-system-production.up.railway.app/api
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

Developed with ❤️ made by **Er. Gaurav Kumar**
