import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const latest = await Product.find()
            .sort({ createdAt: -1 })
            .limit(10);

        return NextResponse.json(latest);
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to fetch latest products" },
            { status: 500 }
        );
    }
}
