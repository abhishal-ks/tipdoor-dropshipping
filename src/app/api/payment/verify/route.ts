import { NextResponse } from "next/server";
import crypto from "crypto";
import { getUserFromHeader } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";

export async function POST(req: Request) {
    try {
        const user = getUserFromHeader(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,
            shippingAddress
        } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        await connectDB();

        const cartItems = await Cart.find({ user: user.id }).populate("product");

        const items = cartItems.map((item: any) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity,
        }));

        const order = await Order.create({
            user: user.id,
            items,
            amount,
            shippingAddress,
            razorpay_order_id,
            razorpay_payment_id,
        });


        // 🧹 Clear the user's cart after successful payment
        await Cart.deleteMany({ user: user.id });

        return NextResponse.json({ success: true, order });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
