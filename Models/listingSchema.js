const mongoose = require("mongoose");
const listingSchema = mongoose.Schema({
  title: String,
  description: String,
  properties: [String],
  createdAt: { type: Date, default: Date.now },
  category: String,
  roomCount: Number,
  bathroomCount: Number,
  guestCount: Number,
  locationValue: {type:{}},
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },
  price: Number,
  isDeleted:{type:Boolean, default:false},
  adminApproved:{type:Boolean, default:false},
  adminDeleted : {type:Boolean, default:false},
});

module.exports = mongoose.model("Listing", listingSchema);
