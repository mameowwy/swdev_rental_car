const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const RentalCarProvider = require('../models/RentalCarProvider');

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings = async (req, res, next) => {
    let query;
    //General users can see only their bookings
    if (req.user.role !== "admin") {
        query = Booking.find({ user: req.user.id }).populate({
            path: 'rentalCarProvider',
            select: 'name address telephoneNumber',
        }).populate({
            path: 'car',
            select: 'brand model color numberOfSeats',
        });
    } else {
        query = Booking.find().populate({
            path: 'rentalCarProvider',
            select: 'name address telephoneNumber',
        }).populate({
            path: 'car',
            select: 'brand model color numberOfSeats',
        });
    }
    try {
        const bookings = await query;
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot find Bookings' });
    }
};

//@desc     Get single booking
//@route    GET /api/v1/booking/:id
//@access   Public
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: 'rentalCarProvider',
            select: 'name address tel',
        });
        if (!booking) {
            return res.status(404).json({ success: false, message: `No booking with the id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot find booking' });
    }
};

//@desc     Get rental car provider's booking
//@route    GET /api/v1/booking/rentalCarProvider/:rentalCarProviderID
//@access   Public
exports.getRentalCarProviderBooking = async (req, res, next) => {
    try {
        const bookings = await Booking.find({rentalCarProvider: mongoose.Types.ObjectId(req.params.id)})
        if (!bookings) {
            return res.status(404).json({ success: false, message: `No booking with the id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, count: bookings.length , data: bookings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot find booking' });
    }
};


//@desc     Add booking
//@route    POST /api/v1/rentalCarProviders/:rentalCarProviderId/booking
//@access   Private
exports.addBooking = async (req, res, next) => {
    try {
        req.body.rentalCarProvider = req.params.rentalCarProviderId;
        const rentalCarProvider = await RentalCarProvider.findById(req.params.rentalCarProviderId);
        if (!rentalCarProvider) {
            return res.status(404).json({ success: false, message: `No rentalCarProvider with the id of ${req.params.rentalCarProviderId}` });
        }

        //Check if car is exist
        const car = await Car.findById(req.body.car);
        if(!car){
            return res.status(404).json({ success: false, message: `No car with the id of ${req.params.rentalCarProviderId}` });
        }
        //Check if car is belong to provider
        console.log("Provider id ", car.rentalCarProvider.toString());
        if(car.rentalCarProvider.toString() !== req.params.rentalCarProviderId) {
            return res.status(404).json({success: false, messsage: `This car is not belong to ${req.params.rentalCarProviderId}`})
        }

        //add user Id to req.body
        req.body.user = req.user.id;

        //Checked for existed Booking
        const existedBooking = await Booking.find({ user: req.user.id });

        // If the user is not an admin, they can only create 3 Booking.
        if (existedBooking.length >= 3 && req.user.role !== "admin") {
            return res.status(400).json({ success: false, message: `The user with ID ${req.user.id} has already made 3 Bookings`, });
        }
        const booking = await Booking.create(req.body);
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot create Booking' });
    }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: `No Booking with the id of ${req.params.id}` });
        }

        //Make sure user is the Booking owner
        if (booking.user.toString() !== req.user.id & req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update this Booking` });
        }
        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot update Booking' });
    }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: `No booking with the id of ${req.params.id}` });
        }

        //Make sure user is the booking owner
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to delete this booking` });
        }
        await booking.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot delete booking' });
    }
};