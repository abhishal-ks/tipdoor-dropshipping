import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { getUserFromHeader } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const user = getUserFromHeader(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const orders = await Order.find({ user: user.id }).sort({
            createdAt: -1,
        });

        return NextResponse.json(orders);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
