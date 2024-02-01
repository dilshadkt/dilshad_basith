const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
module.exports = function verifyToken(req, res, next) {
  // Check if the ADMIN_ACCESS_TOKEN_SECRET environment variable is set
  if (!process.env.ADMIN_ACCESS_TOKEN_SECRET) {
    return res
      .status(500)
      .json({
        error: "ADMIN_ACCESS_TOKEN_SECRET environment variable not found",
      });
  }

  // Extract the token from the Authorization header
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];

  // Check if the token exists
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, decoded) => {
    // Handle errors during token verification
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Store the decoded email in the request object
    req.email = decoded.email;

    // Proceed to the next middleware
    next();
  });
};
