require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const { PORT } = process.env;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(routes);

// Home route
app.get("/", (req, res) => {
  return res.send("Hello welcome to our API, WS Team");
});

// Error handling 400
app.use((_req, res) => {
  return res.status(404).json({
    status: false,
    message: "Are you lost?",
  });
});

// Eror handling 500
app.use((err, _req, res) => {
  return res.status(500).json({
    status: false,
    message: "Internal server error " + err.message,
    data: null,
  });
});

app.listen(PORT, () => {
  return console.log(`Server running on http://localhost:${PORT}`);
});
