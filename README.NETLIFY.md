# Deployment notes
This branch contains the admin structure updates and Netlify configuration.

Quick deploy steps (Netlify):
1. Ensure environment variables are set in Netlify dashboard (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).
2. Build: `npm run build:netlify` (this will run next build + functions placeholder).
3. Publish directory (if using static out): configure Next export or use `next start` behind a serverless adapter.

Notes:
- To fully deploy NestJS backend to Netlify Functions, additional build steps are required (compile Nest to dist and place function handlers under `netlify/functions`).
- Lottie animation JSON files are included in `assets/lottie/` and can be loaded with `admin/utils.js` loadLottie helper.
