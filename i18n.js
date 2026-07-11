/**
 * i18n.js
 * ----------------------------------------------------------------------------
 * All user-facing strings for all three languages, plus the small runtime
 * that applies them to the page.
 *
 * How a page uses this:
 *   - Static text:      <h1 data-i18n="login.title"></h1>
 *   - Input placeholder: <input data-i18n-placeholder="login.emailPlaceholder">
 *   - aria-label:        <button data-i18n-aria="common.show">
 *   - In JS:              t('errors.invalidCredentials')
 *
 * Language resolution order: localStorage -> browser language -> 'en'.
 * settings.js additionally writes the choice to profiles.preferred_language
 * so it follows the user to a new device; on login/profile load we prefer
 * that value if localStorage has nothing yet (see auth-guard.js).
 */

const STORAGE_KEY = 'manara_lang';
const RTL_LANGS = new Set(['ar']);
const SUPPORTED = ['en', 'fr', 'ar'];

const translations = {
  en: {
    common: {
      loading: 'Loading…',
      save: 'Save',
      saving: 'Saving…',
      cancel: 'Cancel',
      signOut: 'Sign out',
      signOutSuccess: 'Signed out',
      backToLogin: 'Back to sign in',
      language: 'Language',
      theme: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeAuto: 'Auto',
      navProfile: 'Profile',
      navSettings: 'Settings',
      show: 'Show',
      hide: 'Hide',
    },
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to continue to your account',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      submit: 'Sign in',
      submitLoading: 'Signing in…',
      noAccount: "Don't have an account?",
      signUpLink: 'Sign up',
    },
    signup: {
      title: 'Create your account',
      subtitle: 'Start by telling us a bit about yourself',
      fullName: 'Full name',
      fullNamePlaceholder: 'Your full name',
      username: 'Username',
      usernamePlaceholder: 'yourname',
      usernameHint: '3–20 characters, letters, numbers and underscores only',
      usernameChecking: 'Checking availability…',
      usernameAvailable: 'Username is available',
      usernameTaken: 'This username is already taken',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: 'Create a password',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      submit: 'Create account',
      submitLoading: 'Creating account…',
      haveAccount: 'Already have an account?',
      loginLink: 'Sign in',
      strengthWeak: 'Weak',
      strengthFair: 'Fair',
      strengthGood: 'Good',
      strengthStrong: 'Strong',
    },
    forgotPassword: {
      title: 'Reset your password',
      subtitle: "We'll email you a link to get back in",
      email: 'Email',
      submit: 'Send reset link',
      submitLoading: 'Sending…',
      successMessage:
        "If an account exists for that email, a reset link is on its way. Check your inbox.",
      backToLogin: 'Back to sign in',
    },
    resetPassword: {
      title: 'Choose a new password',
      subtitle: "Make it something you haven't used before",
      newPassword: 'New password',
      confirmPassword: 'Confirm new password',
      submit: 'Update password',
      submitLoading: 'Updating…',
      successMessage: 'Your password has been updated.',
      invalidLinkTitle: "This link isn't valid",
      invalidLinkMessage:
        'It may have expired or already been used. Request a new one below.',
      requestNewLink: 'Request a new link',
    },
    verifyEmail: {
      title: 'Verify your email',
      checkInbox: 'We sent a verification link to {email}. Click it to activate your account.',
      checkInboxGeneric: 'We sent you a verification link. Click it to activate your account.',
      resend: 'Resend email',
      resendWait: 'Resend in {seconds}s',
      resendSuccess: 'Verification email sent again.',
      verifiedTitle: 'Email verified',
      verifiedMessage: 'Your account is active. Taking you to your dashboard…',
    },
    profile: {
      title: 'Profile',
      welcomeBack: 'Welcome back, {name}',
      memberSince: 'Member since {date}',
      editTitle: 'Edit profile',
      fullName: 'Full name',
      username: 'Username',
      avatarUrl: 'Avatar URL',
      avatarUrlHint: 'Paste a link to an image',
      save: 'Save changes',
      saveSuccess: 'Profile updated',
      email: 'Email',
      emailHint: 'Change your email from Settings',
    },
    settings: {
      title: 'Account settings',
      passwordSection: 'Password',
      newPassword: 'New password',
      confirmNewPassword: 'Confirm new password',
      updatePassword: 'Update password',
      passwordUpdated: 'Password updated',
      emailSection: 'Email address',
      currentEmail: 'Current email',
      newEmail: 'New email',
      updateEmail: 'Update email',
      emailUpdateSent: 'Check both your old and new inbox to confirm the change.',
      languageSection: 'Language',
      themeSection: 'Appearance',
    },
    errors: {
      invalidCredentials: "That email or password isn't right.",
      emailNotConfirmed: 'Please verify your email before signing in.',
      userAlreadyExists: 'An account with this email already exists.',
      weakPassword: 'Choose a stronger password.',
      rateLimited: 'Too many attempts. Please wait a moment and try again.',
      networkError: "Couldn't reach the server. Check your connection.",
      usernameTaken: 'This username is already taken.',
      sameEmail: "That's already your email address.",
      generic: 'Something went wrong. Please try again.',
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Enter a valid email address',
      passwordTooShort: 'Password must be at least {min} characters',
      passwordsDoNotMatch: "Passwords don't match",
      invalidUsername: '3-20 characters: letters, numbers and underscores only',
    },
  },

  fr: {
    common: {
      loading: 'Chargement…',
      save: 'Enregistrer',
      saving: 'Enregistrement…',
      cancel: 'Annuler',
      signOut: 'Se déconnecter',
      signOutSuccess: 'Déconnexion réussie',
      backToLogin: 'Retour à la connexion',
      language: 'Langue',
      theme: 'Thème',
      themeLight: 'Clair',
      themeDark: 'Sombre',
      themeAuto: 'Automatique',
      navProfile: 'Profil',
      navSettings: 'Paramètres',
      show: 'Afficher',
      hide: 'Masquer',
    },
    login: {
      title: 'Bon retour',
      subtitle: 'Connectez-vous pour accéder à votre compte',
      email: 'E-mail',
      emailPlaceholder: 'vous@exemple.com',
      password: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      submit: 'Se connecter',
      submitLoading: 'Connexion…',
      noAccount: "Vous n'avez pas de compte ?",
      signUpLink: 'Créer un compte',
    },
    signup: {
      title: 'Créer votre compte',
      subtitle: 'Commencez par nous parler un peu de vous',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Votre nom complet',
      username: "Nom d'utilisateur",
      usernamePlaceholder: 'votrenom',
      usernameHint: '3 à 20 caractères : lettres, chiffres et tirets bas uniquement',
      usernameChecking: 'Vérification de la disponibilité…',
      usernameAvailable: "Ce nom d'utilisateur est disponible",
      usernameTaken: "Ce nom d'utilisateur est déjà pris",
      email: 'E-mail',
      emailPlaceholder: 'vous@exemple.com',
      password: 'Mot de passe',
      passwordPlaceholder: 'Créez un mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Ressaisissez votre mot de passe',
      submit: 'Créer le compte',
      submitLoading: 'Création du compte…',
      haveAccount: 'Vous avez déjà un compte ?',
      loginLink: 'Se connecter',
      strengthWeak: 'Faible',
      strengthFair: 'Moyen',
      strengthGood: 'Bon',
      strengthStrong: 'Fort',
    },
    forgotPassword: {
      title: 'Réinitialiser votre mot de passe',
      subtitle: "Nous vous enverrons un lien pour retrouver l'accès",
      email: 'E-mail',
      submit: 'Envoyer le lien',
      submitLoading: 'Envoi…',
      successMessage:
        "Si un compte existe pour cet e-mail, un lien de réinitialisation est en route. Vérifiez votre boîte de réception.",
      backToLogin: 'Retour à la connexion',
    },
    resetPassword: {
      title: 'Choisissez un nouveau mot de passe',
      subtitle: "Optez pour un mot de passe que vous n'avez pas déjà utilisé",
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le nouveau mot de passe',
      submit: 'Mettre à jour le mot de passe',
      submitLoading: 'Mise à jour…',
      successMessage: 'Votre mot de passe a été mis à jour.',
      invalidLinkTitle: "Ce lien n'est pas valide",
      invalidLinkMessage:
        'Il a peut-être expiré ou déjà été utilisé. Demandez-en un nouveau ci-dessous.',
      requestNewLink: 'Demander un nouveau lien',
    },
    verifyEmail: {
      title: 'Vérifiez votre e-mail',
      checkInbox:
        "Nous avons envoyé un lien de vérification à {email}. Cliquez dessus pour activer votre compte.",
      checkInboxGeneric:
        'Nous vous avons envoyé un lien de vérification. Cliquez dessus pour activer votre compte.',
      resend: "Renvoyer l'e-mail",
      resendWait: 'Renvoyer dans {seconds}s',
      resendSuccess: 'E-mail de vérification renvoyé.',
      verifiedTitle: 'E-mail vérifié',
      verifiedMessage: 'Votre compte est actif. Redirection vers votre tableau de bord…',
    },
    profile: {
      title: 'Profil',
      welcomeBack: 'Content de vous revoir, {name}',
      memberSince: 'Membre depuis le {date}',
      editTitle: 'Modifier le profil',
      fullName: 'Nom complet',
      username: "Nom d'utilisateur",
      avatarUrl: "URL de l'avatar",
      avatarUrlHint: "Collez le lien d'une image",
      save: 'Enregistrer les modifications',
      saveSuccess: 'Profil mis à jour',
      email: 'E-mail',
      emailHint: 'Modifiez votre e-mail depuis les Paramètres',
    },
    settings: {
      title: 'Paramètres du compte',
      passwordSection: 'Mot de passe',
      newPassword: 'Nouveau mot de passe',
      confirmNewPassword: 'Confirmer le nouveau mot de passe',
      updatePassword: 'Mettre à jour le mot de passe',
      passwordUpdated: 'Mot de passe mis à jour',
      emailSection: 'Adresse e-mail',
      currentEmail: 'E-mail actuel',
      newEmail: 'Nouvel e-mail',
      updateEmail: "Mettre à jour l'e-mail",
      emailUpdateSent:
        'Vérifiez votre ancienne et votre nouvelle boîte de réception pour confirmer le changement.',
      languageSection: 'Langue',
      themeSection: 'Apparence',
    },
    errors: {
      invalidCredentials: 'Cet e-mail ou ce mot de passe est incorrect.',
      emailNotConfirmed: 'Veuillez vérifier votre e-mail avant de vous connecter.',
      userAlreadyExists: 'Un compte existe déjà avec cet e-mail.',
      weakPassword: 'Choisissez un mot de passe plus robuste.',
      rateLimited: 'Trop de tentatives. Veuillez patienter un instant puis réessayer.',
      networkError: 'Impossible de joindre le serveur. Vérifiez votre connexion.',
      usernameTaken: "Ce nom d'utilisateur est déjà pris.",
      sameEmail: "C'est déjà votre adresse e-mail actuelle.",
      generic: 'Une erreur est survenue. Veuillez réessayer.',
    },
    validation: {
      required: 'Ce champ est obligatoire',
      invalidEmail: 'Saisissez une adresse e-mail valide',
      passwordTooShort: 'Le mot de passe doit contenir au moins {min} caractères',
      passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
      invalidUsername: '3 à 20 caractères : lettres, chiffres et tirets bas uniquement',
    },
  },

  ar: {
    common: {
      loading: 'جارٍ التحميل…',
      save: 'حفظ',
      saving: 'جارٍ الحفظ…',
      cancel: 'إلغاء',
      signOut: 'تسجيل الخروج',
      signOutSuccess: 'تم تسجيل الخروج',
      backToLogin: 'العودة إلى تسجيل الدخول',
      language: 'اللغة',
      theme: 'المظهر',
      themeLight: 'فاتح',
      themeDark: 'داكن',
      themeAuto: 'تلقائي',
      navProfile: 'الملف الشخصي',
      navSettings: 'الإعدادات',
      show: 'إظهار',
      hide: 'إخفاء',
    },
    login: {
      title: 'مرحبًا بعودتك',
      subtitle: 'سجّل الدخول للمتابعة إلى حسابك',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'you@example.com',
      password: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      submit: 'تسجيل الدخول',
      submitLoading: 'جارٍ تسجيل الدخول…',
      noAccount: 'ليس لديك حساب؟',
      signUpLink: 'إنشاء حساب',
    },
    signup: {
      title: 'أنشئ حسابك',
      subtitle: 'ابدأ بإخبارنا القليل عن نفسك',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'اسمك الكامل',
      username: 'اسم المستخدم',
      usernamePlaceholder: 'اسمك',
      usernameHint: 'من 3 إلى 20 حرفًا: أحرف وأرقام وشرطة سفلية فقط',
      usernameChecking: 'جارٍ التحقق من التوفر…',
      usernameAvailable: 'اسم المستخدم متاح',
      usernameTaken: 'اسم المستخدم هذا مُستخدم بالفعل',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'you@example.com',
      password: 'كلمة المرور',
      passwordPlaceholder: 'أنشئ كلمة مرور',
      confirmPassword: 'تأكيد كلمة المرور',
      confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
      submit: 'إنشاء الحساب',
      submitLoading: 'جارٍ إنشاء الحساب…',
      haveAccount: 'لديك حساب بالفعل؟',
      loginLink: 'تسجيل الدخول',
      strengthWeak: 'ضعيفة',
      strengthFair: 'متوسطة',
      strengthGood: 'جيدة',
      strengthStrong: 'قوية',
    },
    forgotPassword: {
      title: 'إعادة تعيين كلمة المرور',
      subtitle: 'سنرسل إليك رابطًا لاستعادة الوصول إلى حسابك',
      email: 'البريد الإلكتروني',
      submit: 'إرسال رابط إعادة التعيين',
      submitLoading: 'جارٍ الإرسال…',
      successMessage:
        'إذا كان هناك حساب مرتبط بهذا البريد، فسيصلك رابط إعادة التعيين. تحقق من بريدك الوارد.',
      backToLogin: 'العودة إلى تسجيل الدخول',
    },
    resetPassword: {
      title: 'اختر كلمة مرور جديدة',
      subtitle: 'اختر كلمة مرور لم تستخدمها من قبل',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور الجديدة',
      submit: 'تحديث كلمة المرور',
      submitLoading: 'جارٍ التحديث…',
      successMessage: 'تم تحديث كلمة المرور بنجاح.',
      invalidLinkTitle: 'هذا الرابط غير صالح',
      invalidLinkMessage: 'قد يكون منتهي الصلاحية أو تم استخدامه من قبل. اطلب رابطًا جديدًا أدناه.',
      requestNewLink: 'طلب رابط جديد',
    },
    verifyEmail: {
      title: 'تحقق من بريدك الإلكتروني',
      checkInbox: 'أرسلنا رابط تحقق إلى {email}. اضغط عليه لتفعيل حسابك.',
      checkInboxGeneric: 'أرسلنا لك رابط تحقق. اضغط عليه لتفعيل حسابك.',
      resend: 'إعادة إرسال البريد',
      resendWait: 'إعادة الإرسال بعد {seconds} ث',
      resendSuccess: 'تم إرسال رسالة التحقق مرة أخرى.',
      verifiedTitle: 'تم التحقق من البريد الإلكتروني',
      verifiedMessage: 'حسابك نشط الآن. جارٍ تحويلك إلى لوحتك الرئيسية…',
    },
    profile: {
      title: 'الملف الشخصي',
      welcomeBack: 'مرحبًا بعودتك، {name}',
      memberSince: 'عضو منذ {date}',
      editTitle: 'تعديل الملف الشخصي',
      fullName: 'الاسم الكامل',
      username: 'اسم المستخدم',
      avatarUrl: 'رابط الصورة الشخصية',
      avatarUrlHint: 'الصق رابط صورة',
      save: 'حفظ التغييرات',
      saveSuccess: 'تم تحديث الملف الشخصي',
      email: 'البريد الإلكتروني',
      emailHint: 'يمكنك تغيير بريدك الإلكتروني من الإعدادات',
    },
    settings: {
      title: 'إعدادات الحساب',
      passwordSection: 'كلمة المرور',
      newPassword: 'كلمة المرور الجديدة',
      confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
      updatePassword: 'تحديث كلمة المرور',
      passwordUpdated: 'تم تحديث كلمة المرور',
      emailSection: 'البريد الإلكتروني',
      currentEmail: 'البريد الإلكتروني الحالي',
      newEmail: 'البريد الإلكتروني الجديد',
      updateEmail: 'تحديث البريد الإلكتروني',
      emailUpdateSent: 'تحقق من بريدك القديم والجديد لتأكيد التغيير.',
      languageSection: 'اللغة',
      themeSection: 'المظهر',
    },
    errors: {
      invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      emailNotConfirmed: 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.',
      userAlreadyExists: 'يوجد حساب بالفعل مرتبط بهذا البريد الإلكتروني.',
      weakPassword: 'اختر كلمة مرور أقوى.',
      rateLimited: 'محاولات كثيرة جدًا. يرجى الانتظار قليلًا ثم المحاولة مرة أخرى.',
      networkError: 'تعذّر الوصول إلى الخادم. تحقق من اتصالك بالإنترنت.',
      usernameTaken: 'اسم المستخدم هذا مُستخدم بالفعل.',
      sameEmail: 'هذا هو بريدك الإلكتروني الحالي بالفعل.',
      generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    },
    validation: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'أدخل بريدًا إلكترونيًا صالحًا',
      passwordTooShort: 'يجب ألا تقل كلمة المرور عن {min} أحرف',
      passwordsDoNotMatch: 'كلمتا المرور غير متطابقتين',
      invalidUsername: 'من 3 إلى 20 حرفًا: أحرف وأرقام وشرطة سفلية فقط',
    },
  },
};

