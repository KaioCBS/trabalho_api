const Redis = require('ioredis');

let redis;
let fallback = new Map();

function init(redisUrl) {
  if (redis) return redis;
  if (!redisUrl) {
    try {
      redis = new Redis();
    } catch (e) {
      redis = null;
    }
  } else {
    redis = new Redis(redisUrl);
  }
  return redis;
}

async function get(key) {
  if (redis) {
    const v = await redis.get(key);
    return v ? JSON.parse(v) : null;
  } else {
    return fallback.has(key) ? fallback.get(key) : null;
  }
}

async function set(key, value, ttlSeconds) {
  if (redis) {
    const str = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.set(key, str, 'EX', ttlSeconds);
    } else {
      await redis.set(key, str);
    }
  } else {
    fallback.set(key, value);
    if (ttlSeconds) {
      setTimeout(() => fallback.delete(key), ttlSeconds * 1000);
    }
  }
}

module.exports = { init, get, set };
