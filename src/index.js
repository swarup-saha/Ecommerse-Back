const app = require("./app");
const serverless = require("serverless-http");

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
module.exports.handler = serverless(app);
