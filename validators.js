/**
 * validators.js
 * ----------------------------------------------------------------------------
 * Pure functions, no DOM. Each page wires these into its own input
 * listeners; keeping the logic here means the rules stay identical between
 * signup (create) and settings (change password / username) instead of
 * drifting apart.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
export const PASSWORD_MIN_LENGTH = 8;

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email).trim());
}

export function isValidUsername(username) {
  return USERNAME_RE.test(String(username).trim());
}

export function passwordsMatch(password, confirm) {
  return password.length > 0 && password === confirm;
}

/**
 * Scores a password 0-4 using length + character-class variety. This is a
 * lightweight heuristic (no dictionary/breach checks) intended for a live
 * UI meter, not a hard gate -- the only hard rule enforced elsewhere is the
 * minimum length, which Supabase Auth also enforces server-side.
 * Returns { score: 0-4, label: 'weak'|'fair'|'good'|'strong' }.
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: 'weak' };

  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const capped = Math.min(score, 4);
  const labels = ['weak', 'weak', 'fair', 'good', 'strong'];
  return { score: capped, label: labels[capped] };
}
