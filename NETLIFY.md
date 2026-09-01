# Netlify deployment

This repository is configured for Netlify as a static Vite deployment. In Netlify, choose **Add new site → Import an existing project → GitHub**, select `Tauno29/oniipa-guest-house`, and use the settings below.

| Setting | Value |
|---|---|
| Build command | `pnpm build` |
| Publish directory | `dist/public` |
| Production branch | `main` |
| Node version | `22` or the current Netlify default |

The `netlify.toml` file already contains the build command, publish directory, and a catch-all rewrite to `index.html`. The rewrite keeps the single-page site routes working if additional client-side routes are added later.

The current site does not require application secrets or a backend service. Booking requests are submitted through a Netlify Form named `room-booking`. The form collects the guest’s name, email, phone, guest count, arrival date, departure date, room preference, and message.

## Forward booking requests to the guesthouse email

After the first production deploy, open **Netlify → Site configuration → Forms → Form notifications → Add notification → Email notification**. Set the form to `room-booking` and the recipient to `oipapa2016@gmail.com`, then save the notification. Netlify will store each submission and forward new booking requests to that inbox. The code includes a static hidden form shell in `client/index.html` so Netlify detects the form during the build, plus the interactive React form on the page.

Generated and uploaded visual assets are now bundled under `client/public/assets` so they load correctly on the standalone Netlify domain.

## Local verification

Run `pnpm check` for TypeScript validation and `pnpm build` to produce the Netlify publish directory. A successful build should create `dist/public`.
