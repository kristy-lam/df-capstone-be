import { body, validationResult } from "express-validator";

const validateCustomer = [
  body("firstName")
    .isString()
    .notEmpty()
    .withMessage("Must provide a first name"),
  body("preferredName")
    .isString()
    .notEmpty()
    .withMessage("Must provide a preferred name"),
  body("lastName")
    .isString()
    .notEmpty()
    .withMessage("Must provide a last name"),
  body("mobile")
    .isString()
    .notEmpty()
    .withMessage("Must provide a valid mobile phone number"),
  body("email")
    .isEmail()
    .notEmpty()
    .withMessage("Must provide a valid email address"),
  body("firstLineOfAddress")
    .isString()
    .notEmpty()
    .withMessage("Must provide the first line of address"),
  body("postcode")
    .matches(/^([A-Z]{1,2}[0-9][0-9A-Z]?[ ]?[0-9][A-Z]{2})$/)
    .withMessage("Must provide a valid postcode"),
  body("drivingLicenceNum")
    .matches(/^[A-Z0-9]{16}$/)
    .withMessage(
      "Must provide a valid driving licence number with 16 characters"
    ),
  body("testPreparation")
    .isBoolean()
    .notEmpty()
    .withMessage("Must indicate true or false"),
  body("skillsImprovement")
    .isBoolean()
    .notEmpty()
    .withMessage("Must indicate true or false"),
  body("enquiries").isArray(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ message: "Invalid customer", errors: errors.array() });
    }
    next();
  },
];

export default validateCustomer;
