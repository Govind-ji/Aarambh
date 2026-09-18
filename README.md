# 🚀 Aarambh – AI Interview System

Aarambh is an AI-powered platform for practicing interviews with smart feedback.

## ✨ Features

* AI mock interviews
* Dynamic question generation
* Performance feedback
* Progress tracking

## 🛠️ Tech Stack

* React.js
* Node.js, Express.js
* MongoDB
* AI APIs

## ⚙️ Setup

```bash
git clone https://github.com/your-username/Aarambh.git
cd Aarambh
cd frontend && npm install
cd ../backend && npm install
```

## ▶️ Run

```bash
# backend
npm start

# frontend
npm start
```

## ✅ Verified Current Status

- Frontend is running on `http://localhost:5173`
- Backend is running on `http://localhost:5000`
- CV service is responding on `http://localhost:5001`
- MongoDB is connected and the demo users were seeded successfully
- Working admin login: `admin@example.com` / `admin123`
- Other seeded users: `john@example.com` / `password123`, `jane@example.com` / `password123`
- Speech recognition and head movement are currently working and were left unchanged
- The report page hardcoded speech-accuracy card was removed and the frontend build still passes

## 📌 Current Session Notes

- The project is in a working state for login, interview flow, and report viewing.
- Keep the browser-based CV flow and the current working speech/head-movement behavior unchanged unless a new bug is reported.
- To restart the app:

```powershell
cd D:\Vs\Projects\Aarambh\backend
npm start

cd D:\Vs\Projects\Aarambh\Arambh
npm run dev -- --host 0.0.0.0
```

## 🔐 .env
