require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const portfolioRoute = require("./routes/portfolio");
app.use("/", portfolioRoute);

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
