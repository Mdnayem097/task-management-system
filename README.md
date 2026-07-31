# 📝 Task Management System (Full-Stack Web Application)

A modern, robust, and full-stack Task Management Application designed to create, organize, track, and manage daily tasks efficiently with secure user authentication.

---

## 🚀 Tech Stack

### **Frontend**
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios
* **Deployment:** Vercel

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js (v5)
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT (JSON Web Tokens) & Passwords hashing (Bcrypt)
* **Middleware:** CORS, Global Error Handler
* **Deployment:** Vercel (Serverless Node.js Runtime)

---

## ✨ Features

- **User Authentication:** Secure JWT-based registration and login system.
- **Task Management:** Full CRUD operations for managing tasks (Create, Read, Update, Delete).
- **Responsive UI:** Fully mobile-friendly and clean user interface built with Tailwind CSS.
- **Robust Error Handling:** Centralized custom error middleware for handling unexpected edge cases.
- **Serverless Ready:** Configured specifically to run seamlessly on Vercel Serverless Functions.

---

## 🛠️ Project Setup & Installation

### **1. Backend Setup**

```bash
# Navigate to the backend directory
cd server

# Install dependencies
npm install

# Create a .env file in the root directory and add:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

# Start the local development server
npm run dev```

### **1. Frontend Setup**

```bash
# Navigate to the frontend directory
cd client

# Install dependencies
npm install

# Create a .env.local file in the root directory and add:
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# Start the Next.js development server
npm run dev
