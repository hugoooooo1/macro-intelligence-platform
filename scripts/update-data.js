const fs = require("fs");

const API_KEY = "TA_CLE_NEWSAPI";

async function getNews(query) {
  const url =
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=5&sortBy=publishedAt&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.articles) {
    return [];
  }

  return data.articles.map(article => ({
    title: article.title,
    url: article.url
  }));
}

async function updateDashboard() {

  const usa = await getNews("US economy");
  const china = await getNews("China economy");

  const dashboard = {

    lastUpdate: new Date().toLocaleString("fr-FR"),

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

    usa,
    china
  };

  fs.writeFileSync(
    "data.json",
    JSON.stringify(dashboard, null, 2)
  );

  console.log("Dashboard updated");
}

updateDashboard();
