export type User = {
  username: string
  name: string
  avatar: string
}

export type PullRequest = {
  repo: string
  title: string
  url: string
  merged_at: string
  number: number
  type: 'User' | 'Organization'
  stars: number
}

export type Contributions = {
  user: User
  prs: PullRequest[]
}
