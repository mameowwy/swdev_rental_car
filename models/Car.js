const mongoose = require('mongoose');
const Booking = require('../models/Booking');

const CarSchema = new mongoose.Schema(
    {
        rentalCarProvider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Provider',
        },
        brand: {
            type: String,
            required: [true, 'Please add a brand'],
        },
        model: {
            type: String,
            required: [true, 'Please add a model'],
        },
        color: {
            type: String,
            required: [true, 'Please add a color'],
        },
        numberOfSeats: {
            type: Number,
            required: [true, 'Please add the number of seats'],
        }
    });

// Cascade delete bookings when a car is deleted
CarSchema.pre("remove", async function (next) {
    console.log(`Bookings being removed from car ${this._id}`);
    await Booking.deleteMany({ car: this._id });
    //await this.model('Booking').deleteMany({ car: this._id });
    next();
});

// Reverse populate with virtuals
CarSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'car',
    justOne: false,
});

module.exports = mongoose.model('Car', CarSchema);
