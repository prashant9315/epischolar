const { signup, signin } = require("../Controller/AuthController");
const {
  signupValidation,
  loginValidation,
} = require("../Middleware/AuthValidation");

const router = require("express").Router();

router.post("/signin", loginValidation, signin);
router.post("/signup", signupValidation, signup);

module.exports = router;
