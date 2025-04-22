# 🧑‍💼 HR Management System

A modern **Human Resource Management System** built with **Laravel 11** (API backend) and **React + TypeScript** (frontend). This system allows HR teams to manage employees, departments, roles, and leave requests efficiently.

## 🚀 Features

-   🔐 User authentication (Laravel Sanctum)
-   👤 Employee management (Create, Edit, Delete, View)
-   🏢 Department management with Heads & Participants
-   📅 Leave request and approval system
-   📊 HR dashboard for insights
-   🧑‍⚖️ Role & permission system (planned)
-   🧾 Audit trails and activity logs _(planned)_
-   🔍 Filter, search, and pagination for large data

---

## 🛠️ Tech Stack

### 🔧 Backend

-   [Laravel 11](https://laravel.com/docs/11.x)
-   Laravel Sanctum (SPA Authentication)
-   Eloquent ORM
-   MySQL / MariaDB
-   RESTful API with validation

### 🎨 Frontend

-   [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
-   Tailwind CSS
-   Headless UI (Combobox, Modal, etc.)
-   Axios for API requests
-   Zustand or Context API for state management (if used)

---

## ⚙️ Installation

### 📦 Requirements

-   PHP >= 8.2
-   Composer
-   Node.js >= 18
-   MySQL or compatible DB
-   Laravel CLI

---

### 🔧 Step-by-step Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/hr-management.git
cd hr-management
```

2. **Install dependencies**

```bash
composer install
npm install
npm run build
```

3. **Copy and setup environment**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database in .env**

5. **Then run**

```bash
php artisan migrate --seed
```

6. **Start The Project**

```bash
npm run dev
php artisan serve

```

## 📝 License

This project is licensed under the [MIT License](./LICENSE).
