// app/api/repo/route.ts
import { supabase } from "@/app/_utils/supabase/supabaseClient";
import { NextRequest, NextResponse } from "next/server";


// -----------------------------------------------------------------------
// add repo
// -----------------------------------------------------------------------
export async function POST(req: NextRequest) {
    try {
        const { userId, description, url } = await req.json();


        // checking auth
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // checking url
        if (!url || !url.trim()) {
            return new NextResponse("Repository URL is required", { status: 400 });
        }

        // Split the URL to get username/repo
        const parts = url.trim().split("/");
        if (parts.length < 5) {
            return new NextResponse(
                "Invalid GitHub URL format. Use: https://github.com/username/repo",
                { status: 400 }
            );
        }
        // username and reponame
        const username = parts[3];
        const reponame = parts[4].replace(/\.git$/, ""); // remove .git if present

        // Check repo existence via GitHub API
        const githubResponse = await fetch(`https://api.github.com/repos/${username}/${reponame}`);
        const githubData = await githubResponse.json();

        if (githubData.message === "Not Found") {
            return new NextResponse("Repository not found on GitHub", { status: 404 });
        }

        if (!githubResponse.ok) {
            return new NextResponse("Failed to validate repository. Try again later.", { status: 400 });
        }

        // checking if repo already exists
        const { data: existingRepo } = await supabase
            .from("repo")
            .select("*")
            .eq("clerk_user_id", userId)
            .eq("github_repo_url", url.trim())
            .single();

        if (existingRepo) {
            return new NextResponse("Repository already exists", { status: 400 });
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from("repo")
            .insert([
                {
                    clerk_user_id: userId,
                    description: description?.trim() || null,
                    github_repo_url: url.trim(),
                },
            ])
            .select(); // returns inserted row

        if (error) {
            console.error("Supabase insert error:", error);
            // handle duplicate
            if (error.code === "23505") {
                return new NextResponse("This repository has already been added", { status: 400 });
            }
            return new NextResponse("Failed to add repository", { status: 500 });
        }

        return NextResponse.json({
            message: "Repository added successfully",
            repo: data[0],
        }, { status: 201 });
    } catch (err) {
        console.error("Unexpected error:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// -----------------------------------------------------------------------
// get user repos
// -----------------------------------------------------------------------
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("repo")
        .select("*")
        .eq("clerk_user_id", userId);

    if (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
    }

    return NextResponse.json(data);
}

// -----------------------------------------------------------------------
// delete repo
// -----------------------------------------------------------------------
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