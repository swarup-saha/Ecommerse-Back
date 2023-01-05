const app = require("./app");
const serverless = require("serverless-http");
const express = require("express");
const router = express.Router();
app.use("/.netlify/functions/api", router);
app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
module.exports.handler = serverless(app);
