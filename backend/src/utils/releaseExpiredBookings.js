const Booking = require("../models/Booking");
const Schedule = require("../models/Schedule");
const Payment = require("../models/Payment");

exports.releaseExpiredBookings = async () => {
  try {
    const expiredBookings = await Booking.find({
      status: "PendingPayment",
      paymentStatus: "Pending",
      paymentExpiresAt: { $lt: new Date() }
    });

    if (expiredBookings.length === 0) return 0;

    let releasedCount = 0;

    for (const booking of expiredBookings) {
      booking.status = "Expired";
      booking.paymentStatus = "Expired";
      
      await booking.save();

      // Expire related payment records
      await Payment.updateMany(
        { bookingId: booking._id, status: "Pending" },
        { $set: { status: "Expired" } }
      );

      // Release seats
      await Schedule.updateOne(
        { _id: booking.scheduleId },
        { $pullAll: { bookedSeats: booking.seatNumbers } }
      );

      releasedCount++;
    }

    if (releasedCount > 0) {
      console.log(`Released ${releasedCount} expired bookings.`);
    }

    return releasedCount;
  } catch (error) {
    console.error("Error releasing expired bookings:", error);
    return 0;
  }
};
