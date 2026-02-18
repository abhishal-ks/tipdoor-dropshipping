import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: Request) {
    const admin = requireAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const admin = requireAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();

    const product = await Product.create(body);
    return NextResponse.json(product);
}
