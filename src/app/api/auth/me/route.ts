import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromHeader } from "@/lib/auth";

export async function GET(req: Request) {
    const userJwt = getUserFromHeader(req);

    if (!userJwt) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(userJwt.id).select("name email role");

    return NextResponse.json({ user });
}
