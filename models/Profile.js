const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
