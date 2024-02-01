const express = require("express");
const router = express.Router();
const controller = require("../Controllers/commonController");
const TryCatch = require("../Middlewares/tryCatchMiddleware");

router.get("/listings", TryCatch(controller.getAllListings));
router.get("/listings/:listingId", TryCatch(controller.getListingById));
router.get("/reservations/:userId", TryCatch(controller.getReservations));
router.get("/reservations/:listingId", TryCatch(controller.ReservationByListingId));
router.get("/users", TryCatch(controller.getUsers));
router.get('/users/:mail', TryCatch(controller.getUserByEmail))
router.get('/promotions',TryCatch(controller.getPromotion))

module.exports = router;
