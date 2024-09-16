const passport = require("passport");
const mongoose = require("mongoose");

const AuthUser = mongoose.model("authusers");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

//const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTHURL } = require("./keys");
passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.OAUTH_CLIENT_ID}`,
      clientSecret: `${process.env.OAUTH_CLIENT_SECRET}`,
      callbackURL: `${process.env.OAUTHURL}`,
      scope: ["profile", "email"],
    },

    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const newUser = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
      };
      //console.log(newUser);
      try {
        let user = await AuthUser.findOne({ email: newUser.email });
        if (user) {
          // User Exists
          console.log("EXISTS ", user);
          done(null, user);
        } else {
          // Sign Up for the first time
          user = await AuthUser.create(newUser);
          await user.save();
          console.log("NEW ", user);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

//it is for new user to update the session with new user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//checking if user is logged in then diract move to dashboard
passport.deserializeUser(async (id, done) => {
  try {
    const user = await AuthUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
