const mongoose = require("mongoose");

const AuthUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    //required: true,
  },
  lastName: {
    type: String,
    default: "",
  },
  displayName: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    //required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("authusers", AuthUserSchema);
//module.exports = UserModel;
