import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Crown,
  Flame,
  Gift,
  Lock,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  TicketPercent,
  TrendingUp,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";

// Assets visuais do Coach Luca e alunas
import coachDuo from "@/assets/coach-duo-new.png";
import coachPortrait from "@/assets/pic2page.webp";
import desafioCard from "@/assets/desafio-card.jpg";
import avatarMaria from "@/assets/avatar-maria.jpg";
import avatarCarla from "@/assets/avatar-carla.jpg";
import avatarPatricia from "@/assets/avatar-patricia.jpg";
import avatarSofia from "@/assets/avatar-sofia.jpg";

// Tracking e links
import {
  BASE_BACKREDIRECT_URL,
  BASE_CHECKOUT_BASIC_URL,
  BASE_CHECKOUT_VIP_URL,
  getDecoratedCheckoutUrl,
  trackBackredirectView,
  trackFaqToggle,
  trackPlanCheckoutClick,
  trackPlanSelection,
  trackVslCtaClick,
  trackVslMilestone,
  trackVslPageView,
  trackVslPitchReached,
  trackVslPlay,
  trackVslUnmute,
} from "../pixel";

export const Route = createFileRoute("/vsl")({
  validateSearch: (search: Record<string, unknown>) => ({
    pitch:
      search.pitch === "true" ||
      search.pitch === "1" ||
      search.pitch === true ||
      undefined,
    debug:
      search.debug === "true" ||
      search.debug === "1" ||
      search.debug === true ||
      undefined,
    plan: typeof search.plan === "string" ? search.plan : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Desafío Glúteos Brasileños 28 Días | Presentación Oficial" },
      {
        name: "description",
        content:
          "Descubre el método biomecánico brasileño del Coach Luca para tonificar, levantar y redondear tus glúteos en 15 min al día sin pesas ni cirugías.",
      },
      {
        property: "og:title",
        content: "Desafío Glúteos Brasileños 28 Días - Presentación Oficial",
      },
      {
        property: "og:description",
        content:
          "Método en video de 15 minutos al día para activar y moldear la silueta femenina desde casa.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: VslSalesPage,
});

export default function VslSalesPage() {
  const [hasUnlockedPitch, setHasUnlockedPitch] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<"vip" | "basic">("vip");
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const offerSectionRef = useRef<HTMLDivElement>(null);
  const pitchAnnouncedRef = useRef(false);

  // Efeito sonoro sutil ao clicar em CTAs ou desbloquear
  const playClickSound = () => {
    try {
      const audio = new Audio("/button-click.mp3");
      audio.volume = 0.4;
      void audio.play();
    } catch {
      // Audio playback failsafe
    }
  };

  useEffect(() => {
    trackVslPageView();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const handleScroll = () => {
      if (hasUnlockedPitch && offerSectionRef.current) {
        const rect = offerSectionRef.current.getBoundingClientRect();
        // Exibe barra fixa quando passa da VSL e continua na oferta
        setShowFloatingCta(window.scrollY > 600 && rect.bottom > 150);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasUnlockedPitch]);

  const handlePitchReached = () => {
    if (!hasUnlockedPitch) {
      setHasUnlockedPitch(true);
      playClickSound();
      if (!pitchAnnouncedRef.current) {
        pitchAnnouncedRef.current = true;
        trackVslPitchReached();
      }
    }
  };

  // Backredirect: se a pessoa tentar sair (botão Voltar do navegador), redireciona para a oferta especial de 5,99 Euros
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.history.pushState({ page: "vsl_active" }, "", window.location.href);
    } catch {
      // Ignora erro em ambientes restritos
    }

    const handlePopState = () => {
      trackBackredirectView();
      const backredirectUrl = getDecoratedCheckoutUrl(BASE_BACKREDIRECT_URL);
      window.location.href = backredirectUrl;
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleSelectPlan = (plan: "vip" | "basic") => {
    setSelectedPlan(plan);
    playClickSound();
    trackPlanSelection(plan, plan === "vip" ? 19.99 : 9.99);
  };

  const handleCheckout = (plan: "vip" | "basic", location: string) => {
    playClickSound();
    const price = plan === "vip" ? 19.99 : 9.99;
    trackPlanCheckoutClick(plan, price, location);
    trackVslCtaClick(`${location}_${plan}`);

    const targetUrl =
      plan === "vip" ? BASE_CHECKOUT_VIP_URL : BASE_CHECKOUT_BASIC_URL;
    const checkoutUrl = getDecoratedCheckoutUrl(targetUrl);
    window.location.href = checkoutUrl;
  };

  return (
    <main className="quiz-canvas min-h-screen overflow-x-hidden text-foreground selection:bg-[color:var(--coral)] selection:text-white">
      {/* Background ambient orbs */}
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-two" aria-hidden="true" />

      {/* Top Urgent Alert Bar */}
      <div className="sticky top-0 z-40 border-b border-[color:var(--wine)]/20 bg-gradient-to-r from-[color:var(--wine)] via-[#6b1426] to-[color:var(--wine)] py-2.5 px-3 text-center text-white shadow-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-bold">
          <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--coral)] px-2.5 py-0.5 text-[11px] font-black uppercase text-white shadow-sm animate-pulse">
            <AlertTriangle size={13} strokeWidth={3} /> ATENCIÓN ESPECIAL
          </span>
          <span>Esta presentación y los cupones con 90% de descuento vencen hoy</span>
          <span className="rounded bg-[color:var(--lime)] px-1.5 py-0.2 text-[color:var(--wine)] font-black">
            CUPOS LIMITADOS
          </span>
          <span className="hidden sm:inline">• Mira el video completo</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[980px] px-4 pb-28 pt-6 sm:px-6 sm:pt-8 space-y-10">
        {/* Header Branding & Live Stats */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
          <div className="flex items-center gap-2.5 text-left">
            <span className="brand-mark">
              <TrendingUp size={20} strokeWidth={3} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-base font-black uppercase tracking-[-0.03em] text-[color:var(--wine)]">
                BRAZILIANBOOTY
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--coral)]">
                MÉTODO COACH LUCA • 28 DÍAS
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--wine)] px-3 py-1.5 text-[10px] font-black uppercase text-white shadow-sm">
              <span className="vsl-pulse-dot" />
              <LiveViewerCounter />
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[color:var(--lime)] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--wine)] shadow-sm">
              <TicketPercent size={13} strokeWidth={3} /> 90% OFF APLICADO
            </span>
          </div>
        </header>

        {/* HERO: Powerful Headline */}
        <section className="text-center space-y-3">
          <span className="eyebrow-pill inline-flex items-center gap-1.5">
            <Flame size={14} className="text-[color:var(--coral)]" />
            PRESENTACIÓN OFICIAL EXCLUSIVA • MÉTODO BIOMECÁNICO
          </span>

          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-[color:var(--wine)] max-w-4xl mx-auto">
            Cómo Activar, Levantar y Redondear Tus Glúteos en{" "}
            <span className="text-[color:var(--coral)] underline decoration-[color:var(--lime)] decoration-4 underline-offset-4">
              15 Minutos al Día
            </span>{" "}
            Desde Casa
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-base font-medium text-[color:var(--ink-muted)] leading-relaxed">
            Sin sentadillas lesivas con barras pesadas, sin necesidad de ir al gimnasio y sin
            ensanchar tus piernas. Mira este video breve antes de que se agoten los accesos.
          </p>
        </section>

        {/* VSL PLAYER SECTION */}
        <section className="space-y-4">
          <SalesVslPlayer
            src="/vsl-video.mp4"
            onPitchReached={handlePitchReached}
            onPlayClick={playClickSound}
          />

          {/* Direct Action Block to jump to Plans */}
          <div className="mx-auto max-w-xl text-center space-y-3 pt-2">
            <a
              href="#planes-oferta"
              onClick={() => {
                playClickSound();
                offerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="cta-button inline-flex items-center justify-center gap-2.5 py-4 px-8 text-sm sm:text-base font-black tracking-wider text-white shadow-xl hover:scale-[1.02] bg-gradient-to-r from-[color:var(--coral)] via-[#e11d48] to-[color:var(--wine)] w-full sm:w-auto"
            >
              <span className="button-sheen" />
              <span>VER LOS 2 PLANES Y REGALOS DISPONIBLES</span>
              <ArrowRight size={20} />
            </a>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-[color:var(--ink-muted)]">
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck size={14} /> Garantía de 7 Días
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles size={13} className="text-amber-500" /> 4 Bonos de Regalo
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock size={13} className="text-emerald-700" /> Pago 100% Cifrado
              </span>
            </div>
          </div>
        </section>

        {/* FULL SALES PAGE - ALWAYS UNLOCKED */}
        <div ref={offerSectionRef} id="planes-oferta" className="animate-fade-in space-y-14 pt-4">
            {/* 1. SECCIÓN PRINCIPAL: LOS 2 PLANOS DE OFERTA */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <span className="eyebrow-pill">ELIGE TU NIVEL DE ACCESO</span>
                <h2 className="font-display text-2xl sm:text-4xl font-black text-[color:var(--wine)]">
                  Selecciona El Plan Perfecto Para Tu Transformación
                </h2>
                <p className="mx-auto max-w-2xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
                  Ambos planes cuentan con nuestra{" "}
                  <strong className="text-[color:var(--wine)]">
                    Garantía Incondicional de 7 Días.
                  </strong>{" "}
                  Si no ves resultados, no pagas un solo centavo.
                </p>

                {/* Switcher Tab rápido */}
                <div className="mx-auto inline-flex rounded-full border-2 border-[color:var(--wine)] bg-white p-1 shadow-sm mt-3">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan("vip")}
                    className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-black transition-all ${
                      selectedPlan === "vip"
                        ? "bg-[color:var(--coral)] text-white shadow-md scale-[1.02]"
                        : "text-[color:var(--wine)] hover:bg-black/5"
                    }`}
                  >
                    <Crown size={15} />
                    <span>PLAN VIP VITALICIO (RECOMENDADO)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan("basic")}
                    className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-black transition-all ${
                      selectedPlan === "basic"
                        ? "bg-[color:var(--wine)] text-white shadow-md scale-[1.02]"
                        : "text-[color:var(--wine)] hover:bg-black/5"
                    }`}
                  >
                    <span>PLAN BÁSICO (1 AÑO)</span>
                  </button>
                </div>
              </div>

              {/* CARDS DOS 2 PLANOS LADO A LADO */}
              <div className="grid gap-6 lg:grid-cols-12 items-stretch pt-2">
                {/* PLANO 1: BÁSICO ($9.90) */}
                <div
                  className={`lg:col-span-5 rounded-3xl border-3 transition-all flex flex-col justify-between p-6 sm:p-7 bg-white relative ${
                    selectedPlan === "basic"
                      ? "border-[color:var(--wine)] shadow-[8px_8px_0_var(--wine)] ring-2 ring-[color:var(--wine)]"
                      : "border-black/15 shadow-sm hover:border-[color:var(--wine)]/50"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-black/10 pb-3">
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[color:var(--ink-muted)]">
                          OPCIÓN ESENCIAL
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-black text-[color:var(--wine)]">
                          Plan Básico 28 Días
                        </h3>
                      </div>
                      <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-extrabold text-[color:var(--wine)]">
                        Acceso 1 Año
                      </span>
                    </div>

                    <p className="text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Ideal para quienes desean exclusivamente las rutinas diarias en video para
                      activar los glúteos en casa.
                    </p>

                    {/* Preço Básico */}
                    <div className="rounded-2xl border border-[color:var(--wine)]/20 bg-[color:var(--cream)]/60 p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-bold text-[color:var(--ink-muted)] line-through">
                          De 47,00 €
                        </span>
                        <span className="rounded-full bg-[color:var(--wine)] px-2 py-0.5 text-[10px] font-black text-white">
                          80% OFF
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline justify-center gap-1">
                        <span className="text-sm font-bold text-[color:var(--wine)]">Solo</span>
                        <span className="font-display text-4xl font-black text-[color:var(--wine)]">
                          9,99 €
                        </span>
                      </div>
                      <span className="text-[10px] text-[color:var(--ink-muted)] font-medium">
                        Pago único • Sin mensualidades
                      </span>
                    </div>

                    {/* Lista de Recursos Básico */}
                    <div className="space-y-2.5 pt-2 text-xs font-semibold">
                      <div className="flex items-start gap-2 text-[color:var(--wine)]">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Desafío Completo 28 Días en Video HD (15 min/día)</span>
                      </div>
                      <div className="flex items-start gap-2 text-[color:var(--wine)]">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Guía Biomecánica Básica de Postura y Aislamiento</span>
                      </div>
                      <div className="flex items-start gap-2 text-[color:var(--wine)]">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Acceso durante 12 meses a la plataforma</span>
                      </div>
                      <div className="flex items-start gap-2 text-[color:var(--wine)]">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Garantía Incondicional de Devolución en 7 Días</span>
                      </div>

                      {/* Itens que NÃO estão inclusos no básico */}
                      <div className="border-t border-black/10 pt-2 space-y-2 opacity-60">
                        <div className="flex items-start gap-2 text-[color:var(--ink-muted)]">
                          <XCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                          <span>Sin Guía Nutricional Anti-Flacidez</span>
                        </div>
                        <div className="flex items-start gap-2 text-[color:var(--ink-muted)]">
                          <XCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                          <span>Sin Protocolo Anti-Celulitis Express</span>
                        </div>
                        <div className="flex items-start gap-2 text-[color:var(--ink-muted)]">
                          <XCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                          <span>Sin Acceso Vitalicio (caduca al año)</span>
                        </div>
                        <div className="flex items-start gap-2 text-[color:var(--ink-muted)]">
                          <XCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                          <span>Sin Comunidad VIP ni Soporte Prioritario</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => handleCheckout("basic", "sales_page_basic_card")}
                      className="cta-button w-full py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-md hover:scale-[1.01] bg-[color:var(--wine)]"
                    >
                      <span className="button-sheen" />
                      <span className="flex items-center justify-center gap-1.5">
                        ELEGIR PLAN BÁSICO (9,99 €)
                        <ArrowRight size={16} />
                      </span>
                    </button>
                    <p className="mt-2 text-center text-[10px] text-[color:var(--ink-muted)] font-medium">
                      Acceso instantáneo • 100% Cifrado
                    </p>
                  </div>
                </div>

                {/* PLANO 2: VIP VITALÍCIO ($19.90) - O MAIOR DESTAQUE */}
                <div
                  className={`lg:col-span-7 rounded-3xl border-4 transition-all flex flex-col justify-between p-6 sm:p-8 bg-white relative overflow-hidden ${
                    selectedPlan === "vip"
                      ? "border-[color:var(--coral)] shadow-[10px_10px_0_var(--wine)] ring-4 ring-[color:var(--coral)]/30"
                      : "border-[color:var(--wine)] shadow-[6px_6px_0_var(--wine)]"
                  }`}
                >
                  {/* Badge de Melhor Escolha no Topo */}
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[color:var(--coral)] to-[#e11d48] text-white text-[11px] font-black uppercase tracking-wider px-5 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1.5">
                    <Crown size={14} fill="currentColor" />
                    <span>MÁS ELEGIDO • 94% DE ALUMNAS</span>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b border-black/10 pb-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--coral-soft)] px-2.5 py-0.5 text-[10px] font-black uppercase text-[color:var(--coral-dark)]">
                        ⭐ PAQUETE COMPLETO DEFINITIVO
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-black text-[color:var(--wine)] mt-1">
                        Plan VIP Vitalicio + 4 Bonos
                      </h3>
                      <p className="text-xs text-[color:var(--ink-muted)] leading-relaxed mt-1">
                        Todo lo que necesitas para levantar, esculpir y mantener tus glúteos firmes
                        para siempre, con acceso sin límite de tiempo y soporte.
                      </p>
                    </div>

                    {/* Product Mockup visual preview */}
                    <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--coral)]/30 bg-[color:var(--cream)]/60 p-3">
                      <img
                        src={desafioCard}
                        alt="Desafío Glúteos Brasileños VIP"
                        className="h-16 w-16 rounded-xl object-cover border-2 border-[color:var(--coral)] shadow-sm shrink-0"
                      />
                      <div className="text-left">
                        <span className="inline-block rounded bg-[color:var(--wine)] px-2 py-0.5 text-[9px] font-black uppercase text-[color:var(--lime)]">
                          ACCESO TOTAL VITALICIO
                        </span>
                        <p className="text-xs font-black text-[color:var(--wine)] mt-0.5">
                          Desafío 28 Días + 4 Bonos + Protocolo Cintura Fina
                        </p>
                      </div>
                    </div>

                    {/* Preço VIP */}
                    <div className="rounded-2xl border-2 border-[color:var(--coral)] bg-gradient-to-br from-[color:var(--coral-soft)]/40 via-white to-[color:var(--cream)] p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-bold text-[color:var(--ink-muted)] line-through">
                          Valor Real: 147,00 €
                        </span>
                        <span className="rounded-full bg-[color:var(--coral)] px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                          90% DE DESCUENTO
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline justify-center gap-1">
                        <span className="text-sm font-black text-[color:var(--wine)]">
                          Pago único de solo
                        </span>
                        <span className="font-display text-4xl sm:text-5xl font-black text-[color:var(--coral)]">
                          19,99 €
                        </span>
                      </div>
                      <p className="text-[11px] font-extrabold text-emerald-800 mt-0.5">
                        ⚡ Acceso Vitalicio De Por Vida (Pagas una sola vez, tuyo para siempre)
                      </p>
                    </div>

                    {/* Lista Completa de Recursos do VIP */}
                    <div className="space-y-2.5 pt-1 text-xs sm:text-sm font-bold text-[color:var(--wine)]">
                      <div className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <span>
                          <strong>ACCESO VITALICIO ILIMITADO</strong> al Desafío 28 Días en Video HD
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <span>
                          <strong>Módulo Avanzado de Escultura:</strong> Redondez lateral y elevación profunda
                        </span>
                      </div>

                      <div className="flex items-start gap-2 bg-[color:var(--coral-soft)]/40 p-2 rounded-xl border border-[color:var(--coral)]/30">
                        <Gift size={16} className="text-[color:var(--coral)] shrink-0 mt-0.5" />
                        <span>
                          <strong>Bono #1:</strong> Guía Nutricional Anti-Flacidez y Menú Glúteos Firmes{" "}
                          <span className="text-[color:var(--coral-dark)]">(Valor $37 • GRATIS)</span>
                        </span>
                      </div>

                      <div className="flex items-start gap-2 bg-[color:var(--coral-soft)]/40 p-2 rounded-xl border border-[color:var(--coral)]/30">
                        <Gift size={16} className="text-[color:var(--coral)] shrink-0 mt-0.5" />
                        <span>
                          <strong>Bono #2:</strong> Protocolo Express Anti-Celulitis y Drenaje{" "}
                          <span className="text-[color:var(--coral-dark)]">(Valor $29 • GRATIS)</span>
                        </span>
                      </div>

                      <div className="flex items-start gap-2 bg-[color:var(--coral-soft)]/40 p-2 rounded-xl border border-[color:var(--coral)]/30">
                        <Gift size={16} className="text-[color:var(--coral)] shrink-0 mt-0.5" />
                        <span>
                          <strong>Bono #3:</strong> Planificador Imprimible y Tracker Diario{" "}
                          <span className="text-[color:var(--coral-dark)]">(Valor $19 • GRATIS)</span>
                        </span>
                      </div>

                      <div className="flex items-start gap-2 bg-[color:var(--coral-soft)]/40 p-2 rounded-xl border border-[color:var(--coral)]/30">
                        <Gift size={16} className="text-[color:var(--coral)] shrink-0 mt-0.5" />
                        <span>
                          <strong>Bono #4:</strong> Comunidad VIP de Alumnas y Soporte Prioritario{" "}
                          <span className="text-[color:var(--coral-dark)]">(Valor $47 • GRATIS)</span>
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-emerald-800">
                        <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Bono VIP Exclusivo:</strong> Protocolo SOS Cintura Fina y Abdomen Plano
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => handleCheckout("vip", "sales_page_vip_card")}
                      className="cta-button w-full py-4 text-sm sm:text-base font-black tracking-wider text-white shadow-xl hover:scale-[1.02] bg-gradient-to-r from-[color:var(--coral)] via-[#e11d48] to-[color:var(--wine)]"
                    >
                      <span className="button-sheen" />
                      <span className="flex items-center justify-center gap-2">
                        ¡SÍ! QUIERO EL PLAN VIP COMPLETO (19,99 €)
                        <ArrowRight size={22} />
                      </span>
                    </button>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-center text-[11px] font-semibold text-[color:var(--ink-muted)]">
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-600" /> Garantía de 7 Días
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Lock size={13} className="text-emerald-600" /> Checkout Seguro Cifrado
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CreditCard size={13} className="text-[color:var(--wine)]" /> Pago Único
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. TABELA COMPARATIVA LADO A LADO: BÁSICO VS VIP */}
            <section className="rounded-3xl border-3 border-[color:var(--wine)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_var(--wine)]">
              <div className="text-center mb-6">
                <span className="eyebrow-pill mb-2">COMPARATIVA TRANSPARENTE</span>
                <h3 className="font-display text-xl sm:text-3xl font-black text-[color:var(--wine)]">
                  ¿Por Qué el 94% de las Alumnas Elige el Plan VIP?
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-[color:var(--wine)]">
                      <th className="pb-3 font-bold text-[color:var(--ink-muted)]">Beneficio</th>
                      <th className="pb-3 font-bold text-[color:var(--wine)] text-center">
                        Plan Básico (9,99 €)
                      </th>
                      <th className="pb-3 font-black text-[color:var(--coral)] text-center bg-[color:var(--coral-soft)]/20 rounded-t-xl">
                        ⭐ Plan VIP Vitalicio (19,99 €)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    <tr>
                      <td className="py-3 font-bold text-[color:var(--wine)]">
                        Desafío 28 Días en Video HD
                      </td>
                      <td className="py-3 text-center text-emerald-700">
                        <Check size={16} className="mx-auto" strokeWidth={3} />
                      </td>
                      <td className="py-3 text-center text-emerald-700 font-extrabold bg-[color:var(--coral-soft)]/20">
                        <Check size={16} className="mx-auto" strokeWidth={3} />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[color:var(--wine)]">
                        Tiempo de Acceso al Programa
                      </td>
                      <td className="py-3 text-center text-[color:var(--ink-muted)]">
                        1 Año (12 Meses)
                      </td>
                      <td className="py-3 text-center text-[color:var(--coral)] font-extrabold bg-[color:var(--coral-soft)]/20">
                        DE POR VIDA (Vitalicio)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[color:var(--wine)]">
                        Bono 1: Guía Nutricional Anti-Flacidez ($37)
                      </td>
                      <td className="py-3 text-center text-rose-500">
                        <XCircle size={16} className="mx-auto" />
                      </td>
                      <td className="py-3 text-center text-emerald-700 font-extrabold bg-[color:var(--coral-soft)]/20">
                        <Check size={16} className="mx-auto" strokeWidth={3} />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[color:var(--wine)]">
                        Bono 2: Protocolo Anti-Celulitis Express ($29)
                      </td>
                      <td className="py-3 text-center text-rose-500">
                        <XCircle size={16} className="mx-auto" />
                      </td>
                      <td className="py-3 text-center text-emerald-700 font-extrabold bg-[color:var(--coral-soft)]/20">
                        <Check size={16} className="mx-auto" strokeWidth={3} />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[color:var(--wine)]">
                        Bono 3: Tracker Imprimible de Hábitos ($19)
                      </td>
                      <td className="py-3 text-center text-rose-500">
                        <XCircle size={16} className="mx-auto" />
                      </td>
                      <td className="py-3 text-center text-emerald-700 font-extrabold bg-[color:var(--coral-soft)]/20">
                        <Check size={16} className="mx-auto" strokeWidth={3} />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[color:var(--wine)]">
                        Bono 4: Comunidad VIP de Alumnas & Soporte ($47)
                      </td>
                      <td className="py-3 text-center text-rose-500">
                        <XCircle size={16} className="mx-auto" />
                      </td>
                      <td className="py-3 text-center text-emerald-700 font-extrabold bg-[color:var(--coral-soft)]/20">
                        <Check size={16} className="mx-auto" strokeWidth={3} />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[color:var(--wine)]">
                        Protocolo Especial Cintura Fina ($39)
                      </td>
                      <td className="py-3 text-center text-rose-500">
                        <XCircle size={16} className="mx-auto" />
                      </td>
                      <td className="py-3 text-center text-emerald-700 font-extrabold bg-[color:var(--coral-soft)]/20">
                        <Check size={16} className="mx-auto" strokeWidth={3} />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-[color:var(--wine)]">
                        Garantía Incondicional de 7 Días
                      </td>
                      <td className="py-3 text-center text-emerald-700">
                        <Check size={16} className="mx-auto" strokeWidth={3} />
                      </td>
                      <td className="py-3 text-center text-emerald-700 font-extrabold bg-[color:var(--coral-soft)]/20 rounded-b-xl">
                        <Check size={16} className="mx-auto" strokeWidth={3} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3. MOCKUP DE PRODUTO E OS 4 BÔNUS EXCLUSIVOS */}
            <section className="rounded-3xl border-3 border-[color:var(--wine)] bg-[color:var(--cream-deep)]/40 p-6 sm:p-8">
              <div className="mb-8 text-center">
                <span className="rounded-full bg-[color:var(--coral)] px-3.5 py-1 text-xs font-black uppercase text-white shadow-sm">
                  🎁 REGALOS DE VALOR INCLUIDOS EN TU PLAN VIP
                </span>
                <h3 className="font-display mt-2 text-2xl sm:text-3xl font-black text-[color:var(--wine)]">
                  Llévate Estos 4 Bonos de Regalo (Valorados en $132 USD) por $0
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
                  Herramientas creadas específicamente para acelerar la firmeza de tus glúteos y
                  eliminar la flacidez.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border-2 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--coral)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-black mb-2">
                      <span className="text-[color:var(--coral)]">BONO #1</span>
                      <span className="text-[color:var(--ink-muted)] line-through">$37.00 USD</span>
                    </div>
                    <h4 className="font-display font-black text-[color:var(--wine)] text-base">
                      Guía Nutricional Anti-Flacidez y Menú Glúteos Firmes
                    </h4>
                    <p className="mt-2 text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Qué comer exactamente antes y después de cada rutina para nutrir el músculo,
                      estimular la formación de colágeno natural y evitar la retención de líquidos.
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--lime)] px-2.5 py-1 text-xs font-black text-[color:var(--wine)] w-fit">
                    <Check size={14} strokeWidth={3} />
                    <span>GRATIS CON EL PLAN VIP</span>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--coral)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-black mb-2">
                      <span className="text-[color:var(--coral)]">BONO #2</span>
                      <span className="text-[color:var(--ink-muted)] line-through">$29.00 USD</span>
                    </div>
                    <h4 className="font-display font-black text-[color:var(--wine)] text-base">
                      Protocolo Anti-Celulitis Express y Drenaje
                    </h4>
                    <p className="mt-2 text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Secuencias de movimientos de bajo impacto diseñadas para reactivar el sistema
                      linfático, reduciendo los hoyuelos y mejorando la textura de la piel en piernas y
                      glúteos.
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--lime)] px-2.5 py-1 text-xs font-black text-[color:var(--wine)] w-fit">
                    <Check size={14} strokeWidth={3} />
                    <span>GRATIS CON EL PLAN VIP</span>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--coral)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-black mb-2">
                      <span className="text-[color:var(--coral)]">BONO #3</span>
                      <span className="text-[color:var(--ink-muted)] line-through">$19.00 USD</span>
                    </div>
                    <h4 className="font-display font-black text-[color:var(--wine)] text-base">
                      Planificador Imprimible y Tracker Diario de 28 Días
                    </h4>
                    <p className="mt-2 text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Una plantilla visual clara para imprimir y colocar en tu refrigerador o espejo.
                      Registra tus medidas, fotos de progreso y marca cada día completado.
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--lime)] px-2.5 py-1 text-xs font-black text-[color:var(--wine)] w-fit">
                    <Check size={14} strokeWidth={3} />
                    <span>GRATIS CON EL PLAN VIP</span>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--coral)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-black mb-2">
                      <span className="text-[color:var(--coral)]">BONO #4</span>
                      <span className="text-[color:var(--ink-muted)] line-through">$47.00 USD</span>
                    </div>
                    <h4 className="font-display font-black text-[color:var(--wine)] text-base">
                      Comunidad VIP de Alumnas & Soporte Directo
                    </h4>
                    <p className="mt-2 text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Nunca estarás sola. Accede a nuestro grupo privado de alumnas para hacer
                      preguntas sobre la técnica de los ejercicios, compartir recetas y mantenerte
                      motivada al 100%.
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--lime)] px-2.5 py-1 text-xs font-black text-[color:var(--wine)] w-fit">
                    <Check size={14} strokeWidth={3} />
                    <span>GRATIS CON EL PLAN VIP</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. AS 4 SEMANAS DA TRANSFORMAÇÃO */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <span className="eyebrow-pill">CRONOGRAMA DE RESULTADOS</span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-[color:var(--wine)]">
                  Cómo Transformarás Tu Silueta Día a Día
                </h2>
                <p className="mx-auto max-w-xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
                  Sin improvisaciones: cada mañana sabes exactamente qué video ver y qué ejercicios
                  hacer durante solo 15 minutos.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--wine)] flex flex-col justify-between">
                  <div>
                    <span className="rounded-full bg-[color:var(--coral)] px-2.5 py-0.5 text-[10px] font-black text-white">
                      SEMANA 1
                    </span>
                    <h3 className="font-display text-base font-black text-[color:var(--wine)] mt-2">
                      Despertar Neuromuscular
                    </h3>
                    <p className="mt-2 text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Reactivamos las fibras "dormidas" del glúteo por tantas horas sentadas, sin
                      sobrecargar rodillas.
                    </p>
                  </div>
                  <div className="mt-4 border-t border-black/10 pt-2 text-[11px] font-bold text-emerald-700">
                    ✓ Sensación inmediata de activación
                  </div>
                </div>

                <div className="rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--wine)] flex flex-col justify-between">
                  <div>
                    <span className="rounded-full bg-[color:var(--coral)] px-2.5 py-0.5 text-[10px] font-black text-white">
                      SEMANA 2
                    </span>
                    <h3 className="font-display text-base font-black text-[color:var(--wine)] mt-2">
                      Redondez Lateral (Glúteo Medio)
                    </h3>
                    <p className="mt-2 text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Estimulamos el glúteo medio para rellenar los hoyuelos laterales y crear esa forma
                      curva y femenina.
                    </p>
                  </div>
                  <div className="mt-4 border-t border-black/10 pt-2 text-[11px] font-bold text-emerald-700">
                    ✓ Silueta lateral más redondeada
                  </div>
                </div>

                <div className="rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--wine)] flex flex-col justify-between">
                  <div>
                    <span className="rounded-full bg-[color:var(--coral)] px-2.5 py-0.5 text-[10px] font-black text-white">
                      SEMANA 3
                    </span>
                    <h3 className="font-display text-base font-black text-[color:var(--wine)] mt-2">
                      Elevación y Firmeza Profunda
                    </h3>
                    <p className="mt-2 text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Aumentamos la tensión metabólica para elevar la curva inferior y reducir la
                      flacidez visible.
                    </p>
                  </div>
                  <div className="mt-4 border-t border-black/10 pt-2 text-[11px] font-bold text-emerald-700">
                    ✓ Firmeza al tacto y ropa ajustada
                  </div>
                </div>

                <div className="rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--wine)] flex flex-col justify-between">
                  <div>
                    <span className="rounded-full bg-[color:var(--lime)] px-2.5 py-0.5 text-[10px] font-black text-[color:var(--wine)]">
                      SEMANA 4
                    </span>
                    <h3 className="font-display text-base font-black text-[color:var(--wine)] mt-2">
                      Consolidación Efecto Push-Up
                    </h3>
                    <p className="mt-2 text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Fijamos el tono muscular duradero para que mantengas tus glúteos altos y firmes
                      en tu día a día.
                    </p>
                  </div>
                  <div className="mt-4 border-t border-black/10 pt-2 text-[11px] font-bold text-emerald-700">
                    ✓ Resultado consolidado y visible
                  </div>
                </div>
              </div>
            </section>

            {/* 5. PROVA SOCIAL COM FOTOS REAIS DAS ALUNAS */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <span className="eyebrow-pill">TESTIMONIOS REALES</span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-[color:var(--wine)]">
                  Más de 2.800 Mujeres Ya Han Cambiado Su Silueta
                </h2>
                <p className="mx-auto max-w-xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
                  Historias de alumnas de distintas edades y países que decidieron dedicar solo 15 min
                  al día a su cuerpo.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Aluna 1 */}
                <div className="rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--wine)] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={15} fill="currentColor" />
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck size={14} className="text-emerald-600" /> Alumna Verificada
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[color:var(--wine)] italic leading-relaxed">
                      "Pasaba 8 horas sentada trabajando frente a la computadora y sentía mis glúteos
                      completamente caídos y planos. Había intentado sentadillas con barra en el gym y
                      terminaba con dolor de rodillas. Con este método del Coach Luca sentí la quema
                      exacta en el glúteo desde el día 3. Mis jeans favoritos me quedan espectaculares."
                    </p>
                  </div>
                  <div className="mt-4 border-t border-black/10 pt-3 flex items-center gap-3">
                    <img
                      src={avatarMaria}
                      alt="María S."
                      className="h-11 w-11 rounded-full object-cover border-2 border-[color:var(--wine)] shadow-sm"
                    />
                    <div>
                      <strong className="block text-xs font-black text-[color:var(--wine)]">
                        María Sofía S., 34 años
                      </strong>
                      <span className="text-[11px] text-[color:var(--ink-muted)]">
                        Santiago, Chile • -4 cm de cadera caída y glúteos más firmes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aluna 2 */}
                <div className="rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--coral)] ring-2 ring-[color:var(--coral)] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={15} fill="currentColor" />
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck size={14} className="text-emerald-600" /> Alumna Verificada
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[color:var(--wine)] italic leading-relaxed">
                      "Tengo 43 años y dos hijos. Creí que a mi edad ya era imposible levantar los
                      glúteos sin cirugías caras. El plan VIP con la guía de alimentación anti-flacidez
                      fue la mejor inversión. En 28 días la firmeza cambió por completo y la piel se
                      alisó muchísimo."
                    </p>
                  </div>
                  <div className="mt-4 border-t border-black/10 pt-3 flex items-center gap-3">
                    <img
                      src={avatarCarla}
                      alt="Carla M."
                      className="h-11 w-11 rounded-full object-cover border-2 border-[color:var(--wine)] shadow-sm"
                    />
                    <div>
                      <strong className="block text-xs font-black text-[color:var(--wine)]">
                        Carla Morales, 43 años
                      </strong>
                      <span className="text-[11px] text-[color:var(--ink-muted)]">
                        Bogotá, Colombia • Alumna Plan VIP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aluna 3 */}
                <div className="rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--wine)] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={15} fill="currentColor" />
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck size={14} className="text-emerald-600" /> Alumna Verificada
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[color:var(--wine)] italic leading-relaxed">
                      "Lo que más amo es que solo son 15 minutos. No tengo tiempo para perder 2 horas
                      en el gimnasio. Lo hago por las mañanas antes de despertar a mi familia y la
                      energía con la que empiezo el día es otra. ¡Vale mil veces la pena!"
                    </p>
                  </div>
                  <div className="mt-4 border-t border-black/10 pt-3 flex items-center gap-3">
                    <img
                      src={avatarPatricia}
                      alt="Patricia V."
                      className="h-11 w-11 rounded-full object-cover border-2 border-[color:var(--wine)] shadow-sm"
                    />
                    <div>
                      <strong className="block text-xs font-black text-[color:var(--wine)]">
                        Patricia Valdés, 28 años
                      </strong>
                      <span className="text-[11px] text-[color:var(--ink-muted)]">
                        Ciudad de México • Resultados en 28 días
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aluna 4 */}
                <div className="rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--wine)] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={15} fill="currentColor" />
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck size={14} className="text-emerald-600" /> Alumna Verificada
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[color:var(--wine)] italic leading-relaxed">
                      "Tenía miedo de que se me ensancharan las piernas porque siempre que hacía pierna
                      me crecían los muslos y nada los glúteos. La técnica de aislamiento del Coach Luca
                      es pura ciencia. Mis piernas siguen estilizadas y mis glúteos están más redondos."
                    </p>
                  </div>
                  <div className="mt-4 border-t border-black/10 pt-3 flex items-center gap-3">
                    <img
                      src={avatarSofia}
                      alt="Sofía L."
                      className="h-11 w-11 rounded-full object-cover border-2 border-[color:var(--wine)] shadow-sm"
                    />
                    <div>
                      <strong className="block text-xs font-black text-[color:var(--wine)]">
                        Lucía Gómez, 51 años
                      </strong>
                      <span className="text-[11px] text-[color:var(--ink-muted)]">
                        Lima, Perú • Cero dolor de columna o rodilla
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. AUTORIDADE DO COACH LUCA E BIOMECÂNICA */}
            <section className="space-y-8">
              {/* Card dos 3 Pilares Científicos */}
              <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_var(--wine)]">
                <div className="text-center mb-6">
                  <span className="eyebrow-pill mb-2">MÉTODO PROBADO</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-[color:var(--wine)]">
                    Los 3 Pilares de la Biomecánica Brasileña
                  </h2>
                  <p className="mx-auto mt-1 max-w-xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
                    Por qué 15 minutos enfocados generan mejores resultados que 1 hora en máquinas
                    de gimnasio:
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-2xl border-2 border-[color:var(--wine)]/20 bg-[color:var(--cream)]/50 p-5 space-y-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--wine)] font-display text-base font-black text-[color:var(--shock-yellow)] shadow-[3px_3px_0_var(--coral)]">
                      01
                    </span>
                    <h3 className="font-display text-base font-black text-[color:var(--wine)]">
                      Aislamiento Posterior Puro
                    </h3>
                    <p className="text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Ajustamos el ángulo de la cadera para que el glúteo mayor y medio absorban el
                      100% de la contracción, sin hipertrofiar cuádriceps ni engrosar tus piernas.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-[color:var(--wine)]/20 bg-[color:var(--cream)]/50 p-5 space-y-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--wine)] font-display text-base font-black text-[color:var(--shock-yellow)] shadow-[3px_3px_0_var(--coral)]">
                      02
                    </span>
                    <h3 className="font-display text-base font-black text-[color:var(--wine)]">
                      Tensión Metabólica en 15 Min
                    </h3>
                    <p className="text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      El estímulo continuo sin descansos prolongados activa la síntesis de colágeno y
                      firmeza muscular profunda, quemando grasa localizada sin horas de cardio aburrido.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-[color:var(--wine)]/20 bg-[color:var(--cream)]/50 p-5 space-y-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--wine)] font-display text-base font-black text-[color:var(--shock-yellow)] shadow-[3px_3px_0_var(--coral)]">
                      03
                    </span>
                    <h3 className="font-display text-base font-black text-[color:var(--wine)]">
                      Cero Sobrecarga Articular
                    </h3>
                    <p className="text-xs text-[color:var(--ink-muted)] leading-relaxed">
                      Movimientos biomecánicamente seguros realizados en tapete o colchoneta que
                      protegen tu columna lumbar y eliminan la compresión sobre los meniscos de tus
                      rodillas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio do Coach Luca com Fotos Reais */}
              <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-[color:var(--wine)] p-6 sm:p-8 text-white shadow-[6px_6px_0_var(--coral)]">
                <div className="grid gap-6 md:grid-cols-12 items-center">
                  <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-center gap-3">
                    <div className="relative overflow-hidden rounded-2xl border-3 border-white/20 shadow-xl max-w-[240px]">
                      <img
                        src={coachDuo}
                        alt="Coach Luca y equipo"
                        className="h-auto w-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-black/75 p-1.5 text-center text-[10px] font-black uppercase text-white backdrop-blur-sm">
                        Coach Luca & Especialistas
                      </div>
                    </div>
                    <div className="hidden sm:block relative overflow-hidden rounded-xl border-2 border-white/20 shadow-md max-w-[160px]">
                      <img
                        src={coachPortrait}
                        alt="Coach Luca"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <span className="rounded-full bg-[color:var(--lime)] px-3 py-1 text-xs font-black uppercase text-[color:var(--wine)]">
                      CONOCE A TU ENTRENADOR
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                      Coach Luca — Especialista en Biomecánica y Estética Femenina
                    </h2>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                      "Tras años entrenando a mujeres que se sentían frustradas por hacer sentadillas
                      pesadas sin ver resultados o que sufrían dolores de espalda, decidí estudiar a
                      fondo el secreto del estímulo brasileño: una combinación precisa de ángulos de
                      palanca y activación muscular que esculpe los glúteos en tiempo récord."
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-[color:var(--shock-yellow)]">
                      <span>✓ +10 Años de Trayectoria</span>
                      <span>✓ +2.800 Alumnas Transformadas</span>
                      <span>✓ Método 100% Casa</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. SEÇÃO: PARA QUEM É VS PARA QUEM NÃO É */}
            <section className="grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border-3 border-emerald-600 bg-emerald-50/80 p-6 shadow-[4px_4px_0_theme(colors.emerald.800)]">
                <div className="flex items-center gap-2 mb-3 text-emerald-950">
                  <CheckCircle2 size={24} className="text-emerald-600" />
                  <h3 className="font-display text-lg font-black">Este Programa ES Para Ti Si:</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-950 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-700">✓</span>
                    <span>Tienes poco tiempo y necesitas rutinas directas de 15 minutos en tu casa.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-700">✓</span>
                    <span>Pasas mucho tiempo sentada y notas tus glúteos planos, dormidos o con flacidez.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-700">✓</span>
                    <span>Quieres redondear y elevar sin que tus piernas se pongan gruesas ni pesadas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-700">✓</span>
                    <span>Prefieres un método amigable que proteja tus rodillas y zona lumbar.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border-3 border-rose-500 bg-rose-50/80 p-6 shadow-[4px_4px_0_theme(colors.rose.800)]">
                <div className="flex items-center gap-2 mb-3 text-rose-950">
                  <XCircle size={24} className="text-rose-500" />
                  <h3 className="font-display text-lg font-black">Este Programa NO Es Para Ti Si:</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-rose-950 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">✗</span>
                    <span>Buscas pastillas milagrosas o cremas mágicas sin mover un solo músculo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">✗</span>
                    <span>No estás dispuesta a comprometerte con 15 minutos al día para ti misma.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">✗</span>
                    <span>Prefieres arriesgar tu salud en cirugías estéticas invasivas y costosas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">✗</span>
                    <span>No deseas seguir las instrucciones de técnica explicadas paso a paso.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 8. GARANTIA INCONDICIONAL DE 7 DIAS */}
            <section className="rounded-3xl border-4 border-emerald-600 bg-emerald-50 p-6 sm:p-9 text-center shadow-[6px_6px_0_theme(colors.emerald.800)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md mb-3">
                <ShieldCheck size={36} />
              </div>

              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                GARANTÍA TOTAL • COMPRA 100% BLINDADA
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                Pruébalo Durante 7 Días. Si No Te Encanta, Te Devolvemos el 100% de Tu Dinero.
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-emerald-900 leading-relaxed">
                Ingresa hoy, mira los videos y realiza las primeras rutinas. Si por cualquier motivo
                sientes que el método no es para ti, solo envíanos un correo y te reembolsaremos cada
                centavo invertido de inmediato. Sin preguntas, sin trabas y sin resentimientos. El
                riesgo corre 100% por nuestra cuenta.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleCheckout("vip", "sales_page_guarantee_vip_btn")}
                  className="cta-button py-3.5 px-6 text-xs sm:text-sm font-black uppercase text-white shadow-md hover:scale-[1.02] bg-gradient-to-r from-[color:var(--coral)] to-[color:var(--wine)]"
                >
                  <span className="button-sheen" />
                  <span>PROBAR EL PLAN VIP SIN RIESGO (19,99 €)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCheckout("basic", "sales_page_guarantee_basic_btn")}
                  className="rounded-2xl border-2 border-emerald-800 bg-white px-5 py-3 text-xs sm:text-sm font-black text-emerald-900 hover:bg-emerald-100 transition-colors"
                >
                  Probar el Plan Básico (9,99 €)
                </button>
              </div>
            </section>

            {/* 9. FAQ INTERATIVO */}
            <section className="space-y-6">
              <div className="text-center space-y-1">
                <span className="eyebrow-pill">PREGUNTAS FRECUENTES</span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-[color:var(--wine)]">
                  Resolvemos Todas Tus Dudas
                </h2>
              </div>

              <SalesPageFaq openFaq={openFaq} setOpenFaq={setOpenFaq} onPlaySound={playClickSound} />
            </section>

            {/* 10. BLOCO FINAL DE DECISÃO COM CRONÔMETRO */}
            <section className="rounded-3xl border-3 border-[color:var(--wine)] bg-white/90 p-6 sm:p-10 text-center shadow-[8px_8px_0_var(--wine)] backdrop-blur-md space-y-5">
              <div className="mx-auto flex justify-center">
                <OfferCountdownTimer />
              </div>

              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[color:var(--wine)] max-w-2xl mx-auto">
                ¿Lista Para Estrenar Tu Nueva Silueta en los Próximos 28 Días?
              </h2>

              <p className="mx-auto max-w-xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
                No dejes que tu cupón de descuento expire. Elige tu plan ahora mismo y recibe tu acceso
                inmediato en tu correo electrónico.
              </p>

              <div className="mx-auto flex max-w-md flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleCheckout("vip", "sales_page_bottom_vip_cta")}
                  className="cta-button py-4 text-sm sm:text-base font-black tracking-wider text-white shadow-xl hover:scale-[1.02] bg-gradient-to-r from-[color:var(--coral)] via-[#e11d48] to-[color:var(--wine)]"
                >
                  <span className="button-sheen" />
                  <span className="flex items-center justify-center gap-2">
                    ¡QUIERO EL PLAN VIP COMPLETO POR 19,99 €!
                    <ArrowRight size={20} />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCheckout("basic", "sales_page_bottom_basic_cta")}
                  className="rounded-2xl border-2 border-[color:var(--wine)] bg-white py-3 text-xs sm:text-sm font-bold text-[color:var(--wine)] hover:bg-black/5 transition-colors"
                >
                  Prefiero el Plan Básico de 9,99 €
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[color:var(--ink-muted)] pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={16} className="text-emerald-600" /> Garantía de 7 días
                </span>
                <span className="flex items-center gap-1">
                  <Lock size={15} className="text-emerald-600" /> Pago 100% Cifrado
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles size={15} className="text-[color:var(--coral)]" /> Acceso De Por Vida
                </span>
              </div>
            </section>
          </div>
      </div>

      {/* FLOATING STICKY BOTTOM BAR NO SCROLL */}
      {showFloatingCta && (
        <div className="vsl-floating-bottom-cta animate-slide-up">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <div className="hidden sm:block text-left text-white">
              <p className="text-[11px] font-bold text-[color:var(--lime)]">
                🔥 90% DE DESCUENTO ACTIVO
              </p>
              <p className="text-xs sm:text-sm font-black">
                Desafío Glúteos 28 Días —{" "}
                <span className="text-[color:var(--shock-yellow)]">
                  {selectedPlan === "vip" ? "19,99 € (VIP Vitalicio)" : "9,99 € (Básico)"}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
              <button
                type="button"
                onClick={() =>
                  handleCheckout(
                    selectedPlan,
                    `sales_page_floating_sticky_${selectedPlan}`
                  )
                }
                className="cta-button min-h-[3rem] py-2 px-5 text-xs sm:text-sm font-black uppercase text-white shadow-md flex-1 sm:flex-initial"
              >
                <span className="button-sheen" />
                <span className="flex items-center justify-center gap-1.5">
                  ¡ACCEDER POR {selectedPlan === "vip" ? "19,99 €" : "9,99 €"}!
                  <ArrowRight size={16} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/**
 * Player de VSL de Alta Retenção com Barra de Retenção Psicológica
 */
function SalesVslPlayer({
  src,
  onPitchReached,
  onPlayClick,
}: Readonly<{
  src: string;
  onPitchReached?: () => void;
  onPlayClick?: () => void;
}>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const trackedMilestones = useRef<Set<number>>(new Set());
  const pitchTrackedRef = useRef(false);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration || 1;
      setCurrentTime(current);

      const percent = Math.round((current / total) * 100);

      [25, 50, 75, 90, 100].forEach((milestone) => {
        if (percent >= milestone && !trackedMilestones.current.has(milestone)) {
          trackedMilestones.current.add(milestone);
          trackVslMilestone(milestone);
        }
      });

      // Dispara o pitch aos 30 segundos ou 25% do vídeo
      if (current >= 30 || percent >= 25) {
        if (!pitchTrackedRef.current) {
          pitchTrackedRef.current = true;
          trackVslPitchReached();
        }
        onPitchReached?.();
      }
    };

    let animFrameId: number;
    const updateProgressFrame = () => {
      if (video && !video.paused) {
        setCurrentTime(video.currentTime);
        animFrameId = requestAnimationFrame(updateProgressFrame);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (!hasStartedPlaying) {
        setHasStartedPlaying(true);
        trackVslPlay();
      }
      cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(updateProgressFrame);
    };

    const handlePause = () => {
      setIsPlaying(false);
      cancelAnimationFrame(animFrameId);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      cancelAnimationFrame(animFrameId);
      setCurrentTime(video.duration || 1);
      trackVslMilestone(100);
      onPitchReached?.();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    video.muted = true;
    setIsMuted(true);
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasStartedPlaying(true);
          cancelAnimationFrame(animFrameId);
          animFrameId = requestAnimationFrame(updateProgressFrame);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [hasStartedPlaying, onPitchReached]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    onPlayClick?.();
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleUnmute = (e: ReactMouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    onPlayClick?.();
    trackVslUnmute();
    video.muted = false;
    video.volume = 1;
    setIsMuted(false);

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e: ReactMouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    onPlayClick?.();
    const nextMuted = !video.muted;
    if (!nextMuted) {
      trackVslUnmute();
    }
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2800);
  };

  /**
   * Curva psicológica de retenção: avança 3x mais rápido no começo e estabiliza em 1x
   */
  const getDynamicProgress = (current: number, total: number) => {
    if (!total || total <= 0 || current <= 0) return 2.5;
    const ratio = Math.min(1, Math.max(0, current / total));
    if (ratio >= 0.998) return 100;

    const threshold = 0.8;
    let percent: number;

    if (ratio < threshold) {
      const u = ratio / threshold;
      const a = 160;
      const b = -320;
      const c = 240;
      const g = a * Math.pow(u, 3) + b * Math.pow(u, 2) + c * u;
      percent = Math.max(2.5, g);
    } else {
      percent = ratio * 100;
    }

    return Math.min(100, Math.max(2.5, Number.parseFloat(percent.toFixed(2))));
  };

  const progressPercent = getDynamicProgress(currentTime, duration);

  let dynamicStatus = "🔊 Sube el volumen y mira con atención";
  if (currentTime > 10 && currentTime < 28) {
    dynamicStatus = "🔥 Explicando la activación neuromuscular...";
  } else if (currentTime >= 28) {
    dynamicStatus = "✨ ¡Oferta y planes desbloqueados!";
  }

  return (
    <div className="vsl-hero-wrapper mx-auto w-full max-w-[440px]">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onContextMenu={(e) => e.preventDefault()}
        className="vsl-video-frame group relative select-none aspect-[3/4] overflow-hidden rounded-3xl border-3 border-[color:var(--wine)] shadow-[8px_8px_0_var(--wine)] bg-black"
      >
        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
          <span className="flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-black uppercase text-white backdrop-blur-md border border-white/10">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PRESENTACIÓN OFICIAL</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 rounded-full bg-[color:var(--wine)]/80 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur-md border border-white/10">
            {dynamicStatus}
          </span>
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="auto"
          onContextMenu={(e) => e.preventDefault()}
          className="h-full w-full object-cover"
        >
          <track kind="captions" />
        </video>

        {/* Unmute Overlay Banner */}
        {isMuted && isPlaying && (
          <button type="button" onClick={handleUnmute} className="vsl-unmute-banner z-40">
            <VolumeX size={18} className="animate-pulse text-[color:var(--lime)]" />
            <span>Haz Clic Para Activar El Audio 🔊</span>
            <div className="flex items-center gap-0.5">
              <span className="vsl-sound-bar" />
              <span className="vsl-sound-bar" />
              <span className="vsl-sound-bar" />
              <span className="vsl-sound-bar" />
            </div>
          </button>
        )}

        {/* Play Overlay Button */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 backdrop-blur-[2px] transition-opacity">
            <button
              type="button"
              onClick={togglePlay}
              className="vsl-play-overlay-btn group-hover:scale-110"
              aria-label="Reproducir Video"
            >
              <Play size={38} className="ml-1 text-white fill-white" />
            </button>
          </div>
        )}

        {/* Bottom Clean Video Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-6 text-white transition-opacity duration-300 ${
            showControls || !isPlaying ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="vsl-progress-track relative mb-3 overflow-hidden" aria-hidden="true">
            <div className="vsl-progress-fill" style={{ width: `${progressPercent}%` }}>
              <div className="vsl-progress-glow-tip" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="rounded-lg bg-white/15 p-2 text-white hover:bg-white/25 hover:text-[color:var(--lime)] transition-colors"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className="flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-2 text-xs font-bold text-white hover:bg-white/25 transition-colors"
                aria-label={isMuted ? "Activar sonido" : "Silenciar"}
              >
                {isMuted ? (
                  <>
                    <VolumeX size={17} className="text-[color:var(--coral)] animate-pulse" />
                    <span className="text-[11px]">Activar Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={17} className="text-emerald-400" />
                    <span className="text-[11px]">Audio ON</span>
                  </>
                )}
              </button>
            </div>

            <span className="text-[11px] font-bold text-white/80 flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-400" /> HD 1080p
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-[color:var(--ink-muted)]">
        <Volume2 size={15} className="text-[color:var(--coral)] animate-bounce" />
        <span>Asegúrate de mantener el audio encendido para no perder la explicación</span>
      </div>
    </div>
  );
}

/**
 * FAQ da Página de Vendas
 */
function SalesPageFaq({
  openFaq,
  setOpenFaq,
  onPlaySound,
}: Readonly<{
  openFaq: number | null;
  setOpenFaq: (idx: number | null) => void;
  onPlaySound?: () => void;
}>) {
  const faqs = [
    {
      q: "¿Cuál es la diferencia entre el Plan Básico y el Plan VIP Vitalicio?",
      a: "El Plan Básico te da acceso por 12 meses a las rutinas diarias del Desafío 28 Días. El Plan VIP Vitalicio te da acceso PARA SIEMPRE (vitalicio), incluye los 4 Super Bonos exclusivos (Nutrición Anti-Flacidez, Protocolo Anti-Celulitis, Tracker de Hábitos, Comunidad VIP y Soporte Prioritario) además del Protocolo Cintura Fina. ¡Es el paquete más completo por solo unos euros más!",
    },
    {
      q: "¿Cómo y cuándo recibo mi acceso al programa?",
      a: "El acceso es 100% inmediato e instantáneo. Tras confirmar tu pago seguro, recibirás un correo electrónico con tus credenciales personales para ingresar a la plataforma y comenzar hoy mismo desde tu celular, tablet o computadora.",
    },
    {
      q: "¿Necesito equipo o pesas para hacer los entrenamientos?",
      a: "No. El método biomecánico está diseñado para utilizar tu propio peso corporal y apoyos caseros sencillos (como una silla o pared). No necesitas mancuernas pesadas ni aparatos de gimnasio.",
    },
    {
      q: "¿Es seguro si tengo dolor de rodillas o problemas lumbares?",
      a: "Totalmente seguro. A diferencia de las sentadillas tradicionales con barra, nuestros ejercicios eliminan el impacto axial sobre la columna y aíslan el glúteo sin forzar los ligamentos de las rodillas.",
    },
    {
      q: "¿Cuánto tiempo al día necesito dedicarle?",
      a: "Solo 15 a 20 minutos al día. Las rutinas son de alta densidad de activación, ideales para realizar en casa antes de comenzar tu jornada o al final del día.",
    },
    {
      q: "¿Es un pago único o hay cobros mensuales recurrentes?",
      a: "Es un pago ÚNICO. No hay mensualidades, cargos ocultos ni suscripciones automáticas. Pagas una sola vez y disfrutas de tu plan sin sorpresas.",
    },
    {
      q: "¿Cómo funciona la Garantía Incondicional de 7 Días?",
      a: "Si durante tus primeros 7 días sientes que el programa no superó tus expectativas, nos envías un correo electrónico o solicitas tu reembolso con un solo clic y te devolvemos el 100% de tu dinero de inmediato.",
    },
  ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openFaq === index;
        return (
          <div
            key={faq.q}
            className={`rounded-2xl border-2 border-[color:var(--wine)] bg-white transition-all ${
              isOpen ? "shadow-[4px_4px_0_var(--wine)]" : "shadow-sm"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                onPlaySound?.();
                const nextOpen = !isOpen;
                setOpenFaq(nextOpen ? index : null);
                trackFaqToggle(faq.q, nextOpen, "sales_vsl_faq");
              }}
              className="flex w-full items-center justify-between p-4 text-left font-display font-bold text-sm sm:text-base text-[color:var(--wine)]"
              aria-expanded={isOpen}
            >
              <span>{faq.q}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-[color:var(--coral)]" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-black/10 p-4 pt-2 text-xs sm:text-sm text-[color:var(--ink-muted)] leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LiveViewerCounter() {
  const [count, setCount] = useState(1482);

  useEffect(() => {
    const deltas = [2, -1, 3, -2, 1, -1, 2, -3, 1, 2];
    let idx = 0;
    const interval = setInterval(() => {
      setCount((prev) => prev + deltas[idx % deltas.length]);
      idx += 1;
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return <span>{count.toLocaleString()} viendo</span>;
}

function OfferCountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border-2 border-[color:var(--coral)] bg-[color:var(--coral-soft)]/40 px-4 py-2">
      <Clock size={18} className="text-[color:var(--coral)] animate-spin-slow" />
      <div className="text-left">
        <span className="block text-[10px] font-extrabold uppercase tracking-wide text-[color:var(--coral-dark)]">
          El descuento especial expira en:
        </span>
        <span className="font-mono text-sm sm:text-base font-black text-[color:var(--wine)]">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
