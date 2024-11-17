import React, { useEffect, useState, useCallback } from 'react';
import './News.css'; 

const News = () => {
    const [search, setSearch] = useState("Stocks"); 
    const [newsData, setNewsData] = useState(null);
    const API_KEY = "b6416b78bc0349dea2c69fd9b3482950";

    const getData = useCallback(async () => {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`);
        const jsonData = await response.json();
        console.log(jsonData.articles);
        let dt = jsonData.articles.slice(0, 10); 
        setNewsData(dt);
    }, [search]);

    useEffect(() => {
        getData(); 
    }, [getData]);

    const userInput = (event) => {
        setSearch(event.target.value);
        getData(); 
    };

    return (
        <div>
            
            <div>
                <h2 className="head">Latest Stock Market Updates</h2>
            </div>
            <div className="categoryBtn">
                <button onClick={userInput} value="Stocks">Stocks</button>
                <button onClick={userInput} value="money">Money</button>
                <button onClick={userInput} value="investment">Investment</button>
            </div>
            <div>
                {newsData && newsData.map((article, index) => (
                    <div key={index} className="news-item">
                        {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
                        <h3>{article.title}</h3>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
