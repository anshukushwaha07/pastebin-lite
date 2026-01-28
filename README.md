# Pastebin Lite

A distributed, full-stack pastebin application that allows users to create text pastes with optional expiration times (TTL) and view limits.

## 🚀 Live Demo
- **Frontend:** https://pastebin-lite-snowy-xi.vercel.app/
- **Backend:** https://pastebin-lite-b30b.onrender.com/

## 🛠 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** Redis (ioredis)
- **Validation:** Joi

## ⚙️ Features
- **Create Paste:** Store text with a generated short ID.
- **Expiration (TTL):** Pastes automatically delete after a set time (e.g., 1 hour).
- **View Limits:** Pastes become inaccessible after a specific number of views.
- **Time Travel Testing:** Supports `x-test-now-ms` header to simulate future states for testing.

---

## 📦 Installation & Local Setup

This project is a monorepo containing `frontend` and `backend` folders.

### 1. Prerequisites
- Node.js (v18+)
- Redis (Running locally or a cloud URL)

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following content:

```env
PORT=3001
KV_URL=redis://localhost:6379  # Or your Render/Cloud Redis URL
TEST_MODE=1                    # Enable time-travel header for testing
```

Start the Server:

```bash
npm run dev
# Server will run on http://localhost:3001
```

### 3. Frontend Setup
Open a new terminal.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder with the following content:

```env
# Point this to your local backend for development
VITE_API_URL=http://localhost:3001
```

Start the Client:

```bash
npm run dev
# Client will run on http://localhost:5173
```
🧪 Testing
The backend includes a Postman-ready testing collection.

Health Check: GET /api/healthz

Create Paste: POST /api/pastes

JSON

{ "content": "Hello", "ttl_seconds": 60, "max_views": 5 }
Get Paste: GET /api/pastes/:id

## ☁️ Deployment Notes

### Backend (Render)
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Env Vars:** `KV_URL` (Redis Connection String)

### Frontend (Vercel)
- **Root Directory:** `frontend`
- **Env Vars:** `VITE_API_URL` (The URL of your deployed Backend)


---
