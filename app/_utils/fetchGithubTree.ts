import axios, { AxiosError } from "axios";
import type { GitHubTreeResponse, GitHubTreeItem } from "../types";

/**
 * Fetch GitHub repository tree as a flat array
 */
export async function fetchGitHubTree(): Promise<GitHubTreeItem[]> {
    try {
        const response = await axios.get<GitHubTreeResponse>(
            "https://api.github.com/repos/burakorkmez/chatify/git/trees/master?recursive=1"
        );
        return response.data.tree;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw new Error(axiosError.response?.data?.message ?? axiosError.message);
        } else if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Unknown error while fetching GitHub tree");
        }
    }
}
