import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/admin";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const admin = requireAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { id } = await context.params;

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
}
