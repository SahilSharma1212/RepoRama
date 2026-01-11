export const mongooseCode = `
    import mongoose from "mongoose"

    const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    age: Number,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    profile: {
        bio: String,
        website: String
    },
    tags: [String]
    })

    mongoose.model("User", UserSchema)
`;
