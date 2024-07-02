import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      res.status(403).send({ message: "No token provided" });
    } else {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          res.status(401).send({ message: "Unauthorised" });
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    }
  } catch (e) {
    res.status(e.statusCode ?? 500).send({ message: e.message });
  }
};

export default verifyToken;
