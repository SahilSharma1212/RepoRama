import axios, { AxiosError } from "axios";
import type { Branch } from "../../types";

/**
 * Fetch all branches for a GitHub repository
 */
export async function fetchGitHubBranches(
    owner: string,
    repo: string
): Promise<Branch[]> {
    try {
        const response = await axios.get<Branch[]>(
            `https://api.github.com/repos/${owner}/${repo}/branches`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw new Error(axiosError.response?.data?.message ?? axiosError.message);
        } else if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Unknown error while fetching branches");
        }
    }
}
