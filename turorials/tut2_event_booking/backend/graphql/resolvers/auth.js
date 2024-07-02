const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error("User already exists.")
            }
            const hashedPass = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPass
            });
            const result = user.save();
            return {
                ...result._doc,
                password: null,
                _id: result.id
            };
        } catch (err) {
            throw err;
        };
    }
}