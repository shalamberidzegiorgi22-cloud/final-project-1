import { Award, CircleAlert, ShieldCheck, Globe } from 'lucide-react';
import { useTheme } from '../../context/useTheme';
import { useLanguage } from '../../context/useLanguage';
import { PruffoLogo } from '../../components/PruffoLogo';
import './about.css';

export default function About() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const copy = t.about;

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-clip p-4 transition-colors duration-300 sm:p-6 lg:p-8 ${isDark ? 'bg-[#0a0a0a] text-zinc-100' : 'bg-[#f8f9fa] text-zinc-900'}`}>
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/40 pb-5 sm:pb-6">
          <div className="flex items-center gap-3">
            <PruffoLogo className="h-8 w-auto shrink-0 object-contain" />
            <span className="font-bold tracking-widest text-base bg-gradient-to-r from-[#d4af37] to-amber-200 bg-clip-text text-transparent">{copy.brand}</span>
          </div>
          
        </div>

      
        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-bold leading-tight sm:text-4xl">{copy.title}</h1>
          <p className="opacity-80 leading-relaxed text-sm">
            {copy.description}
          </p>
        </div>

      
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="blue-glass-card space-y-4 rounded-2xl p-6 sm:p-8 about-card lg:row-span-2">
            <CircleAlert aria-hidden="true" className="text-red-500" size={32} />
            <h3 className="font-bold text-lg">{copy.safetyTitle}</h3>
            <p className="text-sm leading-relaxed opacity-80">{copy.safetyDescription}</p>
          </div>

          <div className="blue-glass-card space-y-3 rounded-2xl p-5 sm:p-6 about-card">
            <ShieldCheck className="text-[#d4af37]" size={28} />
            <h3 className="font-bold text-lg">{copy.expertsTitle}</h3>
            <p className="text-xs opacity-75">{copy.expertsDescription}</p>
          </div>
          
          <div className="blue-glass-card space-y-3 rounded-2xl p-5 sm:p-6 about-card">
            <Award className="text-[#d4af37]" size={28} />
            <h3 className="font-bold text-lg">{copy.inspectionTitle}</h3>
            <p className="text-xs opacity-75">{copy.inspectionDescription}</p>
          </div>
          
          <div className="blue-glass-card space-y-3 rounded-2xl p-5 sm:p-6 about-card">
            <Globe className="text-[#d4af37]" size={28} />
            <h3 className="font-bold text-lg">{copy.coverageTitle}</h3>
            <p className="text-xs opacity-75">{copy.coverageDescription}</p>
          </div>
        </div>

      </div>
    </div>
  );
}