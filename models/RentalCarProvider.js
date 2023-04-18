const mongoose = require('mongoose');

const RentalCarProviderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        address: {
            type: String,
            required: [true, 'Please add an address'],
        },
        district: {
            type: String,
            required: [true, 'Please add a district'],
        },
        province: {
            type: String,
            required: [true, 'Please add a province'],
        },
        postalcode: {
            type: String,
            required: [true, 'Please add a postalcode'],
            maxlength: [5, 'Postalcode cannot be more than 5 digits'],
        },
        telephoneNumber: {
            type: String,
            required: [true, 'Please add a telephone number'],
        },
        brand: {
            type: String,
            required: [true, 'Please add a brand of car'],
        },
        model: {
            type: String,
            required: [true, 'Please add a model of car'],
        },
        color: {
            type: String,
            required: [true, 'Please add a color of car'],
        },
        numberOfSeat: {
            type: Number,
            required: [true, 'Please add a number of seat'],
        }
    }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Cascade delete bookings when a rental car provider is deleted
RentalCarProviderSchema.pre('remove', async function (next) {
    console.log(`Bookings being removed from rental car provider ${this._id}`);
    await this.model('Booking').deleteMany({ rentalCarProvider: this._id });
    next();
});

// Reverse populate with virtuals
RentalCarProviderSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'rentalCarProvider',
    justOne: false,
});

module.exports = mongoose.model('RentalCarProvider', RentalCarProviderSchema);