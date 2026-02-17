import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { getUserFromHeader } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const user = getUserFromHeader(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount } = await req.json(); // amount in rupees

        const order = await razorpay.orders.create({
            amount: amount * 100, // Razorpay expects paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        });

        return NextResponse.json(order);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Order creation failed" },
            { status: 500 }
        );
    }
}
