import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        razorpay_order_id: String,
        razorpay_payment_id: String,
        amount: Number,
        status: {
            type: String,
            default: "paid",
        },
    },
    { timestamps: true }
);

export default models.Order || mongoose.model("Order", OrderSchema);
