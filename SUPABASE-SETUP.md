# Supabase setup
1. Create a Supabase project.
2. Project Settings → API: copy Project URL and anon public key.
3. Put them in config.js.
4. Run supabase-schema.sql in SQL Editor.
5. Commit config.js to GitHub. Vercel will redeploy automatically.
Never put a service-role key in the browser.
