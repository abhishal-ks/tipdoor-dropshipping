import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
    const admin = requireAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
        return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "products" }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
            .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
}
