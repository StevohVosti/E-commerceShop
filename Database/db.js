const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path: "config/config.env"});

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const ConnectDatabase = () => {
  mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@e-commerce-shop.nnoih4j.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((data) => {
    console.log(`Database is now connected: ${data.connection.host}`)
  })
}

module.exports = ConnectDatabase;