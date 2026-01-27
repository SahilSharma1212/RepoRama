import { supabase } from "@/app/_utils/supabase/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        // Parse query params from the URL (GET request doesn't have a body)
        const { githubUsername } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!githubUsername) {
            return NextResponse.json({ error: "Missing githubUsername" }, { status: 400 });
        }

        // Check if user already exists
        const { data: existingUser, error: selectError } = await supabase
            .from("user")
            .select("*")
            .eq("clerk_user_id", userId)
            .single();

        if (selectError && selectError.code !== "PGRST116") { // Ignore "no rows found"
            return NextResponse.json({ error: selectError.message }, { status: 500 });
        }

        // Fetch GitHub profile
        const githubResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (!githubResponse.ok) {
            return NextResponse.json({ error: "Failed to fetch GitHub user" }, { status: githubResponse.status });
        }
        const githubData = await githubResponse.json();

        let user;

        if (!existingUser) {
            // Insert new user with GitHub data
            const { data, error: insertError } = await supabase.from("user").insert({
                github_login: githubData.login,
                clerk_user_id: userId,
            }).select().single();

            if (insertError) {
                return NextResponse.json({ error: insertError.message }, { status: 500 });
            }

            user = data;
        } else {
            // User already exists, return existing data
            user = existingUser;
        }

        return NextResponse.json({ user });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
