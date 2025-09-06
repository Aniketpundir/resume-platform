const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret_dev_key";

module.exports = function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token provided" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🟢 Match karo jo tumne sign ke time use kiya tha
    req.userId = decoded.id || decoded.userId || decoded._id;

    if (!req.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
