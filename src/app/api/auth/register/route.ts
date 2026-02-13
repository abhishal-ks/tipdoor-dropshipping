import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const { name, email, password } = body;

        const exists = await User.findOne({ email });

        if (exists) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        const token = signToken({ id: user._id });

        return NextResponse.json({ token });
    } catch {
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
