const payment = require('../Models/paymentSchema');
const User = require('../Models/userSchema');

const order = async (req, res) => {
  try {
  
    const userId = req.body?.currentUser?._id;
    const user = await User.findById(userId);
    

    const orderDetails = new payment({
      userId: user._id,
      userName: user.name,
      paymentId: req.body.payment_id,
      hotelName: req.body.hotelName,
      totalAmount: req.body.totalPrice,
      date: new Date(),
      status: 'success',
      history: 'pending',
    })

    const orderAdded = await orderDetails.save();
  } catch (error) {
    console.error('Error saving order:', error.message);
  }
};

module.exports = {
  order,
};