import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            modelImageBase64,
            garmentBase64,
            category,
            mode,
            segmentation_free,
            num_samples,
        } = body;

        const response = await fetch("https://api.fashn.ai/v1/run", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model_image: modelImageBase64,
                garment_image: garmentBase64,
                category,
                mode,
                segmentation_free,
                num_samples,
                return_base64: true,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({ jobId: data.id });
    } catch {
        return NextResponse.json(
            { error: "Try-on initiation failed" },
            { status: 500 }
        );
    }
}
