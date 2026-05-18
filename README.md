# 📈 Pulse Trade

A full-stack stock and crypto trading dashboard that gives traders real-time market data, interactive charts, and a seamless experience for monitoring their portfolios — all in one place.

🔗 **Live Demo**: [pulse-trade-inky.vercel.app](https://pulse-trade-inky.vercel.app)
---

## ✨ Features

- 🔐 **Secure Authentication**: User signup and login utilizing JWT and bcrypt for secure sessions.
- 💰 **Real-time Portfolio Tracking**: Monitor your cash balance, total portfolio value, and overall P&L.
- 📊 **Visual Analytics**: Beautiful, interactive portfolio breakdown pie charts using Recharts.
- ⚡ **Live Market Data**: Integrates directly with the CoinGecko API to fetch live USD prices.
- 📈 **Paper Trading Engine**: Buy and sell assets effortlessly with a dedicated trade modal (complete with a celebratory confetti animation on profitable sales! 🎉).
- 📜 **Transaction History**: A detailed, tabular log of all your historical trades and activities.
- 💎 **Premium Glassmorphism UI**: State-of-the-art frontend design featuring deep animated radial gradients, frosted glass cards (`backdrop-blur`), glowing accents, and modern typography (Outfit font).

---

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite**
- **TypeScript**
- **Tailwind CSS** (Custom Glassmorphism theme)
- **React Router DOM v7**
- **Recharts** (Data Visualization)
- **react-hot-toast** & **canvas-confetti**

### Backend
- **Node.js** & **Express 5**
- **MongoDB** & **Mongoose**
- **JSON Web Tokens (JWT)** for authentication
- **bcryptjs** for password hashing
- **Axios** (CoinGecko API Integration)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/pulse-trade.git
   cd pulse-trade
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

You will need to create a `.env` file in both the `backend` and `frontend` directories.

**Backend (`backend/.env`):**
```env
PORT=3000
MONGO_BASE_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
DB_NAME=crypto_sim
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 💻 Running the Application

You can run both the frontend and backend development servers concurrently.

**1. Start the Backend Server:**
```bash
cd backend
npm run dev
```
*(The backend should start on `http://localhost:3000`)*

**2. Start the Frontend Dev Server:**
```bash
cd frontend
npm run dev
```
*(The frontend should start on `http://localhost:5173` or similar. Open this link in your browser to view the app!)*

---
