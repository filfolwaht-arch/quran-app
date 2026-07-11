/**
 * theme.js
 * ----------------------------------------------------------------------------
 * Light / dark / auto, persisted in localStorage. "Auto" follows the OS via
 * prefers-color-scheme and keeps following it live if the OS setting
 * changes while the page is open. Not tied to the profiles table -- there's
 * no theme column in the schema, so this is a per-device preference only,
 * same as most apps treat it.
 */

const STORAGE_KEY = 'manara_theme'; // 'light' | 'dark' | 'auto'
const media = window.matchMedia('(prefers-color-scheme: dark)');

function systemPrefersDark() {
  return media.matches;
}

function resolvedTheme(mode) {
  return mode === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : mode;
}

export function getThemeMode() {
  return localStorage.getItem(STORAGE_KEY) || 'auto';
}

export function applyTheme(mode = getThemeMode()) {
  document.documentElement.setAttribute('data-theme', resolvedTheme(mode));
  document.querySelectorAll('[data-theme-switch]').forEach((el) => {
    el.classList.toggle('is-active', el.getAttribute('data-theme-switch') === mode);
  });
}

export function setThemeMode(mode) {
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode);
}

/** Call once per page on load. Applies the saved theme and wires up any
 *  [data-theme-switch="light|dark|auto"] buttons found in the header. */
export function initTheme() {
  applyTheme();
  document.querySelectorAll('[data-theme-switch]').forEach((el) => {
    el.addEventListener('click', () => setThemeMode(el.getAttribute('data-theme-switch')));
  });
  media.addEventListener('change', () => {
    if (getThemeMode() === 'auto') applyTheme('auto');
  });
}
