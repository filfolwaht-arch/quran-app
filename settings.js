/**
 * settings.js
 * ----------------------------------------------------------------------------
 * Password + email changes use plain updateUser() -- Supabase's default
 * behavior when the project's "Secure password change" setting is off. If
 * that setting gets turned on later, updateUser({ password }) will need a
 * reauthenticate() + nonce step first; see Supabase's Auth docs for
 * reauthenticate() when that applies to this project.
 *
 * Email changes trigger Supabase's own confirmation flow (by default, a
 * confirmation link goes to BOTH the old and new address -- "Secure email
 * change" in the project's email provider settings controls this).
 */
import { supabase } from './supabaseClient.js';
import { requireAuth, signOut } from './auth-guard.js';
import { initI18n, setPageTitle, t, getLang } from './i18n.js';
import { initTheme } from './theme.js';
import { isValidEmail, passwordsMatch, getPasswordStrength, PASSWORD_MIN_LENGTH } from './validators.js';
import { initPasswordToggles, setButtonLoading, showToast, getFriendlyErrorMessage } from './ui.js';

const session = await requireAuth();
if (session) {
  document.body.classList.remove('is-authing');
  initI18n();
  initTheme();
  initPasswordToggles();
  setPageTitle('settings.title');

  const user = session.user;
  document.getElementById('current-email').textContent = user.email;
  document.getElementById('sign-out-btn').addEventListener('click', signOut);

  // Persist the language choice to the account (in addition to the
  // localStorage write initI18n() already does) so it follows the user to
  // other devices.
  document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      supabase
        .from('profiles')
        .update({ preferred_language: btn.getAttribute('data-lang-switch') })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) showToast(getFriendlyErrorMessage(error), 'error');
        });
    });
  });

  /* ---- Password ---- */

  document.getElementById('new-password').addEventListener('input', (e) => {
    const meter = document.getElementById('strength-meter');
    const label = document.getElementById('strength-label');
    const { score, label: strengthLabel } = getPasswordStrength(e.target.value);
    meter.dataset.score = String(score);
    label.textContent = e.target.value
      ? t(`signup.strength${strengthLabel[0].toUpperCase()}${strengthLabel.slice(1)}`)
      : '';
  });

  document.getElementById('password-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const pwField = document.getElementById('new-password-field');
    const confirmField = document.getElementById('confirm-password-field');
    const pwError = document.getElementById('new-password-error');
    pwField.classList.remove('has-error');
    confirmField.classList.remove('has-error');
    pwError.textContent = '';

    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    let hasError = false;

    if (password.length < PASSWORD_MIN_LENGTH) {
      pwField.classList.add('has-error');
      pwError.textContent = t('validation.passwordTooShort', getLang(), { min: PASSWORD_MIN_LENGTH });
      hasError = true;
    }
    if (!passwordsMatch(password, confirmPassword)) {
      confirmField.classList.add('has-error');
      hasError = true;
    }
    if (hasError) return;

    const btn = document.getElementById('password-submit');
    setButtonLoading(btn, true, t('common.saving'));
    const { error } = await supabase.auth.updateUser({ password });
    setButtonLoading(btn, false);

    if (error) {
      showToast(getFriendlyErrorMessage(error), 'error');
      return;
    }
    document.getElementById('password-form').reset();
    document.getElementById('strength-meter').dataset.score = '0';
    document.getElementById('strength-label').textContent = '';
    showToast(t('settings.passwordUpdated'), 'success');
  });

  /* ---- Email ---- */

  document.getElementById('email-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const field = document.getElementById('new-email-field');
    field.classList.remove('has-error');

    const newEmail = document.getElementById('new-email').value.trim();
    if (!isValidEmail(newEmail)) {
      field.classList.add('has-error');
      return;
    }
    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      showToast(t('errors.sameEmail'), 'error');
      return;
    }

    const btn = document.getElementById('email-submit');
    setButtonLoading(btn, true, t('common.saving'));
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setButtonLoading(btn, false);

    if (error) {
      showToast(getFriendlyErrorMessage(error), 'error');
      return;
    }
    document.getElementById('email-form').reset();
    showToast(t('settings.emailUpdateSent'), 'success');
  });
}
