import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const response = await fetch(
            `https://api.fashn.ai/v1/status/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch job status" },
            { status: 500 }
        );
    }
}
