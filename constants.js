/**
 * constants.js
 * ----------------------------------------------------------------------------
 * Single source of truth for the two things every page needs: the brand
 * name shown in headers/titles, and the route every "redirect to X" call
 * points at. "Manara" is a placeholder for wherever this system gets wired
 * in -- change it here once and every page picks it up.
 *
 * No dedicated "dashboard" page was in the spec's page list, so
 * DASHBOARD_URL points at profile.html, which doubles as the signed-in
 * landing page. If a real dashboard page gets added later, this one line is
 * the only change needed.
 */

export const APP_NAME = 'Manara';

export const ROUTES = {
  HOME: 'index.html',
  LOGIN: 'login.html',
  SIGNUP: 'signup.html',
  FORGOT_PASSWORD: 'forgot-password.html',
  RESET_PASSWORD: 'reset-password.html',
  VERIFY_EMAIL: 'verify-email.html',
  PROFILE: 'profile.html',
  SETTINGS: 'settings.html',
  DASHBOARD: 'profile.html',
};
