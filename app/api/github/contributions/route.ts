import { NextRequest, NextResponse } from "next/server";

type CalendarDay = {
    date: string;
    count: number;
    weekday: number;
    weekIndex: number;
};

type HourlyBucket = {
    hour: number;
    count: number;
};

type GithubGraphQLResponse = {
    data?: {
        user?: {
            contributionsCollection: {
                contributionCalendar: {
                    weeks: Array<{
                        contributionDays: Array<{
                            date: string;
                            weekday: number;
                            contributionCount: number;
                        }>;
                    }>;
                };
                commitContributionsByRepository: Array<{
                    contributions: {
                        edges: Array<{
                            node: {
                                occurredAt: string;
                            };
                        }>;
                    };
                }>;
            };
        };
    };
    errors?: Array<{ message: string }>;
};

const MAX_REPOSITORIES = 20;
const MAX_COMMITS_PER_REPO = 100;

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const login = url.searchParams.get("login");

        if (!login) {
            return NextResponse.json({ error: "Missing login query parameter" }, { status: 400 });
        }

        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            return NextResponse.json(
                { error: "GitHub token is not configured on the server" },
                { status: 500 }
            );
        }

        // Date range: last 365 days by default
        const rangeDaysParam = url.searchParams.get("rangeDays");
        const rangeDays = rangeDaysParam ? Math.min(Math.max(parseInt(rangeDaysParam, 10) || 365, 1), 365) : 365;

        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - rangeDays);

        const graphqlQuery = `
          query($login: String!, $from: DateTime!, $to: DateTime!, $maxRepos: Int!, $maxCommits: Int!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      weekday
                      contributionCount
                    }
                  }
                }
                commitContributionsByRepository(maxRepositories: $maxRepos) {
                  contributions(first: $maxCommits) {
                    edges {
                      node {
                        occurredAt
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const body = JSON.stringify({
            query: graphqlQuery,
            variables: {
                login,
                from: from.toISOString(),
                to: to.toISOString(),
                maxRepos: MAX_REPOSITORIES,
                maxCommits: MAX_COMMITS_PER_REPO,
            },
        });

        const ghRes = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body,
        });

        if (!ghRes.ok) {
            const text = await ghRes.text();
            console.error("GitHub GraphQL error:", ghRes.status, text);
            return NextResponse.json(
                { error: "Failed to fetch contributions from GitHub" },
                { status: 502 }
            );
        }

        const json = (await ghRes.json()) as GithubGraphQLResponse;

        if (json.errors && json.errors.length > 0) {
            console.error("GitHub GraphQL errors:", json.errors);
            return NextResponse.json(
                { error: json.errors[0].message ?? "GitHub GraphQL returned errors" },
                { status: 502 }
            );
        }

        const collection = json.data?.user?.contributionsCollection;
        if (!collection) {
            return NextResponse.json(
                { error: "No contributions collection found for user" },
                { status: 404 }
            );
        }

        const calendarDays: CalendarDay[] = [];
        const weeks = collection.contributionCalendar.weeks ?? [];

        weeks.forEach((week, weekIndex) => {
            week.contributionDays.forEach((day) => {
                calendarDays.push({
                    date: day.date,
                    count: day.contributionCount,
                    weekday: day.weekday,
                    weekIndex,
                });
            });
        });

        const hourlyHistogram: HourlyBucket[] = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            count: 0,
        }));

        const repoContribs = collection.commitContributionsByRepository ?? [];
        for (const repo of repoContribs) {
            const edges = repo.contributions.edges ?? [];
            for (const edge of edges) {
                const occurredAt = edge.node?.occurredAt;
                if (!occurredAt) continue;
                const date = new Date(occurredAt);
                const hour = date.getHours(); // server-local time; can adjust to UTC/local later
                if (hour >= 0 && hour < 24) {
                    hourlyHistogram[hour].count += 1;
                }
            }
        }

        return NextResponse.json({
            login,
            from: from.toISOString(),
            to: to.toISOString(),
            calendarDays,
            hourlyHistogram,
        });
    } catch (err) {
        console.error("Unexpected error in /api/github/contributions:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

