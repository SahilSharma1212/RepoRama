import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json()

        if (!username) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 })
        }

        const token = process.env.GITHUB_TOKEN
        const headers: any = {
            Accept: "application/vnd.github+json",
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        // ─── 1. User basics ─────────────────────────────────
        const userRes = await axios.get(`https://api.github.com/users/${username}`, { headers })
        const user = userRes.data

        // ─── 2. Total commits ───────────────────────────────
        const commitsRes = await axios.get(
            `https://api.github.com/search/commits?q=author:${username}`,
            { headers: { ...headers, Accept: "application/vnd.github.cloak-preview+json" } }
        )
        const totalCommits = commitsRes.data.total_count || 0

        // ─── 3. Total stars ─────────────────────────────────
        let totalStars = 0
        let page = 1
        let hasMoreRepos = true

        while (hasMoreRepos) {
            const reposRes = await axios.get(
                `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
                { headers }
            )
            const repos = reposRes.data

            totalStars += repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)

            hasMoreRepos = repos.length === 100
            page++
        }

        // ─── 4. Merged PRs ──────────────────────────────────
        const prRes = await axios.get(
            `https://api.github.com/search/issues?q=author:${username}+type:pr+is:merged`,
            { headers: { ...headers, Accept: "application/vnd.github.cloak-preview+json" } }
        )
        const prMerged = prRes.data.total_count || 0

        // ─── 5. Top languages ───────────────────────────────
        const reposAllRes = await axios.get(
            `https://api.github.com/users/${username}/repos?per_page=100`,
            { headers }
        )
        const langCount: Record<string, number> = {}
        reposAllRes.data.forEach((r: any) => {
            if (r.language) {
                langCount[r.language] = (langCount[r.language] || 0) + 1
            }
        })
        const topLangs = Object.entries(langCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang]) => lang)

        // ─── 6. GraphQL – Contribution data ─────────────────
        const graphqlEndpoint = "https://api.github.com/graphql"
        const graphqlHeaders = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }

        // Get contribution years
        const yearsQuery = `
            query {
                user(login: "${username}") {
                    contributionsCollection {
                        contributionYears
                    }
                }
            }
        `

        let years: number[] = []
        try {
            const yearsRes = await axios.post(graphqlEndpoint, { query: yearsQuery }, { headers: graphqlHeaders })
            years = yearsRes.data.data?.user?.contributionsCollection?.contributionYears || []
            if (years.length === 0) years = [new Date().getFullYear()]
        } catch (err) {
            console.warn("Could not fetch contribution years", err)
            years = [new Date().getFullYear()]
        }

        // Fetch calendar per year
        const allDays: { date: string; count: number }[] = []

        for (const year of years) {
            const from = `${year}-01-01T00:00:00Z`
            const to = `${year}-12-31T23:59:59Z`

            const calendarQuery = `
                query {
                    user(login: "${username}") {
                        contributionsCollection(from: "${from}", to: "${to}") {
                            contributionCalendar {
                                weeks {
                                    contributionDays {
                                        date
                                        contributionCount
                                    }
                                }
                            }
                        }
                    }
                }
            `

            try {
                const calRes = await axios.post(graphqlEndpoint, { query: calendarQuery }, { headers: graphqlHeaders })
                const weeks = calRes.data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || []

                weeks.forEach((week: any) => {
                    week.contributionDays.forEach((day: any) => {
                        if (day.date && day.date.includes('-')) {
                            allDays.push({
                                date: day.date.split('T')[0],
                                count: day.contributionCount || 0,
                            })
                        }
                    })
                })
            } catch (err) {
                console.warn(`Failed to fetch calendar for ${year}`, err)
            }
        }

        // Sort chronologically
        allDays.sort((a, b) => a.date.localeCompare(b.date))

        // ─── 7. Calculate detailed stats ────────────────────

        // Top 10 busiest days
        const busiestDays = [...allDays]
            .filter(d => d.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)

        // Monthly breakdown
        const monthlyStats: Record<string, number> = {}
        allDays.forEach(day => {
            const month = day.date.substring(0, 7) // YYYY-MM
            monthlyStats[month] = (monthlyStats[month] || 0) + day.count
        })

        // Longest streak
        let maxStreak = 0
        let maxStart = ""
        let maxEnd = ""
        let currentStreak = 0
        let currentStart = ""
        let prevDate: string | null = null

        allDays.forEach((day) => {
            const isActive = day.count >= 1

            if (isActive) {
                if (!prevDate || isNextDay(prevDate, day.date)) {
                    currentStreak++
                    if (currentStreak === 1) currentStart = day.date
                } else {
                    currentStreak = 1
                    currentStart = day.date
                }

                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak
                    maxStart = currentStart
                    maxEnd = day.date
                }
            } else {
                currentStreak = 0
            }

            prevDate = day.date
        })

        function isNextDay(d1: string, d2: string): boolean {
            const date1 = new Date(d1)
            date1.setDate(date1.getDate() + 1)
            return date1.toISOString().split('T')[0] === d2
        }

        // Day of week analysis
        const dayOfWeekStats: Record<string, number> = {
            'Sunday': 0,
            'Monday': 0,
            'Tuesday': 0,
            'Wednesday': 0,
            'Thursday': 0,
            'Friday': 0,
            'Saturday': 0
        }

        allDays.forEach(day => {
            const date = new Date(day.date)
            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
            dayOfWeekStats[dayName] += day.count
        })

        // Total contributions
        const totalContributions = allDays.reduce((sum, day) => sum + day.count, 0)

        // Active days count
        const activeDays = allDays.filter(d => d.count > 0).length

        return NextResponse.json({
            avatar_url: user.avatar_url,
            name: user.name,
            login: user.login,
            bio: user.bio,
            public_repos: user.public_repos || 0,
            totalCommits,
            totalStars,
            topLanguages: topLangs.length ? topLangs : ["None detected"],
            pullRequestsMerged: prMerged,
            longestStreak: maxStreak,
            longestStreakPeriod: maxStreak > 0 ? `${maxStart} → ${maxEnd}` : undefined,
            busiestDays,
            monthlyStats,
            dayOfWeekStats,
            totalContributions,
            activeDays,
            contributionCalendar: allDays, // Full calendar data for heatmap
        })

    } catch (error: any) {
        console.error('GitHub API Error:', error.response?.data || error.message)

        if (error.response?.status === 404) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        } else if (error.response?.status === 403) {
            return NextResponse.json({ error: 'Rate limited' }, { status: 403 })
        } else if (error.response?.status === 401) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}