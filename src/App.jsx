import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contract from './pages/Contract/Contract';
import Contact from './pages/Contact';
import MessengerChat from './components/MessengerChat';
import { useLanguage } from './context/useLanguage';
import LanguageToggle from './components/LanguageToggle';
import ThemeToggle from './components/ThemeToggle';
import { DEMO_INSPECTORS } from './data/demoInspectors';
import { readLocalStorage, writeLocalStorage } from './utils/localStorage';

const INSPECTORS_STORAGE_KEY = 'pirro-inspectors';
const SERVICE_ORDERS_STORAGE_KEY = 'pirro-service-orders';
const INSPECTOR_MESSAGES_STORAGE_KEY = 'pirro-inspector-messages';
const REGISTERED_INSPECTOR_ID_STORAGE_KEY = 'pirro-registered-inspector-id';
const ACTIVE_PAGE_STORAGE_KEY = 'pirro-active-page';
const CONTRACT_TAB_STORAGE_KEY = 'pirro-contract-tab';

const isArray = (value) => Array.isArray(value);
const isOptionalString = (value) => value === null || typeof value === 'string';
const isValidPage = (value) => navigationItems.some(({ page }) => page === value);
const isValidContractTab = (value) => value === 'buyer' || value === 'inspector';

const navigationItems = [
  { page: 'home', label: 'home' },
  { page: 'contract', label: 'contract' },
  { page: 'about', label: 'about' },
  { page: 'contact', label: 'contact' },
];

