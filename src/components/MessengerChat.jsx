import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import { useTheme } from '../context/useTheme';
import { readLocalStorage, writeLocalStorage } from '../utils/localStorage';

const ASSISTANT_MESSAGES_STORAGE_KEY = 'pirro-assistant-chat-messages';

function getReplyKey(message) {
  const text = message.toLowerCase();

  if (
    text.includes('city') || text.includes('where') || text.includes('service')
    || text.includes('location') || text.includes('stadt') || text.includes('wo')
    || text.includes('standort') || text.includes('ქალაქ') || text.includes('ადგილ')
    || text.includes('სად')
  ) return 'cities';
  if (
    text.includes('price') || text.includes('cost') || text.includes('€')
    || text.includes('euro') || text.includes('preis') || text.includes('kosten')
    || text.includes('ტარიფ') || text.includes('ფას') || text.includes('ღირებულ')
  ) return 'price';
  if (
    text.includes('selection') || text.includes('choose') || text.includes('buy')
    || text.includes('advice') || text.includes('kaufberatung') || text.includes('auswahl')
    || text.includes('kaufen') || text.includes('კონსულტ') || text.includes('შერჩევ')
    || text.includes('შესაბამისობ')
  ) return 'selection';
  if (
    text.includes('mechanic') || text.includes('hire') || text.includes('inspection')
    || text.includes('audit') || text.includes('check') || text.includes('mechaniker')
    || text.includes('prüf') || text.includes('pruef') || text.includes('kontroll')
    || text.includes('ექსპერტ') || text.includes('მექანიკოს') || text.includes('შეკეთ')
    || text.includes('შემოწმ') || text.includes('დიაგნოსტ') || text.includes('მომსახურ')
  ) return 'mechanic';

  return 'fallback';
}

function createMessage(text, role, replyKey) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    text,
    replyKey,
    createdAt: new Date().toISOString(),
  };
}

function formatTime(value, language) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const locale = language === 'GE' ? 'ka-GE' : language === 'DE' ? 'de-DE' : 'en-US';
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
}

export default function MessengerChat() {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const copy = t.chat;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => readLocalStorage(
    ASSISTANT_MESSAGES_STORAGE_KEY,
    [],
    Array.isArray,
  ));
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    writeLocalStorage(ASSISTANT_MESSAGES_STORAGE_KEY, messages);
  }, [messages]);

  useEffect(() => {
    if (isOpen) messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [isOpen, messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  function sendAssistantMessage(message) {
    const text = message.trim();
    if (!text || isSendingRef.current) return;

    isSendingRef.current = true;
    setMessages((current) => [
      ...current,
      createMessage(text, 'user'),
      createMessage('', 'assistant', getReplyKey(text)),
    ]);
    setInput('');
    isSendingRef.current = false;
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendAssistantMessage(input);
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const panelColors = isDark
    ? 'border-white/10 bg-[#0b1220] text-slate-100'
    : 'border-slate-200 bg-white text-slate-900';

  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label={copy.ariaLabel}
          aria-modal="false"
          className={`flex h-[min(640px,calc(100dvh-6rem))] w-[min(420px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border shadow-[0_24px_80px_rgba(2,8,23,0.28)] ${panelColors}`}
          role="dialog"
        >
          <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-5 py-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-950 ring-1 ring-amber-200/70">
                <Sparkles aria-hidden="true" size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold">{copy.title}</h2>
                <p className="mt-0.5 truncate text-xs text-amber-200">{copy.localGuide}</p>
              </div>
            </div>
            <button
              aria-label={copy.close}
              className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X aria-hidden="true" size={20} />
            </button>
          </header>

          <div
            aria-live="polite"
            className={`min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 ${isDark ? 'bg-[#0d1626]' : 'bg-[#f7f8fa]'}`}
          >
            <div className="flex justify-start">
              <div className={`max-w-[88%] rounded-2xl rounded-bl-md border px-4 py-3 text-sm leading-relaxed shadow-sm ${isDark ? 'border-white/10 bg-slate-800 text-slate-100' : 'border-slate-200 bg-white text-slate-700'}`}>
                {copy.greeting}
              </div>
            </div>
            {messages.map((message) => {
              const isOutgoing = message.role === 'user' || message.role === 'customer';
              const content = isOutgoing
                ? message.text
                : message.replyKey
                  ? copy.replies[message.replyKey] ?? copy.replies.fallback
                  : message.text ?? copy.replies.fallback;
              return (
                <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`} key={message.id}>
                  {!isOutgoing && (
                    <span className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                      <Sparkles aria-hidden="true" size={13} />
                    </span>
                  )}
                  <div className={`max-w-[88%] ${isOutgoing ? 'text-right' : 'text-left'}`}>
                    <p className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-left text-sm leading-relaxed shadow-sm ${isOutgoing
                      ? 'rounded-br-md bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950'
                      : isDark ? 'rounded-bl-md border border-white/10 bg-slate-800 text-slate-100' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'}`}>
                      {content}
                    </p>
                    <time className={`mt-1 block px-1 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`} dateTime={message.createdAt}>
                      {formatTime(message.createdAt, language)}
                    </time>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>

          <div className={`border-t px-4 pb-4 pt-3 ${isDark ? 'border-white/10 bg-slate-950/40' : 'border-slate-200 bg-white'}`}>
            <p className={`mb-3 text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {copy.localAssistantNote}
            </p>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {copy.topics.map((topic) => (
                <button
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${isDark ? 'border-white/10 bg-white/5 text-amber-200 hover:bg-white/10' : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'}`}
                  key={topic}
                  onClick={() => sendAssistantMessage(topic)}
                  type="button"
                >
                  {topic}
                </button>
              ))}
            </div>
            <form className="flex items-end gap-2" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="pruffo-chat-input">{copy.inputLabel}</label>
              <textarea
                autoComplete="off"
                className={`max-h-28 min-h-11 min-w-0 flex-1 resize-y rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 ${isDark ? 'border-white/10 bg-white/5 placeholder:text-slate-500' : 'border-slate-200 bg-slate-50 placeholder:text-slate-400'}`}
                id="pruffo-chat-input"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={copy.placeholder}
                ref={inputRef}
                rows={1}
                value={input}
              />
              <button
                aria-label={copy.send}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-amber-300 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
                disabled={!input.trim()}
                type="submit"
              >
                <Send aria-hidden="true" size={18} />
              </button>
            </form>
            <p className={`mt-2 px-1 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{copy.enterHint}</p>
          </div>
        </section>
      )}

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? copy.close : copy.open}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-200/50 bg-gradient-to-br from-amber-300 via-amber-400 to-[#d4af37] text-slate-950 shadow-[0_10px_32px_rgba(180,130,30,0.36)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(180,130,30,0.44)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-300/50 sm:h-16 sm:w-16"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? <X aria-hidden="true" size={25} /> : <MessageCircle aria-hidden="true" fill="currentColor" size={26} />}
      </button>
    </div>
  );
}
