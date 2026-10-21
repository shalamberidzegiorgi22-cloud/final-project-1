import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import { PruffoLogo } from '../components/PruffoLogo';
import './Home/home.css';

export default function Contact() {
  const { t } = useLanguage();
  const copy = t.contact;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setForm({ name: '', email: '', subject: '', message: '' });
    setIsSent(true);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setIsSent(false);
  }

  const infoCards = [
    { icon: MapPin, title: copy.office, details: copy.officeDetails },
    { icon: Mail, title: copy.supportEmail, details: copy.supportAddress },
    { icon: Phone, title: copy.phone, details: copy.phoneDetails },
  ];

  return (
    <div className="home-luxury-shell min-h-screen w-full max-w-full overflow-x-hidden rounded-none p-0 text-white">
      <div className="mx-auto max-w-6xl space-y-6 px-3 pb-6 sm:space-y-8 sm:px-6 sm:pb-8 lg:px-8">
        <header className="home-glass-nav flex-wrap justify-between gap-4 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <PruffoLogo className="h-8 w-auto shrink-0 object-contain" />
            <span className="bg-gradient-to-r from-[#d4af37] to-amber-200 bg-clip-text text-base font-bold tracking-widest text-transparent">
              {copy.brand}
            </span>
          </div>
        </header>

        <section className="space-y-3 py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">{copy.brand}</p>
          <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{copy.title}</h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-blue-50/80 sm:text-base">{copy.description}</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <form className="blue-glass-card space-y-5 rounded-3xl p-4 sm:p-6 lg:p-8" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold" htmlFor="contact-name">{copy.name}</label>
                <input
                  autoComplete="name"
                  className="w-full border border-white/20 bg-slate-950/25 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100/50 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
                  id="contact-name"
                  name="name"
                  onChange={updateField}
                  placeholder={copy.namePlaceholder}
                  required
                  value={form.name}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold" htmlFor="contact-email">{copy.email}</label>
                <input
                  autoComplete="email"
                  className="w-full border border-white/20 bg-slate-950/25 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100/50 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
                  id="contact-email"
                  name="email"
                  onChange={updateField}
                  placeholder={copy.emailPlaceholder}
                  required
                  type="email"
                  value={form.email}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="contact-subject">{copy.subject}</label>
              <input
                className="w-full border border-white/20 bg-slate-950/25 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100/50 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
                id="contact-subject"
                name="subject"
                onChange={updateField}
                placeholder={copy.subjectPlaceholder}
                required
                value={form.subject}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="contact-message">{copy.message}</label>
              <textarea
                className="min-h-36 w-full resize-y border border-white/20 bg-slate-950/25 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100/50 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
                id="contact-message"
                name="message"
                onChange={updateField}
                placeholder={copy.messagePlaceholder}
                required
                value={form.message}
              />
            </div>

            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d4af37] to-amber-500 px-6 py-3.5 font-bold text-slate-950 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 sm:w-auto"
              type="submit"
            >
              <span>{copy.send}</span>
              <Send aria-hidden="true" size={17} />
            </button>
            {isSent && <p aria-live="polite" className="text-sm font-semibold text-emerald-300">{copy.success}</p>}
          </form>

          <aside aria-label={copy.brand} className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
            {infoCards.map(({ icon: Icon, title, details }) => {
              const content = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky-200/30 bg-sky-300/10 text-sky-100">
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words font-semibold text-white">{title}</span>
                    <span className="mt-1 block break-words text-left text-sm leading-relaxed text-blue-50/75">{details}</span>
                  </span>
                </>
              );

              return (
                <div className="blue-glass-card flex w-full min-w-0 items-start gap-4 rounded-2xl p-6 text-left" key={title}>
                  {content}
                </div>
              );
            })}
          </aside>
        </div>
      </div>
    </div>
  );
}
