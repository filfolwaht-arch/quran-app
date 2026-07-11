/**
 * signup.js
 * ----------------------------------------------------------------------------
 * Page logic for signup.html. full_name/username/preferred_language are
 * passed as signUp() metadata; the DB trigger in migration 003 reads that
 * metadata to seed the profiles row -- nothing here inserts into profiles
 * directly.
 */
import { supabase } from './supabaseClient.js';
import { redirectIfAuthed } from './auth-guard.js';
import { initI18n, setPageTitle, t, getLang } from './i18n.js';
import { initTheme } from './theme.js';
import {
  isValidEmail,
  isValidUsername,
  passwordsMatch,
  getPasswordStrength,
  PASSWORD_MIN_LENGTH,
} from './validators.js';
import { initPasswordToggles, setButtonLoading, showToast, getFriendlyErrorMessage } from './ui.js';
import { ROUTES } from './constants.js';

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const alreadyAuthed = await redirectIfAuthed();
if (!alreadyAuthed) {
  document.body.classList.remove('is-authing');
  initI18n();
  initTheme();
  initPasswordToggles();
  setPageTitle('signup.title');

  const form = document.getElementById('signup-form');
  const fullNameField = document.getElementById('fullname-field');
  const usernameField = document.getElementById('username-field');
  const usernameStatus = document.getElementById('username-status');
  const emailField = document.getElementById('email-field');
  const passwordField = document.getElementById('password-field');
  const passwordError = document.getElementById('password-error');
  const confirmField = document.getElementById('confirm-password-field');
  const strengthMeter = document.getElementById('strength-meter');
  const strengthLabel = document.getElementById('strength-label');
  const submitBtn = document.getElementById('signup-submit');

  let usernameIsAvailable = null; // null = unknown/unchecked, true/false once resolved

  const checkUsername = debounce(async (value) => {
    if (!isValidUsername(value)) {
      usernameIsAvailable = null;
      usernameStatus.textContent = t('signup.usernameHint');
      usernameStatus.style.color = '';
      return;
    }
    usernameStatus.textContent = t('signup.usernameChecking');
    const { data, error } = await supabase.rpc('is_username_available', { check_username: value });
    if (error) return; // stay silent; the real check happens again on submit
    usernameIsAvailable = data === true;
    usernameStatus.textContent = t(usernameIsAvailable ? 'signup.usernameAvailable' : 'signup.usernameTaken');
    usernameStatus.style.color = usernameIsAvailable ? 'var(--success)' : 'var(--error)';
  }, 450);

  document.getElementById('username').addEventListener('input', (e) => {
    usernameIsAvailable = null;
    checkUsername(e.target.value.trim());
  });

  document.getElementById('password').addEventListener('input', (e) => {
    const { score, label } = getPasswordStrength(e.target.value);
    strengthMeter.dataset.score = String(score);
    strengthLabel.textContent = e.target.value ? t(`signup.strength${label[0].toUpperCase()}${label.slice(1)}`) : '';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    [fullNameField, usernameField, emailField, passwordField, confirmField].forEach((f) =>
      f.classList.remove('has-error')
    );
    passwordError.textContent = '';

    const fullName = form.fullName.value.trim();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    let hasError = false;
    if (!fullName) {
      fullNameField.classList.add('has-error');
      hasError = true;
    }
    if (!isValidUsername(username)) {
      usernameField.classList.add('has-error');
      usernameStatus.textContent = t('validation.invalidUsername');
      usernameStatus.style.color = 'var(--error)';
      hasError = true;
    } else if (usernameIsAvailable === false) {
      usernameField.classList.add('has-error');
      hasError = true;
    }
    if (!isValidEmail(email)) {
      emailField.classList.add('has-error');
      hasError = true;
    }
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

    setButtonLoading(submitBtn, true, t('signup.submitLoading'));

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username, preferred_language: getLang() },
        emailRedirectTo: new URL(ROUTES.VERIFY_EMAIL, window.location.href).toString(),
      },
    });

    if (error) {
      setButtonLoading(submitBtn, false);
      showToast(getFriendlyErrorMessage(error), 'error');
      return;
    }

    // signUp() returns a session only when "Confirm email" is OFF in the
    // project's Auth settings. When it's ON (the default), session is null
    // and the user still needs to click the link we just emailed them.
    if (data.session) {
      window.location.replace(ROUTES.DASHBOARD);
    } else {
      window.location.replace(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`);
    }
  });
}
