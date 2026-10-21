import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Search, Star, Wrench, X } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import { useTheme } from '../context/useTheme';
import { useAuth } from '../context/useAuth';
import { DEMO_INSPECTORS } from '../data/demoInspectors';
import GermanyMap from './GermanyMap';

const minimumServiceDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 16);

const labels = {
  EN: {
    eyebrow: 'PIRRO EXPERT NETWORK',
    title: 'Find an expert near you',
    description: 'Search by name, city, or specialization. Select an expert on the map or in the list to view their profile.',
    search: 'Search experts',
    placeholder: 'Name, city, or specialization',
    resultCount: (count) => `${count} ${count === 1 ? 'expert' : 'experts'} found`,
    mapTitle: 'Experts across Germany',
    demo: 'Demo profiles',
    allExperts: 'All experts',
    topExperts: 'Top experts',
    emptyTitle: 'No experts found',
    emptyDescription: 'Try another name, city, or specialization.',
    topRated: 'Top Rated',
    rateExpert: 'Rate this expert',
    ratingLabel: 'Your rating',
    reviewLabel: 'Short comment',
    reviewPlaceholder: 'Share your experience...',
    submitReview: 'Submit review',
    cancel: 'Cancel',
    reviewRequired: 'Choose a star rating and enter a comment.',
    reviews: (count) => `${count} ${count === 1 ? 'review' : 'reviews'}`,
    viewProfile: 'View profile',
    callExpert: 'Call / Connect',
    sendMessage: 'Send message',
    messagePlaceholder: 'Write a message to this expert...',
    connectionSent: 'Your service request was sent to',
    messageSent: 'Your message was sent to',
    sent: 'Sent',
    profile: 'Expert profile',
    completed: 'Completed',
    requested: 'Requested',
    reviewLocked: 'Reviews are available after a completed service.',
    noReviews: 'No reviews yet.',
    serviceDateTime: 'Preferred service date and time',
    requestHistory: 'Your service requests',
    appointment: 'Appointment',
    dateRequired: 'Choose a future service date and time before sending.',
    messageRequired: 'Write a message before sending the request.',
    requestFailed: 'The request could not be sent. Please try again.',
    sentLabel: 'Sent ✔️',
    cancelRequest: 'Cancel request',
    requestCancelled: 'Request cancelled',
  },
  DE: {
    eyebrow: 'PIRRO EXPERTENNETZWERK',
    title: 'Finden Sie einen Experten in Ihrer Nähe',
    description: 'Suchen Sie nach Name, Stadt oder Fachgebiet. Wählen Sie einen Experten auf der Karte oder in der Liste aus.',
    search: 'Experten suchen',
    placeholder: 'Name, Stadt oder Fachgebiet',
    resultCount: (count) => `${count} ${count === 1 ? 'Experte gefunden' : 'Experten gefunden'}`,
    mapTitle: 'Experten in Deutschland',
    demo: 'Beispielprofile',
    allExperts: 'Alle Experten',
    topExperts: 'Top-Experten',
    emptyTitle: 'Keine Experten gefunden',
    emptyDescription: 'Versuchen Sie einen anderen Namen, eine Stadt oder ein Fachgebiet.',
    topRated: 'Top bewertet',
    rateExpert: 'Experten bewerten',
    ratingLabel: 'Ihre Bewertung',
    reviewLabel: 'Kurzer Kommentar',
    reviewPlaceholder: 'Teilen Sie Ihre Erfahrung...',
    submitReview: 'Bewertung senden',
    cancel: 'Abbrechen',
    reviewRequired: 'Wählen Sie Sterne und schreiben Sie einen Kommentar.',
    reviews: (count) => `${count} ${count === 1 ? 'Bewertung' : 'Bewertungen'}`,
    viewProfile: 'Profil ansehen',
    callExpert: 'Anrufen / Kontaktieren',
    sendMessage: 'Nachricht senden',
    messagePlaceholder: 'Schreiben Sie eine Nachricht...',
    connectionSent: 'Ihre Serviceanfrage wurde gesendet an',
    messageSent: 'Ihre Nachricht wurde gesendet an',
    sent: 'Gesendet',
    profile: 'Expertenprofil',
    completed: 'Abgeschlossen',
    requested: 'Angefragt',
    reviewLocked: 'Bewertungen sind nach Abschluss eines Services verfügbar.',
    noReviews: 'Noch keine Bewertungen.',
    serviceDateTime: 'Gewünschter Service-Termin',
    requestHistory: 'Ihre Serviceanfragen',
    appointment: 'Termin',
    dateRequired: 'Bitte wählen Sie vor dem Senden einen zukünftigen Service-Termin.',
    messageRequired: 'Schreiben Sie eine Nachricht, bevor Sie die Anfrage senden.',
    requestFailed: 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
    sentLabel: 'Gesendet ✔️',
    cancelRequest: 'Anfrage stornieren',
    requestCancelled: 'Anfrage storniert',
  },
  GE: {
    eyebrow: 'PIRRO-ს ექსპერტთა ქსელი',
    title: 'იპოვეთ თქვენთან ახლოს ოსტატი',
    description: 'მოძებნეთ სახელით, ქალაქით ან სპეციალიზაციით. პროფილის სანახავად აირჩიეთ ოსტატი რუკაზე ან სიაში.',
    search: 'ოსტატების ძებნა',
    placeholder: 'სახელი, ქალაქი ან სპეციალიზაცია',
    resultCount: (count) => `${count} ${count === 1 ? 'ოსტატი მოიძებნა' : 'ოსტატი მოიძებნა'}`,
    mapTitle: 'ოსტატები გერმანიაში',
    demo: 'სადემო პროფილები',
    allExperts: 'ყველა მოხელე',
    topExperts: 'რჩეული / ტოპ მოხელეები',
    emptyTitle: 'ოსტატი ვერ მოიძებნა',
    emptyDescription: 'სცადეთ სხვა სახელი, ქალაქი ან სპეციალიზაცია.',
    topRated: 'ტოპ შეფასება',
    rateExpert: 'შეაფასე ოსტატი',
    ratingLabel: 'თქვენი შეფასება',
    reviewLabel: 'მოკლე კომენტარი',
    reviewPlaceholder: 'გაგვიზიარეთ გამოცდილება...',
    submitReview: 'შეფასების გაგზავნა',
    cancel: 'გაუქმება',
    reviewRequired: 'აირჩიეთ ვარსკვლავი და დატოვეთ კომენტარი.',
    reviews: (count) => `${count} შეფასება`,
    viewProfile: 'პროფილის ნახვა',
    callExpert: 'გამოძახება / კავშირი',
    sendMessage: 'მესიჯის გაგზავნა',
    messagePlaceholder: 'მისწერეთ ოსტატს...',
    connectionSent: 'მომსახურების მოთხოვნა გაეგზავნა ოსტატს:',
    messageSent: 'მესიჯი გაეგზავნა ოსტატს:',
    sent: 'გაგზავნილია',
    profile: 'ოსტატის პროფილი',
    completed: 'დასრულებული',
    requested: 'მოთხოვნილი',
    reviewLocked: 'შეფასება ხელმისაწვდომია მომსახურების დასრულების შემდეგ.',
    noReviews: 'შეფასებები ჯერ არ არის.',
    serviceDateTime: 'მომსახურების სასურველი თარიღი და დრო',
    requestHistory: 'თქვენი მომსახურების მოთხოვნები',
    appointment: 'შერჩეული დრო',
    dateRequired: 'გაგზავნამდე აირჩიეთ მომსახურების მომავალი თარიღი და დრო.',
    messageRequired: 'მოთხოვნის გაგზავნამდე დაწერეთ მესიჯი.',
    requestFailed: 'მოთხოვნა ვერ გაიგზავნა. გთხოვთ, სცადოთ თავიდან.',
    sentLabel: 'გაგზავნილია ✔️',
    cancelRequest: 'მოთხოვნის გაუქმება',
    requestCancelled: 'მოთხოვნა გაუქმდა',
  },
};

