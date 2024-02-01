const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PropertyListing = require("../Models/listingSchema");
const Reservations = require("../Models/reservationSchema");
const Favorite = require("../Models/favoritesSchema");
const Promo = require("../Models/offerSchema");
const {
  joiUserCreationSchema,
  joiListingCreationSchema,
  joiUserUpdationSchema,
} = require("../Models/validationSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  //
  // Create a user with name, email, username (POST /api/users/auth/signup)
  //
  userCreation: async (req, res) => {
    const { value, error } = joiUserCreationSchema.validate(req.body);
    if (error) {
      return res.json(error.message);
    }
    const { name, email, password,mobilenumber } = value;

    const existingUser = await user.findOne({ email });

    if (existingUser) {
      return res.status(403).json({
        status: "error",
        message: "User already exists with this email.",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);
    await user.create({
      name,
      email,
      hashedPassword,
      mobilenumber
    });
    res.status(201).json({
      status: "success",
      message: "user registration successfull.",
    });
  },
  //
  //
  userUpdation: async (req, res) => {
    const { value, error } = joiUserUpdationSchema.validate(req.body);
    if (error) {
      return res.json(error.message);
    }
    const { name, password,mobilenumber } = value;
    const email = req.email;
    const User = await user.findOne({ email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }
    // if (name) {
    //   await user.findByIdAndUpdate(User._id, { $set: { name } });
    // }
    // if (mobilenumber) {
    //   await user.findByIdAndUpdate(User._id, { $set: { mobilenumber } });
    // }  
    // if (password) {
    //   const hashedPassword = await bcrypt.hash(password, 12);
    //   await user.findByIdAndUpdate(User._id, { $set: { hashedPassword } });
    // }
    const updateFields = {};

    if (name) {
      updateFields.name = name;
    }
    if (mobilenumber) {
      updateFields.mobilenumber = mobilenumber;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateFields.hashedPassword = hashedPassword;
    }

    const updatedUser = await user.findByIdAndUpdate(
      User._id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "user update successful",
      data:updatedUser
    });
  },
  //
  //
  //
   editAvatar : async (req, res) => {
    const { image } = req.body;
    const id = req.params.id;
    const User = await user.findOne({ _id: id });
    if (User) {
      await user.findByIdAndUpdate(id, {
        $set: {
          image: image,
        },
      });
      res.status(200).json({
        status: "success",
        message: "Avatar updated successfully",
        data: User,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "updating avatar failed",
      });
    }
  },
  ///
  //
  //
  //
  createListings: async (req, res) => {
    // const id = req.params.id;
    const { value, error } = joiListingCreationSchema.validate(req.body);
    if (error) {
      return res.json(error.message);
    }
    const {
      title,
      description,
      properties,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      location,
      price,
    } = value;

    const User = await user.findOne({ email: req.email });

    const property = await PropertyListing.create({
      title,
      description,
      properties,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue:{ location:location.label, location:location.region},
      userId: User._id,
      price: parseInt(price, 10),
    });

    await user.updateOne(
      { email: req.email },
      { $push: { listings: property._id } }
    );

    res.status(201).json({
      status: "success",
      message: "Listing created Successfully.",
    });
  },
  //
  //
  //
  deleteListing: async (req, res) => {
    const listId = req.params.listingId;
    // const id = req.params.id;

    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    if (User.listings.includes(listId)) {
      await PropertyListing.findByIdAndDelete({ _id: listId });
      await user.updateOne(
        { email: req.email },
        { $pull: { listings: listId } }
      );

      return res.status(200).json({
        status: "success",
        message: "property deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Property not found",
      });
    }
  },
  //
  //
  //
  
  addToFavorites: async (req, res) => {
    // const id = req.params.id;
    const { listingId } = req.body;

    const User = await user.findOne({ email: req.email });
    // console.log(req.email);
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    const favorite = await Favorite.create({ userId: User._id, listingId });
    await user.updateOne(
      { email: req.email },
      { $addToSet: { favoriteIds: favorite } }
    );

    res.status(201).json({
      status: "success",
      message: "added to Favorites.",
      favorite
    });
  },
  //
  //
  //
  removeFavorites: async (req, res) => {
    const id = req.params.id;
    const { listingId } = req.body;

    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
      // Exit the function if the user is not found
    }

    const favorite = await Favorite.findOne({ userId: User._id, listingId });
    if (!favorite) {
      return res
        .status(404)
        .json({ status: "error", message: "Favorite not found" });
      // Exit the function if the favorite is not found
    }
    await user.updateOne(
      { _id: User._id },
      { $pull: { favoriteIds: favorite._id } }
    );
    await Favorite.deleteOne({ userId: User._id, listingId: listingId });

    res.status(201).json({
      status: "success",
      message: "Removed from Favorites.",
    });
  },
  //
  //
  //
  reservation: async (req, res) => {
    // const id = req.params.id;
    const { listingId, startDate, endDate, totalPrice, promoCode } = req.body;
 
   

    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    
    // const promotion = await Promo.findOne({ promoCode, isDeleted: false });
    const reservationId = await Reservations.create({
      userId: User._id,
      listingId,
      startDate,
      endDate,
      totalPrice,
      
      // romocodeAdded: promotion ? true : false,
      // promocode: promotion && promotion._id,
    });
    res.status(200).send("success")

    // const lineItems = [
    //   {
    //     price_data: {
    //       currency: "inr",
    //       product_data: {
    //         name: listingId,
    //       },
    //       unit_amount: totalPrice * 100,
    //     },
    //     quantity: 1,
    //   },
    // ];

    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: lineItems,
    //   mode: "payment",
    //   success_url: `${process.env.CLIENT_URL}/paymentsuccess?rid=${reservationId._id}`,
    //   cancel_url: `${process.env.CLIENT_URL}/paymentfailed`,
    // });

    // console.log("session :", session);

    // res.json({ id: session.id });
  },
  //
  //
  //
  confirmReservation: async (req, res) => {
    const id = req.params.id;
    const { reservId } = req.body;

    const reservation = await Reservations.findOne({ _id: reservId });

    if (!reservation) {
      return res.status(404).json({
        status: "error",
        message: "no reservation found",
      });
    }

    await Reservations.findByIdAndUpdate(reservId, {
      $set: { paymentDone: true },
    });

    await user.updateOne(
      { _id: id },
      { $addToSet: { reservations: reservId } }
    );

    res.status(200).json({
      status: "success",
      message: " Reservation conformed  successfully ",
    });
  },
  //
  //
  //
  cancelReservation: async (req, res) => {
    const reservId = req.params.reservId;
    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "no users foun",
      });
    }
    const reservation = await Reservations.findOne({ _id: reservId });
    if (!reservation) {
      return res.status(404).json({
        status: "error",
        message: "no reservation found",
      });
    }

    if (reservation.userId == User._id) {
      await Reservations.findByIdAndDelete({ _id: reservId });
      await user.updateOne(
        { _id: User._id },
        { $pull: { reservations: reservId } }
      );

      return res.status(200).json({
        status: "success",
        message: "Successfully cancelled reservation.",
      });
    }

    await Reservations.findByIdAndUpdate(
      { _id: reservId },
      { cancelledByHost: true }
    );
    await Reservations.findByIdAndDelete({ _id: reservId });
    res.status(200).json({
      status: "success",
      message: "Successfully cancelled reservation.",
    });
  },
  //
  //
  //
  getFavorites: async (req, res) => {
    const id = req.params.id;
    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "No user found",
      });
    }
    const favorites = await Favorite.find({ userId: User._id }).populate(
      "listingId"
    );
    if (!favorites) {
      return res.status(404).json({
        status: "error",
        message: "No favorites found",
      });
    }

    res.status(200).json({
      status: "success",
      message: " successfully fetched favorites",
      data: favorites,
    });
  },
  //
  //
  //
};
