const express = require('express');
const { getRentalCarProviders, getRentalCarProvider, createRentalCarProvider, updateRentalCarProvider, deleteRentalCarProvider } = require('../controllers/rentalCarProviders');

const bookingRouter = require('./bookings');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:rentalCarProviderId/bookings/', bookingRouter);

router.route('/').get(getRentalCarProviders).post(protect, authorize('admin'), createRentalCarProvider);
router.route('/:id').get(getRentalCarProvider).put(protect, authorize('admin'), updateRentalCarProvider).delete(protect, authorize('admin'), deleteRentalCarProvider);

module.exports = router;