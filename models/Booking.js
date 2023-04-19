const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    bookDate: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    rentalCarProvider: {
        type: mongoose.Schema.ObjectId,
        ref: 'rentalCarProvider',
        required: true,
    },
    car: {
        type: mongoose.Schema.ObjectId,
        ref: 'Car',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Booking', BookingSchema);