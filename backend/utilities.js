const jwt = require("jsonwebtoken");

function authentificateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  //No token, unauthorized
  if (!token) return res.sendStatus(401);
  // return res.status(401).json({ error: true, message: "Unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //Token invalid, forbidden
    if (err) return res.sendStatus(403);
    // return res.status(403).json({ error: true, message: "Forbidden" });

    req.user = user;
    next();
  });
}

module.exports = {
  authentificateToken,
};
