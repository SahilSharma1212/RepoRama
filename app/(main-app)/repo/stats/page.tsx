'use client'

import React, { useEffect } from "react";
import { useDataStore } from "@/app/store/dataStore";
import { fetchRepoStats } from "@/app/_utils/statsUtils/fetchStats";
import Loader from "@/app/_components/Loader";

export default function RepoStatsViewer() {
    const { repoStats } = useDataStore();

    useEffect(() => {
        fetchRepoStats();
    }, []);

    if (!repoStats) return <Loader />;

    return (
        <div className="p-6 bg-gray-900 text-white rounded-xl border border-white/10 max-w-4xl mx-auto mt-10">
            <h2 className="text-2xl font-bold">{repoStats.full_name}</h2>
            <p className="text-gray-400">{repoStats.description || "No description provided."}</p>
            <div className="mt-4 flex gap-6 flex-wrap">
                <div>⭐ Stars: {repoStats.stargazers_count}</div>
                <div>🍴 Forks: {repoStats.forks_count}</div>
                <div>👀 Watchers: {repoStats.watchers_count}</div>
                <div>❗ Open Issues: {repoStats.open_issues_count}</div>
                <div>📝 Language: {repoStats.language}</div>
                <div>📦 Size: {repoStats.size} KB</div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
                Created: {new Date(repoStats.created_at).toLocaleDateString()} | Last Pushed: {new Date(repoStats.pushed_at).toLocaleDateString()}
            </div>
            <a href={repoStats.html_url} target="_blank" className="mt-4 inline-block text-purple-500 hover:underline">View on GitHub</a>
        </div>
    )
}
