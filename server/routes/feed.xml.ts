import { Feed } from 'feed'
import { joinURL } from 'ufo'
import { getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const domain = getRequestURL(event).origin
  const { user, prs } = await $fetch <Contributions> ('/api/contributions')
  const feed = new Feed({
    title: `${user.name} is contributing...`,
    description: `Discover ${user.name}'s merged pull requests on GitHub`,
    id: domain,
    link: domain,
    language: 'en',
    image: joinURL(domain, 'favicon.png'),
    favicon: joinURL(domain, 'favicon.png'),
    copyright: `© ${(new Date()).getFullYear()} ${user.name}`,
    feedLinks: {
      rss: `${domain}/feed.xml`,
    },
  })

  for (const pr of prs) {
    feed.addItem({
      link: pr.url,
      date: new Date(pr.merged_at),
      title: pr.title,
      image: `https://github.com/${pr.repo.split('/')[0]}.png`,
      description: `<a href="${pr.url}">${pr.title}</a>`,
    })
  }

  appendHeader(event, 'Content-Type', 'application/xml')
  return feed.rss2()
})
