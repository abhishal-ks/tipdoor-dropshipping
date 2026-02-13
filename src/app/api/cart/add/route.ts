import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";
import { getUserFromHeader } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const user = getUserFromHeader(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { product_id } = await req.json();

        const existing = await Cart.findOne({
            user: user.id,
            product: product_id,
        });

        if (existing) {
            existing.quantity += 1;
            await existing.save();
            return NextResponse.json(existing);
        }

        const cartItem = await Cart.create({
            user: user.id,
            product: product_id,
        });

        return NextResponse.json(cartItem);
    } catch {
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
    }
}
