import { useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLanguage } from './useLanguage';
import { AuthContext } from './auth-context';
import { readLocalStorage, writeLocalStorage } from '../utils/localStorage';

const AUTH_STORAGE_KEY = 'pirro-auth-session';

function isValidAuthSession(value) {
  return Boolean(
    value
    && typeof value === 'object'
    && typeof value.isRegistered === 'boolean'
    && typeof value.isLoggedIn === 'boolean',
  );
}

const authCopy = {
  EN: {
    required: 'To request a service, please register!',
    register: 'Register',
    title: 'Create your account',
    firstName: 'First name',
    firstNamePlaceholder: 'George',
    lastName: 'Last name',
    lastNamePlaceholder: 'Smith',
    email: 'Email address',
    emailPlaceholder: '@gmail.com',
    password: 'Password',
    passwordPlaceholder: '*****',
    submit: 'Complete registration',
    close: 'Close',
    demo: 'Registration is currently a local demo and is not connected to an account service.',
  },
  DE: {
    required: 'Um einen Service anzufragen, registrieren Sie sich bitte!',
    register: 'Registrieren',
    title: 'Konto erstellen',
    firstName: 'Vorname',
    firstNamePlaceholder: 'Georg',
    lastName: 'Nachname',
    lastNamePlaceholder: 'Schmidt',
    email: 'E-Mail-Adresse',
    emailPlaceholder: '@gmail.com',
    password: 'Passwort',
    passwordPlaceholder: '*****',
    submit: 'Registrierung abschließen',
    close: 'Schließen',
    demo: 'Die Registrierung ist derzeit eine lokale Demo und nicht mit einem Kontodienst verbunden.',
  },
  GE: {
    required: 'მომსახურების მოსითხოვად და ოსტატთან დაკავშირებამდე გთხოვთ გაიაროთ რეგისტრაცია!',
    register: 'რეგისტრაციის',
    title: 'ანგარიშის შექმნა',
    firstName: 'სახელი',
    firstNamePlaceholder: 'სახელი',
    lastName: 'გვარი',
    lastNamePlaceholder: 'გვარი',
    email: 'ელფოსტა (Email)',
    emailPlaceholder: '@gmail.com',
    password: 'პაროლი',
    passwordPlaceholder: '*****',
    submit: 'რეგისტრაციის დასრულება',
    close: 'დახურვა',
    demo: 'რეგისტრაცია ამ ეტაპზე მხოლოდ ლოკალური დემოა და ანგარიშების სერვისთან დაკავშირებული არ არის.',
  },
};

function RegistrationDialog({ copy, mode, onClose, onRegister }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!mode) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-labelledby="auth-dialog-title"
        aria-modal="true"
        className="blue-glass-card relative w-full max-w-md space-y-5 rounded-3xl p-6 text-zinc-900 shadow-2xl dark:text-zinc-100 sm:p-8"
        role="dialog"
      >
        <button
          aria-label={copy.close}
          className="absolute right-4 top-4 rounded-full p-2 opacity-65 transition hover:bg-blue-500/10 hover:opacity-100"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={19} />
        </button>

        <div className="space-y-1">
          <h2 className="pr-8 font-serif text-xl font-bold sm:text-2xl" id="auth-dialog-title">
            {mode === 'guard' ? copy.required : copy.title}
          </h2>
          <p className="text-xs opacity-65">{copy.demo}</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onRegister({ name: `${firstName.trim()} ${lastName.trim()}`, email: email.trim() });
          }}
        >
          <label className="block space-y-2 text-xs font-semibold">
            <span>{copy.firstName}</span>
            <input
              autoComplete="given-name"
              className="w-full rounded-xl border border-blue-300/60 bg-white/60 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-200/20 dark:bg-zinc-950/40"
              onChange={(event) => setFirstName(event.target.value)}
              placeholder={copy.firstNamePlaceholder}
              required
              type="text"
              value={firstName}
            />
          </label>
          <label className="block space-y-2 text-xs font-semibold">
            <span>{copy.lastName}</span>
            <input
              autoComplete="family-name"
              className="w-full rounded-xl border border-blue-300/60 bg-white/60 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-200/20 dark:bg-zinc-950/40"
              onChange={(event) => setLastName(event.target.value)}
              placeholder={copy.lastNamePlaceholder}
              required
              type="text"
              value={lastName}
            />
          </label>
          <label className="block space-y-2 text-xs font-semibold">
            <span>{copy.email}</span>
            <input
              autoComplete="email"
              className="w-full rounded-xl border border-blue-300/60 bg-white/60 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-200/20 dark:bg-zinc-950/40"
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.emailPlaceholder}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block space-y-2 text-xs font-semibold">
            <span>{copy.password}</span>
            <input
              autoComplete="new-password"
              className="w-full rounded-xl border border-blue-300/60 bg-white/60 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-200/20 dark:bg-zinc-950/40"
              onChange={(event) => setPassword(event.target.value)}
              placeholder={copy.passwordPlaceholder}
              required
              type="password"
              value={password}
            />
          </label>
          <button
            className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 px-5 py-3 font-bold text-black transition hover:opacity-90"
            type="submit"
          >
            {copy.submit}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export function AuthProvider({ children }) {
  const { language } = useLanguage();
  const [authSession, setAuthSession] = useState(() => readLocalStorage(
    AUTH_STORAGE_KEY,
    { isRegistered: false, isLoggedIn: false, user: null },
    isValidAuthSession,
  ));
  const { isRegistered, isLoggedIn, user } = authSession;
  const [dialogMode, setDialogMode] = useState(null);
  const pendingAction = useRef(null);
  const copy = authCopy[language] ?? authCopy.EN;

  const requireAuth = useCallback((action) => {
    if (isLoggedIn && isRegistered) {
      action();
      return true;
    }

    pendingAction.current = action;
    setDialogMode('guard');
    return false;
  }, [isLoggedIn, isRegistered]);

  const closeDialog = useCallback(() => {
    pendingAction.current = null;
    setDialogMode(null);
  }, []);

  const completeRegistration = useCallback((userData) => {
    const nextSession = {
      isRegistered: true,
      isLoggedIn: true,
      user: userData?.name && userData?.email ? userData : user,
    };
    writeLocalStorage(AUTH_STORAGE_KEY, nextSession);
    setAuthSession(nextSession);
    setDialogMode(null);

    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  }, [user]);

  const login = useCallback(() => {
    const nextSession = { ...authSession, isRegistered: true, isLoggedIn: true };
    writeLocalStorage(AUTH_STORAGE_KEY, nextSession);
    setAuthSession(nextSession);
  }, [authSession]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      isRegistered,
      user,
      login,
      register: completeRegistration,
      requireAuth,
    }),
    [isLoggedIn, isRegistered, user, login, completeRegistration, requireAuth],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <RegistrationDialog
        copy={copy}
        mode={dialogMode}
        onClose={closeDialog}
        onRegister={completeRegistration}
      />
    </AuthContext.Provider>
  );
}
