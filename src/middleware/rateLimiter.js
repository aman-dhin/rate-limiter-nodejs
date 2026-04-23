const TokenBucket = require("../limiter/tokenBucket");

const plans = {
  free: new TokenBucket(5, 1),
  premium: new TokenBucket(20, 5)
};

const rateLimiter = async (req, res, next) => {
  try {
    console.log("👉 Middleware hit");

    const userId = req.headers["x-user-id"] || req.ip;
    const userPlan = req.headers["x-plan"] || "free";

    console.log("User:", userId);
    console.log("Plan:", userPlan);

    const limiter = plans[userPlan] || plans["free"];

    const key = `rate:${userPlan}:${userId}`;
    console.log("Key:", key);

    const allowed = await limiter.allowRequest(key);

    console.log("Allowed:", allowed);

    res.setHeader("X-RateLimit-Limit", limiter.capacity);

    if (!allowed) {
      return res.status(429).json({
        message: "Rate limit exceeded 🚫"
      });
    }

    next();
  } catch (err) {
    console.error("❌ Middleware Error:", err);
    next();
  }
};

module.exports = rateLimiter;