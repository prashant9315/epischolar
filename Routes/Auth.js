const { Router } = require("express");
const passport = require("passport");
const AuthUser = require("../models/Authuser");
const User = require("../models/User");
const router = new Router();
const jwt = require("jsonwebtoken");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "${process.env.FRONTEND_API}/signin",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    console.log(user);

    try {
      const { email } = user;
      const find = await User.findOne({ email });
      const errorMsg = "Auth failed email or password is wrong";
      if (!find) {
        return res.redirect(`${process.env.FRONTEND_API}/`);
      } else {
        // Optionally create a JWT token
        const find1 = await AuthUser.findOne({ email });
        const jwtToken = jwt.sign(
          { id: find1._id, email: find1.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" } // Token expires in 1 hour
        );
        console.log(jwtToken);
        // return res.status(200).json({
        //   message: "Login Success",
        //   success: true,
        //   jwtToken, // Send JWT token
        //   name: find.displayName,
        //   email: find.email,
        // });

        return res.redirect(
          `${process.env.FRONTEND_API}/dashboard?token=${jwtToken}&name=${find1.displayName}&email=${find1.email}`
        );
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server errror",
        success: false,
      });
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
