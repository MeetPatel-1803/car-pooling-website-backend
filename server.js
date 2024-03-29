const express = require("express");
const app = express();
const dotenv = require("dotenv");
const routes = require("./routes/index");
const limiter = require("./middleware/rateLimiter");
const cors = require("cors");

dotenv.config({ path: ".env" });

app.use(express.json());
app.use(cors());
app.use(limiter);
app.use("/", routes);

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");

  next();
});

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port : ${process.env.PORT}`);
});
