import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        const token = signToken({ id: user._id });

        return NextResponse.json({ token });
    } catch {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
