import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Clock3,
  CreditCard,
  Flame,
  Gift,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TicketPercent,
  TrendingUp,
  X,
} from "lucide-react";
import coachDuo from "@/assets/coach-duo-new.png";
import desafioCard from "@/assets/desafio-card.jpg";
import avatarMaria from "@/assets/avatar-maria.jpg";
import avatarCarla from "@/assets/avatar-carla.jpg";
import avatarPatricia from "@/assets/avatar-patricia.jpg";
import avatarSofia from "@/assets/avatar-sofia.jpg";
import {
  BASE_BACKREDIRECT_URL,
  getDecoratedCheckoutUrl,
  trackBackredirectCtaClick,
  trackBackredirectView,
  trackDownsellCtaClick,
  trackDownsellDismiss,
  trackDownsellModalView,
  trackFaqToggle,
} from "../pixel";

export const Route = createFileRoute("/oferta-especial")({
  head: () => ({
    meta: [
      { title: "¡Espera! Oferta Especial Exclusiva | BrazilianBooty 28 Días" },
      {
        name: "description",
        content:
          "No dejes pasar tu transformación. Accede a BrazilianBooty 28 Días con 90% de descuento especial.",
      },
      { property: "og:title", content: "Oferta Especial - BrazilianBooty 28 Días" },
      {
        property: "og:description",
        content:
          "Descubre los casos reales y el método biomecánico para tonificar tus glúteos en 15 min al día.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: OfertaEspecialPage,
});

export default function OfertaEspecialPage() {
  const [showDownsellModal, setShowDownsellModal] = useState(false);
  const [hasTriggeredDownsell, setHasTriggeredDownsell] = useState(false);
  const [showStickyRescue, setShowStickyRescue] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const exitIntentBlockedRef = useRef(false);

  // Initialize tracking and setup exit-intent listeners
  useEffect(() => {
    trackBackredirectView();
    window.scrollTo({ top: 0, behavior: "smooth" });

    // History API trap for mobile Back Button / Popstate exit intent
    if (typeof window !== "undefined") {
      try {
        window.history.pushState({ page: "special_offer_active" }, "", window.location.href);
      } catch {
        // ignore
      }

      const handlePopState = () => {
        if (!hasTriggeredDownsell) {
          setHasTriggeredDownsell(true);
          setShowDownsellModal(true);
          setShowStickyRescue(true);
          trackDownsellModalView();
          // Push state again so user stays on page and sees the modal
          window.history.pushState({ page: "downsell_modal" }, "", window.location.href);
        }
      };

      // Desktop Exit Intent: Mouse moving towards browser close / tabs
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 15 && !hasTriggeredDownsell && !exitIntentBlockedRef.current) {
          exitIntentBlockedRef.current = true;
          setHasTriggeredDownsell(true);
          setShowDownsellModal(true);
          setShowStickyRescue(true);
          trackDownsellModalView();
        }
      };

      window.addEventListener("popstate", handlePopState);
      document.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        document.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [hasTriggeredDownsell]);

  // Primary CTA click ($9.90 Offer)
  const handlePrimaryCta = (location = "backredirect_hero_cta") => {
    trackBackredirectCtaClick(location);
    const checkoutUrl = getDecoratedCheckoutUrl(BASE_BACKREDIRECT_URL);
    window.location.href = checkoutUrl;
  };

  // Downsell CTA click ($5.90 Offer)
  const handleDownsellCta = (location = "downsell_modal_cta") => {
    trackDownsellCtaClick(location);
    const checkoutUrl = getDecoratedCheckoutUrl(BASE_BACKREDIRECT_URL);
    window.location.href = checkoutUrl;
  };

  const handleCloseDownsellModal = () => {
    trackDownsellDismiss();
    setShowDownsellModal(false);
  };

  return (
    <main className="quiz-canvas min-h-screen overflow-x-hidden text-foreground selection:bg-[color:var(--coral)] selection:text-white">
      {/* Background ambient orbs */}
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-two" aria-hidden="true" />

      {/* Top Urgent Alert Bar */}
      <div className="sticky top-0 z-40 border-b border-[color:var(--wine)]/20 bg-gradient-to-r from-[color:var(--wine)] via-[#6b1426] to-[color:var(--wine)] py-2.5 px-3 text-center text-white shadow-md">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-bold">
          <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--coral)] px-2.5 py-0.5 text-[11px] font-black uppercase text-white shadow-sm animate-pulse">
            <AlertTriangle size={13} strokeWidth={3} /> ¡ESPERA UN MOMENTO!
          </span>
          <span>No te vayas sin reclamar tu cupón especial reservado de</span>
          <span className="rounded bg-[color:var(--lime)] px-1.5 py-0.2 text-[color:var(--wine)] font-black">
            $9.90 USD
          </span>
          <span className="hidden sm:inline">• Válido solo por esta sesión</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[960px] px-4 pb-28 pt-6 sm:px-6 sm:pt-8 space-y-12">
        {/* Header Branding & Live Stats */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
          <div className="flex items-center gap-2 text-left">
            <span className="brand-mark">
              <TrendingUp size={18} strokeWidth={3} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-sm font-black uppercase tracking-[-0.03em] text-[color:var(--wine)]">
                BRAZILIANBOOTY
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--coral)]">
                DESAFÍO 28 DÍAS
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--wine)] px-3 py-1.5 text-[10px] font-black uppercase text-white shadow-sm">
              <span className="vsl-pulse-dot" />
              <LiveCounter />
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[color:var(--lime)] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--wine)] shadow-sm">
              <TicketPercent size={13} strokeWidth={3} /> 90% DE DESCUENTO ACTIVO
            </span>
          </div>
        </header>

        {/* HERO: Attention Grabber & The Problem vs Solution */}
        <section className="rounded-3xl border-4 border-[color:var(--wine)] bg-white p-6 shadow-[8px_8px_0_var(--wine)] md:p-10">
          <div className="text-center">
            <span className="eyebrow-pill mb-3 inline-flex items-center gap-1.5">
              <Sparkles size={14} className="text-[color:var(--coral)]" />
              OFERTA EXCLUSIVA DE RETENCIÓN • ACCESO VITALICIO
            </span>
            <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black leading-tight text-[color:var(--wine)]">
              ¿Por Qué Dejar Para Mañana El Bumbum Firme Que Puedes Empezar a Construir Hoy?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-medium text-[color:var(--ink-muted)] leading-relaxed">
              Sabemos que tienes dudas o que has intentado otros programas sin ver resultados. Por
              eso, antes de que te vayas, queremos mostrarte{" "}
              <strong className="text-[color:var(--wine)]">
                exactamente por qué el Método Brasileño funciona
              </strong>{" "}
              donde las sentadillas tradicionales y las dietas estrictas fallan.
            </p>
          </div>

          {/* Quick Pillars Snapshot */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/60 p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm mb-2">
                <Clock3 size={20} />
              </div>
              <h3 className="font-display text-sm font-black text-emerald-950">
                Solo 15 Minutos/Día
              </h3>
              <p className="mt-1 text-xs text-emerald-900 leading-snug">
                Rutinas breves y precisas que se adaptan a tu ritmo en casa.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[color:var(--coral)]/30 bg-[color:var(--coral-soft)]/40 p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--coral)] text-white shadow-sm mb-2">
                <Target size={20} />
              </div>
              <h3 className="font-display text-sm font-black text-[color:var(--wine)]">
                100% Aislamiento Glúteo
              </h3>
              <p className="mt-1 text-xs text-[color:var(--ink-muted)] leading-snug">
                Activa glúteo mayor y medio sin ensanchar muslos ni dañar rodillas.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[color:var(--lime)]/60 bg-[color:var(--lime)]/20 p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--wine)] text-[color:var(--lime)] shadow-sm mb-2">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-display text-sm font-black text-[color:var(--wine)]">
                7 Días Garantizados
              </h3>
              <p className="mt-1 text-xs text-[color:var(--ink-muted)] leading-snug">
                Prueba el método completo sin ningún riesgo financiero.
              </p>
            </div>
          </div>

          {/* Quick Price CTA */}
          <div className="mt-8 rounded-2xl border-2 border-[color:var(--wine)] bg-[color:var(--cream)] p-5 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm font-bold text-[color:var(--ink-muted)] line-through">
                Precio Habitual: $97.00 USD
              </span>
              <span className="rounded-full bg-[color:var(--coral)] px-3 py-1 text-xs font-black text-white shadow-sm">
                90% DE DESCUENTO APLICADO
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-center gap-2">
              <span className="text-sm font-bold text-[color:var(--wine)]">
                Llévatelo hoy por solo:
              </span>
              <span className="font-display text-4xl sm:text-5xl font-black text-[color:var(--coral)]">
                $9.90
              </span>
              <span className="text-base font-bold text-[color:var(--wine)]">USD</span>
            </div>

            <button
              type="button"
              onClick={() => handlePrimaryCta("backredirect_hero_btn")}
              className="cta-button mt-4 mx-auto max-w-lg text-base sm:text-lg font-black tracking-wider text-white shadow-xl hover:scale-[1.02]"
            >
              <span className="button-sheen" />
              <span className="flex items-center justify-center gap-2">
                ¡SÍ, QUIERO MI PLAN COMPLETO POR $9.90!
                <ArrowRight size={22} />
              </span>
            </button>
            <p className="mt-2 text-[11px] font-semibold text-[color:var(--ink-muted)]">
              Pago único • Acceso de por vida • Sin mensualidades ocultas
            </p>
          </div>
        </section>

        {/* SECTION: DETAILED REAL SUCCESS CASES (WHY PEOPLE MUST BUY) */}
        <section className="space-y-8">
          <div className="text-center">
            <span className="eyebrow-pill mb-2">CASOS REALES & RESULTADOS PROBADOS</span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[color:var(--wine)]">
              ¿Te Identificas Con Alguno de Estos Casos?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
              Descubre cómo mujeres en situaciones exactamente iguales a la tuya transformaron sus
              glúteos en 28 días con el método.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Caso 1: Sin tiempo / Madres ocupadas */}
            <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-white p-6 shadow-[5px_5px_0_var(--wine)] flex flex-col justify-between hover:shadow-[7px_7px_0_var(--wine)] transition-shadow">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarMaria}
                      alt="María Elena"
                      className="h-14 w-14 rounded-full border-2 border-[color:var(--coral)] object-cover shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display text-base font-black text-[color:var(--wine)]">
                          María Elena, 42 años
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-bold text-[color:var(--coral)]">
                          Madre de 2 niños y ejecutiva
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800">
                          <BadgeCheck size={11} className="text-emerald-600" /> Alumna Verificada
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[color:var(--lime)] px-2.5 py-1 text-[10px] font-black text-[color:var(--wine)] shadow-sm">
                    CASO #1
                  </span>
                </div>

                <h4 className="font-display text-lg font-black text-[color:var(--wine)]">
                  "Pensaba que necesitaba 2 horas en el gimnasio y no tenía tiempo."
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-[color:var(--ink-muted)] leading-relaxed">
                  <em>
                    "Con dos hijos y trabajo de oficina, ir al gimnasio era imposible. Este método
                    me salvó porque solo hago 15 minutos en mi sala antes de que los niños
                    despierten. En la tercera semana sentí mis glúteos más levantados y duros, y los
                    pantalones me quedan increíbles sin haber tocado una pesa."
                  </em>
                </p>

                <div className="mt-4 rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Por qué funcionó para ella:</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-800">
                    La alta densidad neuromuscular estimula el 100% de las fibras en 15 minutos sin
                    tiempos muertos ni desplazamientos.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-[color:var(--wine)]">
                <span className="flex text-amber-500 font-bold">★★★★★</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 text-[11px]">
                  Resultado: +3.5 cm de elevación
                </span>
              </div>
            </div>

            {/* Caso 2: Dolor de rodillas / problemas articulares */}
            <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-white p-6 shadow-[5px_5px_0_var(--wine)] flex flex-col justify-between hover:shadow-[7px_7px_0_var(--wine)] transition-shadow">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarCarla}
                      alt="Carla Rodríguez"
                      className="h-14 w-14 rounded-full border-2 border-[color:var(--coral)] object-cover shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display text-base font-black text-[color:var(--wine)]">
                          Carla Rodríguez, 35 años
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-bold text-[color:var(--coral)]">
                          Lesión previa en rodilla
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800">
                          <BadgeCheck size={11} className="text-emerald-600" /> Alumna Verificada
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[color:var(--lime)] px-2.5 py-1 text-[10px] font-black text-[color:var(--wine)] shadow-sm">
                    CASO #2
                  </span>
                </div>

                <h4 className="font-display text-lg font-black text-[color:var(--wine)]">
                  "Las sentadillas y zancadas me destrozaban las rodillas y la espalda."
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-[color:var(--ink-muted)] leading-relaxed">
                  <em>
                    "Cada vez que intentaba entrenar piernas terminaba con dolor de rodillas por
                    días. Con la técnica brasileña de puente y abducción isométrica aprendí a quemar
                    el glúteo directamente sin poner presión en las articulaciones. Por primera vez
                    entreno sin dolor alguno."
                  </em>
                </p>

                <div className="mt-4 rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Por qué funcionó para ella:</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-800">
                    Eliminamos la carga axial sobre rodillas y vértebras, focalizando la tensión
                    mediante ángulos biomecánicos de suelo.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-[color:var(--wine)]">
                <span className="flex text-amber-500 font-bold">★★★★★</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 text-[11px]">
                  Resultado: Cero dolor articular
                </span>
              </div>
            </div>

            {/* Caso 3: Flacidez, celulitis y edad 35-55+ */}
            <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-white p-6 shadow-[5px_5px_0_var(--wine)] flex flex-col justify-between hover:shadow-[7px_7px_0_var(--wine)] transition-shadow">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarPatricia}
                      alt="Patricia Gómez"
                      className="h-14 w-14 rounded-full border-2 border-[color:var(--coral)] object-cover shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display text-base font-black text-[color:var(--wine)]">
                          Patricia Gómez, 51 años
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-bold text-[color:var(--coral)]">
                          Menopausia y pérdida de tono
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800">
                          <BadgeCheck size={11} className="text-emerald-600" /> Alumna Verificada
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[color:var(--lime)] px-2.5 py-1 text-[10px] font-black text-[color:var(--wine)] shadow-sm">
                    CASO #3
                  </span>
                </div>

                <h4 className="font-display text-lg font-black text-[color:var(--wine)]">
                  "Creí que por mi edad era imposible volver a tener glúteos firmes."
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-[color:var(--ink-muted)] leading-relaxed">
                  <em>
                    "Después de los 45 años sentí que la gravedad y la celulitis habían ganado.
                    Empecé el desafío sin mucha fe y en 28 días la piel de mis glúteos se tensó por
                    completo. La guía nutricional anti-flacidez del bono fue el complemento perfecto
                    para recuperar firmeza."
                  </em>
                </p>

                <div className="mt-4 rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Por qué funcionó para ella:</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-800">
                    Reactiva la memoria neuromuscular de las 3 porciones del glúteo y estimula la
                    síntesis de colágeno natural en la fascia.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-[color:var(--wine)]">
                <span className="flex text-amber-500 font-bold">★★★★★</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 text-[11px]">
                  Resultado: Firmeza y reducción de flacidez
                </span>
              </div>
            </div>

            {/* Caso 4: Dominancia de muslos / Glúteos planos */}
            <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-white p-6 shadow-[5px_5px_0_var(--wine)] flex flex-col justify-between hover:shadow-[7px_7px_0_var(--wine)] transition-shadow">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarSofia}
                      alt="Sofía Moreno"
                      className="h-14 w-14 rounded-full border-2 border-[color:var(--coral)] object-cover shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display text-base font-black text-[color:var(--wine)]">
                          Sofía Moreno, 27 años
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-bold text-[color:var(--coral)]">
                          Glúteos planos y muslos anchos
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800">
                          <BadgeCheck size={11} className="text-emerald-600" /> Alumna Verificada
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[color:var(--lime)] px-2.5 py-1 text-[10px] font-black text-[color:var(--wine)] shadow-sm">
                    CASO #4
                  </span>
                </div>

                <h4 className="font-display text-lg font-black text-[color:var(--wine)]">
                  "Todo el ejercicio se me iba a los muslos y el glúteo seguía plano."
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-[color:var(--ink-muted)] leading-relaxed">
                  <em>
                    "Siempre que hacía ejercicio terminaba con las piernas hinchadas y el bumbum
                    plano. Con este protocolo aprendí la técnica de pre-activación: apagas los
                    cuádriceps y obligas al glúteo medio a trabajar. Rellené los hoyuelos laterales
                    y mi cintura se ve mucho más fina."
                  </em>
                </p>

                <div className="mt-4 rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Por qué funcionó para ella:</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-800">
                    Aisla el glúteo medio y mínimo para dar redondez y proyección lateral sin
                    hipertrofiar los muslos frontales.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-[color:var(--wine)]">
                <span className="flex text-amber-500 font-bold">★★★★★</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 text-[11px]">
                  Resultado: Curva lateral y silueta reloj de arena
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: 5 REASONS WHY YOU SHOULD BUY TODAY */}
        <section className="rounded-3xl border-3 border-[color:var(--wine)] bg-[color:var(--wine)] p-6 md:p-10 text-white shadow-[8px_8px_0_var(--coral)]">
          <div className="text-center mb-8">
            <span className="rounded-full bg-[color:var(--lime)] px-3 py-1 text-xs font-black uppercase text-[color:var(--wine)] shadow-sm">
              LA DIFERENCIA DEL MÉTODO BRASILEÑO
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white mt-2">
              5 Razones Contundentes Para Entrar Hoy Mismo
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-white/80">
              No es otro programa genérico de fitness. Es una fórmula científica de activación
              neuromuscular diseñada exclusivamente para la anatomía femenina.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--lime)] font-black text-[color:var(--wine)] text-sm mb-3">
                1
              </span>
              <h3 className="font-display text-base font-black text-white">
                Aislamiento Biomecânico
              </h3>
              <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                Aprenderás a dirigir el 100% de la contracción muscular al glúteo mayor y medio, sin
                sobrecargar los cuádriceps ni engrosar las piernas.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--coral)] font-black text-white text-sm mb-3">
                2
              </span>
              <h3 className="font-display text-base font-black text-white">
                15 Minutos de Alta Densidad
              </h3>
              <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                Sin horas interminables de cardio. Sesiones breves y dinámicas en video que puedes
                hacer en tu sala o habitación en cualquier horario.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--lime)] font-black text-[color:var(--wine)] text-sm mb-3">
                3
              </span>
              <h3 className="font-display text-base font-black text-white">
                Cero Equipo Necesario
              </h3>
              <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                Utiliza tu propio peso corporal y principios de tensión isométrica para estimular el
                crecimiento y firmeza sin gastar en gimnasios.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--coral)] font-black text-white text-sm mb-3">
                4
              </span>
              <h3 className="font-display text-base font-black text-white">
                4 Bonos Gratis de Regalo
              </h3>
              <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                Guía nutricional anti-flacidez, protocolo express anti-celulitis, tracker de
                progreso y acceso a la comunidad VIP sin costo extra.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:col-span-2 lg:col-span-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 font-black text-white text-sm mb-3">
                5
              </span>
              <h3 className="font-display text-base font-black text-white">
                Garantía Total de 7 Días
              </h3>
              <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                Prueba el programa durante una semana completa. Si no sientes la activación y la
                diferencia en tu cuerpo, te devolvemos el 100% de tu dinero de inmediato ($9.90
                USD). Risco Cero.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: FULL MAIN OFFER SUMMARY CARD ($9.90 USD) */}
        <section className="relative overflow-hidden rounded-3xl border-4 border-[color:var(--wine)] bg-white p-6 shadow-[10px_10px_0_var(--wine)] md:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-5">
            <div>
              <span className="vsl-offer-badge">🔥 OFERTA EXCLUSIVA DE RETENCIÓN (90% OFF)</span>
              <h2 className="font-display text-2xl font-black text-[color:var(--wine)] sm:text-3xl mt-1.5">
                Desafío Glúteos Brasileños 28 Días
              </h2>
              <p className="text-xs font-medium text-[color:var(--ink-muted)]">
                Acceso Completo De Por Vida + 4 Bonos de Regalo + Garantía Incondicional de 7 Días
              </p>
            </div>

            <OfferCountdownTimer />
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Left: Product Card Image */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative overflow-hidden rounded-2xl border-3 border-[color:var(--wine)] bg-[color:var(--wine)] shadow-[6px_6px_0_var(--coral)]">
                <img
                  src={desafioCard}
                  alt="Desafío Glúteos Brasileños"
                  className="h-auto w-full max-w-[280px] object-cover transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-black/85 p-2 text-center text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  ✨ Programa Digital Completo en Video HD
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[color:var(--wine)]">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span>4.9 / 5.0 (+2.800 alumnas satisfechas)</span>
              </div>
            </div>

            {/* Right: Benefits & Value List */}
            <div className="lg:col-span-7 space-y-4">
              <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-[color:var(--wine)]">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--lime)] text-[color:var(--wine)]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span>
                    <strong>Protocolo Guiado de 28 Días:</strong> Rutinas completas en video de 15
                    min al día.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--lime)] text-[color:var(--wine)]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span>
                    <strong>Biomecánica Brasileña:</strong> Aislamiento de glúteos sin dolor de
                    rodillas ni muslos gruesos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--lime)] text-[color:var(--wine)]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span>
                    <strong>Entrena 100% en Casa:</strong> Sin máquinas, pesas pesadas ni
                    mensualidades.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--coral)] text-white">
                    <Gift size={13} />
                  </span>
                  <span>
                    <strong>Bono #1:</strong> Guía Nutricional Anti-Flacidez y Menú Firmeza{" "}
                    <span className="text-[color:var(--coral)] font-bold">
                      (Valor $37 USD - GRATIS)
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--coral)] text-white">
                    <Gift size={13} />
                  </span>
                  <span>
                    <strong>Bono #2:</strong> Protocolo Express Anti-Celulitis y Drenaje{" "}
                    <span className="text-[color:var(--coral)] font-bold">
                      (Valor $29 USD - GRATIS)
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--coral)] text-white">
                    <Gift size={13} />
                  </span>
                  <span>
                    <strong>Bono #3:</strong> Planificador Imprimible y Tracker de Hábitos{" "}
                    <span className="text-[color:var(--coral)] font-bold">
                      (Valor $19 USD - GRATIS)
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--coral)] text-white">
                    <Gift size={13} />
                  </span>
                  <span>
                    <strong>Bono #4:</strong> Comunidad VIP de Alumnas y Soporte Vitalicio{" "}
                    <span className="text-[color:var(--coral)] font-bold">
                      (Valor $47 USD - GRATIS)
                    </span>
                  </span>
                </li>
              </ul>

              {/* Price Box */}
              <div className="rounded-2xl border-2 border-[color:var(--wine)] bg-[color:var(--cream)] p-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs sm:text-sm font-bold text-[color:var(--ink-muted)] line-through">
                    Precio Regular: $97 USD
                  </span>
                  <span className="rounded-full bg-[color:var(--coral)] px-2.5 py-0.5 text-xs font-black text-white">
                    90% DESCUENTO
                  </span>
                </div>

                <div className="mt-1 flex items-baseline justify-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-[color:var(--wine)]">
                    Pago único hoy:
                  </span>
                  <span className="font-display text-4xl sm:text-5xl font-black text-[color:var(--coral)]">
                    $9.90
                  </span>
                  <span className="text-sm font-bold text-[color:var(--wine)]">USD</span>
                </div>
                <p className="mt-0.5 text-[11px] font-semibold text-[color:var(--ink-muted)]">
                  Pago único • Acceso ilimitado de por vida • Sin mensualidades
                </p>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={() => handlePrimaryCta("backredirect_main_card_cta")}
                className="cta-button text-base md:text-lg font-black tracking-wider text-white shadow-xl hover:scale-[1.02]"
              >
                <span className="button-sheen" />
                <span className="flex items-center justify-center gap-2">
                  ¡DESBLOQUEAR MI ACCESO POR $9.90 USD!
                  <ArrowRight size={22} />
                </span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-center text-[11px] font-semibold text-[color:var(--ink-muted)]">
                <span className="flex items-center gap-1">
                  <Lock size={13} className="text-emerald-600" /> Checkout Seguro y Cifrado
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" /> Garantía de 7 Días
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard size={13} className="text-[color:var(--wine)]" /> Tarjetas / Pagos Seguros
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: COACHES & AUTHORITY */}
        <section className="rounded-3xl border-3 border-[color:var(--wine)] bg-[color:var(--wine)] p-6 text-white shadow-[6px_6px_0_var(--coral)] md:p-8">
          <div className="grid gap-6 md:grid-cols-12 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative overflow-hidden rounded-2xl border-3 border-white/20 shadow-xl max-w-[240px]">
                <img src={coachDuo} alt="Entrenadores" className="h-auto w-full object-cover" />
              </div>
            </div>

            <div className="md:col-span-8 space-y-3">
              <span className="rounded-full bg-[color:var(--lime)] px-3 py-1 text-xs font-black uppercase text-[color:var(--wine)]">
                EQUIPO PROFESIONAL BRASILEÑO
              </span>
              <h2 className="font-display text-2xl font-black md:text-3xl text-white">
                Diseñado Por Especialistas en Estética y Biomecánica Femenina
              </h2>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                Estudiamos los patrones de activación muscular del entrenamiento brasileño para
                crear un protocolo paso a paso, seguro y 100% aplicable en casa para cualquier edad.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-[color:var(--shock-yellow)]">
                <span>✓ +10 Años de Experiencia</span>
                <span>✓ +2.800 Alumnas Transformadas</span>
                <span>✓ Soporte Vitalicio Incluido</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: 7-DAY GUARANTEE */}
        <section className="rounded-3xl border-4 border-emerald-600 bg-emerald-50 p-6 md:p-8 text-center shadow-[6px_6px_0_theme(colors.emerald.800)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md mb-3">
            <ShieldCheck size={32} />
          </div>

          <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
            GARANTÍA INCONDICIONAL DE REEMBOLSO
          </span>

          <h2 className="font-display text-2xl font-black text-emerald-950 md:text-3xl mt-1">
            Pruébalo Durante 7 Días Completos Sin Ningún Riesgo
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-emerald-900 leading-relaxed">
            Si durante los primeros 7 días sientes que el método no es para ti, o simplemente
            cambias de opinión, solicitas tu reembolso con un solo clic en la plataforma y te
            devolvemos el 100% de tu dinero ($9.90 USD). Sin preguntas ni complicaciones.
          </p>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => handlePrimaryCta("backredirect_guarantee_btn")}
              className="cta-button max-w-md mx-auto text-sm sm:text-base font-black uppercase text-white shadow-md hover:scale-[1.02]"
            >
              <span className="button-sheen" />
              <span>PROBAR EL MÉTODO POR $9.90 SIN RIESGO</span>
            </button>
          </div>
        </section>

        {/* SECTION: FAQ */}
        <section className="space-y-6">
          <div className="text-center">
            <span className="eyebrow-pill mb-2">RESOLVEMOS TODAS TUS DUDAS</span>
            <h2 className="font-display text-2xl font-black text-[color:var(--wine)] md:text-3xl">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "¿Cómo recibo el acceso al programa?",
                a: "El acceso es 100% inmediato. Tras confirmar tu pago seguro de $9.90 USD, recibirás un correo electrónico con tus datos de acceso para ingresar a la plataforma en video y comenzar hoy mismo.",
              },
              {
                q: "¿Necesito equipo o pesas para hacer las rutinas?",
                a: "No. El protocolo está diseñado para realizarse con peso corporal y apoyos cotidianos en casa (como una silla o pared). Las bandas elásticas son opcionales si luego quieres más intensidad.",
              },
              {
                q: "¿Es seguro si tengo dolor de rodillas o espalda?",
                a: "Sí. A diferencia de las sentadillas con peso libre, nuestros ejercicios biomecánicos aíslan el glúteo en el suelo sin sobrecargar articulaciones ni columna.",
              },
              {
                q: "¿Cuánto tiempo al día necesito?",
                a: "Solo 15 minutos al día. Las sesiones son compactas y de alta densidad para adaptarse a tu rutina sin importar qué tan ocupada estés.",
              },
              {
                q: "¿Es un pago único o hay cobros mensuales?",
                a: "Es un pago ÚNICO de $9.90 USD. No hay mensualidades ni cobros recurrentes. Tu acceso es de por vida.",
              },
            ].map((faq, index) => {
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
                      const nextOpen = !isOpen;
                      setOpenFaq(nextOpen ? index : null);
                      trackFaqToggle(faq.q, nextOpen, "backredirect_faq");
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
        </section>

        {/* FINAL BOTTOM CTA */}
        <section className="rounded-3xl border-3 border-[color:var(--wine)] bg-white/95 p-6 text-center shadow-[6px_6px_0_var(--wine)] backdrop-blur-md md:p-10">
          <span className="vsl-offer-badge mb-3">🔥 ÚLTIMA OPORTUNIDAD • CUPÓN 90% OFF</span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[color:var(--wine)]">
            Comienza Hoy Tu Desafío Glúteos Brasileños
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
            Acceso completo de por vida + 4 bonos de regalo por un único pago de solo{" "}
            <strong className="text-[color:var(--coral)]">$9.90 USD</strong>.
          </p>

          <div className="mx-auto mt-6 max-w-lg">
            <button
              type="button"
              onClick={() => handlePrimaryCta("backredirect_bottom_cta")}
              className="cta-button text-base font-black tracking-wider text-white shadow-xl hover:scale-[1.02]"
            >
              <span className="button-sheen" />
              <span className="flex items-center justify-center gap-2">
                ¡QUIERO MI PLAN COMPLETO POR $9.90!
                <ArrowRight size={20} />
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* DOWNSELL MODAL: TRIGGERED WHEN USER TRIES TO LEAVE BACKREDIRECT ($5.90)   */}
      {/* ========================================================================= */}
      {showDownsellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border-4 border-[color:var(--coral)] bg-white p-6 shadow-2xl md:p-8 animate-scale-up text-[color:var(--wine)]">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseDownsellModal}
              className="absolute right-4 top-4 rounded-full bg-black/5 p-1.5 text-gray-500 hover:bg-black/10 transition-colors"
              aria-label="Cerrar ventana"
            >
              <X size={20} />
            </button>

            {/* Emergency Header */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase text-white shadow-md animate-bounce">
                <Flame size={15} /> ¡ALTO! OFERTA DE RESCATE EXCLUSIVA
              </span>
              <h2 className="font-display mt-3 text-2xl sm:text-3xl font-black leading-tight text-[color:var(--wine)]">
                No Queremos Que El Dinero Sea Un Impedimento Para Tu Transformación
              </h2>
              <p className="mt-2 text-xs sm:text-sm font-medium text-[color:var(--ink-muted)]">
                Por ser tu última oportunidad antes de salir, hemos liberado un cupón de emergencia
                exclusivo para ti.
              </p>
            </div>

            {/* Downsell Offer Box */}
            <div className="mt-5 rounded-2xl border-3 border-[color:var(--wine)] bg-[color:var(--cream)] p-4 text-center">
              <span className="rounded-full bg-[color:var(--wine)] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--lime)]">
                PLAN COMPLETO + TODOS LOS BONOS INCLUIDOS
              </span>

              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-gray-400 line-through">
                  Precio Normal: 97,00 €
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-400 line-through">
                  Oferta 9,99 €
                </span>
              </div>

              <div className="mt-1 flex items-baseline justify-center gap-1.5">
                <span className="text-sm font-black text-[color:var(--wine)]">
                  Llévalo hoy por solo:
                </span>
                <span className="font-display text-4xl sm:text-5xl font-black text-red-600">
                  5,99 €
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-left text-xs font-bold text-[color:var(--wine)]">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600 shrink-0" strokeWidth={3} />
                  <span>Acceso Completo al Desafío 28 Días en video HD</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600 shrink-0" strokeWidth={3} />
                  <span>Los 4 Bonos de Regalo (Nutrición, Anti-Celulitis, Tracker, VIP)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600 shrink-0" strokeWidth={3} />
                  <span>Garantía Incondicional de 7 Días (Riesgo Cero)</span>
                </div>
              </div>
            </div>

            {/* Downsell CTA Button */}
            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => handleDownsellCta("downsell_modal_primary_btn")}
                className="cta-button w-full py-4 text-base sm:text-lg font-black tracking-wider text-white shadow-xl hover:scale-[1.02] bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400"
              >
                <span className="button-sheen" />
                <span className="flex items-center justify-center gap-2">
                  ¡SÍ, QUIERO MI PLAN POR SOLO 5,99 €!
                  <ArrowRight size={22} />
                </span>
              </button>

              <button
                type="button"
                onClick={handleCloseDownsellModal}
                className="block w-full text-center text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors underline"
              >
                No gracias, prefiero perder esta oportunidad única y pagar el precio completo
                después
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 text-center text-[10px] font-semibold text-gray-500">
              <span className="flex items-center gap-1">
                <Lock size={12} className="text-emerald-600" /> Pago Seguro
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-600" /> Garantía de 7 Días
              </span>
              <span className="flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500" /> Acceso De Por Vida
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STICKY RESCUE BAR: SHOWN AT BOTTOM AFTER DOWNSELL IS TRIGGERED             */}
      {/* ========================================================================= */}
      {showStickyRescue && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[color:var(--wine)] bg-white/95 p-3 shadow-2xl backdrop-blur-md animate-slide-up">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-md animate-pulse">
                <Flame size={20} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-red-600">
                    OFERTA DE RESCATE ACTIVA
                  </span>
                  <span className="rounded bg-[color:var(--wine)] px-1.5 py-0.2 text-[10px] font-black text-[color:var(--lime)]">
                    5,99 €
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[color:var(--ink-muted)]">
                  Acceso completo al método de 28 días con 95% de descuento
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleDownsellCta("downsell_sticky_btn")}
                className="cta-button py-2.5 px-6 text-xs sm:text-sm font-black uppercase text-white shadow-lg flex-1 sm:flex-initial bg-gradient-to-r from-red-600 to-orange-500"
              >
                <span className="button-sheen" />
                <span className="flex items-center justify-center gap-1.5">
                  ¡ACCEDER POR 5,99 €!
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

function LiveCounter() {
  const [count, setCount] = useState(1495);

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
    <div className="flex items-center gap-2 rounded-xl border-2 border-[color:var(--coral)] bg-[color:var(--coral-soft)]/30 px-3.5 py-1.5">
      <Clock size={16} className="text-[color:var(--coral)] animate-spin-slow" />
      <div className="text-left">
        <span className="block text-[10px] font-extrabold uppercase tracking-wide text-[color:var(--coral-dark)]">
          El cupón expira en:
        </span>
        <span className="font-mono text-sm font-black text-[color:var(--wine)]">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
