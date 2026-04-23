const redis = require("../config/redisClient");
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;       // max tokens
    this.refillRate = refillRate;   // tokens per second
  }

  async allowRequest(key) {
    console.log("🔥 allowRequest called with key:", key);
    const now = Date.now() / 1000;

    let data = await redis.hmget(key, "tokens", "lastRefill");

    let tokens = parseFloat(data[0]);
    let lastRefill = parseFloat(data[1]);

    if (isNaN(tokens)) tokens = this.capacity;
    if (isNaN(lastRefill)) lastRefill = now;

    // refill tokens
    const elapsed = now - lastRefill;
    tokens = Math.min(this.capacity, tokens + elapsed * this.refillRate);

    if (tokens < 1) {
      await redis.hmset(key, {
        tokens,
        lastRefill: now
      });
      return false;
    }

    tokens -= 1;

    await redis.hmset(key, {
      tokens,
      lastRefill: now
    });

    return true;
  }
}

module.exports = TokenBucket;