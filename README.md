# 📈 Paper Trading App - OpenAlgo

A modern, interactive paper trading application that allows users to practice stock trading in a risk-free environment. Build your virtual portfolio by earning paper money through interactive games and challenges. Every dollar matters—funds must be earned, not given!

## 🚀 Features

- **Dashboard**: Real-time portfolio tracking and account overview
- **Earn Virtual Funds**: Play interactive games and complete challenges to earn paper money
- **Virtual Trading**: Practice trading with earned virtual funds without real money risk
- **Interactive Games**: 
  - **Memory Game**: Test your market knowledge and earn rewards
  - **Reflex Game**: Improve your trading reflexes and build your portfolio
  - **Trading Hub**: Comprehensive trading practice environment with earned capital
- **Modern UI**: Glass-morphism design with responsive layout
- **Backend API**: Express.js server for handling trading logic, fund management, and data

## 📁 Project Structure

```
paper-trading-app/
├── public/                 # Frontend files
│   ├── app.js             # Main application logic
│   ├── index.html         # Dashboard page
│   ├── style.css          # Global styles
│   └── games/
│       ├── hub.html       # Trading hub
│       ├── memory.html    # Memory game
│       └── reflex.html    # Reflex game
├── server/                # Backend
│   ├── index.js          # Express server
│   ├── package.json      # Dependencies
│   └── node_modules/     # (Generated)
└── README.md             # This file
```

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Glass-morphism design)
- Vanilla JavaScript

**Backend:**
- Node.js
- Express.js
- CORS enabled for cross-origin requests
- Body-parser for JSON handling
- Axios for HTTP requests

**Development:**
- Nodemon for auto-reload during development

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd paper-trading-app
```

2. **Install backend dependencies**
```bash
cd server
npm install
cd ..
```

3. **Start the server**
```bash
cd server
npm run dev    # Development mode with nodemon
# or
npm start      # Production mode
```

The frontend can be opened by serving the `public/index.html` file in your browser.

## 🎮 How to Use

1. **Access the Dashboard**: Open `index.html` in your browser
2. **Earn Funds**: Click "Earn Funds" and play games to build your virtual portfolio
3. **Complete Challenges**: Win games to earn paper money that you can use for trading
4. **Trade**: Use your earned virtual funds to practice stock trading
5. **Track Portfolio**: Monitor your trading performance and earned capital

## 📝 API Endpoints

The backend server is configured to handle:
- CORS requests from the frontend
- JSON data parsing
- API calls to external trading data sources (via Axios)

## 🔧 Development

### Run in Development Mode
```bash
cd server
npm run dev
```

This uses Nodemon to automatically restart the server when files change.

### Build/Run in Production
```bash
cd server
npm start
```

## 🚀 Deployment

This app can be deployed to:
- **Heroku**: Add a `Procfile` and deploy
- **Vercel**: Frontend on Vercel, backend as serverless functions
- **AWS/Azure**: Traditional server deployment
- **Firebase Hosting**: Frontend only

## 📄 Dependencies

### Backend (server/package.json)
- `express`: Web framework
- `cors`: Cross-Origin Resource Sharing
- `body-parser`: Request body parsing
- `axios`: HTTP client for API calls
- `nodemon` (dev): Auto-reload during development

## 💡 Future Enhancements

- Real-time stock data integration
- User authentication and accounts
- Fund withdrawal and management system
- More earning games and challenges
- Advanced analytics and charts
- Leaderboards (top earners and traders)
- Mobile app version
- Streak bonuses for consistent gameplay

## 📝 License

This project is part of the 5th Semester IPRE course.

## 👨‍💻 Author

Created as an educational project for practicing web development and trading concepts.

---

**Happy Trading! 📊**
