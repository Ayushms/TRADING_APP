// Initial Setup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    updateWallet();
    updatePortfolio();

    // Poll for updates every 5 seconds
    setInterval(updateWallet, 5000);
    setInterval(updatePortfolio, 5000);

    // Initial price check
    fetchQuote();

    // Update price when symbol changes
    document.getElementById('order-symbol').addEventListener('change', (e) => {
        initChart(e.target.value);
        fetchQuote();
    });
});

let currentSymbol = "BSE:RELIANCE";

function initChart(symbol = "BSE:RELIANCE") {
    currentSymbol = symbol;
    // ensure container is clean
    const container = document.getElementById('tradingview_chart');
    container.innerHTML = "";

    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "D",
        "timezone": "Asia/Kolkata",
        "theme": "dark",
        "style": "1",
        "locale": "in",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_chart"
    });
}

function fetchQuote() {
    const symbol = document.getElementById('order-symbol').value || currentSymbol;
    // Simulation: In real world, use the API. 
    // Here we'll simulate a fetch to our own backend which acts as a proxy
    // For visual feedback in the "Price" input.
    fetch(`/api/quote/${symbol}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('order-price').value = `₹${data.price}`;
        })
        .catch(err => console.error("Error fetching quote:", err));
}

function updateWallet() {
    fetch('/api/wallet')
        .then(res => res.json())
        .then(data => {
            document.getElementById('wallet-balance').innerText = `₹${data.balance.toLocaleString('en-IN')}`;
        });
}

function placeOrder(action) {
    const symbol = document.getElementById('order-symbol').value;
    const qty = document.getElementById('order-qty').value;
    const priceStr = document.getElementById('order-price').value.replace('₹', '');
    const price = parseFloat(priceStr);

    if (!symbol || !qty || !price) {
        showMessage("Please check inputs", "error");
        return;
    }

    const payload = {
        symbol,
        action,
        quantity: parseInt(qty),
        price: price
    };

    fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showMessage(data.error, "error");
            } else {
                showMessage(`Success: ${action} ${qty} ${symbol}`, "success");
                updateWallet();
                updatePortfolio();
            }
        })
        .catch(err => showMessage("Network Error", "error"));
}

async function updatePortfolio() {
    try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();

        // Render Positions
        const tbody = document.getElementById('positions-body');
        tbody.innerHTML = '';

        if (data.portfolio.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; opacity:0.5;">No Open Positions</td></tr>';
        } else {
            // Use Promise.all to fetch all quotes in parallel
            const positionsWithData = await Promise.all(data.portfolio.map(async (pos) => {
                let ltp = pos.averagePrice; // Default fallback
                try {
                    const qRes = await fetch(`/api/quote/${pos.symbol}`);
                    const qData = await qRes.json();
                    ltp = parseFloat(qData.price);
                } catch (err) {
                    console.error("Error fetching quote for P&L", err);
                }

                const pnl = (ltp - pos.averagePrice) * pos.quantity;
                return { ...pos, ltp, pnl };
            }));

            positionsWithData.forEach(pos => {
                const pnlClass = pos.pnl >= 0 ? 'tx-green' : 'tx-red';
                const pnlSign = pos.pnl >= 0 ? '+' : '';

                const row = `<tr>
                    <td>${pos.symbol}</td>
                    <td>${pos.quantity}</td>
                    <td>₹${pos.averagePrice.toFixed(2)}</td>
                    <td>₹${pos.ltp.toFixed(2)}</td>
                    <td class="${pnlClass}">${pnlSign}₹${pos.pnl.toFixed(2)}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }

        // Render Transactions (Last 5)
        const txList = document.getElementById('transactions-list');
        txList.innerHTML = '';
        const recentTx = data.transactions.slice(-5).reverse();
        recentTx.forEach(tx => {
            const colorClass = (tx.type === 'BUY' || tx.type === 'DEPOSIT') ? 'tx-green' : 'tx-red';
            const li = document.createElement('li');
            li.innerHTML = `<span class="${colorClass}">${tx.type}</span> ${tx.symbol} - <span style="white-space:nowrap;">₹${tx.price}</span>`;
            txList.appendChild(li);
        });
    } catch (err) {
        console.error("Error updating portfolio:", err);
    }
}

function showMessage(msg, type) {
    const box = document.getElementById('order-message');
    box.innerText = msg;
    box.style.color = type === 'error' ? '#ff5252' : '#69f0ae';
    setTimeout(() => { box.innerText = ''; }, 3000);
}
