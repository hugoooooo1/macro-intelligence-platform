const fs = require("fs");

const NEWS_API_KEY = "TA_CLE_NEWSAPI";
const FMP_API_KEY = "TA_CLE_FMP";

async function getNews(query) {

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=5&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
  );

  const data = await response.json();

  if (!data.articles) return [];

  return data.articles.map(article => ({
    title: article.title,
    url: article.url,
    source: article.source?.name || ""
  }));
}

async function getQuote(symbol) {

  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`
  );

  const data = await response.json();

  return data[0];
}

async function updateDashboard() {

  const usa = await getNews("US economy");

  const china = await getNews("China economy");

  const geopolitics = await getNews(
    "Middle East OR Taiwan OR Ukraine"
  );

  const sp500 = await getQuote("%5EGSPC");
  const nasdaq = await getQuote("%5EIXIC");

  const dashboard = {

    lastUpdate:
      new Date().toLocaleString("fr-FR"),

    riskScore: 7,

    commodities: {
      brent: {
        price: 84.3,
        change: 1.4
      },

      wti: {
        price: 81.1,
        change: 1.1
      },

      gold: {
        price: 3350,
        change: 0.4
      }
    },

    markets: {

      sp500: {
        price: sp500?.price || 0,
        change: sp500?.changesPercentage || 0
      },

      nasdaq: {
        price: nasdaq?.price || 0,
        change: nasdaq?.changesPercentage || 0
      }

    },

    usa,
    china,
    geopolitics

  };

  fs.writeFileSync(
    "data.json",
    JSON.stringify(dashboard, null, 2)
  );

  console.log("Dashboard updated");
}

updateDashboard();
