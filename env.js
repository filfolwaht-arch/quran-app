/**
 * env.example.js
 * ----------------------------------------------------------------------------
 * Template for env.js. This is the closest a static, no-build-step site can
 * get to real environment variables: browsers can't read process.env, so the
 * credentials live in a small untracked script instead (same role .env plays
 * in a Node project). Copy this file to env.js and fill in your project's
 * values -- env.js is listed in .gitignore and is never committed.
 *
 * Both values below are safe to expose in client-side code: the anon key is
 * a public key by design and only ever grants what your RLS policies allow.
 * Find them in Supabase Dashboard -> Project Settings -> API.
 *
 * Deploying to Netlify/Vercel/GitHub Actions/etc? Generate this file at
 * build time from the platform's real environment variables instead of
 * hand-editing it, e.g. as a Netlify build command:
 *   echo "window.__ENV__={SUPABASE_URL:'$SUPABASE_URL',SUPABASE_ANON_KEY:'$SUPABASE_ANON_KEY'};" > env.js
 */
window.__ENV__ = {
  SUPABASE_URL: 'https://YOUR-PROJECT-REF.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR-ANON-PUBLIC-KEY',
};
