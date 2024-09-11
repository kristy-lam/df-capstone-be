import express from "express";
import validateCustomer from "../middlewares/customer.validator.js";
import verifyToken from "../middlewares/authJwt.js";
import {
  sendAddCustomerRes,
  sendGetCustomersRes,
  sendUpdateCustomerRes,
  sendDeleteCustomerRes,
} from "../controllers/customer.controller.js";

const customerRouter = express.Router();

customerRouter.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization"
  );
  next();
});

customerRouter.post("/add", verifyToken, validateCustomer, sendAddCustomerRes);

customerRouter.get("/all", verifyToken, sendGetCustomersRes);

customerRouter.patch(
  "/:id",
  verifyToken,
  validateCustomer,
  sendUpdateCustomerRes
);

customerRouter.delete("/:id", verifyToken, sendDeleteCustomerRes);

export default customerRouter;
