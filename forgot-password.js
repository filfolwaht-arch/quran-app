/**
 * forgot-password.js
 * ----------------------------------------------------------------------------
 * Sends the reset email, then always shows the same success state -- even
 * if the address has no account -- so this form can't be used to enumerate
 * registered emails. Supabase's own resetPasswordForEmail() already behaves
 * this way server-side; this just mirrors it in the UI.
 */
import { supabase } from './supabaseClient.js';
import { redirectIfAuthed } from './auth-guard.js';
import { initI18n, setPageTitle, t } from './i18n.js';
import { initTheme } from './theme.js';
import { isValidEmail } from './validators.js';
import { setButtonLoading, showToast, getFriendlyErrorMessage } from './ui.js';
import { ROUTES } from './constants.js';

const alreadyAuthed = await redirectIfAuthed();
if (!alreadyAuthed) {
  document.body.classList.remove('is-authing');
  initI18n();
  initTheme();
  setPageTitle('forgotPassword.title');

  const form = document.getElementById('forgot-form');
  const emailField = document.getElementById('email-field');
  const submitBtn = document.getElementById('forgot-submit');
  const successAlert = document.getElementById('success-alert');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    emailField.classList.remove('has-error');

    const email = form.email.value.trim();
    if (!isValidEmail(email)) {
      emailField.classList.add('has-error');
      return;
    }

    setButtonLoading(submitBtn, true, t('forgotPassword.submitLoading'));

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: new URL(ROUTES.RESET_PASSWORD, window.location.href).toString(),
    });

    setButtonLoading(submitBtn, false);

    // Only a genuine network/rate-limit failure is shown as an error --
    // "no account with that email" is intentionally indistinguishable from
    // success (see file header).
    if (error && !/user not found/i.test(error.message || '')) {
      showToast(getFriendlyErrorMessage(error), 'error');
      return;
    }

    form.style.display = 'none';
    successAlert.style.display = 'flex';
  });
}