function normalizeSearchText(value) {
  return value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

export default function InspectorMapSearch({
  inspectors = DEMO_INSPECTORS,
  initialSelectedInspectorId = null,
  completedOrders = [],
  serviceOrders = [],
  onServiceRequest,
  onServiceRequestCancel,
  onMessageSend,
  onReviewSubmit,
}) {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const { requireAuth } = useAuth();
  const copy = labels[language] ?? labels.EN;
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedInspectorId, setSelectedInspectorId] = useState(initialSelectedInspectorId);
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [requestedInspectorIds, setRequestedInspectorIds] = useState(() => new Set());
  const [localServiceRequests, setLocalServiceRequests] = useState([]);
  const [cancelledRequests, setCancelledRequests] = useState([]);
  const [draftRating, setDraftRating] = useState(0);
  const [draftComment, setDraftComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState({});
  const [serviceDateTime, setServiceDateTime] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const completedInspectorIds = useMemo(
    () => new Set(completedOrders
      .filter((order) => order.status === 'Completed' || order.status === 'completed')
      .map((order) => order.inspectorId)),
    [completedOrders],
  );

  const filteredInspectors = useMemo(() => {
    const searchTerm = normalizeSearchText(query.trim());
    return inspectors
      .map((inspector, originalIndex) => {
        const reviews = [...(inspector.reviews ?? []), ...(submittedReviews[inspector.id] ?? [])];
        const reviewTotal = Number(inspector.reviewCount) || 0;
        const additionalReviews = submittedReviews[inspector.id] ?? [];
        const baseRating = Number(inspector.rating) || 0;
        const rating = additionalReviews.length
          ? ((baseRating * reviewTotal + additionalReviews.reduce((total, review) => total + review.rating, 0))
            / (reviewTotal + additionalReviews.length))
          : baseRating;

        return {
          ...inspector,
          rating,
          reviewCount: reviewTotal + additionalReviews.length,
          topRated: rating >= 4.8,
          originalIndex,
          reviews,
        };
      })
      .filter((inspector) => (
        (activeFilter === 'all' || inspector.rating >= 4.8)
        && (!searchTerm || [inspector.name, inspector.city, inspector.specialization]
          .some((value) => normalizeSearchText(value).includes(searchTerm)))
      ))
      .sort((first, second) => second.rating - first.rating || first.originalIndex - second.originalIndex);
  }, [activeFilter, inspectors, query, submittedReviews]);

  const selectedInspector = filteredInspectors.find((inspector) => inspector.id === selectedInspectorId);
  const serviceRequestHistory = useMemo(() => {
    const seenRequests = new Set();
    return [...serviceOrders, ...localServiceRequests]
      .filter((order) => !cancelledRequests.some((cancelled) => (
        cancelled.inspectorId === order.inspectorId && cancelled.requestedAt === order.requestedAt
      )))
      .filter((order) => {
        const key = `${order.inspectorId}:${order.requestedAt}`;
        if (seenRequests.has(key)) return false;
        seenRequests.add(key);
        return true;
      })
      .map((order) => {
        const inspector = inspectors.find((item) => item.id === order.inspectorId);
        return {
          ...order,
          inspectorName: order.inspectorName ?? inspector?.name ?? '',
          city: order.city ?? inspector?.city ?? '',
        };
      })
      .sort((first, second) => new Date(second.requestedAt) - new Date(first.requestedAt));
  }, [cancelledRequests, inspectors, localServiceRequests, serviceOrders]);
  const hasRequestedService = selectedInspector && (
    requestedInspectorIds.has(selectedInspector.id)
    || serviceOrders.some((order) => order.inspectorId === selectedInspector.id)
    || completedOrders.some((order) => order.inspectorId === selectedInspector.id
      && (order.status === 'Completed' || order.status === 'completed'))
  );
  const hasPreviouslyRequested = selectedInspector && (
    requestedInspectorIds.has(selectedInspector.id)
    || serviceOrders.some((order) => order.inspectorId === selectedInspector.id
      && !cancelledRequests.some((cancelled) => (
        cancelled.inspectorId === order.inspectorId && cancelled.requestedAt === order.requestedAt
      )))
  );
  const hasCompletedService = selectedInspector && hasRequestedService && completedInspectorIds.has(selectedInspector.id);

  function handleSendRequest() {
    if (!selectedInspector) return;

    const inspector = selectedInspector;
    const requestedAt = serviceDateTime;
    const messageText = message.trim();
    if (!requestedAt || requestedAt <= minimumServiceDateTime) {
      setRequestError(copy.dateRequired);
      return;
    }
    if (!messageText) {
      setRequestError(copy.messageRequired);
      return;
    }

    const completeRequest = async () => {
      setIsSendingRequest(true);
      try {
        const order = { inspectorId: inspector.id, requestedAt, status: 'Requested' };
        await onServiceRequest?.(order);
        await onMessageSend?.({ inspectorId: inspector.id, message: messageText });
        setCancelledRequests((current) => current.filter((cancelled) => (
          cancelled.inspectorId !== order.inspectorId || cancelled.requestedAt !== order.requestedAt
        )));
        setLocalServiceRequests((current) => [...current, order]);
        setRequestedInspectorIds((current) => new Set(current).add(inspector.id));
        setServiceDateTime('');
        setMessage('');
        setRequestError('');
        setNotice('');
        setSelectedInspectorId(null);
      } catch {
        setRequestError(copy.requestFailed);
      } finally {
        setIsSendingRequest(false);
      }
    };

    requireAuth(completeRequest);
  }

  function submitReview(inspector) {
    const comment = draftComment.trim();
    if (!hasCompletedService || !draftRating || !comment) {
      setReviewError(copy.reviewRequired);
      return;
    }

    const review = { inspectorId: inspector.id, rating: draftRating, comment };
    requireAuth(() => {
      onReviewSubmit?.(review);
      setSubmittedReviews((current) => ({
        ...current,
        [inspector.id]: [...(current[inspector.id] ?? []), review],
      }));
      setDraftRating(0);
      setDraftComment('');
      setReviewError('');
    });
  }

  return (
    <section aria-labelledby="inspector-map-title" className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20">
      <div className="blue-glass-card rounded-3xl p-4 text-zinc-900 sm:p-6 lg:p-8 dark:text-zinc-100">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-blue-700 dark:text-blue-300">{copy.eyebrow}</p>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl" id="inspector-map-title">{copy.title}</h2>
            <p className="mt-2 max-w-2xl text-sm opacity-75">{copy.description}</p>
          </div>
          <span className="w-fit rounded-full border border-blue-300/50 bg-blue-100/60 px-3 py-1 text-xs font-medium text-blue-800 dark:border-blue-300/20 dark:bg-blue-400/10 dark:text-blue-200">
            {copy.demo}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_0.9fr] lg:gap-8">
          <div className="min-w-0">
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-blue-300/35 bg-blue-500/5 p-1">
              <button
                aria-pressed={activeFilter === 'all'}
                className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${activeFilter === 'all' ? 'bg-blue-600 text-white shadow' : 'opacity-75 hover:bg-blue-500/10'}`}
                onClick={() => setActiveFilter('all')}
                type="button"
              >
                {copy.allExperts}
              </button>
              <button
                aria-pressed={activeFilter === 'top'}
                className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${activeFilter === 'top' ? 'bg-blue-600 text-white shadow' : 'opacity-75 hover:bg-blue-500/10'}`}
                onClick={() => setActiveFilter('top')}
                type="button"
              >
                <span className="inline-flex items-center gap-1"><Star aria-hidden="true" fill="currentColor" size={13} />{copy.topExperts}</span>
              </button>
            </div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide opacity-70" htmlFor="inspector-search">
              {copy.search}
            </label>
            <div className={`flex items-center gap-3 rounded-2xl border px-4 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 ${isDark ? 'border-zinc-700 bg-zinc-950/50' : 'border-blue-200 bg-white/70'}`}>
              <Search aria-hidden="true" className="shrink-0 opacity-55" size={19} />
              <input
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:opacity-50"
                id="inspector-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.placeholder}
                type="search"
                value={query}
              />
            </div>
            <p aria-live="polite" className="mt-3 text-xs opacity-65">{copy.resultCount(filteredInspectors.length)}</p>
            {notice && <p aria-live="polite" className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">{notice}</p>}

            <ul className="mt-3 grid max-h-[34rem] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
              {filteredInspectors.map((inspector) => (
                <li key={inspector.id}>
                  <button
                    aria-label={`${copy.viewProfile}: ${inspector.name}`}
                    aria-pressed={selectedInspectorId === inspector.id}
                    className={`blue-glass-card flex w-full items-start gap-3 rounded-2xl p-4 text-left transition ${selectedInspectorId === inspector.id ? 'border-blue-500/70 bg-blue-100/70 ring-2 ring-blue-500/20 dark:border-blue-300/50 dark:bg-blue-400/10' : ''}`}
                    onClick={() => {
                      setSelectedInspectorId(inspector.id);
                      setNotice('');
                      setDraftRating(0);
                      setDraftComment('');
                      setReviewError('');
                    }}
                    type="button"
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300">
                      <Wrench aria-hidden="true" size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-semibold">{inspector.name}</span>
                        {inspector.topRated && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-100/70 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-200">
                            <Star aria-hidden="true" fill="currentColor" size={11} />{copy.topRated}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm opacity-75">{inspector.city}</span>
                      <span className="mt-2 block text-xs text-blue-700 dark:text-blue-300">{inspector.specialization}</span>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                        <Star aria-hidden="true" fill={inspector.rating > 0 ? 'currentColor' : 'none'} size={13} />
                        {inspector.rating.toFixed(1)}
                        <span className="font-normal opacity-70">({copy.reviews(inspector.reviewCount)})</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {filteredInspectors.length === 0 && (
                <li className="rounded-2xl border border-dashed border-blue-300/60 px-5 py-8 text-center sm:col-span-2 lg:col-span-1">
                  <p className="font-semibold">{copy.emptyTitle}</p>
                  <p className="mt-1 text-sm opacity-70">{copy.emptyDescription}</p>
                </li>
              )}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="mb-3 font-serif text-lg font-semibold">{copy.mapTitle}</h3>
            <GermanyMap
              inspectors={filteredInspectors}
              mapLabel={copy.mapTitle}
              onSelect={(inspectorId) => {
                setSelectedInspectorId(inspectorId);
                setNotice('');
                setDraftRating(0);
                setDraftComment('');
                setReviewError('');
              }}
              selectedId={selectedInspectorId}
            />
          </div>
        </div>
        {serviceRequestHistory.length > 0 && (
            <div aria-live="polite" className="mt-6 border-t border-blue-300/25 pt-5">
              <h3 className="mb-3 font-serif text-lg font-semibold">{copy.requestHistory}</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {serviceRequestHistory.map((order) => (
                  <li
                    className="blue-glass-card flex items-start justify-between gap-4 rounded-2xl p-4"
                    key={`${order.inspectorId}-${order.requestedAt}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{order.inspectorName}</span>
                      <span className="mt-1 block text-sm opacity-70">{order.city}</span>
                      <span className="mt-2 block text-xs opacity-70">
                        {copy.appointment}: {new Date(order.requestedAt).toLocaleString(
                          language === 'GE' ? 'ka-GE' : language === 'DE' ? 'de-DE' : 'en-US',
                        )}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        <Check aria-hidden="true" size={15} strokeWidth={3} />
                        {copy.sentLabel}
                      </span>
                      <button
                        className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-500/10 dark:text-red-300"
                        onClick={() => {
                          setCancelledRequests((current) => [...current, {
                            inspectorId: order.inspectorId,
                            requestedAt: order.requestedAt,
                          }]);
                          setLocalServiceRequests((current) => current.filter((item) => (
                            item.inspectorId !== order.inspectorId || item.requestedAt !== order.requestedAt
                          )));
                          onServiceRequestCancel?.(order);
                          setRequestedInspectorIds((current) => {
                            const stillHasOtherRequests = serviceRequestHistory.some((request) => (
                              request.inspectorId === order.inspectorId
                                && request.requestedAt !== order.requestedAt
                            ));
                            if (stillHasOtherRequests) return current;
                            const updated = new Set(current);
                            updated.delete(order.inspectorId);
                            return updated;
                          });
                          setNotice(copy.requestCancelled);
                        }}
                        type="button"
                      >
                        {copy.cancelRequest}
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      {selectedInspector && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 pt-16 backdrop-blur-sm sm:items-center sm:py-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedInspectorId(null);
          }}
        >
          <div
            aria-labelledby="inspector-profile-title"
            aria-modal="true"
            className="blue-glass-card relative max-h-[calc(100dvh-5rem)] w-full max-w-xl space-y-5 overflow-y-auto rounded-3xl p-5 pt-14 text-zinc-900 shadow-2xl dark:text-zinc-100 sm:max-h-[min(90dvh,52rem)] sm:p-8"
            role="dialog"
          >
            <button
              aria-label={copy.cancel}
              className="absolute right-4 top-4 rounded-full p-2 opacity-65 transition hover:bg-blue-500/10 hover:opacity-100"
              onClick={() => setSelectedInspectorId(null)}
              type="button"
            >
              <X aria-hidden="true" size={20} />
            </button>
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-blue-700 dark:text-blue-300">{copy.profile}</p>
              <h2 className="pr-10 font-serif text-2xl font-bold" id="inspector-profile-title">{selectedInspector.name}</h2>
              <p className="mt-1 text-sm opacity-75">{selectedInspector.city} · {selectedInspector.specialization}</p>
              <p className="mt-3 inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300">
                <Star aria-hidden="true" fill={selectedInspector.rating > 0 ? 'currentColor' : 'none'} size={16} />
                {selectedInspector.rating.toFixed(1)} ({copy.reviews(selectedInspector.reviewCount)})
              </p>
              {hasRequestedService && (
                <p className="mt-2 text-xs font-semibold text-blue-700 dark:text-blue-300">{copy.requested}</p>
              )}
              {hasCompletedService && (
                <p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{copy.completed}</p>
              )}
              {selectedInspector.topRated && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-100/70 px-2 py-1 text-xs font-semibold text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-200">
                  <Star aria-hidden="true" fill="currentColor" size={12} />{copy.topRated}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">{copy.reviews(selectedInspector.reviewCount)}</h3>
              {selectedInspector.reviews.length > 0 ? selectedInspector.reviews.map((review, index) => (
                <div className="rounded-xl border border-blue-300/25 bg-blue-500/5 p-3 text-sm" key={`${selectedInspector.id}-review-${index}`}>
                  <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    <Star aria-hidden="true" fill="currentColor" size={12} />{review.rating.toFixed(1)}
                  </p>
                  <p>{review.comment}</p>
                </div>
              )) : <p className="text-sm opacity-65">{copy.noReviews}</p>}
            </div>

            <div className="space-y-3 rounded-2xl border border-blue-300/30 bg-blue-500/5 p-4">
              <label className="block text-xs font-semibold" htmlFor="inspector-service-time">{copy.serviceDateTime}</label>
              <input
                className={`w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'border-zinc-700 bg-zinc-950/60 text-zinc-100' : 'border-blue-200 bg-white/70 text-zinc-900'}`}
                id="inspector-service-time"
                min={minimumServiceDateTime}
                onChange={(event) => {
                  setServiceDateTime(event.target.value);
                  setRequestError('');
                }}
                required
                type="datetime-local"
                value={serviceDateTime}
              />
              <label className="block text-xs font-semibold" htmlFor="inspector-message">{copy.messagePlaceholder}</label>
              <textarea
                className={`w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'border-zinc-700 bg-zinc-950/60 text-zinc-100' : 'border-blue-200 bg-white/70 text-zinc-900'}`}
                id="inspector-message"
                maxLength={1000}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setRequestError('');
                }}
                placeholder={copy.messagePlaceholder}
                rows={3}
                value={message}
              />
              {requestError && <p className="text-sm text-red-600 dark:text-red-300" role="alert">{requestError}</p>}
              <button
                aria-busy={isSendingRequest}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 px-5 py-3 font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSendingRequest || hasPreviouslyRequested}
                onClick={handleSendRequest}
                type="button"
              >
                {hasPreviouslyRequested ? copy.sentLabel : 'გაგზავნა'}
              </button>
            </div>

            <div className="space-y-3 border-t border-blue-300/25 pt-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">{copy.rateExpert}</h3>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${hasCompletedService ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-zinc-500/10 opacity-75'}`}>
                  {hasCompletedService ? copy.completed : copy.reviewLocked}
                </span>
              </div>
              <fieldset disabled={!hasCompletedService} className="space-y-3 disabled:opacity-50">
                <legend className="mb-2 text-xs font-medium">{copy.ratingLabel}</legend>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      aria-label={`${rating} / 5`}
                      aria-pressed={draftRating === rating}
                      className="rounded p-1 text-amber-500 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-blue-500"
                      key={rating}
                      onClick={() => {
                        setDraftRating(rating);
                        setReviewError('');
                      }}
                      type="button"
                    >
                      <Star aria-hidden="true" fill={draftRating >= rating ? 'currentColor' : 'none'} size={22} />
                    </button>
                  ))}
                </div>
                <label className="block text-xs font-semibold" htmlFor="inspector-review">{copy.reviewLabel}</label>
                <textarea
                  className={`w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'border-zinc-700 bg-zinc-950/60 text-zinc-100' : 'border-blue-200 bg-white/70 text-zinc-900'}`}
                  disabled={!hasCompletedService}
                  id="inspector-review"
                  maxLength={300}
                  onChange={(event) => {
                    setDraftComment(event.target.value);
                    setReviewError('');
                  }}
                  placeholder={copy.reviewPlaceholder}
                  rows={2}
                  value={draftComment}
                />
                {reviewError && <p className="text-xs text-red-600 dark:text-red-300" role="alert">{reviewError}</p>}
                <button
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!hasCompletedService || !draftRating || !draftComment.trim()}
                  onClick={() => submitReview(selectedInspector)}
                  type="button"
                >
                  {copy.submitReview}
                </button>
              </fieldset>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