function resolve(lang, key) {
  const parts = key.split('.');
  let node = translations[lang];
  for (const part of parts) {
    node = node?.[part];
  }
  return node;
}

/** Look up a translation string and interpolate {placeholders}. Falls back
 *  to English, then to the raw key, so a missing translation is visible
 *  and never a crash. */
export function t(key, lang = getLang(), vars = {}) {
  let str = resolve(lang, key) ?? resolve('en', key) ?? key;
  for (const [name, value] of Object.entries(vars)) {
    str = str.replaceAll(`{${name}}`, value);
  }
  return str;
}

export function getLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) return stored;
  const browserLang = (navigator.language || 'en').slice(0, 2);
  return SUPPORTED.includes(browserLang) ? browserLang : 'en';
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations(lang);
}

/** Walks the DOM applying data-i18n / data-i18n-placeholder / data-i18n-aria,
 *  sets <html lang/dir>, and refreshes the state of any language-switcher
 *  buttons (marked with data-lang-switch="en|fr|ar"). */
export function applyTranslations(lang = getLang()) {
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'), lang);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'), lang));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), lang));
  });
  document.querySelectorAll('[data-lang-switch]').forEach((el) => {
    el.classList.toggle('is-active', el.getAttribute('data-lang-switch') === lang);
  });
}

/** Call once per page on load. Applies the current language and wires up
 *  any [data-lang-switch] buttons found in the header. */
export function initI18n() {
  applyTranslations(getLang());
  document.querySelectorAll('[data-lang-switch]').forEach((el) => {
    el.addEventListener('click', () => setLang(el.getAttribute('data-lang-switch')));
  });
}

export function setPageTitle(key) {
  document.title = `${t(key)} · Manara`;
}
