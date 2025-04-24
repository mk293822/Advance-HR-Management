# 🧑‍💼 HR Management System

A modern **Human Resource Management System** built with **Laravel 11** (API backend) and **React + TypeScript** (frontend). This system allows HR teams to manage employees, departments, roles, and leave requests efficiently.

---

![Laravel](https://img.shields.io/badge/Laravel-11-red?logo=laravel)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)

---

## 🚀 Features

-   🔐 Secure user authentication (Laravel Sanctum)
-   👤 Full employee CRUD management
-   🏢 Department creation with Heads & Participants
-   📅 Leave request and approval system
-   📊 Interactive HR dashboard for insights
-   🔍 Advanced search with Fuse.js
-   🌈 Fully styled with Tailwind CSS & daisyUI
-   🧑‍⚖️ Role & permission system _(planned)_
-   🧾 Audit logs and activity history _(planned)_

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
-   [Tailwind CSS](https://tailwindcss.com/)
-   [daisyUI](https://daisyui.com/) (Tailwind component library)
-   [Heroicons](https://heroicons.com/) (for beautiful icons)
-   [clsx](https://github.com/lukeed/clsx) (for conditional classNames)
-   [fuse.js](https://fusejs.io/) (for fuzzy search functionality)
-   Axios for API communication
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
git clone https://github.com/mk293822/Advance-HR-Management.git
cd Advance-HR-Management
```

2. **Install backend dependencies**

```bash
composer install
```

3. **Copy and setup environment**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database in .env**

### DB_DATABASE=hr_db

### DB_USERNAME=root

### DB_PASSWORD=secret

5. **Then run**

```bash
php artisan migrate --seed
```

6. **Install frontend dependencies**

```bash
npm install
```

7. **Start The Project**

```bash
npm run dev
php artisan serve

```

## 📝 License

This project is licensed under the [MIT License](./LICENSE).
