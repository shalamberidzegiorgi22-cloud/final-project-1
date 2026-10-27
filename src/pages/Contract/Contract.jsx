import { useState } from 'react';
import { Shield, CheckCircle2, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/useTheme';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/useAuth';
import { PruffoLogo } from '../../components/PruffoLogo';
import './contract.css';

const minimumDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 16);

export default function Contract({
  activeTab,
  onTabChange,
  onInspectorRegister,
  onCancelInspectorRegistration,
  onViewRegisteredInspector,
  registeredInspector,
}) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { register } = useAuth();
  const copy = t.contract;
  
  const [accountForm, setAccountForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isBuyerRegistered, setIsBuyerRegistered] = useState(false);

  // Inspector state
  const [inspectorForm, setInspectorForm] = useState({
    firstName: '',
    lastName: '',
    qualification: 'Zweiradmechaniker-Meister (HWK)',
    specialization: '',
    certNumber: '',
    certificateImage: null,
    city: '',
    experience: '',
    availability: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(Boolean(registeredInspector));
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  function submitBuyerRegistration(event) {
    event.preventDefault();
    register({
      name: `${accountForm.firstName.trim()} ${accountForm.lastName.trim()}`,
      email: accountForm.email.trim(),
    });
    setIsBuyerRegistered(true);
  }

  async function submitInspectorRegistration(event) {
    event.preventDefault();
    if (isSubmittingRegistration || isSubmitted) return;
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const city = String(formData.get('city') ?? '').trim();
    const specialization = String(formData.get('specialization') ?? '').trim();
    const availability = String(formData.get('availability') ?? '');
    if (!inspectorForm.certificateImage) {
      setRegistrationError(copy.certificateImageRequired);
      return;
    }

    const missingFields = [
      [firstName, copy.firstName],
      [lastName, copy.lastName],
      [city, copy.primaryCity],
      [specialization, copy.specialization],
      [availability, copy.availabilityDateTime],
    ]
      .filter(([value]) => !value)
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      setRegistrationError(`${copy.registrationRequired} ${missingFields.join(', ')}`);
      return;
    }
    const availabilityTimestamp = new Date(availability).getTime();
    if (!Number.isFinite(availabilityTimestamp) || availabilityTimestamp <= Date.now()) {
      setRegistrationError(copy.registrationDateRequired);
      return;
    }
    if (!onInspectorRegister) {
      setRegistrationError(copy.registrationUnavailable);
      return;
    }

    const inspector = {
      id: `inspector-${Date.now()}`,
      name: `${firstName} ${lastName}`,
      city,
      specialization,
      qualification: String(formData.get('qualification') ?? ''),
      certNumber: String(formData.get('certNumber') ?? '').trim(),
      availability,
      rating: 0,
      reviewCount: 0,
      reviews: [],
    };
    setIsSubmittingRegistration(true);
    try {
      await onInspectorRegister(inspector);
      setRegistrationError('');
      setIsSubmitted(true);
    } catch {
      setRegistrationError(copy.registrationFailed);
    } finally {
      setIsSubmittingRegistration(false);
    }
  }

  function cancelInspectorRegistration() {
    if (!registeredInspector) return;
    onCancelInspectorRegistration?.(registeredInspector.id);
    setIsSubmitted(false);
    setInspectorForm({
      firstName: '',
      lastName: '',
      qualification: 'Zweiradmechaniker-Meister (HWK)',
      specialization: '',
      certNumber: '',
      certificateImage: null,
      city: '',
      experience: '',
      availability: '',
    });
    setRegistrationError('');
  }

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-clip p-4 transition-colors duration-300 sm:p-6 lg:p-8 ${isDark ? 'bg-[#0a0a0a] text-zinc-100' : 'bg-[#f8f9fa] text-zinc-900'}`}>
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/40 pb-5 sm:pb-6">
          <div className="flex items-center gap-3">
            <PruffoLogo className="h-8 w-auto shrink-0 object-contain" />
            <span className="font-bold tracking-widest text-base bg-gradient-to-r from-[#d4af37] to-amber-200 bg-clip-text text-transparent">{copy.brand}</span>
          </div>
          
        </div>

        
        <div className="blue-glass-card mx-auto flex w-full max-w-md rounded-2xl p-1.5">
          <button 
            onClick={() => onTabChange('buyer')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'buyer' ? 'bg-[#d4af37] text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <Shield size={16} />
            <span className="min-w-0">{copy.buyerTab}</span>
          </button>
          <button 
            onClick={() => onTabChange('inspector')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'inspector' ? 'bg-[#d4af37] text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <UserCheck size={16} />
            <span className="min-w-0">{copy.inspectorTab}</span>
          </button>
        </div>

      
        {activeTab === 'buyer' && (
          <div className="blue-glass-card space-y-6 rounded-3xl p-4 sm:p-6 md:p-8">
            {!isBuyerRegistered ? (
              <>
                <div className="space-y-2">
                  <h2 className="text-xl font-serif font-bold leading-tight sm:text-2xl">{copy.buyerTitle}</h2>
                  <p className="text-sm opacity-70">{copy.buyerDescription}</p>
                </div>

                <form className="space-y-4 pt-4" onSubmit={submitBuyerRegistration}>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="buyer-first-name">{copy.accountFirstName}</label>
                    <input
                      className="blue-glass-card w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="buyer-first-name"
                      onChange={(event) => setAccountForm((current) => ({ ...current, firstName: event.target.value }))}
                      placeholder={copy.accountFirstNamePlaceholder}
                      required
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="text"
                      value={accountForm.firstName}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="buyer-last-name">{copy.accountLastName}</label>
                    <input
                      className="w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="buyer-last-name"
                      onChange={(event) => setAccountForm((current) => ({ ...current, lastName: event.target.value }))}
                      placeholder={copy.accountLastNamePlaceholder}
                      required
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="text"
                      value={accountForm.lastName}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="buyer-email">{copy.accountEmail}</label>
                    <input
                      className="w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="buyer-email"
                      onChange={(event) => setAccountForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder={copy.accountEmailPlaceholder}
                      required
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="email"
                      value={accountForm.email}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="buyer-password">{copy.accountPassword}</label>
                    <div className="relative">
                      <input
                        className="w-full !rounded-xl border border-amber-500/50 p-3.5 pr-12 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                        id="buyer-password"
                        onChange={(event) => setAccountForm((current) => ({ ...current, password: event.target.value }))}
                        placeholder={copy.accountPasswordPlaceholder}
                        required
                        style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={accountForm.password}
                      />
                      <button
                        aria-label={isPasswordVisible ? copy.hidePassword : copy.showPassword}
                        aria-pressed={isPasswordVisible}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-amber-300 transition hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
                        onClick={() => setIsPasswordVisible((visible) => !visible)}
                        type="button"
                      >
                        {isPasswordVisible
                          ? <Eye aria-hidden="true" size={18} />
                          : <EyeOff aria-hidden="true" size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 py-4 font-bold text-black shadow-lg transition-all hover:from-amber-400 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                  >
                    <span>{copy.confirmOrder}</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 size={56} className="text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold">{copy.confirmedTitle}</h3>
                <p className="text-sm opacity-80 max-w-md mx-auto">{copy.confirmedDescription}</p>
                <button onClick={() => setIsBuyerRegistered(false)} className="px-6 py-2.5 bg-zinc-800 text-xs font-bold rounded-xl hover:bg-zinc-700">{copy.bookAnother}</button>
              </div>
            )}
          </div>
        )}

    
        {activeTab === 'inspector' && (
          <div className="blue-glass-card space-y-6 rounded-3xl p-4 sm:p-6 md:p-8">
            {!isSubmitted ? (
              <>
                <div className="space-y-2">
                  <h2 className="text-xl font-serif font-bold leading-tight sm:text-2xl">{copy.inspectorTitle}</h2>
                  <p className="text-sm opacity-70">{copy.inspectorDescription}</p>
                </div>

                <form
                  className="space-y-6"
                  noValidate
                  onSubmit={submitInspectorRegistration}
                >
                <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="inspector-first-name">{copy.firstName}</label>
                    <input
                      className="w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="inspector-first-name"
                      name="firstName"
                      onChange={(e) => {
                        setInspectorForm((current) => ({ ...current, firstName: e.target.value }));
                        setRegistrationError('');
                      }}
                      placeholder={copy.firstName}
                      required
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="text"
                      value={inspectorForm.firstName}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="inspector-last-name">{copy.lastName}</label>
                    <input
                      className="w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="inspector-last-name"
                      name="lastName"
                      onChange={(e) => {
                        setInspectorForm((current) => ({ ...current, lastName: e.target.value }));
                        setRegistrationError('');
                      }}
                      placeholder={copy.lastName}
                      required
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="text"
                      value={inspectorForm.lastName}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="inspector-city">{copy.primaryCity}</label>
                    <input
                      className="blue-glass-card w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="inspector-city"
                      name="city"
                      onChange={(event) => setInspectorForm((current) => ({ ...current, city: event.target.value }))}
                      placeholder={copy.locationPlaceholder}
                      required
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="text"
                      value={inspectorForm.city}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="inspector-specialization">{copy.specialization}</label>
                    <input
                      className="w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="inspector-specialization"
                      name="specialization"
                      onChange={(e) => {
                        setInspectorForm((current) => ({ ...current, specialization: e.target.value }));
                        setRegistrationError('');
                      }}
                      placeholder={copy.specializationPlaceholder}
                      required
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="text"
                      value={inspectorForm.specialization}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="inspector-qualification">{copy.qualification}</label>
                    <select
                      className="w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition [color-scheme:dark] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="inspector-qualification"
                      name="qualification"
                      onChange={(e) => setInspectorForm({ ...inspectorForm, qualification: e.target.value })}
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      value={inspectorForm.qualification}
                    >
                      <option className="bg-slate-900 text-amber-300">Zweiradmechaniker-Meister (HWK)</option>
                      <option className="bg-slate-900 text-amber-300">Diplom-Ingenieur (Fahrzeugtechnik)</option>
                      <option className="bg-slate-900 text-amber-300">Zertifizierter Fahrradmechaniker</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="inspector-certificate">{copy.certificate}</label>
                    <input
                      className="w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="inspector-certificate"
                      name="certNumber"
                      onChange={(e) => setInspectorForm({ ...inspectorForm, certNumber: e.target.value })}
                      placeholder={copy.certificatePlaceholder}
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="text"
                      value={inspectorForm.certNumber}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="inspector-certificate-image">{copy.certificateImage}</label>
                    <input
                      accept="image/*"
                      className="w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="inspector-certificate-image"
                      name="certificateImage"
                      onChange={(event) => {
                        setInspectorForm((current) => ({
                          ...current,
                          certificateImage: event.target.files?.[0] ?? null,
                        }));
                        setRegistrationError('');
                      }}
                      required
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="file"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="inspector-availability">{copy.availabilityDateTime}</label>
                    <input
                      className="w-full !rounded-xl border border-amber-500/50 p-3.5 text-sm accent-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.12)] outline-none transition [color-scheme:dark] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                      id="inspector-availability"
                      name="availability"
                      min={minimumDateTime}
                      onChange={(e) => {
                        setInspectorForm((current) => ({ ...current, availability: e.target.value }));
                        setRegistrationError('');
                      }}
                      required
                      style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      type="datetime-local"
                      value={inspectorForm.availability}
                    />
                  </div>
                </div>

                <button
                  className="w-full rounded-xl bg-[#d4af37] py-4 font-bold text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmittingRegistration}
                  type="submit"
                >
                  {copy.submitApplication}
                </button>
                {registrationError && (
                  <p className="text-sm font-medium text-red-600 dark:text-red-300" role="alert">
                    {registrationError}
                  </p>
                )}
                </form>
              </>
            ) : (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 size={56} className="text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-bold">{copy.applicationTitle}</h3>
                <p className="text-sm font-semibold">{registeredInspector?.name ?? `${inspectorForm.firstName} ${inspectorForm.lastName}`.trim()}</p>
                <p className="text-sm opacity-80 max-w-md mx-auto">
                  {copy.applicationDescription(registeredInspector?.city ?? inspectorForm.city)}
                </p>
                <button
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-emerald-600/80 py-4 font-bold text-white"
                  disabled
                  type="button"
                >
                  {copy.sentLabel}
                </button>
                {onViewRegisteredInspector && (
                  <button
                    className="rounded-xl bg-zinc-800 px-6 py-2.5 text-xs font-bold hover:bg-zinc-700"
                    onClick={onViewRegisteredInspector}
                    type="button"
                  >
                    {copy.viewRegisteredInspector}
                  </button>
                )}
                {registeredInspector && onCancelInspectorRegistration && (
                  <button
                    className="w-full rounded-xl border border-red-400/40 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-500/10 dark:text-red-300"
                    onClick={cancelInspectorRegistration}
                    type="button"
                  >
                    {copy.cancelRegistration}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}