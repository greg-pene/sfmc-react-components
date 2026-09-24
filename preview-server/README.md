# SFMC embargo preview server

A small standalone Express service used only for one thing: signing
short-lived preview URLs for **embargoed** Cloudinary assets (assets with a
`token` Access Control rule that automatically flips to `anonymous`/public at
a scheduled date), so an SFMC content-block author can preview them before
the embargo lifts.

This exists because `cloudinary-sfmc/` is a pure client-side app — it has no
access to any Cloudinary secret. Signing an authenticated delivery URL needs
one (the **Access Control Key**, provisioned by Cloudinary Support — distinct
from the account's API key/secret), which must never reach the browser
bundle. Hence a separate service.

## What it does

`POST /api/embargo-preview-url` with `{ publicId, resourceType, deliveryType }`:

1. Looks the asset up via the Cloudinary Admin API (server-to-server, using
   the account's own API key/secret) to read its real `access_control` rules
   — the client's claim about an asset is never trusted directly.
2. If the asset doesn't actually carry a `token` access-control rule, refuses
   with `403 not_token_restricted`. This endpoint only ever signs genuinely
   embargoed assets.
3. Otherwise returns a signed, short-lived (`PREVIEW_TTL_SECONDS`, default
   300s) authenticated delivery URL built with the official Cloudinary SDK
   and the Access Control Key, plus the matching `access_control` rule (so
   the caller can show the marketer when the embargo actually lifts).

The **final** email HTML is never built from this signed URL — only the
plain, normal Cloudinary delivery URL is saved as content, so it starts
working the moment the embargo lifts and doesn't depend on this service or
a token that will have long since expired.

## Configuration

Copy `.env.example` to `.env` and fill in:

- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` —
  used only for the read-only Admin API lookup.
- `CLOUDINARY_ACCESS_CONTROL_KEY` — from Cloudinary Support. Keep this out of
  any client-facing config; it never leaves this service.
- `ALLOWED_ORIGINS` — comma-separated list of origins allowed to call this
  service (the deployed `cloudinary-sfmc` app's origin(s)). Leave empty only
  for local development.
- `PREVIEW_TTL_SECONDS` — how long a signed preview URL stays valid. Keep
  this short: it only needs to survive one editor session.

## Running it

```bash
yarn install
yarn dev      # node --watch index.js
# or
yarn start
```

## Testing

```bash
yarn test     # node --test, uses a fake cloudinary client — no network calls
```

## Deploying

This is a plain Express app — deploy it anywhere that runs Node 20+ (Render,
a Lambda + API Gateway, etc.). Point the `cloudinary-sfmc` app at it via the
`previewServerUrl` query parameter (see the root README).

### Render

A [Render Blueprint](https://render.com/docs/blueprint-spec) is included at
the repo root (`render.yaml`) — a `web` service rooted at `preview-server/`
with a health check on `/healthz`. To deploy:

1. In the Render dashboard, create a new Blueprint from this repo (or a fork
   of it).
2. Fill in the env vars marked `sync: false` in `render.yaml`
   (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
   `CLOUDINARY_ACCESS_CONTROL_KEY`, `ALLOWED_ORIGINS`) directly in the
   dashboard — none of these are committed.
3. Set `ALLOWED_ORIGINS` to wherever `cloudinary-sfmc` is actually deployed
   (its exact origin, no trailing slash) — not blank; blank is only for
   local development, where it allows every origin.
4. Once deployed, pass the resulting `https://<service>.onrender.com` URL as
   `previewServerUrl` to the `cloudinary-sfmc` app.

## Known limitations / follow-ups

- Video-to-GIF (`Video2Gif.js`) still hard-blocks restricted source videos;
  this service and the validator change only cover the Image content block.
- A stale signed preview URL (past its TTL) is refreshed lazily: `CldAssetSelector`
  re-requests a fresh one the moment the browser fails to load the current
  one (`<img onError>`), which covers reopening a previously-saved content
  block after the token has expired. It does **not** cover an already-open
  block sitting idle past the TTL without any reload — there's no background
  timer re-signing it while mounted. The saved/sent HTML is unaffected either
  way, since it never used the signed URL.
