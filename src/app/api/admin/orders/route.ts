import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: Request) {
    try {
        const admin = requireAdmin(req);

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch admin orders" },
            { status: 500 }
        );
    }
}
