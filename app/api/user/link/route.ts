import { supabase } from "@/app/_utils/supabase/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Parse query params from the URL (GET request doesn't have a body)
        const { userId, githubUsername } = await req.json();

        if (!userId || !githubUsername) {
            return NextResponse.json({ error: "Missing userId or githubUsername" }, { status: 400 });
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
                github_id: githubData.id,
                github_node_id: githubData.node_id,
                github_type: githubData.type,
                github_avatar_url: githubData.avatar_url,
                github_profile_url: githubData.html_url,
                github_name: githubData.name,
                github_company: githubData.company,
                github_blog: githubData.blog,
                github_location: githubData.location,
                github_bio: githubData.bio,
                github_email: githubData.email,
                github_twitter_username: githubData.twitter_username,
                github_site_admin: githubData.site_admin,
                github_public_repos: githubData.public_repos,
                github_public_gists: githubData.public_gists,
                github_followers: githubData.followers,
                github_following: githubData.following,
                github_created_at: githubData.created_at,
                github_updated_at: githubData.updated_at,
                github_followers_url: githubData.followers_url,
                github_following_url: githubData.following_url,
                github_repos_url: githubData.repos_url,
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
