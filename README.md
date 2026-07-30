# [releases.zhoukai.space](https://releases.zhoukai.space)

A public timeline of Zhou Kai's merged GitHub pull requests.

The site only lists public pull requests authored by
[`@zkforge`](https://github.com/zkforge) and merged by project maintainers.

## Features

- Lists the 50 most recent public merged pull requests.
- Sorts by merge date or repository stars.
- Includes dark mode and an RSS feed.
- Uses a GitHub token only to increase the public API rate limit.

## Setup

Install the dependencies:

```bash
pnpm install
```

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

For production, create a
[fine-grained GitHub token](https://github.com/settings/personal-access-tokens/new)
with public repository read access and set it in `.env`:

```bash
NUXT_GITHUB_TOKEN=<TOKEN>
```

The default profile is already configured as `zkforge`. The username, display
name, result count, excluded repositories, and excluded organizations can all be
overridden with the variables documented in `.env.example`.

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

The project is ready to import into Vercel. Set `NUXT_GITHUB_TOKEN` in the
deployment environment, then attach `releases.zhoukai.space` as the custom
domain.

## Credits

Based on
[Sébastien Chopin's `my-pull-requests`](https://github.com/atinux/my-pull-requests),
which was inspired by
[Anthony Fu's `releases.antfu.me`](https://github.com/antfu/releases.antfu.me).

## License

[MIT](./LICENSE)
