import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "../components/Header";

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

        // get stock price data
        axios
          .get(
            "https://financialmodelingprep.com/api/v3/historical-chart/5min/AAPL?apikey=demo"
            // `https://financialmodelingprep.com/api/v3/historical-chart/1min/${ticker}?apikey=${FMP_key}`
          )
          .then(function (response) {
            setTickerData(response.data);
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
      console.log(companyData);
      companyName = companyData.companyName;
      console.log(companyName);
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

  return (
    <div>
      <Header />
      <main className="Home">
        <div>
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

          <h3>Current Price</h3>
          <h4>% changes and $changes</h4>
        </div>
      </main>
    </div>
  );
}

export default Home;
