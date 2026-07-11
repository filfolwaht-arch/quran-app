/**
 * verify-email.js
 * ----------------------------------------------------------------------------
 * Tells the two landing scenarios apart by whether the URL carries auth
 * tokens (the actual confirmation link) or not (a plain redirect here from
 * signup.js with ?email=... for display only). Same detectSessionInUrl +
 * onAuthStateChange timing considerations as reset-password.js apply here.
 */
import { supabase } from './supabaseClient.js';
import { initI18n, setPageTitle, t } from './i18n.js';
import { initTheme } from './theme.js';
import { showToast, getFriendlyErrorMessage } from './ui.js';
import { ROUTES } from './constants.js';

document.body.classList.remove('is-authing');
initI18n();
initTheme();
setPageTitle('verifyEmail.title');

const pendingEl = document.getElementById('verify-pending');
const successEl = document.getElementById('verify-success');
const messageEl = document.getElementById('verify-message');
const resendBtn = document.getElementById('resend-btn');

const params = new URLSearchParams(window.location.search);
const email = params.get('email');

messageEl.textContent = email
  ? t('verifyEmail.checkInbox', undefined, { email })
  : t('verifyEmail.checkInboxGeneric');

if (!email) resendBtn.style.display = 'none';

const hasAuthTokens =
  window.location.hash.includes('access_token') || window.location.search.includes('code=');

function showVerified() {
  pendingEl.style.display = 'none';
  successEl.style.display = '';
  setTimeout(() => window.location.replace(ROUTES.DASHBOARD), 1600);
}

let confirmed = false;

supabase.auth.onAuthStateChange((event) => {
  if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && hasAuthTokens && !confirmed) {
    confirmed = true;
    showVerified();
  }
});

if (hasAuthTokens) {
  setTimeout(async () => {
    if (confirmed) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      confirmed = true;
      showVerified();
    }
  }, 1200);
}

let cooldown = 0;
let cooldownTimer = null;

function tickCooldown() {
  cooldown -= 1;
  if (cooldown <= 0) {
    clearInterval(cooldownTimer);
    resendBtn.disabled = false;
    resendBtn.textContent = t('verifyEmail.resend');
  } else {
    resendBtn.textContent = t('verifyEmail.resendWait', undefined, { seconds: cooldown });
  }
}

resendBtn.addEventListener('click', async () => {
  if (!email) return;
  resendBtn.disabled = true;

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: new URL(ROUTES.VERIFY_EMAIL, window.location.href).toString() },
  });

  if (error) {
    showToast(getFriendlyErrorMessage(error), 'error');
    resendBtn.disabled = false;
    return;
  }

  showToast(t('verifyEmail.resendSuccess'), 'success');
  cooldown = 30;
  cooldownTimer = setInterval(tickCooldown, 1000);
  tickCooldown();
});
