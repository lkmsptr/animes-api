const express = require("express");
const app = express();
const Scraping = require("./src/Scraper");

const data = new Scraping();

app.get("/", (req, res) => {
  res.send("Hello Api is ready!!!");
});

app.get("/api/watch/:slug", async (req, res) => {
  const slug = req.params.slug;
  const response = await data.getStreaming(slug);
  res.json({ results: response });
});

app.get("/api/download/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const response = await data.getDownload(slug);
    res.json({ results: response });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/latest", async (req, res) => {
  const page = req.query.page;
  let response;
  if (page) {
    response = await data.getLatest(page);
  } else {
    response = await data.getLatest();
  }
  res.json({ results: response });
});

app.get("/api/anime/:slug", async (req, res) => {
  const slug = req.params.slug;
  const response = await data.animeDetail(slug);
  res.json({ results: response });
});

app.listen(3000, () => {
  console.log("Server started!");
});
