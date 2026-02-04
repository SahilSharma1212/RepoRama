import { summarizeCode } from "@/app/_utils/langChainUtils/summariserUtil";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json();
        const summary = await summarizeCode(code);
        return NextResponse.json({ summary });
    } catch (error) {
        console.error("Error summarizing code:", error);
        return NextResponse.json({ error: "Failed to generate code summary" }, { status: 500 });
    }
}
