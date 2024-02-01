const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  userId: { type: String, ref: "User" },
  listingId: { type: mongoose.Schema.ObjectId, ref: "Listing" },
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
  cancelledByHost: { type: Boolean, default: false },
  // paymentDone: { type: Boolean, default: false },
  // promocodeAdded:{ type: Boolean, default: false },
  promocode:{ type: mongoose.Schema.ObjectId, ref: "Offer" },
  image:String
});

module.exports = mongoose.model("Reservation", reservationSchema);
