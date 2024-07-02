import express from "express";
import { body } from "express-validator";

import sendAuthRes from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization"
  );
  next();
});

authRouter.post(
  "/login",
  [body("username").exists().escape(), body("password").exists().escape()],
  sendAuthRes
);

export default authRouter;
