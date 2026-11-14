# Static deployment

`pnpm build` generates `dist/`. It is a static single page with relative asset paths (`base: './'`), no server, no secrets, and no remote runtime data. Browser navigation uses page anchors, so no route rewrites are needed.

## Active workshop deployment

The public repository is [michaeltaras/nov-2026-parsons-workshop](https://github.com/michaeltaras/nov-2026-parsons-workshop). GitHub Pages is configured to publish from Actions at [the live results page](https://michaeltaras.github.io/nov-2026-parsons-workshop/). `ENABLE_PAGES=true` is set. A successful deployment and the served page were verified on November 14, 2026. Main-branch pushes automatically rebuild and deploy. PR previews are not configured.

## GitHub Pages: setup for another repository

Repository administrator: enable Actions; open Settings → Pages and select GitHub Actions as the source; create Actions repository variable `ENABLE_PAGES` with value `true`. Push main or manually dispatch “Deploy Pages (optional).” The included workflow builds and deploys dist using GitHub's token, with a Pages environment. Configure environment restrictions if your organization requires them. A new repository needs its own Pages settings; copying workflow files does not copy those settings.

The workflow runs unit/component checks and a production build. Required PR browser checks belong to the separate Checks workflow. Pages does not supply per-PR previews in this setup.

## Main + PR previews: Netlify alternative

Connect the GitHub repository in Netlify, choose pnpm, Node 22, build command `pnpm build`, publish directory `dist`, production branch `main`, and enable Deploy Previews for pull requests. The account owner grants GitHub integration access in the provider UI. Keep provider tokens out of this repository. Invite students to use the preview links posted on PRs. No provider account or external resource is created by this implementation.

Choose one production host so the projector has one authoritative URL. Test the deployment and a preview PR before class. Repository administration, hosting permissions, custom domain setup, and billing remain external tasks.
