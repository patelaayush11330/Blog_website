const rateLimiters = {};

module.exports = (keyFn, limit = 5, windowMs = 60 * 1000) => (req, res, next) => {
  const key = keyFn(req);
  const now = Date.now();
  if (!rateLimiters[key]) rateLimiters[key] = [];
  // Remove old timestamps
  rateLimiters[key] = rateLimiters[key].filter(ts => now - ts < windowMs);
  if (rateLimiters[key].length >= limit) {
    return res.status(429).json({ message: 'Too many requests. Please slow down.' });
  }
  rateLimiters[key].push(now);
  next();
}; 