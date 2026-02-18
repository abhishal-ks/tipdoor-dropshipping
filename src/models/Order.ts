import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        shippingAddress: {
            name: String,
            phone: String,
            address: String,
            city: String,
            state: String,
            pincode: String,
        },

        items: [
            {
                productId: Schema.Types.ObjectId,
                name: String,
                price: Number,
                image: String,
                quantity: Number,
            },
        ],

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
