const Event = require("../../models/event");
const { dateToString } = require("../../helpers/date");
const { transEvent } = require("./merge");

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!")
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: "6679f79d690a2dc21babb9dc"
        });
        let createdEvent;
        try {
            const result = await event
                .save()
            createdEvent = transEvent(result);
            const creator = await User.findById("6679f79d690a2dc21babb9dc")

            if (!creator) {
                throw new Error("User not found.")
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            throw err;
        };
    }
}