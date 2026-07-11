/**
 * reset-password.js
 * ----------------------------------------------------------------------------
 * This page has no simple "authed or not" answer -- a visitor lands here
 * mid-recovery, holding a short-lived session Supabase grants purely so
 * they can set a new password. Correctness here hinges on timing:
 *
 *   1. supabaseClient.js creates the client with detectSessionInUrl: true,
 *      which starts parsing the URL's recovery tokens as soon as the
 *      module loads.
 *   2. That parsing finishes asynchronously and fires a PASSWORD_RECOVERY
 *      event through onAuthStateChange.
 *   3. We subscribe to that event IMMEDIATELY (no awaits before it) so our
 *      listener is registered before that first async tick can complete.
 *
 * As a safety net (Supabase's own docs note this ordering isn't 100%
 * guaranteed across versions), a short timeout falls back to checking
 * getSession() directly. If neither confirms a recovery session, the link
 * is treated as invalid/expired rather than silently showing a form that
 * would fail on submit.
 */
import { supabase } from './supabaseClient.js';
import { initI18n, setPageTitle, t, getLang } from './i18n.js';
import { initTheme } from './theme.js';
import { passwordsMatch, getPasswordStrength, PASSWORD_MIN_LENGTH } from './validators.js';
import { initPasswordToggles, setButtonLoading, showToast, getFriendlyErrorMessage } from './ui.js';
import { ROUTES } from './constants.js';

document.body.classList.remove('is-authing');
initI18n();
initTheme();
setPageTitle('resetPassword.title');

const verifyingEl = document.getElementById('reset-verifying');
const formWrapperEl = document.getElementById('reset-form-wrapper');
const invalidEl = document.getElementById('reset-invalid');
const successEl = document.getElementById('reset-success');

function showState(el) {
  [verifyingEl, formWrapperEl, invalidEl, successEl].forEach((node) => {
    node.style.display = node === el ? '' : 'none';
  });
}

let resolved = false;

const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY' && !resolved) {
    resolved = true;
    initPasswordToggles();
    showState(formWrapperEl);
  }
});

const hasRecoveryTokens =
  window.location.hash.includes('type=recovery') || window.location.search.includes('code=');

setTimeout(async () => {
  if (resolved) return;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && hasRecoveryTokens) {
    resolved = true;
    initPasswordToggles();
    showState(formWrapperEl);
  } else {
    showState(invalidEl);
  }
}, 1200);

document.getElementById('new-password').addEventListener('input', (e) => {
  const meter = document.getElementById('strength-meter');
  const label = document.getElementById('strength-label');
  const { score, label: strengthLabel } = getPasswordStrength(e.target.value);
  meter.dataset.score = String(score);
  label.textContent = e.target.value
    ? t(`signup.strength${strengthLabel[0].toUpperCase()}${strengthLabel.slice(1)}`)
    : '';
});

document.getElementById('reset-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const passwordField = document.getElementById('password-field');
  const confirmField = document.getElementById('confirm-password-field');
  const passwordError = document.getElementById('password-error');
  passwordField.classList.remove('has-error');
  confirmField.classList.remove('has-error');
  passwordError.textContent = '';

  const password = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  let hasError = false;

  if (password.length < PASSWORD_MIN_LENGTH) {
    passwordField.classList.add('has-error');
    passwordError.textContent = t('validation.passwordTooShort', getLang(), { min: PASSWORD_MIN_LENGTH });
    hasError = true;
  }
  if (!passwordsMatch(password, confirmPassword)) {
    confirmField.classList.add('has-error');
    hasError = true;
  }
  if (hasError) return;

  const submitBtn = document.getElementById('reset-submit');
  setButtonLoading(submitBtn, true, t('resetPassword.submitLoading'));

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    setButtonLoading(submitBtn, false);
    showToast(getFriendlyErrorMessage(error), 'error');
    return;
  }

  authListener?.subscription?.unsubscribe();
  showState(successEl);
  setTimeout(() => window.location.replace(ROUTES.DASHBOARD), 1800);
});
