const { check } = require("express-validator");

exports.registerVaildator = [
  check("name").trim().not().isEmpty().withMessage("Name is required"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
  check("password")
    .isLength({ min: 8 })
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters with 1 uppercase, 1 lowercase,1 number, and 1 symbol "
    ),
];
