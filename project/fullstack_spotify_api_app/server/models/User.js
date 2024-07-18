import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';

// Create user schema
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Your name is required"],
    },
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    },
    username: {
        type: String,
        required: [true, "Your username is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    albums: [{
        type: Schema.Types.ObjectId,
        ref: "Album"
    }]
});

// PreAave hook to hash password before saving
userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

export const User = model("User", userSchema);