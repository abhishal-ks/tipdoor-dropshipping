import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";
import { getUserFromHeader } from "@/lib/auth";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = getUserFromHeader(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id } = await context.params;

        await Cart.deleteOne({ _id: id, user: user.id });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
