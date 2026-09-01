# Netlify deployment

This repository is configured for Netlify as a static Vite deployment. In Netlify, choose **Add new site → Import an existing project → GitHub**, select `Tauno29/oniipa-guest-house`, and use the settings below.

| Setting | Value |
|---|---|
| Build command | `pnpm build` |
| Publish directory | `dist/public` |
| Production branch | `main` |
| Node version | `22` or the current Netlify default |

The `netlify.toml` file already contains the build command, publish directory, and a catch-all rewrite to `index.html`. The rewrite keeps the single-page site routes working if additional client-side routes are added later.

The current site does not require application secrets or a backend service. Booking actions use the published phone number and email address directly. Generated and uploaded visual assets are referenced through the project’s managed storage URLs, so they are not bundled into the repository.

## Local verification

Run `pnpm check` for TypeScript validation and `pnpm build` to produce the Netlify publish directory. A successful build should create `dist/public`.
