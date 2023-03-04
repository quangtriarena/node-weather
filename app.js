import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import fileDirName from "./src/utils/pathUrl.js";
import path from "path";
const { __dirname, __filename } = fileDirName(import.meta);

/**
 * app middlewares
 */
const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));

/**
 * static file
 */
const pathPublic = path.join(__dirname, "public");
app.use(express.static(pathPublic));

/**
 * setup view engine
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

/**
 * routes
 */
app.get("/", async (req, res) => {
  const { address } = req.query;
  if (!address) {
    res.render("weather", {
      status: false,
    });
  }

  const url = `http://api.weatherstack.com/current?access_key=${process.env.API_KEY}&query=${address}`;
  try {
    const response = await axios.get(url);
    const weather = {
      region: response.data.location.region,
      country: response.data.location.country,
      temperature: response.data.current.temperature,
      wind_speed: response.data.current.wind_speed,
      precip: response.data.current.precip,
      cloudcover: response.data.current.cloudcover,
    };

    res.render("weather", weather);
  } catch (error) {
    return {
      success: false,
      message: error?.message,
    };
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("server started port" + 3001);
});
