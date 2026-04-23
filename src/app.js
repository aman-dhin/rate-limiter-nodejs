require("dotenv").config();
const express = require("express");

const rateLimiter = require("./middleware/rateLimiter");
const api = require("./routes/api");

const app = express();

app.use(express.json());

// 🔥 DEBUG middleware (ye pakka print karega)
app.use((req, res, next) => {
  console.log("👉 Request received:", req.method, req.url);
  next();
});

// 🔥 RATE LIMITER (MUST BE HERE)
app.use(rateLimiter);

// routes
app.use("/api", api);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
app.get("/", (req, res) => {
    console.log("🔥 ROOT HIT");
    res.send("ok");
  });