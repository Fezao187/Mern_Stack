import { model, Schema } from "mongoose";

// Create album schema
const albumSchema = new Schema({
    albumName: {
        type: String,
        required: [true, "Album name is required"]
    },
    imgUrl: {
        type: String,
        required: [true, "Image URL is required"]
    },
    artistName: {
        type: String,
        required: [true, "Artist name is required"]
    },
    releaseDate: {
        type: String,
        required: [true, "Release date is required"]
    },
    totalTracks: {
        type: String,
        required: [true, "Total number of is required"]
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

export const Album=model("Album",albumSchema);