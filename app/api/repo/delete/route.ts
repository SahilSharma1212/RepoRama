import { supabase } from "@/app/_utils/supabase/supabaseClient";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const repoId = url.searchParams.get("repoId");
    if (!repoId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("repo")
        .delete()
        .eq("id", repoId);

    if (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to delete repository" }, { status: 500 });
    }

    return NextResponse.json({ message: "Repository deleted successfully" });
}