export default function App({
  completedOrders = [],
  onBuyerServiceRequest,
  onInspectorServiceRequest,
  onInspectorServiceCancel,
  onInspectorMessage,
  onInspectorReview,
}) {
  const [currentPage, setCurrentPage] = useState(() => readLocalStorage(
    ACTIVE_PAGE_STORAGE_KEY,
    'home',
    isValidPage,
  ));
  const [contractTab, setContractTab] = useState(() => readLocalStorage(
    CONTRACT_TAB_STORAGE_KEY,
    'buyer',
    isValidContractTab,
  ));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inspectors, setInspectors] = useState(() => readLocalStorage(
    INSPECTORS_STORAGE_KEY,
    DEMO_INSPECTORS,
    isArray,
  ));
  const [serviceOrders, setServiceOrders] = useState(() => readLocalStorage(
    SERVICE_ORDERS_STORAGE_KEY,
    [],
    isArray,
  ));
  const [inspectorMessages, setInspectorMessages] = useState(() => readLocalStorage(
    INSPECTOR_MESSAGES_STORAGE_KEY,
    [],
    isArray,
  ));
  const [registeredInspectorId, setRegisteredInspectorId] = useState(() => readLocalStorage(
    REGISTERED_INSPECTOR_ID_STORAGE_KEY,
    null,
    isOptionalString,
  ));
  const [showRegisteredInspectorOnHome, setShowRegisteredInspectorOnHome] = useState(false);
  const { t } = useLanguage();

  useEffect(() => writeLocalStorage(INSPECTORS_STORAGE_KEY, inspectors), [inspectors]);
  useEffect(() => writeLocalStorage(SERVICE_ORDERS_STORAGE_KEY, serviceOrders), [serviceOrders]);
  useEffect(() => writeLocalStorage(INSPECTOR_MESSAGES_STORAGE_KEY, inspectorMessages), [inspectorMessages]);
  useEffect(() => writeLocalStorage(REGISTERED_INSPECTOR_ID_STORAGE_KEY, registeredInspectorId), [registeredInspectorId]);
  useEffect(() => writeLocalStorage(ACTIVE_PAGE_STORAGE_KEY, currentPage), [currentPage]);
  useEffect(() => writeLocalStorage(CONTRACT_TAB_STORAGE_KEY, contractTab), [contractTab]);

  function navigateTo(page) {
    setCurrentPage(page);
    setShowRegisteredInspectorOnHome(false);
    setIsMobileMenuOpen(false);
  }

  function viewRegisteredInspector() {
    setShowRegisteredInspectorOnHome(true);
    setCurrentPage('home');
    setIsMobileMenuOpen(false);
  }

  function openInspectorRegistration() {
    setContractTab('inspector');
    navigateTo('contract');
  }

  function registerInspector(inspector) {
    setInspectors((currentInspectors) => (
      currentInspectors.some((currentInspector) => currentInspector.id === inspector.id)
        ? currentInspectors
        : [...currentInspectors, inspector]
    ));
    setRegisteredInspectorId(inspector.id);
  }

  function cancelInspectorRegistration(inspectorId) {
    setInspectors((currentInspectors) => currentInspectors.filter((inspector) => inspector.id !== inspectorId));
    setRegisteredInspectorId((currentId) => (currentId === inspectorId ? null : currentId));
    setShowRegisteredInspectorOnHome(false);
  }

  function requestInspectorService(order) {
    setServiceOrders((currentOrders) => [...currentOrders, order]);
    return onInspectorServiceRequest?.(order);
  }

  function cancelInspectorService(order) {
    setServiceOrders((currentOrders) => currentOrders.filter(
      (currentOrder) => currentOrder.inspectorId !== order.inspectorId
        || currentOrder.requestedAt !== order.requestedAt,
    ));
    return onInspectorServiceCancel?.(order);
  }

  function sendInspectorMessage(message) {
    setInspectorMessages((currentMessages) => [...currentMessages, message]);
    return onInspectorMessage?.(message);
  }

  return (
    <div className={`app-shell w-full max-w-full overflow-x-clip ${currentPage === 'home' || currentPage === 'contact' ? 'app-shell--full-bleed' : ''}`}>
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-white/40 bg-white/80 p-1.5 shadow-xl shadow-slate-900/15 backdrop-blur-2xl dark:border-white/20 dark:bg-zinc-950/80">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <nav className="site-nav">
        <div className="hidden items-center gap-5 md:flex">
          {navigationItems.map(({ page, label }) => (
            <button className="site-nav-link" key={page} onClick={() => navigateTo(page)}>
              {t.nav[label]}
            </button>
          ))}
        </div>
        <button
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          className="site-nav-menu-toggle inline-flex items-center justify-center rounded-full p-2 md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          type="button"
        >
          {isMobileMenuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
        {isMobileMenuOpen && (
          <div className="site-nav-mobile-menu md:hidden">
            {navigationItems.map(({ page, label }) => (
              <button className="site-nav-link" key={page} onClick={() => navigateTo(page)}>
                {t.nav[label]}
              </button>
            ))}
          </div>
        )}
      </nav>
      <main className="w-full max-w-full">
        {currentPage === 'home' && (
          <Home
            completedOrders={completedOrders}
            inspectors={inspectors}
            initialSelectedInspectorId={showRegisteredInspectorOnHome ? registeredInspectorId : null}
            serviceOrders={serviceOrders}
            onBuyerServiceRequest={onBuyerServiceRequest}
            onInspectorClick={openInspectorRegistration}
            onInspectorMessage={sendInspectorMessage}
            onInspectorReview={onInspectorReview}
            onInspectorServiceRequest={requestInspectorService}
            onInspectorServiceCancel={cancelInspectorService}
          />
        )}
        {currentPage === 'contract' && (
          <Contract
            activeTab={contractTab}
            onBuyerServiceRequest={onBuyerServiceRequest}
            onInspectorRegister={registerInspector}
            onCancelInspectorRegistration={cancelInspectorRegistration}
            registeredInspector={inspectors.find((inspector) => inspector.id === registeredInspectorId) ?? null}
            onViewRegisteredInspector={viewRegisteredInspector}
            onTabChange={setContractTab}
          />
        )}
        {currentPage === 'about' && <About />}
        {currentPage === 'contact' && <Contact />}
      </main>
      <MessengerChat />
    </div>
  );
}