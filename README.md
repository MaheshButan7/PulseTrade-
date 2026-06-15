# PulseTrade 📈

A full-stack stock and crypto paper-trading dashboard that gives traders real-time market data, interactive charts, and a seamless experience for monitoring their portfolios — all in one place.

🔗 **Live Demo:** [pulse-trade-inky.vercel.app](https://pulse-trade-inky.vercel.app/)

---

## ✨ Features

- 🔐 **Secure Authentication:** User signup and login utilizing JWT and bcrypt for secure sessions.
- 💰 **Real-time Portfolio Tracking:** Monitor your cash balance, total portfolio value, and overall P&L.
- 📊 **Visual Analytics:** Beautiful, interactive portfolio breakdown pie charts using Recharts.
- ⚡ **Live Market Data:** Integrates directly with the CoinGecko API to fetch live USD prices.
- 📈 **Paper Trading Engine:** Buy and sell assets effortlessly with a dedicated trade modal (complete with a celebratory confetti animation on profitable sales! 🎉).
- 🤖 **AI Portfolio Analysis:** On-demand AI-powered portfolio summaries and actionable insights generated using Google Gemini (`gemini-2.5-flash`), delivered in clean markdown with allocation breakdowns and trading recommendations.
- 📜 **Transaction History:** A detailed, tabular log of all your historical trades and activities.
- 💎 **Premium Glassmorphism UI:** State-of-the-art frontend design featuring deep animated radial gradients, frosted glass cards (`backdrop-blur`), glowing accents, and modern typography (Outfit font).

---

## 🛠️ Tech Stack

### Frontend
- React 19 & Vite
- TypeScript
- Tailwind CSS (Custom Glassmorphism theme)
- React Router DOM v7
- Recharts (Data Visualization)
- react-hot-toast & canvas-confetti

### Backend
- Node.js & Express 5
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- Axios (CoinGecko API Integration)
- Vercel AI SDK (`ai` + `@ai-sdk/google`) — AI portfolio analysis powered by Google Gemini (`gemini-2.5-flash`)

### Infrastructure
- **Frontend:** Vercel
- **Backend:** Render (free tier, kept alive via UptimeRobot health checks)
- **Database:** MongoDB Atlas

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- A [Google AI Studio](https://aistudio.google.com/apikey) API key for AI analysis (optional — the app works without it)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/MaheshButan7/PulseTrade-.git
cd PulseTrade-
```

2. **Install Backend Dependencies:**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Configuration

Create a `.env` file in both the `backend` and `frontend` directories.

### Backend (`backend/.env`):
```env
PORT=3000
MONGO_BASE_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
DB_NAME=crypto_sim
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

> 💡 `GEMINI_API_KEY` is optional. If omitted, the AI analysis feature will be disabled but the rest of the app works normally. Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 💻 Running the Application

### 1. Start the Backend Server:
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:3000`

### 2. Start the Frontend Dev Server:
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`. Open this in your browser to view the app.
````
