const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory simulation state
// NOTE: In a real app, this would be a database.
let walletBalance = 5000; 
let portfolio = []; // Array of { symbol, quantity, averagePrice }
let transactions = []; // Array of { type, symbol, price, quantity, date }

// Mock OpenAlgo URL (User should run OpenAlgo locally)
// If OpenAlgo is not running, we will simulate the execution.
const OPENALGO_URL = 'http://127.0.0.1:5000'; 

// --- API Endpoints ---

// 1. Wallet
app.get('/api/wallet', (req, res) => {
    res.json({ balance: walletBalance });
});

app.post('/api/wallet/add-funds', (req, res) => {
    const { amount, source } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }
    walletBalance += amount;
    transactions.push({
        type: 'DEPOSIT',
        symbol: source || 'GAME_REWARD',
        price: amount,
        quantity: 1,
        date: new Date()
    });
    console.log(`[WALLET] Added ₹${amount} from ${source}. New Balance: ₹${walletBalance}`);
    res.json({ success: true, newBalance: walletBalance });
});

// 2. Order Execution (Buy/Sell)
app.post('/api/order', async (req, res) => {
    const { symbol, action, quantity, price } = req.body;
    
    // Basic validation
    if (!symbol || !action || !quantity || !price) {
        return res.status(400).json({ error: 'Missing order details' });
    }

    const totalCost = price * quantity;

    if (action.toUpperCase() === 'BUY') {
        if (totalCost > walletBalance) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Deduct funds
        walletBalance -= totalCost;
        
        // Update Portfolio
        let position = portfolio.find(p => p.symbol === symbol);
        if (position) {
            // Update average price
            const totalValue = (position.quantity * position.averagePrice) + totalCost;
            position.quantity += parseInt(quantity);
            position.averagePrice = totalValue / position.quantity;
        } else {
            portfolio.push({
                symbol: symbol,
                quantity: parseInt(quantity),
                averagePrice: parseFloat(price)
            });
        }

        transactions.push({ type: 'BUY', symbol, price, quantity, date: new Date() });
        
        // Try to notify OpenAlgo (Fire and Forget or await)
        try {
            // This is where we would integrate with the real OpenAlgo API
            // await axios.post(`${OPENALGO_URL}/api/place_order`, { ... });
            console.log(`[OPENALGO] Placed BUY order for ${symbol}`);
        } catch (err) {
            console.warn('[OPENALGO] Connector unreachable, using internal simulation only.');
        }

        return res.json({ success: true, message: 'Order Executed', newBalance: walletBalance });

    } else if (action.toUpperCase() === 'SELL') {
        let position = portfolio.find(p => p.symbol === symbol);
        if (!position || position.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient holdings' });
        }

        // Add funds
        walletBalance += totalCost;

        // Update Portfolio
        position.quantity -= parseInt(quantity);
        if (position.quantity === 0) {
            portfolio = portfolio.filter(p => p.symbol !== symbol);
        }

        transactions.push({ type: 'SELL', symbol, price, quantity, date: new Date() });
        return res.json({ success: true, message: 'Order Executed', newBalance: walletBalance });
    }

    res.status(400).json({ error: 'Invalid action' });
});

// 3. Portfolio
app.get('/api/portfolio', (req, res) => {
    res.json({ portfolio, transactions });
});

// 4. Market Data Proxy (Optional, if we want to hide API keys or process data)
// For now, frontend will use TradingView Widget, but if we need raw data:
app.get('/api/quote/:symbol', async (req, res) => {
    // In a real scenario, use tradingview-scraper or similar here.
    // For this prototype, we'll return a mock or fetch from a public source if needed.
    // Returning a mock to ensure the UI works without complex scraping first.
    res.json({ 
        symbol: req.params.symbol, 
        price: (Math.random() * 1000 + 2000).toFixed(2), // Mock price for game logic if needed
        change: (Math.random() * 20 - 10).toFixed(2)
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Paper Trading Server running at http://localhost:${PORT}`);
    console.log(`OpenAlgo Integration: HTTP Mode (Simulated if unreachable)`);
});
