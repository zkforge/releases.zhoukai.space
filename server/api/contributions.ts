export default defineEventHandler(async () => {
  const octokit = useOctokit()
  const config = useRuntimeConfig()
  const username = config.public.githubUsername
  const userResponse = await octokit.request('GET /users/{username}', {
    username,
  })
  const user: User = {
    name: config.public.githubName || userResponse.data.name || userResponse.data.login,
    username: userResponse.data.login,
    avatar: userResponse.data.avatar_url,
  }
  const excludeRepos = process.env.EXCLUDE_REPOS?.split(',').map(repo => repo.trim()).filter(Boolean) ?? []
  const excludeOrgs = process.env.EXCLUDE_ORGS?.split(',').map(org => org.trim()).filter(Boolean) ?? []
  const prCount = Number(process.env.PR_COUNT ?? 50)

  // Fetch public pull requests authored by the user and merged by maintainers.
  const queryParts = [
    'is:pr',
    'is:merged',
    'is:public',
    `author:"${user.username}"`,
    ...excludeRepos.map(repo => `-repo:${repo}`),
    ...excludeOrgs.map(org => `-org:${org}`),
  ]

  const { data } = await octokit.request('GET /search/issues', {
    q: queryParts.join('+'),
    per_page: prCount,
    page: 1,
    advanced_search: 'true',
  })

  const prs: PullRequest[] = []
  for (const pr of data.items) {
    if (!pr.pull_request?.merged_at)
      continue

    const [owner, name] = pr.repository_url.split('/').slice(-2)
    const repo = await fetchRepo(owner!, name!)

    prs.push({
      repo: `${owner}/${name}`,
      title: pr.title,
      url: pr.html_url,
      merged_at: pr.pull_request.merged_at,
      number: pr.number,
      type: repo.owner.type,
      stars: repo.stargazers_count,
    })
  }

  return {
    user,
    prs,
  } as Contributions
})
