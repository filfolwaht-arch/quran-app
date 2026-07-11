# Manara Auth System

A complete email/password authentication system on Supabase Auth: 8 pages
(login, sign up, forgot password, reset password, verify email, profile,
settings), full English / French / Arabic (RTL) support, light/dark/auto
theming, and a `profiles` table locked down with Row Level Security.

No build step, no framework -- plain HTML/CSS/JS, loaded via native
`<script type="module">` and ES module imports.

## 1. Run the SQL migrations

In the Supabase Dashboard -> SQL Editor, run the five files in
`supabase/migrations/` **in order** (001 through 005). Each one is
commented with what it does and why. If you use the Supabase CLI instead,
copy them into your own `supabase/migrations` folder and run
`supabase db push`.

## 2. Add your project credentials

```
cp env.example.js env.js
```

Edit `env.js` and fill in your Supabase Project URL and anon/publishable
key (Dashboard -> Project Settings -> API). `env.js` is in `.gitignore` --
it's the static-site equivalent of a `.env` file, since browsers can't read
real environment variables. Nothing is hardcoded in the app code itself; if
you deploy to Netlify/Vercel/similar, generate `env.js` at build time from
the platform's real env vars instead (one-line example inside
`env.example.js`).

## 3. Configure the Supabase Auth dashboard

A few things live in project settings, not in code:

- **Authentication -> URL Configuration**: add your site's URL (and
  `localhost` for local testing) to *Redirect URLs*. Password-reset and
  email-confirmation links are rejected if their target isn't allow-listed
  here.
- **Authentication -> Sign In / Providers -> Email**: leave **Confirm
  email** on if you want new users to verify before their first sign-in
  (this system supports both settings either way -- see `signup.js`).
- **Secure email change**: on by default; sends a confirmation link to both
  the old and new address when a user changes their email in Settings.
- **Secure password change**: off by default, which is what this system
  assumes. If you turn it on, `settings.js`'s password form will need a
  `reauthenticate()` + OTP step added before `updateUser()` -- see
  Supabase's Auth docs for that flow.

## 4. Serve it locally

The pages use ES module imports, which browsers block over `file://`. Use
any static server, for example:

```
npx serve .
# or: python3 -m http.server 8080
```

Then open `http://localhost:.../login.html`.

## Project structure

```
index.html              Redirects to login or dashboard based on session
login.html / signup.html / forgot-password.html / reset-password.html / verify-email.html
profile.html            Signed-in landing page (dashboard) + editable profile
settings.html           Password, email, language, appearance

css/variables.css       Design tokens (colors, type, spacing) for light + dark
css/main.css            Reset, layout, shared components
css/pages.css           Layout specific to profile.html / settings.html

js/supabaseClient.js    The one Supabase client every page imports
js/constants.js         Brand name + route constants
js/i18n.js              EN/FR/AR strings + apply/switch logic
js/theme.js             Light/dark/auto
js/auth-guard.js        requireAuth() / redirectIfAuthed() / signOut()
js/validators.js        Email/username/password rules, strength scoring
js/ui.js                Toasts, button loading state, password show/hide, error mapping
js/<page>.js            One file per page, the logic described in its own header comment

supabase/migrations/    5 SQL files, run once, in order
```

## Notes on a few choices made for you

- **"Dashboard"** wasn't in the page list, so `profile.html` is the
  post-login landing page. Change `ROUTES.DASHBOARD` in `js/constants.js`
  if you add a dedicated dashboard page later.
- **"Manara"** in the header/titles is a placeholder brand name --
  change `APP_NAME` in `js/constants.js` (and the `<title>` tags) to
  whatever this ends up being wired into.
- **Account deletion** isn't included. Deleting an `auth.users` row
  requires the service-role key, which must never reach the browser --
  it needs a small Edge Function if you want to add it later.
- **Avatars** are a pasted image URL, matching the `avatar_url` column as
  specified. Direct file upload would need a Supabase Storage bucket +
  policies, which I left out since it wasn't asked for -- happy to add it.
