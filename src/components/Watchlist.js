import React, { createContext, useContext, useState, useEffect } from 'react';
import './Watchlist.css';


const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);

    
    const fetchWatchlist = async () => {
        try {
            const response = await fetch('http://localhost:5000/watchlist');
            if (response.ok) {
                const data = await response.json();
                setWatchlist(data);
            } else {
                console.error('Failed to fetch watchlist from MongoDB');
            }
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const addToWatchlist = async (stock) => {
        setWatchlist((prev) => [...prev, stock]);

       
        try {
            const response = await fetch('http://localhost:5000/watchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{ symbol: stock.symbol, rate: stock.price }]), 
            });

            if (response.ok) {
                alert(`Successfully added ${stock.symbol} to the watchlist!`);
                fetchWatchlist(); 
            } else {
                alert('Failed to save to MongoDB. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding to the watchlist.');
        }
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlist = () => {
    return useContext(WatchlistContext);
};

const Watchlist = () => {
    const { watchlist } = useWatchlist();

    return (
        <div className="watchlist">
            <h2 className='head'>Your Watchlist</h2>
            {watchlist.length === 0 ? (
                <p>No stocks in your watchlist.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Stock Symbol</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {watchlist.map((item) => (
                            <tr key={item.symbol}>
                                <td>{item.symbol}</td>
                                <td>${item.rate.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Watchlist;
