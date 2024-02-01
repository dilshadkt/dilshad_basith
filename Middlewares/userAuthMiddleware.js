const jwt = require("jsonwebtoken");
// Middleware to verify JWT token
module.exports = function TokenVerify(req, res, next) {
  // console.log(req);
  const auth = req.headers["authorization"];

  const token = auth && auth.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.email = decoded.email;
    
    next();
  });
};
