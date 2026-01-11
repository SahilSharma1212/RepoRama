// utils/fetchStats.ts
import { useDataStore } from "@/app/store/dataStore";

export async function fetchRepoStats() {
    try {
        const res = await fetch(
            "https://api.github.com/repos/SahilSharma1212/RepoRama"
        );
        if (!res.ok) throw new Error("Failed to fetch repo stats");

        const data = await res.json();

        const stats = {
            id: data.id,
            name: data.name,
            full_name: data.full_name,
            description: data.description,
            owner: {
                login: data.owner.login,
                avatar_url: data.owner.avatar_url,
                html_url: data.owner.html_url,
            },
            html_url: data.html_url,
            language: data.language,
            stargazers_count: data.stargazers_count,
            forks_count: data.forks_count,
            watchers_count: data.watchers_count,
            open_issues_count: data.open_issues_count,
            size: data.size,
            created_at: data.created_at,
            updated_at: data.updated_at,
            pushed_at: data.pushed_at,
            default_branch: data.default_branch,
        };

        // save in Zustand store
        useDataStore.getState().setRepoStats(stats);

        return stats;
    } catch (err) {
        console.error("Error fetching repo stats:", err);
        return null;
    }
}
