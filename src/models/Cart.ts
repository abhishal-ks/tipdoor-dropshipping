import mongoose, { Schema, models } from "mongoose";

const CartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

export default models.Cart || mongoose.model("Cart", CartSchema);
