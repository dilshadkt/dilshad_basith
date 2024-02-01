const mongoose = require("mongoose");
const favoriteSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },
  listingId: { type: mongoose.Schema.ObjectId, ref: "Listing" },
});

module.exports = mongoose.model("Favorite", favoriteSchema);