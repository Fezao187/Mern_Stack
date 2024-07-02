const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transBooking, transEvent } = require("./merge");

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        const fetchEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: "6679f79d690a2dc21babb9dc",
            event: fetchEvent
        });
        const result = await booking.save();
        return transBooking(result);
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId)
                .populate("event");
            const event = transEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
}