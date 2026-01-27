// /app/api/user/route.ts
import { supabase } from "@/app/_utils/supabase/supabaseClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userId } = body;

    // Check if user exists
    const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("clerk_user_id", userId);

    if (error) return NextResponse.json({ error: error.message });

    if (data.length === 0) {
        const { data: newData, error: insertError } = await supabase
            .from("user")
            .insert([{ userId }])
            .select();

        if (insertError) return NextResponse.json({ error: insertError.message });

        return NextResponse.json({ message: "User created", user: newData[0] });
    }

    return NextResponse.json({ message: "User already exists", user: data[0] });
}
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId)
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // Fetch user from Supabase
    const { data: user, error } = await supabase
        .from("user")
        .select("*")
        .eq("clerk_user_id", userId)
        .maybeSingle(); // returns single object or null

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Fetch GitHub profile using the stored username
    let githubUser = null;
    try {
        const apiResponse = await axios.get(`https://api.github.com/users/${user.github_login}`);
        githubUser = apiResponse.data;
    } catch (err) {
        console.error("GitHub fetch failed:", err);
    }

    return NextResponse.json(githubUser);
}
