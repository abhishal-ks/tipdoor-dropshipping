import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/admin";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const admin = requireAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
}
