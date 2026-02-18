import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
        },
        password: String,
        role: {
            type: String,
            default: "user",
        },
    },
    { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
