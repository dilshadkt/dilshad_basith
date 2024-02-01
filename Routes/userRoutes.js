const express = require("express");
const router = express.Router();
const controller = require("../Controllers/userController");
const paymentController=require('../Controllers/paymentController')
const TryCatch = require("../Middlewares/tryCatchMiddleware");
const verifyToken = require("../Middlewares/userAuthMiddleware");

router.post("/auth/signup", TryCatch(controller.userCreation));
// router.post("/auth/login", TryCatch(controller.userLongin));
router.put("/update",verifyToken,TryCatch(controller.userUpdation));
router.put("/:id/updateAvatar",verifyToken,TryCatch(controller.editAvatar));
router.post("/listings", verifyToken, TryCatch(controller.createListings));
router.post("/favorites",verifyToken,TryCatch(controller.addToFavorites));
router.put("/favorites",verifyToken,TryCatch(controller.removeFavorites));
router.delete("/listings/:listingId",verifyToken, TryCatch(controller.deleteListing))
router.get("/favorites", verifyToken, TryCatch(controller.getFavorites))

router.post("/reservations",verifyToken, TryCatch(controller.reservation))
router.delete("/reservations/:reservId",verifyToken, TryCatch(controller.cancelReservation))
router.patch('/:id/conformreservation', TryCatch(controller.confirmReservation))

router.post('/payments',verifyToken,TryCatch(paymentController.order))



module.exports = router;
