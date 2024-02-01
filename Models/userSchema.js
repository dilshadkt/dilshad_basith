const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {type:String, required:true},
  email: { type: String, unique: true },
  emailVerified: Date,
  mobilenumber:{type:Number,},
  image:{ type:String,default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6V1NHpqrmEQH_NYts3Lp1X6g4MWRRLH_1gg&usqp=CAU"},
  hashedPassword: String,
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  favoriteIds: [{ type: mongoose.Schema.ObjectId, ref: "Favorite" }],
  accounts: [{ type: mongoose.Schema.ObjectId, ref: "Account" }],
  listings: [{ type: mongoose.Schema.ObjectId, ref: "Listing" }],
  reservations: [{ type: mongoose.Schema.ObjectId, ref: "Reservation" }],
  adminSuspended: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);


