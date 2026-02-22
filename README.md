 Expense Tracker — Full-Stack SaaS Application
A production-ready full-stack Expense Tracker built with modern web technologies.
This project demonstrates real-world SaaS concepts such as authentication, protected APIs, user-specific data isolation, analytics, user preferences, and cloud deployment.
🌍 Live Demo
Frontend (Vercel)
👉 https://expense-tracker-nine-pearl-63.vercel.app

Backend API (Render)
👉 https://expense-tracker-5m1n.onrender.com

🚀 Features
🔐 Authentication & Security
User registration & login
JWT-based authentication
Password hashing with bcrypt
Protected API routes
Multi-user data isolation
💸 Expense Management
Add, edit, and delete expenses
Category-based tracking
Date-wise expense history
Responsive card & table views
Mobile-first UX
📊 Analytics
Daily expense visualization
Spending trends
Optimized chart rendering
Lightweight & fast UI
⚙️ User Preferences
Light / Dark theme
Language support (English / Hindi)
Currency conversion (INR / USD / EUR)
Custom date formats
Preferences persist across sessions

🧠 Tech Stack
Frontend
React (Vite)
React Router
Context API
Tailwind CSS
Axios
Backend
Node.js
Express.js
MongoDB Atlas
Mongoose
JWT
bcryptjs
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

🏗 Architecture Overview

React Client (Vercel)
        |
        |  HTTPS + JWT
        v
Express API (Render)
        |
        v
MongoDB Atlas

📂 Project Structure
expense-tracker/
│
├── backend/                         # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/                  # Database & environment config
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/             # Business logic
│   │   │   ├── auth.controller.js
│   │   │   └── expense.controllers.js
│   │   │
│   │   ├── middleware/              # Custom middlewares
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── models/                  # Mongoose models
│   │   │   ├── User.js
│   │   │   └── Expense.js
│   │   │
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.routes.js
│   │   │   └── expense.routes.js
│   │   │
│   │   ├── app.js                   # Express app configuration
│   │   └── server.js                # Server entry point
│   │
│   ├── .env                         # Environment variables (ignored)
│   ├── package.json
│   └── package-lock.json
│
├── frontend/                        # Frontend (React + Vite)
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── api/                     # Axios instance
│   │   │   └── axios.js
│   │   │
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── UserDropdown.jsx
│   │   │   │
│   │   │   ├── ui/                  # Shared UI components
│   │   │   │   ├── ChartSkeleton.jsx
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── TopNotification.jsx
│   │   │   │
│   │   │   ├── AddExpenseModal.jsx
│   │   │   ├── EditExpenseModal.jsx
│   │   │   ├── ExpenseCard.jsx
│   │   │   └── ExpenseTable.jsx
│   │   │
│   │   ├── context/                 # Global state (Context API)
│   │   │   ├── AuthContext.jsx
│   │   │   └── PreferencesContext.jsx
│   │   │
│   │   ├── hooks/                   # Custom hooks
│   │   │   └── useTranslation.js
│   │   │
│   │   ├── layouts/                 # App layout wrapper
│   │   │   └── AppLayout.jsx
│   │   │
│   │   ├── pages/                   # Route-level pages
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/                # API service layer
│   │   │   ├── api.js
│   │   │   ├── authApi.js
│   │   │   └── expenseApi.js
│   │   │
│   │   ├── utils/                   # Utility helpers
│   │   │   ├── analyticsDates.js
│   │   │   ├── currencyUtils.js
│   │   │   ├── format.js
│   │   │   └── translations.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env                         # Frontend environment variables
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docs/                            # Documentation / future diagrams
│
├── .gitignore
└── README.md

⚙️ Environment Variables
Backend (.env)
⚠️ Do NOT commit this file
Env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Frontend (.env)
Env
VITE_API_URL=https://expense-tracker-5m1n.onrender.com
✅ Only variable names are shown — no secrets are exposed.

🧪 Run Locally
1️⃣ Clone Repository
Bash
Copy code
git clone https://github.com/MUKESH-KHUSWAHA/expense-tracker.git
cd expense-tracker
2️⃣ Backend
Bash
Copy code
cd backend
npm install
npm run dev
3️⃣ Frontend
Bash
Copy code
cd frontend
npm install
npm run dev

🔒 Security Notes
Passwords are never stored in plain text
JWT is validated on every protected request
Secrets are stored only in environment variables
CORS configured for frontend access
📈 Performance Optimizations
Optimized chart rendering
Removed heavy unused components
Mobile-friendly layout
Vite production build

🛣 Future Improvements
AI-powered spending insights
Monthly budgets
Expense export (CSV / PDF)
Password reset & email verification
Role-based access

👨‍💻 Author
Mukesh Kumar
B.Tech CSE | Full-Stack Developer
GitHub: https://github.com/MUKESH-KHUSWAHA�

📜 License
MIT License

Copyright (c) 2026 Mukesh Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
