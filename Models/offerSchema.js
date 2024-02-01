const mongoose = require("mongoose");
const offerSchema = mongoose.Schema({
  promoCode: String,
  discount: Number,
  imgSrc: String,
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Offer", offerSchema);
