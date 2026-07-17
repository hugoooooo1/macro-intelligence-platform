const fs = require("fs");

const API_KEY = "f282896cc09d42f8be3f398008d95c0c";

async function getNews(query) {

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=5&sortBy=publishedAt&apiKey=${API_KEY}`
  );

  const data = await response.json();

  if (!data.articles) return [];

  return data.articles.map(article => ({
    title: article.title,
    url: article.url,
    source: article.source?.name || "Unknown"
  }));
}

async function updateDashboard() {

  const usa = await getNews("US economy");

  const china = await getNews("China economy");

  const geopolitics = await getNews(
    "Middle East OR Taiwan OR Ukraine"
  );

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
