# Optional static deployment

`pnpm build` generates `dist/`. It is a static single page with relative asset paths (`base: './'`), no server, no secrets, and no remote runtime data. Browser navigation uses page anchors, so no route rewrites are needed.

## GitHub Pages: main branch

Repository administrator: enable Actions; open Settings → Pages and select GitHub Actions as the source; create Actions repository variable `ENABLE_PAGES` with value `true`. Push main or manually dispatch “Deploy Pages (optional).” The included workflow builds and deploys dist using GitHub's token, with a Pages environment. Configure environment restrictions if your organization requires them. No domain or Pages deployment exists until you configure the repository.

The workflow runs unit/component checks and a production build. Required PR browser checks belong to the separate Checks workflow. Pages does not supply per-PR previews in this setup.

## Main + PR previews: Netlify alternative

Connect the GitHub repository in Netlify, choose pnpm, Node 22, build command `pnpm build`, publish directory `dist`, production branch `main`, and enable Deploy Previews for pull requests. The account owner grants GitHub integration access in the provider UI. Keep provider tokens out of this repository. Invite students to use the preview links posted on PRs. No provider account or external resource is created by this implementation.

Choose one production host so the projector has one authoritative URL. Test the deployment and a preview PR before class. Repository administration, hosting permissions, custom domain setup, and billing remain external tasks.
