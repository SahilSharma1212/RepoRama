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

        // Robust URL parsing — handles trailing slashes, query strings, .git suffix
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url.trim());
        } catch {
            return new NextResponse(
                "Invalid URL format. Use: https://github.com/username/repo",
                { status: 400 }
            );
        }

        if (parsedUrl.hostname !== "github.com") {
            return new NextResponse("Only GitHub repositories are supported", { status: 400 });
        }

        // pathname is like "/username/repo" or "/username/repo/"
        const pathParts = parsedUrl.pathname
            .replace(/\.git$/, "")
            .split("/")
            .filter(Boolean);

        if (pathParts.length < 2) {
            return new NextResponse(
                "Invalid GitHub URL format. Use: https://github.com/username/repo",
                { status: 400 }
            );
        }

        const username = pathParts[0];
        const reponame = pathParts[1];

        // Add token to avoid rate limiting
        const githubHeaders: HeadersInit = {
            "Accept": "application/vnd.github+json",
        };

        if (process.env.GITHUB_TOKEN) {
            githubHeaders["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const githubResponse = await fetch(
            `https://api.github.com/repos/${username}/${reponame}`,
            { headers: githubHeaders }
        );

        if (githubResponse.status === 404) {
            return new NextResponse(
                "Repository not found on GitHub. If it's a private repository, it cannot be added.",
                { status: 404 }
            );
        }

        if (!githubResponse.ok) {
            return new NextResponse("Failed to validate repository. Try again later.", { status: 400 });
        }

        // Check if the repo is private
        const githubData = await githubResponse.json();
        if (githubData.private) {
            return new NextResponse("Private repositories cannot be added.", { status: 400 });
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
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
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