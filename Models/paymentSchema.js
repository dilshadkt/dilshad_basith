const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    hotelName: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true
    },
    history: {
        type:String,
        required:true,
        
    }
});

const Payment = mongoose.model("Payment", paymentSchema); 
module.exports = Payment;