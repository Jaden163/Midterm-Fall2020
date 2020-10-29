import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import ArrowImage from "../components/ArrowImage";
import Header from "../components/Header";
import Graph from "../components/Graph";
import News from "../components/News";

function Home() {
  const [company, setCompany] = useState("Tesla");
  const history = useHistory();
  const [companyData, setCompanyData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [tickerData, setTickerData] = useState(null);
  var ticker = "";

  const FMP_key = process.env.REACT_APP_FMP_KEY;
  const NEWS_key = process.env.REACT_APP_NEWS_KEY;

  useEffect(() => {
    const searchParams = history.location.search;
    const urlParams = new URLSearchParams(searchParams);
    const company = urlParams.get("company");
    if (company) {
      setCompany(company);
    }
  }, [history]);

  useEffect(() => {
    // search for ticker symbol given company name

    axios
      .get(
        `https://financialmodelingprep.com/api/v3/search?query=${company}&exchange=NASDAQ&limit=10&apikey=${FMP_key}`
      )
      .then(function (response) {
        // gets first result returned
        ticker = response.data[0].symbol;
        // get stock price data on 1-minute interval
        axios
          .get(
            `https://financialmodelingprep.com/api/v3/historical-chart/1min/${ticker}?apikey=${FMP_key}`
          )
          .then(function (response) {
            // filter data for 1-day prices. API also returns data from previous day so I wanted to skip those
            const targetDate = new Date(response.data[0].date).getDate();
            let i;
            for (i = 0; i < response.data.length; i++) {
              if (new Date(response.data[i].date).getDate() !== targetDate) {
                // find first index where date is not on the same day
                break;
              }
            }
            const filteredData = response.data.slice(0, i);
            setTickerData(filteredData);
          })
          .catch(function (error) {
            console.log(error);
          });

        // get company profile data
        axios
          .get(
            `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${FMP_key}`
          )
          .then(function (response) {
            setCompanyData(response.data[0]);
          })
          .catch(function (error) {
            console.log(error);
          });
        // API for news
        axios
          .get(
            `https://newsapi.org/v2/everything?qInTitle=${ticker}&language=en&from=2020-10-20&sortBy=relevancy&pageSize=10&apiKey=${NEWS_key}`
          )
          .then(function (response) {
            // get request to URL
            setNewsData(response.data.articles);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        // error handle
        console.log(error);
      });
  }, [company]);

  const {
    companyName,
    currency,
    exchangeShortName,
    imageURL,
    industry,
    sector,
    symbol,
    website,
  } = useMemo(() => {
    let companyName = "";
    let currency = "";
    let exchangeShortName = "";
    let imageURL = "";
    let industry = "";
    let sector = "";
    let symbol = "";
    let website = "";

    if (companyData) {
      companyName = companyData.companyName;
      currency = companyData.currency;
      exchangeShortName = companyData.exchangeShortName;
      imageURL = companyData.image;
      industry = companyData.industry;
      sector = companyData.sector;
      symbol = companyData.symbol;
      website = companyData.website;
    }

    return {
      companyName,
      currency,
      exchangeShortName,
      imageURL,
      industry,
      sector,
      symbol,
      website,
    };
  }, [companyData]);

  const {
    colorChange,
    currentPrice,
    initialPrice,
    percentChange,
    priceChange,
  } = useMemo(() => {
    let colorChange = "";
    let currentPrice = "";
    let initialPrice = "";
    let percentChange = "";
    let priceChange = "";

    if (tickerData) {
      currentPrice = tickerData[0].close.toFixed(2);
      initialPrice = tickerData.slice(-1)[0].open.toFixed(2);
      priceChange = (currentPrice - initialPrice).toFixed(2);
      percentChange = ((priceChange / initialPrice) * 100).toFixed(2);
      if (percentChange) {
        if (percentChange >= 0) {
          colorChange = "#0f9d58";
        } else if (percentChange < 0) {
          colorChange = "#d23f31";
        }
      }
    }
    return {
      colorChange,
      currentPrice,
      initialPrice,
      percentChange,
      priceChange,
    };
  }, [tickerData]);

  return (
    <div className="Page">
      <Header />
      <main className="Home">
        <div>
          <div className="StockInfo">
            <div className="CompanyInfo">
              <img
                className="ComapnyInfo_CompanyImage"
                src={imageURL}
                alt={companyName}
              />
              <div className="CompanyInfo_Description">
                <p className="CompanyInfo_CompanyName">{companyName}</p>
                <p className="CompanyInfo_Labels">
                  {exchangeShortName}: {symbol}
                </p>
                <p className="CompanyInfo_Labels">
                  {sector}: {industry}
                </p>
                <a href={website} className="CompanyInfo_Labels">
                  {website}
                </a>
              </div>
            </div>

            <div className="StockData">
              <p className="StockData_Row">
                <span className="StockData_currentPrice">{currentPrice}</span>
                <span className="StockData_currency"> {currency} </span>
              </p>
              <p className="StockData_Row" style={{ color: `${colorChange}` }}>
                <span className="StockData_priceChange">{priceChange}</span>
                <span className="StockData_percentChange">
                  ({percentChange}%)
                </span>
                <span className="StockData_Image">
                  <ArrowImage
                    percentChange={percentChange}
                    colorChange={colorChange}
                  />
                </span>
              </p>
            </div>
          </div>

          <div className="StockPriceGraph">
            <Graph tickerData={tickerData} colorChange={colorChange} />
          </div>
          <News newsData={newsData} />
        </div>
      </main>
    </div>
  );
}

export default Home;
