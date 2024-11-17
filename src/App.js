// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StockSearch from './components/StockSearch';
import Portfolio from './components/Portfolio';
import Login from './components/Login';
import News from './components/News'; // Import the News component
import Watchlist, { WatchlistProvider } from './components/Watchlist'; // Import the merged Watchlist component
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <WatchlistProvider> {/* Wrap the app in WatchlistProvider */}
            <Router>
                <div className="app">
                    <header className="header">
                        <h1 className='head'>Stock Market Tracker</h1>
                        <nav>
                            <ul>
                                {isLoggedIn && (
                                    <>
                                        <li><Link to="/">Search</Link></li>
                                        <li><Link to="/portfolio">Portfolio</Link></li>
                                        <li><Link to="/watchlist">Watchlist</Link></li>
                                        <li><Link to="/news">News</Link></li>
                                         {/* Add link to Watchlist */}
                                    </>
                                )}
                            </ul>
                        </nav>
                    </header>
                    <main>
                        <Routes>
                            {!isLoggedIn ? (
                                <Route path="*" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                            ) : (
                                <>
                                    <Route path="/" element={<StockSearch />} />
                                    <Route path="/portfolio" element={<Portfolio />} />
                                    <Route path="/news" element={<News />} />
                                    <Route path="/watchlist" element={<Watchlist />} /> {/* Add route for Watchlist */}
                                </>
                            )}
                        </Routes>
                    </main>
                </div>
            </Router>
        </WatchlistProvider>
    );
}

export default App;
