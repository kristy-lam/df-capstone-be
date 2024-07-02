import express from "express";
import validateEnq from "../middlewares/enq.validator.js";
import verifyToken from "../middlewares/authJwt.js";
import {
  sendAddEnqRes,
  sendDeleteEnqRes,
  sendGetEnqsRes,
  sendUpdateEnqRes,
} from "../controllers/enq.controller.js";

const enqRouter = express.Router();

enqRouter.post("/add", validateEnq, sendAddEnqRes);

enqRouter.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization"
  );
  next();
});

enqRouter.get("/all", verifyToken, sendGetEnqsRes);

enqRouter.patch("/:id", verifyToken, validateEnq, sendUpdateEnqRes);

enqRouter.delete("/:id", verifyToken, sendDeleteEnqRes);

export default enqRouter;
