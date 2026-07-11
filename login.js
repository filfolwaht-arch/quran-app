/**
 * login.js
 * ----------------------------------------------------------------------------
 * Page logic for login.html: guest-only guard, form validation, and the
 * actual signInWithPassword() call.
 */
import { supabase, setRememberMe } from './supabaseClient.js';
import { redirectIfAuthed } from './auth-guard.js';
import { initI18n, setPageTitle, t } from './i18n.js';
import { initTheme } from './theme.js';
import { isValidEmail } from './validators.js';
import { initPasswordToggles, setButtonLoading, showToast, getFriendlyErrorMessage } from './ui.js';
import { ROUTES } from './constants.js';

const alreadyAuthed = await redirectIfAuthed();
if (!alreadyAuthed) {
  document.body.classList.remove('is-authing');
  initI18n();
  initTheme();
  initPasswordToggles();
  setPageTitle('login.title');

  const form = document.getElementById('login-form');
  const emailField = document.getElementById('email-field');
  const passwordField = document.getElementById('password-field');
  const submitBtn = document.getElementById('login-submit');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    emailField.classList.remove('has-error');
    passwordField.classList.remove('has-error');

    const email = form.email.value.trim();
    const password = form.password.value;
    let hasError = false;

    if (!isValidEmail(email)) {
      emailField.classList.add('has-error');
      hasError = true;
    }
    if (!password) {
      passwordField.classList.add('has-error');
      hasError = true;
    }
    if (hasError) return;

    setRememberMe(document.getElementById('remember-me').checked);
    setButtonLoading(submitBtn, true, t('login.submitLoading'));

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setButtonLoading(submitBtn, false);
      showToast(getFriendlyErrorMessage(error), 'error');
      return;
    }

    window.location.replace(ROUTES.DASHBOARD);
  });
}
