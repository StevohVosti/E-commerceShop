const app = require("./app");
const ConnectDatabase = require("./Database/db");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config({path: "config/config.env"});

const PORT = process.env.PORT || 8000;

// connect Database
mongoose.set("strictQuery", true);
mongoose.set("strictQuery", false);

ConnectDatabase();

const server = app.listen(PORT, () => (
  console.log(`Server is working https://localhost:${PORT}`)
));

// Unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the Server due to unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});