import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";
import { getUserFromHeader } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const user = getUserFromHeader(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const cart = await Cart.find({ user: user.id }).populate("product");

        return NextResponse.json(cart);
    } catch {
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }
}
