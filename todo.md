# Netlify deployment checklist

- [x] Inspect the current build scripts and output directory.
- [x] Add Netlify build and SPA fallback configuration.
- [x] Document the Netlify connection and deploy settings.
- [x] Run typecheck and production build validation.
- [x] Commit and push the deployment-ready changes to GitHub.

## Image deployment repair

- [x] Replace Manus-only storage paths with Netlify-safe bundled image paths.
- [x] Verify every referenced image exists in the production output.
- [x] Commit and push the image fix to GitHub.

## Room booking flow

- [x] Add a booking request form with guest details, dates, and room preferences.
- [x] Add a clear submitted-state confirmation for guests.
- [x] Document the email notification setup for the guesthouse inbox.
- [x] Validate the production build and push the booking flow to GitHub.
