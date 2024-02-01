const express = require("express");
const router = express.Router();
const controller = require("../Controllers/adminController");
const TryCatch = require("../Middlewares/tryCatchMiddleware");
const verifyToken = require("../Middlewares/adminAuthMiddleware");

router.get("/users", verifyToken, TryCatch(controller.getAllUsers));
router.get("/properties", verifyToken, TryCatch(controller.getProperties));
router.get("/reservations",verifyToken, TryCatch(controller.getReseservations));
router.get("/favorites", verifyToken, TryCatch(controller.getFavorites));
router.put("/users/:id", verifyToken, TryCatch(controller.mangeUser));
router.put("/properties/:id", verifyToken, TryCatch(controller.manageProperties));
router.patch("/properties/:listingId",verifyToken, TryCatch(controller.approveProperties))
router.post("/promotions",verifyToken,TryCatch(controller.createPromo))
router.patch("/promotions/:promoId",verifyToken,TryCatch(controller.cancelPromo))


module.exports = router;
