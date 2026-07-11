/**
 * supabaseClient.js
 * ----------------------------------------------------------------------------
 * Creates the single shared Supabase client every page imports. Two things
 * worth knowing before touching this file:
 *
 * 1) Credentials come from window.__ENV__, set by env.js (loaded via a
 *    plain <script> tag before this module runs on every page). Nothing is
 *    hardcoded here -- see env.example.js for setup.
 *
 * 2) "Remember me" is implemented with a custom storage adapter. supabase-js
 *    always persists the session somewhere; the only choice is *where*.
 *    rememberMeStorage writes to localStorage (survives closing the
 *    browser) when the user checked "Remember me", or to sessionStorage
 *    (cleared when the tab/browser closes) when they didn't. login.js calls
 *    setRememberMe() with the checkbox state right before signing in.
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.108.2/+esm';

const SUPABASE_URL = window.__ENV__?.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.__ENV__?.SUPABASE_ANON_KEY;

const looksUnconfigured =
  !SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('YOUR-PROJECT-REF');

if (looksUnconfigured) {
  // Deliberately loud: a silent failure here is much harder to debug than
  // a console error, since every page would otherwise just hang on "Loading...".
  console.error(
    '[Supabase] env.js is missing or still has placeholder values. ' +
      'Copy env.example.js to env.js and fill in your project URL and anon key.'
  );
}

let remember = true; // default: keep the user signed in across browser restarts

export function setRememberMe(value) {
  remember = Boolean(value);
}

/** Routes get/set/remove to localStorage or sessionStorage based on the
 *  current "remember me" choice, and cleans up the other one so a stale
 *  copy of the session can never linger in both places at once. */
const rememberMeStorage = {
  getItem(key) {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  },
  setItem(key, value) {
    if (remember) {
      localStorage.setItem(key, value);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
      localStorage.removeItem(key);
    }
  },
  removeItem(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '', {
  auth: {
    storage: rememberMeStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // required for email confirmation + password recovery links
  },
});
