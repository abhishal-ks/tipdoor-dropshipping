import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
    {
        name: String,
        price: Number,
        discounted_price: Number,
        description: String,
        image: String,
        promotion: {
            promo_code: String,
            discount_type: String,
            discount_value: Number,
        },
    },
    { timestamps: true }
);

export default models.Product || mongoose.model("Product", ProductSchema);
