/**
 * auth-guard.js
 * ----------------------------------------------------------------------------
 * The "check authentication state on every page" requirement, in one place.
 *
 *   requireAuth()     -- call on profile.html / settings.html. Redirects to
 *                         login if there's no session; otherwise resolves
 *                         with the session.
 *   redirectIfAuthed() -- call on login/signup/forgot-password. Sends an
 *                         already-signed-in visitor straight to the
 *                         dashboard instead of showing them a login form.
 *
 * Both are meant to run before the page reveals its content -- see the
 * <body class="is-authing"> / .is-authing CSS pattern in main.css, which
 * hides content until one of these resolves and the page removes the class.
 * This avoids a flash of the wrong UI while the async session check runs.
 */
import { supabase } from './supabaseClient.js';
import { ROUTES } from './constants.js';

export async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.replace(ROUTES.LOGIN);
    return null;
  }

  // Keep protected pages honest if the session ends while they're open
  // (sign-out in another tab, refresh-token revoked, etc).
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') window.location.replace(ROUTES.LOGIN);
  });

  return session;
}

export async function redirectIfAuthed() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    window.location.replace(ROUTES.DASHBOARD);
    return true;
  }
  return false;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.replace(ROUTES.LOGIN);
}
