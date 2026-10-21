import { useState } from 'react';
import { Shield, Bike, ArrowRight, X } from 'lucide-react';
import ebikeImg from '../../assets/E-Bike.webp';
import { useTheme } from '../../context/useTheme';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/useAuth';
import { PruffoLogo } from '../../components/PruffoLogo';
import InspectorMapSearch from '../../components/InspectorMapSearch';
import './home.css';

const minimumServiceDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 16);

export default function Home({
  onInspectorClick,
  completedOrders,
  inspectors,
  initialSelectedInspectorId,
  serviceOrders,
  onBuyerServiceRequest,
  onInspectorServiceRequest,
  onInspectorServiceCancel,
  onInspectorMessage,
  onInspectorReview,
}) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { requireAuth } = useAuth();
  const copy = t.home;
  const [activeModal, setActiveModal] = useState(null);

  // Buyer booking states
  const [selectedCity, setSelectedCity] = useState('Berlin');
  const [sellerUrl, setSellerUrl] = useState('');
  const [serviceDateTime, setServiceDateTime] = useState('');

  return (
    <div className="home-luxury-shell min-h-screen w-full max-w-full overflow-x-hidden rounded-none p-0 font-sans text-white">
      
      {/* Navigation */}
      <nav className="home-glass-nav max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-2 border-white/50 bg-white/10 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_0_60px_rgba(255,255,255,0.2),0_18px_48px_rgba(0,12,38,0.48),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_0_25px_rgba(255,255,255,0.2)] dark:border-white/30 dark:bg-black/30">
        <div className="flex items-center gap-3">
          <PruffoLogo className="h-8 w-auto shrink-0 object-contain" />
          <div>
            <span className="font-bold tracking-widest text-lg bg-gradient-to-r from-[#d4af37] via-amber-200 to-yellow-500 bg-clip-text text-transparent">PIRRO</span>
            <span className="text-[10px] block text-blue-100/70 tracking-wider -mt-1">GERMANY</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-12 pt-8 sm:gap-10 sm:px-6 sm:pb-16 sm:pt-10 lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-12">
        
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-semibold">
            <Shield size={14} />
            <span>{copy.badge}</span>
          </div>

          <h1 className="text-3xl font-serif font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl">
            {copy.tagline}
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-blue-50/85 sm:text-base md:text-lg">
            {copy.desc}
          </p>

          <div className="relative flex flex-col gap-4 pt-4 sm:flex-row">
            <button 
              onClick={() => setActiveModal((currentModal) => currentModal === 'buyer' ? null : 'buyer')}
              className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d4af37] to-amber-500 px-6 py-4 font-bold text-black shadow-xl transition-all hover:opacity-95 sm:mx-0 sm:w-auto sm:max-w-none sm:px-8"
            >
              <span>{copy.bookBtn}</span>
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={onInspectorClick}
              type="button"
              className="home-inspector-button mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-2 border-white/50 bg-white/10 px-6 py-4 font-semibold shadow-[0_0_42px_rgba(255,255,255,0.24),0_12px_32px_rgba(0,12,38,0.4),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_0_20px_rgba(255,255,255,0.22)] backdrop-blur-2xl backdrop-saturate-200 transition-all dark:border-white/30 dark:bg-black/30 sm:mx-0 sm:w-auto sm:max-w-none sm:px-8"
            >
              <Bike size={18} />
              <span>{copy.inspectorBtn}</span>
            </button>

            {activeModal === 'buyer' && (
              <div className="absolute bottom-full left-0 z-50 mb-4 max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-3rem))] overflow-y-auto">
                <div className={`blue-glass-card p-8 rounded-3xl w-full ${isDark ? 'text-zinc-100' : 'text-zinc-900'} relative space-y-6`}>
                  <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 opacity-60 hover:opacity-100">
                    <X size={20} />
                  </button>

                  <h3 className="text-2xl font-bold font-serif">{copy.modalTitle}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]">{copy.location}</label>
                      <input
                        className="blue-glass-card w-full !rounded-xl border border-amber-500/50 p-3 text-sm outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                        onChange={(event) => setSelectedCity(event.target.value)}
                        placeholder={copy.locationPlaceholder}
                        style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                        type="text"
                        value={selectedCity}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]">{copy.listingUrl}</label>
                      <input 
                        type="url" 
                        placeholder="https://kleinanzeigen.de/..." 
                        value={sellerUrl}
                        onChange={(e) => setSellerUrl(e.target.value)}
                        className="w-full !rounded-xl border border-amber-500/50 p-3 text-sm outline-none transition placeholder:text-[#facc15] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                        style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase text-[#facc15]" htmlFor="home-service-date-time">{copy.serviceDateTime}</label>
                      <input
                        className="w-full !rounded-xl border border-amber-500/50 p-3 text-sm accent-amber-400 outline-none transition [color-scheme:dark] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                        id="home-service-date-time"
                        min={minimumServiceDateTime}
                        onChange={(e) => setServiceDateTime(e.target.value)}
                        required
                        style={{ borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#facc15' }}
                        type="datetime-local"
                        value={serviceDateTime}
                      />
                    </div>

                    <button 
                      onClick={() => {
                        if (!serviceDateTime || new Date(serviceDateTime).getTime() <= Date.now()) return;
                        requireAuth(() => {
                          onBuyerServiceRequest?.({
                            city: selectedCity,
                            description: sellerUrl,
                            requestedAt: serviceDateTime,
                            status: 'Requested',
                          });
                          alert(copy.requestSubmitted);
                          setActiveModal(null);
                        });
                      }}
                      disabled={!serviceDateTime}
                      className="mt-4 w-full rounded-xl bg-[#d4af37] py-4 font-bold text-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {copy.confirmRequest}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-blue-100/20 pt-6 sm:gap-6 sm:pt-8">
            <div>
              <div className="font-serif text-xl font-bold text-[#d4af37] sm:text-2xl">24 hrs</div>
              <div className="mt-1 text-[10px] uppercase text-blue-100/70 sm:text-xs">{copy.turnaround}</div>
            </div>
            <div>
              <div className="font-serif text-xl font-bold text-[#d4af37] sm:text-2xl">100%</div>
              <div className="mt-1 text-[10px] uppercase text-blue-100/70 sm:text-xs">{copy.inspection}</div>
            </div>
            <div>
              <div className="font-serif text-xl font-bold text-[#d4af37] sm:text-2xl">98.8%</div>
              <div className="mt-1 text-[10px] uppercase text-blue-100/70 sm:text-xs">{copy.trustScore}</div>
            </div>
          </div>
        </div>

        {/* E-Bike Image */}
        <div className="min-w-0 lg:col-span-5 relative flex justify-center items-center">
          <div className="home-sapphire-glow absolute inset-0 rounded-full"></div>
          <div className="home-silver-frame blue-glass-card w-full max-w-sm rounded-3xl border-2 border-white/50 bg-white/10 p-3 shadow-[0_0_60px_rgba(255,255,255,0.3),0_28px_80px_rgba(0,7,24,0.58),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_0_25px_rgba(255,255,255,0.24)] backdrop-blur-2xl backdrop-saturate-200 md:max-w-md lg:max-w-lg dark:border-white/30 dark:bg-black/30">
            <img 
              src={ebikeImg} 
              alt={copy.imageAlt}
              className="block h-auto max-h-[520px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>

      </main>

      <InspectorMapSearch
        inspectors={inspectors}
        initialSelectedInspectorId={initialSelectedInspectorId}
        completedOrders={completedOrders}
        serviceOrders={serviceOrders}
        onMessageSend={onInspectorMessage}
        onReviewSubmit={onInspectorReview}
        onServiceRequest={onInspectorServiceRequest}
        onServiceRequestCancel={onInspectorServiceCancel}
      />

    </div>
  );
}