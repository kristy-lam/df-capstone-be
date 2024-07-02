import { body, validationResult } from "express-validator";

const validateEnq = [
  body("preferredName")
    .isString()
    .notEmpty()
    .withMessage("Must provide a preferred name"),
  body("mobile")
    .isString()
    .notEmpty()
    .withMessage("Must provide a valid mobile phone number"),
  body("email").isEmail().withMessage("Must provide a valid email address"),
  body("postcode")
    .matches(/^([A-Z]{1,2}[0-9][0-9A-Z]?[ ]?[0-9][A-Z]{2})$/)
    .withMessage("Must provide a valid postcode"),
  body("testPreparation")
    .isBoolean()
    .notEmpty()
    .withMessage("Must indicate true or false"),
  body("skillsImprovement")
    .isBoolean()
    .notEmpty()
    .withMessage("Must indicate true or false"),
  body("enqMessage").isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ message: "Invalid enquiry", errors: errors.array() });
    }
    next();
  },
];

export default validateEnq;
