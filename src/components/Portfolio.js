import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [symbol, setSymbol] = useState('');
    const [price, setPrice] = useState('');
    const [shares, setShares] = useState('');
    const [currentPrices, setCurrentPrices] = useState({});

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await axios.get('http://localhost:5000/portfolio');
                setPortfolio(response.data);
                await fetchCurrentPrices(response.data);
            } catch (error) {
                console.error('Error fetching portfolio', error);
            }
        };
        fetchPortfolio();
    }, []);

    const fetchCurrentPrices = async (portfolio) => {
        const symbols = portfolio.map(stock => stock.symbol);
        const currentPrices = {};
        
        const requests = symbols.map(async (symbol) => {
            try {
                const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=6BR63WCGVBAXGP26`);
                const data = await response.json();
                const timeSeries = data['Time Series (Daily)'];
                const latestDate = Object.keys(timeSeries)[0];
                currentPrices[symbol] = parseFloat(timeSeries[latestDate]['4. close']);
            } catch (error) {
                console.error(`Error fetching current price for ${symbol}`, error);
            }
        });

        await Promise.all(requests);
        setCurrentPrices(currentPrices);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newStock = {
            symbol,
            price: parseFloat(price),
            shares: parseInt(shares),
            purchaseRate: parseFloat(price),
        };
    
        try {
            const response = await axios.post('http://localhost:5000/portfolio', newStock);
            setPortfolio([...portfolio, response.data]);
            setSymbol('');
            setPrice('');
            setShares('');
            fetchCurrentPrices([...portfolio, response.data]);
        } catch (error) {
            console.error('Error adding stock', error);
        }
    };

    const calculateGainLossPercentage = (purchasePrice, currentPrice) => {
        if (currentPrice === undefined || purchasePrice === 0) return 0;
        return ((currentPrice - purchasePrice) / purchasePrice) * 100;
    };

    return (
        <div className="portfolio-container">
            <h2 className='head'>Your Stocks</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Asset Symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Purchase Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Shares"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        required
                    />
                    <button type="submit">Add Asset</button>
                </div>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Purchase Price</th>
                        <th>Current Price</th>
                        <th>Value</th>
                        <th>Gain/Loss (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.map(stock => {
                        const currentPrice = currentPrices[stock.symbol];
                        const gainLossPercentage = calculateGainLossPercentage(stock.price, currentPrice);
                        
                        return (
                            <tr key={stock._id}>
                                <td>{stock.symbol}</td>
                                <td>{stock.price.toFixed(2)}</td>
                                <td>{currentPrice !== undefined ? currentPrice.toFixed(2) : 'N/A'}</td>
                                <td>{(stock.shares * stock.price).toFixed(2)}</td>
                                <td>{currentPrice !== undefined ? gainLossPercentage.toFixed(2) : 'N/A'}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Portfolio;
