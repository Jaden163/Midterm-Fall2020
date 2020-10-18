import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "../components/Header";
import Graph from "../components/Graph";

function Home() {
  const [company, setCompany] = useState("Tesla");
  const history = useHistory();
  const [companyData, setCompanyData] = useState(null);
  const [tickerData, setTickerData] = useState(null);

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
        "https://financialmodelingprep.com/api/v3/search?query=AA&limit=10&apikey=demo"
        // `https://financialmodelingprep.com/api/v3/search?query=${company}&limit=10&apikey=${FMP_key}`
      )
      .then(function (response) {
        // gets first result returned
        const ticker = response.data[0].symbol;

        // get stock price data on 1-minute interval
        axios
          .get(
            "https://financialmodelingprep.com/api/v3/historical-chart/1min/AAPL?apikey=demo"
            // `https://financialmodelingprep.com/api/v3/historical-chart/1min/${ticker}?apikey=${FMP_key}`
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
            "https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=demo"
            // `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${FMP_key}`
          )
          .then(function (response) {
            setCompanyData(response.data[0]);
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
    price,
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

  const { intialPrice, currentPrice } = useMemo(() => {
    let currentPrice = "";
    let intialPrice = "";

    if (tickerData) {
      console.log(tickerData);
      currentPrice = tickerData[0].close;
      intialPrice = tickerData.slice(-1)[0].open;
    }
    return {
      currentPrice,
      intialPrice,
    };
  }, [tickerData]);

  return (
    <div>
      <Header />
      <main className="Home">
        <div>
          <div className="StockInfo">
            <div className="CompanyInfo">
              <img src={imageURL} alt={companyName} />
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
              <p className="StockData_Table">
                <span className="StockData_currentPrice"> {currentPrice}</span>
                <span className="StockData_initialPrice"> {intialPrice}</span>
                <span className="StockData_currency"> {currency} </span>
              </p>
            </div>
          </div>

          <div className="StockPriceGraph">
            <Graph tickerData={tickerData} />
          </div>
          <h3>Current Price</h3>
          <h4>% changes and $changes</h4>
        </div>
      </main>
    </div>
  );
}

export default Home;
