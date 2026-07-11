/**
 * ui.js
 * ----------------------------------------------------------------------------
 * Small, dependency-free UI helpers shared by every page: toast
 * notifications, a button "loading" state, the show/hide password toggle,
 * the geometric spinner markup, and a translator from raw Supabase error
 * messages to friendly, localized ones.
 */
import { t } from './i18n.js';

/* ---------------------------------------------------------------------- */
/* Spinner (also this system's signature visual element)                   */
/* ---------------------------------------------------------------------- */

export function spinnerSVG() {
  return `
    <svg class="spinner-star" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <polygon points="12,2 22,12 12,22 2,12" />
      <polygon points="12,2 22,12 12,22 2,12" transform="rotate(45 12 12)" />
    </svg>`;
}

/* ---------------------------------------------------------------------- */
/* Toasts                                                                   */
/* ---------------------------------------------------------------------- */

function toastRoot() {
  let root = document.getElementById('toast-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-root';
    root.className = 'toast-root';
    root.setAttribute('aria-live', 'polite');
    root.setAttribute('role', 'status');
    document.body.appendChild(root);
  }
  return root;
}

/** type: 'success' | 'error' | 'info' */
export function showToast(message, type = 'info', duration = 4500) {
  const root = toastRoot();
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = message;
  root.appendChild(el);

  requestAnimationFrame(() => el.classList.add('is-visible'));

  const remove = () => {
    el.classList.remove('is-visible');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  };
  const timer = setTimeout(remove, duration);
  el.addEventListener('click', () => {
    clearTimeout(timer);
    remove();
  });
}

/* ---------------------------------------------------------------------- */
/* Button loading state                                                    */
/* ---------------------------------------------------------------------- */

/** Swaps a submit button into/out of a disabled, spinner + label state.
 *  Stores the original label on the element so it can be restored exactly. */
export function setButtonLoading(button, isLoading, loadingLabel) {
  if (isLoading) {
    button.dataset.originalLabel = button.dataset.originalLabel || button.innerHTML;
    button.disabled = true;
    button.innerHTML = `${spinnerSVG()}<span>${loadingLabel}</span>`;
    button.classList.add('is-loading');
  } else {
    button.disabled = false;
    button.classList.remove('is-loading');
    if (button.dataset.originalLabel) button.innerHTML = button.dataset.originalLabel;
  }
}

/* ---------------------------------------------------------------------- */
/* Show / hide password                                                    */
/* ---------------------------------------------------------------------- */

const EYE_OPEN =
  '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
const EYE_CLOSED =
  '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M2.5 2.5l15 15M1 10s3.5-6 9-6c1.6 0 3 .35 4.2.9M19 10s-1.2 2.05-3.35 3.7M7.6 7.6A2.5 2.5 0 0 0 10 12.5c.5 0 .96-.15 1.35-.4M5.1 5.4C2.9 6.8 1 10 1 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Finds every .password-field wrapper (an input[type=password] plus an
 *  empty .password-toggle button) on the page and wires up the eye icon. */
export function initPasswordToggles() {
  document.querySelectorAll('.password-field').forEach((wrapper) => {
    const input = wrapper.querySelector('input');
    const toggle = wrapper.querySelector('.password-toggle');
    if (!input || !toggle) return;

    toggle.innerHTML = EYE_OPEN;
    toggle.setAttribute('aria-label', t('common.show'));
    toggle.setAttribute('type', 'button');

    toggle.addEventListener('click', () => {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      toggle.innerHTML = showing ? EYE_OPEN : EYE_CLOSED;
      toggle.setAttribute('aria-label', t(showing ? 'common.show' : 'common.hide'));
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Friendly error messages                                                 */
/* ---------------------------------------------------------------------- */

/** Maps a raw Supabase/network error to a translated, friendly string.
 *  Matches on lowercase substrings since exact wording isn't guaranteed
 *  to be stable across supabase-js versions. */
export function getFriendlyErrorMessage(error) {
  const raw = (error?.message || '').toLowerCase();

  const rules = [
    [['invalid login credentials'], 'errors.invalidCredentials'],
    [['email not confirmed'], 'errors.emailNotConfirmed'],
    [['user already registered', 'already registered'], 'errors.userAlreadyExists'],
    [['password should be at least', 'password is too short'], 'errors.weakPassword'],
    [['rate limit', 'security purposes', 'after '], 'errors.rateLimited'],
    [['username', 'duplicate', 'unique'], 'errors.usernameTaken'],
    [['same_email', 'new email address should be different'], 'errors.sameEmail'],
    [['failed to fetch', 'networkerror', 'load failed'], 'errors.networkError'],
  ];

  for (const [needles, key] of rules) {
    if (needles.some((needle) => raw.includes(needle))) return t(key);
  }
  // Never surface raw API text -- always fall back to a friendly, localized message.
  return t('errors.generic');
}
