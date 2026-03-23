import { supabase } from "@/app/_utils/supabase/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        const url = new URL(req.url);
        const repo_id = url.searchParams.get("repo_id");
        const file_path = url.searchParams.get("file_path");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!repo_id || !file_path) {
            return NextResponse.json({ error: "Missing repo_id or file_path" }, { status: 400 });
        }

        const { data: notes, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", userId)
            .eq("repo_id", repo_id)
            .eq("file_path", file_path)
            .order("created_at", { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ notes });
    } catch (err) {
        console.error("GET /api/notes error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const { repo_id, file_path, content } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!repo_id || !file_path || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data: note, error } = await supabase
            .from("notes")
            .insert({
                user_id: userId,
                repo_id,
                file_path,
                content,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ note });
    } catch (err) {
        console.error("POST /api/notes error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
