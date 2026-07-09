<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d6c805cc-a30f-47fd-8693-c6937ea51fdf

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   ## Preview Site

   This repository includes a GitHub Actions workflow that builds the app and deploys the `dist` folder to GitHub Pages on pushes to `main`/`master`.

   Once the workflow runs successfully, the preview will be available at:

   https://topazonanton.github.io/blenderizm/

   You can also preview locally after building:

   1. Build: `npm run build`
   2. Preview: `npm run preview`
