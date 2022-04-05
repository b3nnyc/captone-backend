const express = require("express");
const router = express.Router();
const fs = require("fs");
const app = express();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { uuid } = require("uuidv4");

app.use(cors());

const getPortfolio = () => {
  const portfolio = fs.readFileSync("./data/portfolio.json");
  return JSON.parse(portfolio);
};

const savePortfolioItem = (item) => {
  fs.writeFileSync("./data/portfolio.json", JSON.stringify(item));
};

router
  .route("/")
  .get((_req, res) => {
    let fetchPortfolio = getPortfolio().map((item) => {
      return {
        id: item.id,
        symbol: item.symbol,
        position: item.position,
        shares: item.shares,
        price: item.price,
      };
    });
    res.status(200).json(fetchPortfolio);
  })

  .post((req, res) => {
    const newPortfolioItem = {
      id: uuidv4(),
      symbol: req.body.symbol,
      position: req.body.position,
      shares: req.body.shares,
      price: req.body.price,
    };

    let portfolio = getPortfolio();
    portfolio.push(newPortfolioItem);
    savePortfolioItem(portfolio);
    res.status(201).send({
      status: `Added ${newPortfolioItem.symbol}`,
    });
  });

router
  .route("/:id")
  .get((req, res) => {
    const singleItem = getPortfolio().find((item) => item.id === req.params.id);
    if (!singleItem) {
      res.status(404).json({
        message: "Portfolio item does not exist",
      });
      return;
    }
    res.status(200).json(singleItem);
  })
  .delete((req, res) => {
    const updatedPortfolio = getPortfolio().filter(
      (item) => item.id !== req.params.id
    );
    savePortfolioItem(updatedPortfolio);
    res.status(204).send("Deleted");
  });
module.exports = router;
