/**
 * profile.js
 * ----------------------------------------------------------------------------
 * Loads the signed-in user's profiles row, renders the summary card, and
 * saves edits back. Username availability re-checks against
 * is_username_available() exactly like signup.js, except the user's own
 * current username is treated as always "available" (they're not competing
 * with themselves).
 */
import { supabase } from './supabaseClient.js';
import { requireAuth, signOut } from './auth-guard.js';
import { initI18n, setPageTitle, t, getLang, setLang } from './i18n.js';
import { initTheme } from './theme.js';
import { isValidUsername } from './validators.js';
import { setButtonLoading, showToast, getFriendlyErrorMessage } from './ui.js';

const session = await requireAuth();
if (session) {
  document.body.classList.remove('is-authing');
  initI18n();
  initTheme();
  setPageTitle('profile.title');

  const user = session.user;
  const form = document.getElementById('profile-form');
  const avatarDisplay = document.getElementById('avatar-display');
  const summaryName = document.getElementById('summary-name');
  const summaryMeta = document.getElementById('summary-meta');
  const usernameStatus = document.getElementById('username-status');
  const saveBtn = document.getElementById('profile-save');

  document.getElementById('email-readonly').value = user.email;
  document.getElementById('sign-out-btn').addEventListener('click', signOut);

  function localeFor(lang) {
    return { en: 'en-US', fr: 'fr-FR', ar: 'ar' }[lang] || 'en-US';
  }

  function renderAvatar(name, avatarUrl) {
    if (avatarUrl) {
      avatarDisplay.innerHTML = `<img src="${avatarUrl}" alt="" onerror="this.parentElement.textContent='${(name || '?').charAt(0).toUpperCase()}'" />`;
    } else {
      avatarDisplay.textContent = (name || user.email || '?').charAt(0).toUpperCase();
    }
  }

  let originalUsername = '';

  async function loadProfile() {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      showToast(getFriendlyErrorMessage(error), 'error');
      return;
    }

    // First time on this device (no local language choice yet)? Follow
    // whatever the account last had, so language travels with the user.
    if (!localStorage.getItem('manara_lang') && profile.preferred_language) {
      setLang(profile.preferred_language);
    }

    originalUsername = profile.username || '';
    form.fullName.value = profile.full_name || '';
    form.username.value = profile.username || '';
    form.avatarUrl.value = profile.avatar_url || '';

    const welcomeName = profile.full_name?.split(' ')[0] || profile.username || user.email;
    document.getElementById('welcome-message').textContent = t('profile.welcomeBack', getLang(), { name: welcomeName });
    summaryName.textContent = profile.full_name || profile.username || user.email;

    const memberSince = new Intl.DateTimeFormat(localeFor(getLang()), {
      year: 'numeric',
      month: 'long',
    }).format(new Date(profile.created_at));
    summaryMeta.textContent = t('profile.memberSince', getLang(), { date: memberSince });

    renderAvatar(profile.full_name || profile.username, profile.avatar_url);
  }

  await loadProfile();

  form.avatarUrl.addEventListener('input', (e) => renderAvatar(form.fullName.value, e.target.value.trim()));

  let usernameOk = true;
  let debounceTimer;
  form.username.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    clearTimeout(debounceTimer);
    if (value === originalUsername) {
      usernameStatus.textContent = '';
      usernameOk = true;
      return;
    }
    if (!isValidUsername(value)) {
      usernameStatus.textContent = t('validation.invalidUsername');
      usernameStatus.style.color = 'var(--error)';
      usernameOk = false;
      return;
    }
    usernameStatus.textContent = t('signup.usernameChecking');
    debounceTimer = setTimeout(async () => {
      const { data, error } = await supabase.rpc('is_username_available', { check_username: value });
      if (error) return;
      usernameOk = data === true;
      usernameStatus.textContent = t(usernameOk ? 'signup.usernameAvailable' : 'signup.usernameTaken');
      usernameStatus.style.color = usernameOk ? 'var(--success)' : 'var(--error)';
    }, 450);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = form.fullName.value.trim();
    const username = form.username.value.trim();
    const avatarUrl = form.avatarUrl.value.trim();

    if (!isValidUsername(username) || (username !== originalUsername && !usernameOk)) {
      showToast(t(usernameOk ? 'validation.invalidUsername' : 'signup.usernameTaken'), 'error');
      return;
    }

    setButtonLoading(saveBtn, true, t('common.saving'));

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, username, avatar_url: avatarUrl || null })
      .eq('id', user.id);

    setButtonLoading(saveBtn, false);

    if (error) {
      showToast(getFriendlyErrorMessage(error), 'error');
      return;
    }

    originalUsername = username;
    showToast(t('profile.saveSuccess'), 'success');
    await loadProfile();
  });
}
