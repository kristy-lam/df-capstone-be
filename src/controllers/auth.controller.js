import authenticateUser from "../services/auth.service.js";

const sendAuthRes = async (req, res) => {
  try {
    const user = await authenticateUser(req.body);
    res.header("Authorization", user.accessToken);
    res.status(200).send({ message: "Login success" });
  } catch (e) {
    if (e.message === "User not found") {
      res.status(404).send({ message: e.message });
    } else if (e.message === "Unauthorised") {
      res.status(401).send({ message: e.message });
    } else {
      res.status(e.statusCode ?? 500).send({ message: e.message });
    }
  }
};

export default sendAuthRes;
