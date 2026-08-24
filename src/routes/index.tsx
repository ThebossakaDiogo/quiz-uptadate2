import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  Clock,
  Clock3,
  CreditCard,
  Dumbbell,
  Eye,
  Gift,
  Heart,
  Lock,
  LockKeyhole,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TicketPercent,
  TrendingUp,
  Users,
  Utensils,
  Volume2,
  VolumeX,
  XCircle,
  Zap,
} from "lucide-react";
import coachDuo from "@/assets/coach-duo-new.png";
import coachOffice from "@/assets/pic2.1page.webp";
import coachPortrait from "@/assets/pic2page.webp";
import desafioCard from "@/assets/desafio-card.jpg";
import age1 from "@/assets/age-1.jpg";
import age2 from "@/assets/age-2.jpg";
import age3 from "@/assets/age-3.jpg";
import age4 from "@/assets/age-4.jpg";
import {
  getDecoratedCheckoutUrl,
  trackInitiateCheckout,
  trackQuizAnswer,
  trackQuizComplete,
  trackQuizProgress,
  trackViewContent,
  trackVslCtaClick,
  trackVslMilestone,
  trackVslPlay,
} from "../pixel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desafío Glúteos Brasileños | Tu plan de 28 días" },
      {
        name: "description",
        content:
          "Responde un test breve y descubre una ruta de entrenamiento en casa adaptada a tu tiempo, objetivo y nivel.",
      },
      { property: "og:title", content: "Tu ruta brasileña de 28 días" },
      {
        property: "og:description",
        content: "Un plan práctico de activación y fuerza para entrenar en casa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Option = {
  label: string;
  sub?: string;
  image?: string;
};

type Question = {
  kind: "question";
  n: number;
  phase: string;
  eyebrow: string;
  title: string;
  helper?: string;
  options: Option[];
  grid?: boolean;
};

type Screen =
  | { kind: "landing" }
  | { kind: "coach" }
  | Question
  | { kind: "info" }
  | { kind: "result" }
  | { kind: "analyzing" }
  | { kind: "coupon" }
  | { kind: "final" };

const TOTAL = 13;
const CHECKOUT_URL = "https://pay.hotmart.com/I106974773O";

type SoundKind = "click" | "select" | "back" | "success";

let uiAudioContext: AudioContext | null = null;
let uiSoundsEnabled = true;

function playUiSound(kind: SoundKind) {
  if (!uiSoundsEnabled || typeof window === "undefined") return;

  uiAudioContext ??= new AudioContext();
  const context = uiAudioContext;
  if (context.state === "suspended") void context.resume();

  const tone = (start: number, end: number, duration: number, delay = 0, volume = 0.035) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = context.currentTime + delay;
    const endAt = startAt + duration;

    oscillator.type = kind === "success" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(start, startAt);
    oscillator.frequency.exponentialRampToValueAtTime(end, endAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(endAt + 0.015);
  };

  if (kind === "select") {
    tone(390, 620, 0.09, 0, 0.04);
  } else if (kind === "back") {
    tone(330, 190, 0.075, 0, 0.025);
  } else if (kind === "success") {
    tone(440, 660, 0.13, 0, 0.035);
    tone(620, 880, 0.16, 0.075, 0.03);
    tone(880, 1100, 0.18, 0.15, 0.025);
  } else {
    tone(270, 210, 0.055, 0, 0.025);
  }
}

const questions: Question[] = [
  {
    kind: "question",
    n: 1,
    phase: "Tu punto de partida",
    eyebrow: "Empecemos por cómo te sientes hoy",
    title: "¿Cómo describirías tus glúteos actualmente?",
    helper: "No hay respuestas correctas. Tu honestidad hace que la recomendación sea más útil.",
    options: [
      { label: "Quiero más firmeza y elevación", sub: "Siento que perdieron tono con el tiempo" },
      { label: "Quiero más volumen y forma", sub: "Busco una curva más redondeada y visible" },
      {
        label: "Ya me gustan, pero quiero potenciarlos",
        sub: "Quiero definición y un efecto más marcado",
      },
    ],
  },
  {
    kind: "question",
    n: 2,
    phase: "Tu punto de partida",
    eyebrow: "Tu prioridad estética",
    title: "¿Qué cambio tendría más impacto en tu confianza?",
    options: [
      { label: "Ver más proyección de perfil", sub: "Una silueta con más volumen y curva" },
      { label: "Sentirlos más firmes", sub: "Menos flacidez y mejor tono al tacto" },
      { label: "Vestirme con más seguridad", sub: "Sentirme mejor con jeans, vestidos y bikinis" },
    ],
  },
  {
    kind: "question",
    n: 3,
    phase: "Tu punto de partida",
    eyebrow: "Tu relación con tu cuerpo",
    title: "Cuando eliges ropa, ¿cuánto influye esta inseguridad?",
    options: [
      { label: "Mucho", sub: "A veces cambio de ropa o evito ciertas prendas" },
      { label: "Un poco", sub: "Intento disimular, aunque no siempre" },
      { label: "Casi nada", sub: "Mi objetivo es mejorar, no esconderme" },
    ],
  },
  {
    kind: "question",
    n: 4,
    phase: "Tu rutina ideal",
    eyebrow: "Ahora vamos a hacerlo posible",
    title: "¿Qué formato encaja mejor en tu día?",
    options: [
      { label: "Rutinas cortas y directas", sub: "Quiero terminar antes de encontrar una excusa" },
      { label: "Sesiones guiadas con calma", sub: "Prefiero aprender bien cada movimiento" },
      { label: "Entrenos intensos", sub: "Me gusta sentir un desafío mayor" },
    ],
  },
  {
    kind: "question",
    n: 5,
    phase: "Tu rutina ideal",
    eyebrow: "Constancia antes que perfección",
    title: "¿Seguirías una secuencia clara durante 28 días?",
    options: [
      { label: "Sí, si sé exactamente qué hacer", sub: "Necesito una guía día por día" },
      {
        label: "Sí, si noto que estoy avanzando",
        sub: "Los pequeños logros me mantienen motivada",
      },
      { label: "Sí, quiero crear este hábito", sub: "Estoy lista para priorizarme" },
    ],
  },
  {
    kind: "question",
    n: 6,
    phase: "Tu rutina ideal",
    eyebrow: "Diseñemos una meta realista",
    title: "¿Cuánto tiempo puedes reservar para ti?",
    options: [
      { label: "8 a 10 minutos", sub: "Formato express para días ocupados" },
      { label: "10 a 15 minutos", sub: "Tiempo para activar y entrenar" },
      { label: "20 minutos o más", sub: "Quiero una sesión más completa" },
    ],
  },
  {
    kind: "question",
    n: 7,
    phase: "Tu rutina ideal",
    eyebrow: "Tu frecuencia sostenible",
    title: "¿Cuántos días por semana puedes entrenar en casa?",
    options: [
      { label: "3 días", sub: "Quiero empezar de forma gradual" },
      { label: "4 a 5 días", sub: "Mi equilibrio ideal entre estímulo y descanso" },
      { label: "6 días", sub: "Me motivan las rutinas diarias y variadas" },
    ],
  },
  {
    kind: "question",
    n: 8,
    phase: "Tu rutina ideal",
    eyebrow: "Un vistazo a tu alimentación",
    title: "¿Cómo suelen ser tus comidas durante el día?",
    helper: "Esto nos ayuda a recomendar una guía práctica, no una dieta restrictiva.",
    options: [
      { label: "Como poco o me salto comidas", sub: "Mis horarios dificultan organizarme" },
      {
        label: "Hago 3 comidas bastante regulares",
        sub: "Tengo una base y puedo mejorar detalles",
      },
      { label: "Planifico bien mis comidas", sub: "Quiero optimizar proteína e hidratación" },
      { label: "Como de forma irregular", sub: "El estrés o la ansiedad cambian mi rutina" },
    ],
  },
  {
    kind: "question",
    n: 9,
    phase: "Tu perfil",
    eyebrow: "Adaptamos ritmo y recuperación",
    title: "¿Cuál es tu rango de edad?",
    helper: "Tu edad orienta la progresión; nunca limita lo que puedes conseguir.",
    grid: true,
    options: [
      { label: "18 - 29 años", image: age1 },
      { label: "30 - 39 años", image: age2 },
      { label: "40 - 49 años", image: age3 },
      { label: "50+ años", image: age4 },
    ],
  },
  {
    kind: "question",
    n: 10,
    phase: "Tu perfil",
    eyebrow: "Tu acuerdo contigo misma",
    title: "¿Qué compromiso se siente posible desde hoy?",
    options: [
      { label: "Cumplir incluso en los días ocupados", sub: "Ocho minutos también cuentan" },
      { label: "Volver aunque pierda un día", sub: "Sin culpa ni mentalidad de todo o nada" },
      { label: "Registrar cada pequeña victoria", sub: "Quiero ver mi constancia crecer" },
    ],
  },
  {
    kind: "question",
    n: 11,
    phase: "Tu perfil",
    eyebrow: "Tu resultado deseado",
    title: "¿Qué objetivo te emociona más para estos 28 días?",
    options: [
      { label: "Efecto push-up", sub: "Más elevación, control y firmeza" },
      { label: "Curvas más redondeadas", sub: "Volumen visual y mejor proyección" },
      { label: "Definición y tono", sub: "Una apariencia más fuerte y esculpida" },
      { label: "Reconectar con mi cuerpo", sub: "Sentirme activa, segura y constante" },
    ],
  },
  {
    kind: "question",
    n: 12,
    phase: "Tu perfil",
    eyebrow: "Vamos a anticipar los obstáculos",
    title: "¿Qué suele hacerte abandonar una rutina?",
    helper: "Tu plan incluirá una estrategia simple para este punto de fricción.",
    options: [
      { label: "Pierdo la motivación", sub: "Empiezo animada y después me desconecto" },
      { label: "No tengo tiempo", sub: "Trabajo, casa o familia ocupan mi día" },
      { label: "No sé si lo hago bien", sub: "Me falta una guía visual y progresiva" },
      { label: "No veo cambios rápidos", sub: "Me cuesta reconocer avances pequeños" },
    ],
  },
  {
    kind: "question",
    n: 13,
    phase: "Tu perfil",
    eyebrow: "Último paso",
    title: "¿Cómo quieres empezar tu nueva rutina?",
    options: [
      { label: "Con energía y un plan claro", sub: "Quiero saber qué hacer desde el primer día" },
      { label: "A mi ritmo, pero sin parar", sub: "Quiero constancia sin presión innecesaria" },
      { label: "Con un desafío que me motive", sub: "Estoy lista para celebrar cada avance" },
    ],
  },
];

function SoundControl() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("quiz-ui-sounds");
    const shouldEnable = stored !== "off";
    uiSoundsEnabled = shouldEnable;
    setEnabled(shouldEnable);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element ? event.target.closest<HTMLElement>("button, a") : null;
      if (!target || target.dataset.sound === "none" || target.matches(":disabled")) return;

      if (target.classList.contains("option-card") || target.classList.contains("age-option")) {
        playUiSound("select");
      } else if (target.classList.contains("back-button")) {
        playUiSound("back");
      } else if (target.classList.contains("cta-button")) {
        playUiSound("success");
      } else {
        playUiSound("click");
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [enabled]);

  const toggleSounds = () => {
    const next = !enabled;
    uiSoundsEnabled = next;
    setEnabled(next);
    window.localStorage.setItem("quiz-ui-sounds", next ? "on" : "off");
    if (next) playUiSound("select");
  };

  return (
    <button
      type="button"
      data-sound="none"
      onClick={toggleSounds}
      className={`sound-control ${enabled ? "is-enabled" : ""}`}
      aria-label={enabled ? "Silenciar sonidos" : "Activar sonidos"}
      aria-pressed={enabled}
      title={enabled ? "Silenciar sonidos" : "Activar sonidos"}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      <span>{enabled ? "Sonido" : "Silencio"}</span>
      <i aria-hidden="true" />
    </button>
  );
}

function Index() {
  const [screen, setScreen] = useState<Screen>({ kind: "landing" });
  const [history, setHistory] = useState<Screen[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (screen.kind === "question") {
      trackQuizProgress(screen.n, screen.title);
    } else if (screen.kind === "final") {
      const goal = profileData.goals[answers[11] ?? 0];
      const obstacle = profileData.obstacles[answers[12] ?? 0];
      const age = profileData.ages[answers[9] ?? 1];
      const time = profileData.times[answers[6] ?? 0];

      trackQuizComplete({
        user_goal: goal,
        user_obstacle: obstacle,
        user_age: age,
        user_time: time,
      });
    } else {
      trackViewContent(screen.kind);
    }
  }, [screen, answers]);

  const go = (next: Screen) => {
    setHistory((items) => [...items, screen]);
    setScreen(next);
  };

  const back = () => {
    if (transitioning) return;
    const previous = history.at(-1);
    if (previous) {
      setScreen(previous);
      setHistory((items) => items.slice(0, -1));
    }
  };

  const selectAnswer = (question: Question, optionIndex: number) => {
    if (transitioning) return;
    setTransitioning(true);
    const selectedOption = question.options[optionIndex]?.label || "";
    trackQuizAnswer(question.n, question.title, selectedOption);

    setAnswers((current) => ({ ...current, [question.n]: optionIndex }));
    window.setTimeout(() => {
      setTransitioning(false);
      if (question.n === 8) go({ kind: "info" });
      else if (question.n === 13) go({ kind: "analyzing" });
      else go(questions[question.n]);
    }, 520);
  };

  const isWide = screen.kind === "landing" || screen.kind === "coach" || screen.kind === "final";

  return (
    <main className="quiz-canvas min-h-screen overflow-hidden text-foreground selection:bg-[color:var(--coral)] selection:text-white">
      <SoundControl />
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-two" aria-hidden="true" />
      <div
        className={`relative z-10 mx-auto w-full px-4 pb-16 pt-4 sm:px-6 sm:pt-7 ${isWide ? "max-w-[1080px]" : "max-w-[640px]"}`}
      >
        {screen.kind === "landing" && <Landing onStart={() => go({ kind: "coach" })} />}
        {screen.kind === "coach" && <CoachScreen onBack={back} onNext={() => go(questions[0])} />}
        {screen.kind === "question" && (
          <QuestionScreen
            key={screen.n}
            q={screen}
            selected={answers[screen.n]}
            transitioning={transitioning}
            onBack={back}
            onSelect={(index) => selectAnswer(screen, index)}
          />
        )}
        {screen.kind === "info" && (
          <InfoScreen onBack={back} onNext={() => go({ kind: "result" })} />
        )}
        {screen.kind === "result" && (
          <ResultScreen answers={answers} onNext={() => go(questions[8])} />
        )}
        {screen.kind === "analyzing" && (
          <AnalyzingScreen answers={answers} onDone={() => go({ kind: "coupon" })} />
        )}
        {screen.kind === "coupon" && (
          <ScratchCouponScreen onBack={back} onContinue={() => go({ kind: "final" })} />
        )}
        {screen.kind === "final" && <FinalScreen answers={answers} />}
      </div>
    </main>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2 text-left">
      <span className="brand-mark">
        <TrendingUp size={18} strokeWidth={3} />
      </span>
      <span className="leading-none">
        <span className="block font-display text-sm font-black uppercase tracking-[-0.03em] text-[color:var(--wine)]">
          Método
        </span>
        <span className="block text-[9px] font-black uppercase tracking-[0.19em] text-[color:var(--coral)]">
          Brasileño 28
        </span>
      </span>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  className = "",
}: Readonly<{
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}>) {
  return (
    <button onClick={onClick} className={`cta-button group ${className}`}>
      <span>{children}</span>
      <ChevronRight
        className="transition-transform duration-300 group-hover:translate-x-1"
        size={20}
      />
      <span className="button-sheen" aria-hidden="true" />
    </button>
  );
}

function Landing({ onStart }: Readonly<{ onStart: () => void }>) {
  return (
    <section className="screen-enter">
      <header className="mb-6 flex items-center justify-between sm:mb-8">
        <BrandMark />
        <div className="flex items-center gap-1.5 rounded-full border border-[color:var(--wine)]/10 bg-white/65 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[color:var(--wine)] backdrop-blur-xl">
          <Clock3 size={13} className="text-[color:var(--coral)]" /> 60 segundos
        </div>
      </header>

      <div className="grid items-center gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <div className="text-left lg:py-7">
          <div className="eyebrow-pill">
            <Sparkles size={14} /> Evaluación gratuita y personalizada
          </div>
          <h1 className="mt-5 font-display text-[2.55rem] font-black leading-[0.94] tracking-[-0.055em] text-[color:var(--wine)] sm:text-6xl">
            <span>Menos excusas.</span>
            <span className="mt-1 block text-[color:var(--coral)]">Más fuerza y curva.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] font-medium leading-7 text-[color:var(--ink-muted)] sm:text-lg">
            Descubre una ruta de 28 días para activar y fortalecer tus glúteos en casa, adaptada a
            tu tiempo, tu nivel y el resultado que quieres ver.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2.5">
            <MiniBenefit icon={<Clock3 size={17} />} title="Desde 8 min" text="por sesión" />
            <MiniBenefit icon={<Dumbbell size={17} />} title="En casa" text="sin máquinas" />
            <MiniBenefit icon={<Target size={17} />} title="A tu medida" text="paso a paso" />
          </div>

          <PrimaryButton onClick={onStart} className="mt-6 sm:max-w-md">
            Crear mi ruta personalizada
          </PrimaryButton>
          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[color:var(--ink-muted)]">
            <LockKeyhole size={14} className="text-[color:var(--coral)]" /> Sin registro. Tus
            respuestas permanecen en este dispositivo.
          </p>
        </div>

        <div className="hero-frame">
          <img
            src={coachDuo}
            alt="Entrenadores presentando el desafío de glúteos"
            width={720}
            height={889}
            className="hero-image h-full w-full object-cover"
          />
          <div className="hero-vignette" aria-hidden="true" />
          <div className="hero-note hero-note-top">
            <CirclePlay size={17} fill="currentColor" /> Guía visual
          </div>
          <div className="hero-note hero-note-bottom">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--lime)] text-[color:var(--wine)]">
              <Zap size={18} fill="currentColor" />
            </span>
            <span>
              <strong className="block text-sm text-white">Tu plan empieza contigo</strong>
              <span className="text-[11px] text-white/70">Hábitos posibles, progreso real</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniBenefit({
  icon,
  title,
  text,
}: Readonly<{ icon: ReactNode; title: string; text: string }>) {
  return (
    <div className="mini-benefit">
      <span className="text-[color:var(--coral)]">{icon}</span>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function CoachScreen({ onBack, onNext }: Readonly<{ onBack: () => void; onNext: () => void }>) {
  return (
    <section className="screen-enter">
      <SimpleTopbar onBack={onBack} label="Antes de empezar" />
      <div className="mt-6 grid items-center gap-7 lg:grid-cols-2 lg:gap-12">
        <div className="relative order-2 lg:order-1">
          <div className="coach-collage">
            <img
              src={coachPortrait}
              alt="Coach Luca presentando el método"
              className="coach-main coach-portrait-main"
            />
            <div
              role="img"
              aria-label="Coach Luca analizando el plan de entrenamiento"
              className="coach-secondary coach-luca-crop"
              style={{ backgroundImage: `url(${coachOffice})` }}
            />
            <div className="coach-badge">
              <BadgeCheck size={18} /> Método guiado
            </div>
          </div>
        </div>
        <div className="order-1 text-left lg:order-2">
          <div className="eyebrow-pill">
            <Heart size={14} /> Acompañamiento, no presión
          </div>
          <h2 className="mt-4 font-display text-4xl font-black leading-[1] tracking-[-0.045em] text-[color:var(--wine)] sm:text-5xl">
            Un plan que cabe en tu vida.
          </h2>
          <p className="mt-4 text-[15px] font-medium leading-7 text-[color:var(--ink-muted)]">
            La propuesta de Coach Luca combina activación, control y progresión. Cada sesión te
            muestra qué hacer, cómo hacerlo y cuándo avanzar, sin depender de un gimnasio.
          </p>
          <div className="mt-5 space-y-3">
            <CoachPoint
              icon={<CirclePlay size={18} />}
              title="Demostraciones claras"
              text="Mira el movimiento y acompaña el ritmo."
            />
            <CoachPoint
              icon={<CalendarDays size={18} />}
              title="Secuencia de 28 días"
              text="Abre el día, entrena y marca tu avance."
            />
            <CoachPoint
              icon={<TrendingUp size={18} />}
              title="Progresión accesible"
              text="Empieza donde estás y evoluciona sin compararte."
            />
          </div>
          <PrimaryButton onClick={onNext} className="mt-6">
            Descubrir mi punto de partida
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

function CoachPoint({
  icon,
  title,
  text,
}: Readonly<{ icon: ReactNode; title: string; text: string }>) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--wine)]/8 bg-white/55 p-3.5 backdrop-blur-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--coral-soft)] text-[color:var(--coral)]">
        {icon}
      </span>
      <span>
        <strong className="block text-sm text-[color:var(--wine)]">{title}</strong>
        <span className="text-xs text-[color:var(--ink-muted)]">{text}</span>
      </span>
    </div>
  );
}

function SimpleTopbar({ onBack, label }: Readonly<{ onBack: () => void; label: string }>) {
  return (
    <div className="flex items-center justify-between">
      <button onClick={onBack} className="back-button" aria-label="Volver">
        <ArrowLeft size={18} />
      </button>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
        {label}
      </span>
      <BrandMark />
    </div>
  );
}

function QuestionScreen({
  q,
  selected,
  transitioning,
  onBack,
  onSelect,
}: Readonly<{
  q: Question;
  selected: number | undefined;
  transitioning: boolean;
  onBack: () => void;
  onSelect: (index: number) => void;
}>) {
  const progress = (q.n / TOTAL) * 100;
  let milestone = "Afinando tu plan";
  if (q.n <= 3) {
    milestone = "Conociéndote";
  } else if (q.n <= 8) {
    milestone = "Diseñando tu rutina";
  }

  return (
    <section className="screen-enter">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="back-button" aria-label="Volver">
          <ArrowLeft size={18} />
        </button>
        <BrandMark />
        <span className="rounded-full bg-[color:var(--wine)] px-3 py-2 text-[10px] font-black tabular-nums tracking-[0.12em] text-white">
          {q.n}/{TOTAL}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--coral)]">
              {q.phase}
            </span>
            <p className="mt-0.5 text-xs font-bold text-[color:var(--wine)]">{milestone}</p>
          </div>
          <span className="text-[11px] font-black tabular-nums text-[color:var(--ink-muted)]">
            {Math.round(progress)}% completo
          </span>
        </div>
        <div className="progress-track mt-2.5">
          <div className="progress-fill" style={{ width: `${progress}%` }}>
            <span />
          </div>
        </div>
        <div className="mt-2 flex justify-between" aria-hidden="true">
          {[23, 62, 100].map((point) => (
            <span key={point} className={`progress-dot ${progress >= point ? "is-active" : ""}`} />
          ))}
        </div>
      </div>

      <div className="mt-7 text-left">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--coral)]">
          {q.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-[1.85rem] font-black leading-[1.02] tracking-[-0.045em] text-[color:var(--wine)] sm:text-4xl">
          {q.title}
        </h1>
        {q.helper ? (
          <p className="helper-note">
            <Sparkles size={15} /> <span>{q.helper}</span>
          </p>
        ) : (
          <p className="mt-3 text-sm font-medium text-[color:var(--ink-muted)]">
            Elige la opción que más se parece a ti.
          </p>
        )}
      </div>

      <div
        className={`mt-6 grid gap-3 ${q.grid ? "grid-cols-2" : "grid-cols-1"}`}
        role="radiogroup"
        aria-label={q.title}
      >
        {q.options.map((option, index) => (
          <OptionButton
            key={option.label}
            option={option}
            index={index}
            selected={selected === index}
            grid={Boolean(q.grid)}
            disabled={transitioning}
            delay={index * 70}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>

      <p
        className={`mt-5 flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 ${selected !== undefined ? "translate-y-0 opacity-100 text-[color:var(--coral)]" : "translate-y-1 opacity-0"}`}
        aria-live="polite"
      >
        <Check size={15} strokeWidth={3} /> Respuesta guardada. Preparando el siguiente paso...
      </p>
    </section>
  );
}

function OptionButton({
  option,
  index,
  selected,
  grid,
  disabled,
  delay,
  onClick,
}: Readonly<{
  option: Option;
  index: number;
  selected: boolean;
  grid: boolean;
  disabled: boolean;
  delay: number;
  onClick: () => void;
}>) {
  if (grid && option.image) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        role="radio"
        aria-checked={selected}
        className={`age-option option-reveal group ${selected ? "is-selected" : ""}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="relative overflow-hidden">
          <img
            src={option.image}
            alt=""
            className="aspect-[4/4.4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--wine)]/70 via-transparent to-transparent" />
          <span className={`option-check absolute right-3 top-3 ${selected ? "is-selected" : ""}`}>
            {selected && <Check size={14} strokeWidth={3} />}
          </span>
          <strong className="absolute bottom-3 left-3 right-3 text-left font-display text-base font-black text-white">
            {option.label}
          </strong>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      role="radio"
      aria-checked={selected}
      className={`option-card option-reveal group ${selected ? "is-selected" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="option-letter">{String.fromCodePoint(65 + index)}</span>
      <span className="min-w-0 flex-1 text-left">
        <strong className="block text-[14px] font-extrabold leading-snug text-[color:var(--wine)] sm:text-[15px]">
          {option.label}
        </strong>
        {option.sub && (
          <span className="mt-1 block text-xs font-medium leading-relaxed text-[color:var(--ink-muted)]">
            {option.sub}
          </span>
        )}
      </span>
      <span className={`option-check ${selected ? "is-selected" : ""}`}>
        {selected && <Check size={14} strokeWidth={3} />}
      </span>
    </button>
  );
}

function InfoScreen({ onBack, onNext }: Readonly<{ onBack: () => void; onNext: () => void }>) {
  const fullTitle = "Primero activa. Después fortalece.";
  const fullBody =
    "Cuando pasamos muchas horas sentadas, es común compensar algunos ejercicios con muslos o zona lumbar. Por eso el método empieza con movimientos lentos y controlados para mejorar tu conexión mente-músculo.";

  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedBody, setDisplayedBody] = useState("");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);

  const finishGeneration = () => {
    setDisplayedTitle(fullTitle);
    setDisplayedBody(fullBody);
    setVisibleSteps(3);
    setIsGenerating(false);
  };

  useEffect(() => {
    let titleIdx = 0;
    let bodyIdx = 0;
    let animationActive = true;

    // Fase 1: Escrever Título
    const titleInterval = setInterval(() => {
      if (!animationActive) return;
      if (titleIdx < fullTitle.length) {
        titleIdx++;
        setDisplayedTitle(fullTitle.slice(0, titleIdx));
      } else {
        clearInterval(titleInterval);

        // Fase 2: Escrever Corpo do Texto
        const bodyInterval = setInterval(() => {
          if (!animationActive) return;
          if (bodyIdx < fullBody.length) {
            bodyIdx++;
            const currentText = fullBody.slice(0, bodyIdx);
            setDisplayedBody(currentText);

            // Desbloqueio progressivo dos passos (cards 01, 02, 03)
            const progress = bodyIdx / fullBody.length;
            if (progress >= 0.22 && progress < 0.58) {
              setVisibleSteps(1);
            } else if (progress >= 0.58 && progress < 0.92) {
              setVisibleSteps(2);
            } else if (progress >= 0.92) {
              setVisibleSteps(3);
            }
          } else {
            clearInterval(bodyInterval);
            setIsGenerating(false);
          }
        }, 18);
      }
    }, 28);

    return () => {
      animationActive = false;
      clearInterval(titleInterval);
    };
  }, []);

  return (
    <section className="dark-panel screen-enter relative overflow-hidden">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="back-button back-button-dark" aria-label="Volver">
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {isGenerating ? (
            <button
              onClick={finishGeneration}
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--lime)]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[color:var(--lime)] border border-[color:var(--lime)]/40 backdrop-blur-md transition-all hover:bg-[color:var(--lime)]/25 active:scale-95"
            >
              <Sparkles size={12} className="animate-spin text-[color:var(--lime)]" />
              <span>Generando... (Saltar)</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 border border-white/15">
              <BadgeCheck size={12} className="text-[color:var(--lime)]" />
              <span>Método personalizad</span>
            </span>
          )}
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--coral)] text-white shadow-md shadow-coral/30">
          <Zap size={17} fill="currentColor" />
        </span>
      </div>

      <div
        className={`activation-visual transition-all duration-700 ${
          isGenerating ? "is-generating scale-105" : ""
        }`}
        aria-hidden="true"
      >
        <span className="activation-ring ring-one" />
        <span className="activation-ring ring-two" />
        <span
          className={`activation-core transition-transform duration-500 ${
            isGenerating ? "animate-pulse shadow-[0_0_40px_var(--lime)]" : ""
          }`}
        >
          <Zap size={31} fill="currentColor" />
        </span>
        <span className="activation-line line-one" />
        <span className="activation-line line-two" />

        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-32 w-32 rounded-full border border-[color:var(--lime)]/30 animate-ping" />
          </div>
        )}
      </div>

      <div className="mt-5 text-left min-h-[140px]">
        <div className="flex items-center gap-2">
          <span className="dark-eyebrow">Lo que cambia el juego</span>
          {isGenerating && (
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--lime)] animate-ping" />
          )}
        </div>

        <h2 className="mt-3 font-display text-3xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-4xl">
          {displayedTitle}
          {isGenerating && displayedTitle.length < fullTitle.length && (
            <span className="inline-block w-2.5 h-7 ml-1 bg-[color:var(--lime)] animate-pulse align-middle" />
          )}
        </h2>

        <p className="mt-4 text-sm font-medium leading-6 text-white/80 transition-all">
          {displayedBody}
          {isGenerating && displayedTitle.length >= fullTitle.length && (
            <span className="inline-block w-2 h-4 ml-0.5 bg-[color:var(--lime)] animate-pulse align-middle" />
          )}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <ScienceStep
          number="01"
          title="Conectar"
          text="Aprendes a sentir el músculo trabajando."
          isVisible={visibleSteps >= 1}
          isNew={visibleSteps === 1 && isGenerating}
        />
        <ScienceStep
          number="02"
          title="Controlar"
          text="Mejoras técnica, ritmo y amplitud."
          isVisible={visibleSteps >= 2}
          isNew={visibleSteps === 2 && isGenerating}
        />
        <ScienceStep
          number="03"
          title="Progresar"
          text="Aumentas el desafío poco a poco."
          isVisible={visibleSteps >= 3}
          isNew={visibleSteps === 3 && isGenerating}
        />
      </div>

      <div
        className={`transition-all duration-500 transform ${
          visibleSteps >= 3
            ? "opacity-100 translate-y-0"
            : "opacity-40 translate-y-2 pointer-events-none"
        }`}
      >
        <button onClick={onNext} className="cta-button cta-light group mt-7">
          <span>Ver lo que ya descubrimos</span>
          <ChevronRight size={20} />
          <span className="button-sheen" aria-hidden="true" />
        </button>
        <p className="mt-3 text-center text-[10px] font-semibold leading-4 text-white/45">
          Los resultados varían según constancia, técnica, descanso y características individuales.
        </p>
      </div>
    </section>
  );
}

function ScienceStep({
  number,
  title,
  text,
  isVisible = true,
  isNew = false,
}: Readonly<{
  number: string;
  title: string;
  text: string;
  isVisible?: boolean;
  isNew?: boolean;
}>) {
  if (!isVisible) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left opacity-30 h-[92px] flex items-center justify-center border-dashed">
        <span className="text-[11px] text-white/30 font-mono animate-pulse">
          Generando {number}...
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-4 text-left transition-all duration-500 transform ${
        isNew
          ? "border-[color:var(--lime)] bg-[color:var(--lime)]/15 scale-102 shadow-[0_0_20px_oklch(0.9_0.28_128/0.3)] animate-bounce-subtle"
          : "border-white/10 bg-white/[0.06] scale-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black tracking-[0.2em] text-[color:var(--lime)]">
          {number}
        </span>
        {isNew && <Sparkles size={12} className="text-[color:var(--lime)] animate-spin" />}
      </div>
      <strong className="mt-2 block font-display text-lg font-black text-white">{title}</strong>
      <p className="mt-1 text-xs leading-5 text-white/65">{text}</p>
    </div>
  );
}

function ResultScreen({
  answers,
  onNext,
}: Readonly<{
  answers: Record<number, number>;
  onNext: () => void;
}>) {
  const time = ["8-10 min", "10-15 min", "20+ min"][answers[6] ?? 0];
  const frequency = ["3 días", "4-5 días", "6 días"][answers[7] ?? 1];

  return (
    <section className="result-panel screen-enter text-left">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--lime)] text-[color:var(--wine)] shadow-[0_0_0_12px_oklch(0.88_0.18_120/0.12)]">
        <Check size={30} strokeWidth={3} />
      </div>
      <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--coral)]">
        Primer bloque completado
      </p>
      <h2 className="mx-auto mt-2 max-w-md text-center font-display text-3xl font-black leading-[1] tracking-[-0.045em] text-white">
        Tu rutina necesita ser breve, guiada y progresiva.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-white/60">
        Eso aumenta la posibilidad de que el entrenamiento se convierta en un hábito, no en otra
        tarea pendiente.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <ResultMetric label="Tiempo por sesión" value={time} icon={<Clock3 size={18} />} />
        <ResultMetric label="Ritmo semanal" value={frequency} icon={<CalendarDays size={18} />} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--coral)]/15 text-[color:var(--coral)]">
            <Target size={19} />
          </span>
          <div>
            <strong className="text-sm text-white">Recomendación inicial</strong>
            <p className="mt-1 text-xs leading-5 text-white/58">
              Alternar activación, fuerza y recuperación para que puedas evolucionar sin sobrecargar
              la zona lumbar.
            </p>
          </div>
        </div>
      </div>

      <button onClick={onNext} className="cta-button group mt-6">
        <span>Personalizar la siguiente fase</span>
        <ChevronRight size={20} />
        <span className="button-sheen" aria-hidden="true" />
      </button>
    </section>
  );
}

function ResultMetric({
  label,
  value,
  icon,
}: Readonly<{ label: string; value: string; icon: ReactNode }>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <span className="text-[color:var(--lime)]">{icon}</span>
      <span className="mt-3 block text-[9px] font-black uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>
      <strong className="mt-1 block font-display text-lg font-black text-white">{value}</strong>
    </div>
  );
}

function AnalyzingScreen({
  answers,
  onDone,
}: Readonly<{
  answers: Record<number, number>;
  onDone: () => void;
}>) {
  const goal = ["elevación", "curvas", "definición", "confianza"][answers[11] ?? 0];
  const steps = [
    `Priorizando ${goal} en tu ruta`,
    "Ajustando duración y frecuencia",
    "Preparando progresiones semanales",
    "Añadiendo estrategia de constancia",
  ];
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (completed >= steps.length) {
      const timer = window.setTimeout(onDone, 700);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setCompleted((value) => value + 1), 780);
    return () => window.clearTimeout(timer);
  }, [completed, onDone, steps.length]);

  return (
    <section className="analysis-panel screen-enter">
      <div className="analysis-orbit">
        <span />
        <Sparkles size={28} />
      </div>
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--coral)]">
        Análisis en curso
      </p>
      <h2 className="mt-2 font-display text-3xl font-black leading-none tracking-[-0.045em] text-[color:var(--wine)]">
        Construyendo tu ruta de 28 días
      </h2>
      <p className="mt-3 text-sm text-[color:var(--ink-muted)]">
        Cruzando tus respuestas para organizar una recomendación práctica.
      </p>

      <div className="mt-7 space-y-3 text-left">
        {steps.map((step, index) => {
          const done = index < completed;
          const active = index === completed;
          return (
            <div
              key={step}
              className={`analysis-step ${done ? "is-done" : ""} ${active ? "is-active" : ""}`}
            >
              <span className="analysis-check">
                {done ? <Check size={14} strokeWidth={3} /> : index + 1}
              </span>
              <span className="flex-1 text-xs font-extrabold">{step}</span>
              {active && (
                <span className="typing-dots">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="progress-track mt-6">
        <div className="progress-fill" style={{ width: `${(completed / steps.length) * 100}%` }} />
      </div>
      <p className="mt-3 text-[11px] font-bold tabular-nums text-[color:var(--ink-muted)]">
        {Math.round((completed / steps.length) * 100)}% procesado
      </p>
    </section>
  );
}

function ScratchCouponScreen({
  onBack,
  onContinue,
}: Readonly<{
  onBack: () => void;
  onContinue: () => void;
}>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const moveCountRef = useRef(0);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const revealCoupon = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    playUiSound("success");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * pixelRatio);
    canvas.height = Math.round(rect.height * pixelRatio);

    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(pixelRatio, pixelRatio);

    const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#ff2fb3");
    gradient.addColorStop(0.5, "#a735ff");
    gradient.addColorStop(1, "#5914b8");
    context.fillStyle = gradient;
    context.fillRect(0, 0, rect.width, rect.height);

    context.globalAlpha = 0.12;
    context.fillStyle = "#ffffff";
    for (let x = -rect.height; x < rect.width + rect.height; x += 34) {
      context.save();
      context.translate(x, 0);
      context.rotate(Math.PI / 4);
      context.fillRect(0, -rect.height, 9, rect.height * 3);
      context.restore();
    }
    context.globalAlpha = 1;

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#ffffff";
    context.font = `800 ${Math.min(18, rect.width / 19)}px DM Sans, sans-serif`;
    context.fillText("DESLIZA PARA RASPAR", rect.width / 2, rect.height / 2 - 8);
    context.globalAlpha = 0.7;
    context.font = `700 ${Math.min(11, rect.width / 31)}px DM Sans, sans-serif`;
    context.fillText("TU RECOMPENSA ESTÁ DEBAJO", rect.width / 2, rect.height / 2 + 20);
    context.globalAlpha = 1;
  }, []);

  const checkRevealProgress = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    let sampled = 0;
    const sampleEvery = 18 * 4;
    for (let index = 3; index < pixels.length; index += sampleEvery) {
      sampled += 1;
      if (pixels[index] < 40) transparent += 1;
    }
    if (transparent / sampled > 0.36) revealCoupon();
  };

  const scratch = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || revealed) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const pixelRatio = canvas.width / rect.width;
    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 46;
    context.beginPath();
    const previous = lastPointRef.current ?? point;
    context.moveTo(previous.x, previous.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.beginPath();
    context.arc(point.x, point.y, 23, 0, Math.PI * 2);
    context.fill();
    lastPointRef.current = point;

    moveCountRef.current += 1;
    if (moveCountRef.current % Math.max(3, Math.round(6 / pixelRatio)) === 0) {
      checkRevealProgress();
    }
  };

  const startScratch = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratch(event);
  };

  const stopScratch = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
    checkRevealProgress();
  };

  return (
    <section className="coupon-panel screen-enter">
      <SimpleTopbar onBack={onBack} label="Recompensa desbloqueada" />

      <div className="coupon-heading mt-8 text-center">
        <span className="coupon-gift">
          <Gift size={27} />
          <i />
        </span>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--coral)]">
          Por completar las 13 respuestas
        </p>
        <h1 className="mt-2 font-display text-4xl font-black leading-[0.96] tracking-[-0.05em] text-[color:var(--wine)] sm:text-5xl">
          Hay un regalo reservado para ti.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-6 text-[color:var(--ink-muted)]">
          Raspa la tarjeta con el dedo o el mouse para descubrir tu descuento antes de ver tu plan.
        </p>
      </div>

      <div className={`scratch-wrap mt-7 ${revealed ? "is-revealed" : ""}`}>
        <div className="coupon-reveal" aria-live="polite">
          <span className="coupon-ticket-icon">
            <TicketPercent size={24} />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--coral)]">
            Cupón exclusivo desbloqueado
          </span>
          <strong className="mt-1 font-display text-6xl font-black tracking-[-0.07em] text-[color:var(--wine)]">
            90% OFF
          </strong>
          <span className="mt-2 rounded-full border border-dashed border-[color:var(--wine)]/25 bg-white/55 px-4 py-2 font-mono text-sm font-black tracking-[0.18em] text-[color:var(--wine)]">
            BUMBUM90
          </span>
        </div>
        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          aria-label="Raspa esta tarjeta para revelar tu descuento"
          onPointerDown={startScratch}
          onPointerMove={scratch}
          onPointerUp={stopScratch}
          onPointerCancel={stopScratch}
          onPointerLeave={stopScratch}
        />
        {revealed && (
          <div className="coupon-confetti" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => (
              <i
                key={index}
                style={{
                  left: `${8 + ((index * 29) % 84)}%`,
                  animationDelay: `${(index % 6) * 75}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {!revealed ? (
        <button data-sound="none" className="coupon-fallback mt-4" onClick={revealCoupon}>
          No puedo raspar, revelar mi cupón
        </button>
      ) : (
        <output className="coupon-success mt-5">
          <span>
            <Check size={16} strokeWidth={3} />
          </span>
          <p>
            <strong>¡Descuento aplicado!</strong> Verás el valor final en la siguiente página.
          </p>
        </output>
      )}

      <button
        onClick={onContinue}
        disabled={!revealed}
        className={`cta-button group mt-6 ${revealed ? "coupon-cta-ready" : "coupon-cta-locked"}`}
      >
        <span>
          {revealed ? "Aplicar 90% OFF y ver mi plan" : "Raspa para liberar tu descuento"}
        </span>
        {revealed ? <ChevronRight size={20} /> : <LockKeyhole size={18} />}
        <span className="button-sheen" aria-hidden="true" />
      </button>
      <p className="mt-3 text-center text-[10px] font-semibold text-[color:var(--ink-muted)]">
        El cupón se aplica automáticamente en esta experiencia.
      </p>
    </section>
  );
}

const profileData = {
  goals: [
    "Elevar y ganar firmeza",
    "Construir curvas redondeadas",
    "Definir y tonificar",
    "Reconectar con tu cuerpo",
  ],
  obstacles: [
    "Motivación",
    "Falta de tiempo",
    "Inseguridad con la técnica",
    "Impaciencia con resultados",
  ],
  ages: ["18-29 años", "30-39 años", "40-49 años", "50+ años"],
  times: ["8-10 min", "10-15 min", "20+ min"],
};

function FinalScreen({ answers }: Readonly<{ answers: Record<number, number> }>) {
  const [showPitch, setShowPitch] = useState(true);
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const offerSectionRef = useRef<HTMLDivElement>(null);

  const goal = profileData.goals[answers[11] ?? 0];
  const obstacle = profileData.obstacles[answers[12] ?? 0];
  const age = profileData.ages[answers[9] ?? 1];
  const time = profileData.times[answers[6] ?? 0];

  useEffect(() => {
    trackViewContent("Quiz Final VSL Screen", {
      video_src: "/vsl-video.mp4",
      user_goal: goal,
      user_obstacle: obstacle,
      user_age: age,
      user_time: time,
      price: 9.9,
      currency: "USD",
    });

    const handleScroll = () => {
      if (offerSectionRef.current) {
        const rect = offerSectionRef.current.getBoundingClientRect();
        setShowFloatingCta(window.scrollY > 650 && rect.bottom > 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [goal, obstacle, age, time]);

  const handleCtaClick = (location: string) => {
    trackVslCtaClick(location);
    const checkoutUrl = getDecoratedCheckoutUrl(CHECKOUT_URL);
    window.location.href = checkoutUrl;
  };

  const handleVideoPitchReached = () => {
    setShowPitch(true);
  };

  return (
    <section className="screen-enter pb-24 sm:pb-12 text-[color:var(--wine)]">
      {/* Header with live status and 90% discount pill */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
        <BrandMark />
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--wine)] px-3 py-1.5 text-[10px] font-black uppercase text-white shadow-sm">
            <span className="vsl-pulse-dot" />
            <LiveViewerCounter />
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[color:var(--lime)] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--wine)] shadow-sm">
            <TicketPercent size={13} strokeWidth={3} /> 90% APLICADO ($9.90 USD)
          </span>
        </div>
      </header>

      {/* Personalized Hero banner reflecting their quiz answers */}
      <div className="final-hero mt-6">
        <div className="relative z-10 text-left">
          <span className="dark-eyebrow">Tu ruta personalizada de 28 días</span>
          <h1 className="mt-3 max-w-2xl font-display text-[2.2rem] font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl">
            Tu transformación cabe en{" "}
            <span className="text-[color:var(--lime)]">{time} al día.</span>
          </h1>
          <p className="mt-3 max-w-xl text-xs sm:text-sm font-medium leading-relaxed text-white/75">
            Ruta diseñada para <strong className="text-white">{goal.toLowerCase()}</strong>{" "}
            eliminando tu principal obstáculo:{" "}
            <strong className="text-white">{obstacle.toLowerCase()}</strong>.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ProfileTag icon={<Target size={14} />} text={goal} />
            <ProfileTag icon={<Clock3 size={14} />} text={`${time} por sesión`} />
            <ProfileTag icon={<CalendarDays size={14} />} text={age} />
          </div>
        </div>
        <div className="final-hero-orb" aria-hidden="true">
          <span>28</span>
          <small>días</small>
        </div>
      </div>

      {/* Headline for Video */}
      <div className="mt-8 text-center">
        <span className="eyebrow-pill mb-2">
          <Sparkles size={13} className="text-[color:var(--coral)]" />
          PRESENTACIÓN EN VIDEO DE TU RUTA
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[color:var(--wine)]">
          Mira Este Breve Video Para Desbloquear Tu Plan
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
          Aprende cómo activar las 3 porciones del glúteo en 15 minutos en casa sin dolor de
          rodillas.
        </p>
      </div>

      {/* 3x4 VSL Video Player with Smart Psychological Progress Bar */}
      <div className="mt-6">
        <VslQuizPlayer src="/vsl-video.mp4" onPitchReached={handleVideoPitchReached} />
      </div>

      {/* Full Pitch / Offer Section */}
      {showPitch && (
        <div ref={offerSectionRef} className="mt-12 animate-fade-in space-y-12">
          {/* Main $9.90 USD Offer Card */}
          <VslQuizOfferCard onCtaClick={handleCtaClick} />

          {/* Itemized Value Breakdown */}
          <VslQuizIncludedSummary />

          {/* 4-Week Roadmap */}
          <VslQuizRoadmap />

          {/* 4 Free Bonuses */}
          <VslQuizBonuses />

          {/* Comparison Table */}
          <VslQuizComparisonTable />

          {/* Real Transformations with Student Photos */}
          <VslQuizSocialProof />

          {/* Target Audience Guide */}
          <VslQuizTargetAudience />

          {/* 3-Pillar Method & Coaches Authority */}
          <VslQuizMethodAndCoaches />

          {/* 7-Day Money-Back Guarantee Seal */}
          <VslQuizGuarantee onCtaClick={() => handleCtaClick("quiz_guarantee_cta")} />

          {/* Secondary Urgency CTA Banner */}
          <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-white/85 p-6 text-center shadow-[6px_6px_0_var(--wine)] backdrop-blur-md md:p-10">
            <span className="vsl-offer-badge mb-3">🔥 CUPÓN ACTIVO: 90% DE DESCUENTO</span>
            <h2 className="font-display text-2xl font-black text-[color:var(--wine)] md:text-3xl">
              ¿Lista para transformar tu silueta en 28 días?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[color:var(--ink-muted)]">
              Accede de por vida al Desafío Glúteos Brasileños + 4 bonos de regalo por un único pago
              de solo <strong className="text-[color:var(--coral)]">$9.90 USD</strong>.
            </p>

            <div className="mx-auto mt-6 max-w-lg">
              <button
                type="button"
                onClick={() => handleCtaClick("quiz_secondary_cta")}
                className="cta-button text-base font-black tracking-wider text-white shadow-xl hover:scale-[1.02]"
              >
                <span className="button-sheen" />
                <span className="flex items-center justify-center gap-2">
                  ¡QUIERO MI PLAN COMPLETO POR $9.90!
                  <ArrowRight size={20} />
                </span>
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[color:var(--ink-muted)]">
              <span className="flex items-center gap-1">
                <ShieldCheck size={16} className="text-emerald-600" /> Garantía de 7 días
              </span>
              <span className="flex items-center gap-1">
                <Lock size={15} className="text-emerald-600" /> Pago 100% Encriptado
              </span>
              <span className="flex items-center gap-1">
                <Sparkles size={15} className="text-[color:var(--coral)]" /> Acceso De Por Vida
              </span>
            </div>
          </div>

          {/* Extended FAQ Accordion */}
          <VslQuizFaq openFaq={openFaq} setOpenFaq={setOpenFaq} />
        </div>
      )}

      {/* Floating Sticky Bottom CTA on scroll ($9.90 USD) */}
      {showFloatingCta && showPitch && (
        <div className="vsl-floating-bottom-cta">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <div className="hidden sm:block text-left text-white">
              <p className="text-xs font-bold text-[color:var(--lime)]">90% OFF APLICADO</p>
              <p className="text-sm font-black">
                Desafío Glúteos 28 Días —{" "}
                <span className="text-[color:var(--shock-yellow)]">$9.90 USD</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCtaClick("quiz_floating_cta")}
              className="cta-button min-h-[3.2rem] py-2 px-5 text-xs sm:text-sm font-black uppercase text-white shadow-md flex-1 sm:flex-initial"
            >
              <span className="button-sheen" />
              <span className="flex items-center justify-center gap-1.5">
                ¡ACCEDER POR SOLO $9.90!
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * 3x4 VSL Player with Smart Psychological Progress Bar inside the Quiz Route
 */
function VslQuizPlayer({ src, onPitchReached }: { src: string; onPitchReached?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const trackedMilestones = useRef<Set<number>>(new Set());
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

      if (current >= 15 || percent >= 10) {
        onPitchReached?.();
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (!hasStartedPlaying) {
        setHasStartedPlaying(true);
        trackVslPlay();
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      trackVslMilestone(100);
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
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }

    return () => {
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

    video.muted = false;
    video.volume = 1;
    setIsMuted(false);
    setVolume(1);

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e: ReactMouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && video.volume === 0) {
      video.volume = 1;
      setVolume(1);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number.parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVol;
    setVolume(newVol);
    const shouldMute = newVol === 0;
    video.muted = shouldMute;
    setIsMuted(shouldMute);
  };

  const handleSeek = (e: ReactMouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    const video = videoRef.current;
    if (!bar || !video || !duration) return;

    const rect = bar.getBoundingClientRect();
    const clickPos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const seekTime = (clickPos / rect.width) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleSpeedToggle = (e: ReactMouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const speeds = [1, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    video.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const toggleFullscreen = (e: ReactMouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      void container.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      void document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
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
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    if (Number.isNaN(seconds) || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * Psychological progress bar formula:
   * Starts fast, decelerates towards end.
   */
  const getPsychologicalProgress = (current: number, total: number) => {
    if (!total || total <= 0 || current <= 0) return 0;
    const ratio = Math.min(1, Math.max(0, current / total));
    if (ratio >= 0.995) return 100;
    const curved = (1 - Math.pow(1 - ratio, 2.7)) * 96;
    return Math.min(99, Math.max(1, curved));
  };

  const progressPercent = getPsychologicalProgress(currentTime, duration);

  return (
    <div className="vsl-hero-wrapper mx-auto w-full max-w-[440px]">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onClick={togglePlay}
        className="vsl-video-frame group relative cursor-pointer select-none aspect-[3/4]"
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />

        {/* Unmute Overlay Banner */}
        {isMuted && isPlaying && (
          <button type="button" onClick={handleUnmute} className="vsl-unmute-banner">
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
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity">
            <button
              type="button"
              onClick={togglePlay}
              className="vsl-play-overlay-btn group-hover:scale-110"
              aria-label="Reproducir Video"
            >
              <Play size={36} className="ml-1 text-white fill-white" />
            </button>
          </div>
        )}

        {/* Custom Video Controls Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-6 text-white transition-opacity duration-300 ${
            showControls || !isPlaying ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* Smart Accelerating / Decelerating Progress Bar */}
          <div
            ref={progressBarRef}
            onClick={handleSeek}
            className="group/bar relative mb-2.5 h-2 w-full cursor-pointer rounded-full bg-white/25 hover:h-2.5 transition-all overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[color:var(--coral)] to-[color:var(--lime)] relative transition-[width] duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-2 text-xs font-semibold">
            {/* Left controls */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={togglePlay}
                className="rounded p-1 text-white hover:text-[color:var(--lime)] transition-colors"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              </button>

              <div className="flex items-center gap-1 group/vol">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="rounded p-1 text-white hover:text-[color:var(--lime)] transition-colors"
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="h-1.5 w-12 cursor-pointer accent-[color:var(--coral)] opacity-80 hover:opacity-100"
                  aria-label="Control de volumen"
                />
              </div>

              <span className="font-mono text-[10px] text-white/90">{formatTime(currentTime)}</span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSpeedToggle}
                className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase hover:bg-white/30 transition-colors"
                title="Velocidad de reproducción"
              >
                {playbackSpeed}x
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="rounded p-1 text-white hover:text-[color:var(--lime)] transition-colors"
                aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-[color:var(--ink-muted)]">
        <Volume2 size={15} className="text-[color:var(--coral)] animate-bounce" />
        <span>Asegúrate de tener el audio activado para seguir todas las explicaciones</span>
      </div>
    </div>
  );
}

/**
 * Main Offer Card ($9.90 USD) for the Quiz Funnel
 */
function VslQuizOfferCard({ onCtaClick }: { onCtaClick: (location: string) => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-4 border-[color:var(--wine)] bg-white p-6 shadow-[10px_10px_0_var(--wine)] md:p-10">
      {/* Top Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-5">
        <div>
          <span className="vsl-offer-badge">🔥 OFERTA EXCLUSIVA DE LANZAMIENTO (90% OFF)</span>
          <h2 className="font-display text-2xl font-black text-[color:var(--wine)] sm:text-3xl mt-1.5">
            Desafío Glúteos Brasileños 28 Días
          </h2>
          <p className="text-xs font-medium text-[color:var(--ink-muted)]">
            Acceso Completo De Por Vida + 4 Bonos de Regalo + Garantía Incondicional de 7 Días
          </p>
        </div>

        <OfferCountdownTimer />
      </div>

      {/* Content Columns */}
      <div className="grid gap-8 lg:grid-cols-12 items-center">
        {/* Left column: Image Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative overflow-hidden rounded-2xl border-3 border-[color:var(--wine)] bg-[color:var(--wine)] shadow-[6px_6px_0_var(--coral)]">
            <img
              src={desafioCard}
              alt="Desafío Glúteos Brasileños"
              className="h-auto w-full max-w-[280px] object-cover transition-transform hover:scale-105 duration-300"
            />
            <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-black/80 p-2 text-center text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              ✨ Programa Digital Completo en Video
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[color:var(--wine)]">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span>4.9 / 5.0 (Más de 2.800 alumnas)</span>
          </div>
        </div>

        {/* Right column: Benefits list & Pricing */}
        <div className="lg:col-span-7 space-y-4">
          <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-[color:var(--wine)]">
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--lime)] text-[color:var(--wine)]">
                <Check size={13} strokeWidth={3} />
              </span>
              <span>
                <strong>Protocolo Guiado de 28 Días:</strong> Rutinas completas en video de 15 min
                al día.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--lime)] text-[color:var(--wine)]">
                <Check size={13} strokeWidth={3} />
              </span>
              <span>
                <strong>Biomecánica Brasileña:</strong> Aislamiento del glúteo sin hipertrofiar
                muslos ni dolor articular.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--lime)] text-[color:var(--wine)]">
                <Check size={13} strokeWidth={3} />
              </span>
              <span>
                <strong>Entrena 100% en Casa:</strong> Sin gimnasio ni máquinas pesadas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--coral)] text-white">
                <Gift size={13} />
              </span>
              <span>
                <strong>Bono #1:</strong> Guía Nutricional Anti-Flacidez y Menú Glúteos Firmes{" "}
                <span className="text-[color:var(--coral)]">(Gratis hoy)</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--coral)] text-white">
                <Gift size={13} />
              </span>
              <span>
                <strong>Bono #2:</strong> Protocolo Express Anti-Celulitis y Drenaje Linfático{" "}
                <span className="text-[color:var(--coral)]">(Gratis hoy)</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--coral)] text-white">
                <Gift size={13} />
              </span>
              <span>
                <strong>Bono #3:</strong> Tracker Imprimible y Planificador de Hábitos{" "}
                <span className="text-[color:var(--coral)]">(Gratis hoy)</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--coral)] text-white">
                <Gift size={13} />
              </span>
              <span>
                <strong>Bono #4:</strong> Comunidad VIP de Alumnas y Soporte Vitalicio{" "}
                <span className="text-[color:var(--coral)]">(Gratis hoy)</span>
              </span>
            </li>
          </ul>

          {/* Price Box */}
          <div className="rounded-2xl border-2 border-[color:var(--wine)] bg-[color:var(--cream)] p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-bold text-[color:var(--ink-muted)] line-through">
                Precio Regular: $97 USD
              </span>
              <span className="rounded-full bg-[color:var(--coral)] px-2.5 py-0.5 text-xs font-black text-white">
                90% DE DESCUENTO
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
              Pago único • Acceso ilimitado de por vida • Sin mensualidades ni cobros recurrentes
            </p>
          </div>

          {/* Big CTA */}
          <button
            type="button"
            onClick={() => onCtaClick("quiz_offer_primary_cta")}
            className="cta-button text-base md:text-lg font-black tracking-wider text-white shadow-xl hover:scale-[1.02]"
          >
            <span className="button-sheen" />
            <span className="flex items-center justify-center gap-2">
              ¡QUIERO ACCESO POR SOLO $9.90 USD!
              <ArrowRight size={22} />
            </span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-4 text-center text-[11px] font-semibold text-[color:var(--ink-muted)]">
            <span className="flex items-center gap-1">
              <Lock size={13} className="text-emerald-600" /> Checkout Seguro Hotmart
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" /> Garantía de 7 Días
            </span>
            <span className="flex items-center gap-1">
              <CreditCard size={13} className="text-[color:var(--wine)]" /> Tarjetas / PayPal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Itemized Value Summary for the Quiz
 */
function VslQuizIncludedSummary() {
  const items = [
    { name: "Programa Completo Desafío Glúteos Brasileños 28 Días", value: "$97.00 USD" },
    { name: "Módulo 1: Despertar Neuromuscular y Activación Inicial", value: "$27.00 USD" },
    { name: "Módulo 2: Sobrecarga Progresiva y Volumen Lateral", value: "$37.00 USD" },
    { name: "Módulo 3: Escultura, Elevación y Firmeza Máxima", value: "$37.00 USD" },
    {
      name: "Bono #1: Guía Nutricional Anti-Flacidez y Menú Glúteos Firmes",
      value: "$37.00 USD",
      free: true,
    },
    {
      name: "Bono #2: Protocolo Express Anti-Celulitis y Drenaje",
      value: "$29.00 USD",
      free: true,
    },
    {
      name: "Bono #3: Planificador Imprimible de Hábitos y Tracker Diario",
      value: "$19.00 USD",
      free: true,
    },
    {
      name: "Bono #4: Acceso VIP a la Comunidad y Soporte De Por Vida",
      value: "$47.00 USD",
      free: true,
    },
    { name: "Garantía Incondicional de Reembolso Total en 7 Días", value: "INVALUABLE" },
  ];

  return (
    <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-white p-6 shadow-[6px_6px_0_var(--wine)] md:p-8">
      <div className="text-center mb-6">
        <span className="eyebrow-pill mb-2">RESUMEN DEL PAQUETE COMPLETO</span>
        <h3 className="font-display text-2xl font-black text-[color:var(--wine)]">
          Todo Lo Que Recibes Al Unirte Hoy
        </h3>
      </div>

      <div className="space-y-3 divide-y divide-black/10">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between pt-3 text-xs sm:text-sm"
          >
            <span className="flex items-center gap-2 font-bold text-[color:var(--wine)]">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              {item.name}
            </span>
            <span
              className={`shrink-0 font-extrabold ${item.free ? "text-[color:var(--coral)]" : "text-[color:var(--ink-muted)] line-through"}`}
            >
              {item.free ? "GRATIS HOY" : item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[color:var(--wine)] p-4 text-white">
        <div>
          <span className="text-xs text-white/70 block">VALOR TOTAL REAL:</span>
          <span className="text-sm font-bold line-through text-white/60">$229.00 USD</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-[color:var(--lime)] block">
            PRECIO PROMOCIONAL HOY:
          </span>
          <span className="font-display text-3xl font-black text-[color:var(--shock-yellow)]">
            $9.90 USD
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 4-Week Roadmap
 */
function VslQuizRoadmap() {
  const weeks = [
    {
      week: "Semana 1 (Días 1 a 7)",
      phase: "Despertar Neuromuscular",
      goal: "Reactivar la conexión mente-músculo y despertar las fibras 'dormidas' del glúteo mayor y medio sin forzar rodillas.",
      badge: "Fase de Inicio",
    },
    {
      week: "Semana 2 (Días 8 a 14)",
      phase: "Sobrecarga y Redondez Lateral",
      goal: "Estimulación del glúteo medio para rellenar los hoyuelos laterales y crear esa silueta redondeada y femenina.",
      badge: "Fase de Volumen",
    },
    {
      week: "Semana 3 (Días 15 a 21)",
      phase: "Elevación y Firmeza Profunda",
      goal: "Aumento de la tensión metabólica para elevar la curva inferior del glúteo, reduciendo la flacidez visible.",
      badge: "Fase de Elevación",
    },
    {
      week: "Semana 4 (Días 22 a 28)",
      phase: "Consolidación y Efecto Push-Up",
      goal: "Rutinas de alta densidad para fijar el tono muscular duradero y lucir cualquier ropa con total seguridad.",
      badge: "Fase de Resultados",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="text-center">
        <span className="eyebrow-pill mb-2">PLAN DÍA POR DÍA</span>
        <h2 className="font-display text-2xl font-black text-[color:var(--wine)] md:text-3xl">
          Las 4 Fases de Tu Transformación en 28 Días
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[color:var(--ink-muted)]">
          Un plan estructurado paso a paso para que cada día sepas exactamente qué video ver y qué
          ejercicios hacer.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {weeks.map((w) => (
          <div
            key={w.week}
            className="relative rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--wine)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-[color:var(--coral)]">
                  {w.week}
                </span>
                <span className="rounded-full bg-[color:var(--lime)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--wine)]">
                  {w.badge}
                </span>
              </div>
              <h3 className="font-display text-lg font-black text-[color:var(--wine)]">
                {w.phase}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--ink-muted)]">{w.goal}</p>
            </div>
            <div className="mt-4 border-t border-black/10 pt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <Check size={13} strokeWidth={3} />
              <span>15 minutos diarios guiados en video HD</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 4 Free Bonuses
 */
function VslQuizBonuses() {
  const bonuses = [
    {
      badge: "BONO #1",
      title: "Guía Nutricional Anti-Flacidez",
      value: "$37 USD",
      desc: "Menús simples y qué comer antes y después de entrenar para estimular la síntesis de colágeno y firmeza.",
    },
    {
      badge: "BONO #2",
      title: "Protocolo Anti-Celulitis Express",
      value: "$29 USD",
      desc: "Secuencias de drenaje y activación circulatoria en casa para alisar la textura de la piel en glúteos y piernas.",
    },
    {
      badge: "BONO #3",
      title: "Tracker Imprimible de 28 Días",
      value: "$19 USD",
      desc: "Plantilla visual para registrar tus medidas, tus fotos de progreso y mantener la motivación al 100%.",
    },
    {
      badge: "BONO #4",
      title: "Comunidad VIP de Alumnas & Soporte",
      value: "$47 USD",
      desc: "Espacio privado exclusivo para resolver preguntas, compartir recetas y motivarte con compañeras.",
    },
  ];

  return (
    <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-[color:var(--cream-deep)]/40 p-6 md:p-8">
      <div className="mb-6 text-center">
        <span className="rounded-full bg-[color:var(--coral)] px-3 py-1 text-xs font-black uppercase text-white shadow-sm">
          🎁 4 REGALOS EXCLUSIVOS INCLUIDOS HOY
        </span>
        <h3 className="font-display mt-2 text-xl font-black text-[color:var(--wine)] md:text-2xl">
          Llévate Estos 4 Bonos de Regalo (Valorados en $132 USD) por $0
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {bonuses.map((bonus) => (
          <div
            key={bonus.title}
            className="rounded-2xl border-2 border-[color:var(--wine)] bg-white p-4 shadow-[3px_3px_0_var(--coral)]"
          >
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-[color:var(--coral)]">{bonus.badge}</span>
              <span className="text-[color:var(--ink-muted)] line-through">{bonus.value}</span>
            </div>
            <h4 className="mt-1 font-display font-bold text-[color:var(--wine)] text-sm">
              {bonus.title}
            </h4>
            <p className="mt-1.5 text-xs text-[color:var(--ink-muted)] leading-relaxed">
              {bonus.desc}
            </p>
            <div className="mt-3 inline-block rounded-md bg-[color:var(--lime)] px-2 py-0.5 text-[10px] font-black text-[color:var(--wine)]">
              GRATIS CON TU PLAN
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Comparison Table
 */
function VslQuizComparisonTable() {
  const comparisons = [
    {
      feature: "Tiempo requerido",
      brazilian: "15 a 20 minutos al día en casa",
      standard: "45 a 60 min + traslado al gimnasio",
    },
    {
      feature: "Enfoque muscular",
      brazilian: "100% Aislamiento de las 3 porciones del glúteo",
      standard: "Sobrecarga en cuádriceps y piernas gruesas",
    },
    {
      feature: "Impacto en rodillas/espalda",
      brazilian: "Cero impacto articular (sin sentadillas pesadas)",
      standard: "Alta compresión axial en columna y rodillas",
    },
    {
      feature: "Equipo necesario",
      brazilian: "Ninguno (peso corporal y apoyos caseros)",
      standard: "Máquinas caras y pesas gigantes",
    },
    {
      feature: "Acompañamiento",
      brazilian: "Paso a paso estructurado día a día por 28 días",
      standard: "Videos desordenados en YouTube",
    },
  ];

  return (
    <section className="rounded-3xl border-3 border-[color:var(--wine)] bg-white p-6 shadow-[6px_6px_0_var(--wine)] md:p-8">
      <div className="text-center mb-6">
        <span className="eyebrow-pill mb-2">POR QUÉ ES SUPERIOR</span>
        <h2 className="font-display text-2xl font-black text-[color:var(--wine)] md:text-3xl">
          Método Brasileño vs. Rutinas Tradicionales
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b-2 border-[color:var(--wine)]">
              <th className="pb-3 font-bold text-[color:var(--ink-muted)]">Característica</th>
              <th className="pb-3 font-black text-[color:var(--coral)]">
                ✨ Método Brasileño 28 Días
              </th>
              <th className="pb-3 font-medium text-[color:var(--ink-muted)]">
                Rutinas de Gym / YouTube
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {comparisons.map((row) => (
              <tr key={row.feature} className="hover:bg-slate-50/60">
                <td className="py-3 font-bold text-[color:var(--wine)]">{row.feature}</td>
                <td className="py-3 font-extrabold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  {row.brazilian}
                </td>
                <td className="py-3 text-[color:var(--ink-muted)]">
                  <div className="flex items-center gap-1.5">
                    <XCircle size={15} className="text-rose-500 shrink-0" />
                    {row.standard}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * Social Proof with Avatars
 */
function VslQuizSocialProof() {
  const testimonials = [
    {
      name: "Mariana Silva, 34 años",
      city: "Santiago, Chile",
      image: age1,
      quote:
        "Había probado rutinas de YouTube durante meses y solo me dolían las rodillas. En 2 semanas con el Método Brasileño sentí por primera vez la activación real. Mis pantalones me quedan completamente distintos.",
      stars: 5,
    },
    {
      name: "Camila Rodríguez, 29 años",
      city: "Bogotá, Colombia",
      image: age2,
      quote:
        "Tengo un trabajo de oficina y paso 8 horas sentada. Este programa de 15 minutos fue lo único que pude mantener con constancia. La firmeza que logré en 28 días es impresionante.",
      stars: 5,
      featured: true,
    },
    {
      name: "Valeria Morales, 42 años",
      city: "Ciudad de México",
      image: age3,
      quote:
        "A mis 42 creía que ya era imposible levantar los glúteos sin ir al gym con pesas gigantes. La explicación de la postura y los ángulos lo cambia todo. 100% recomendado.",
      stars: 5,
    },
    {
      name: "Lucía Gómez, 51 años",
      city: "Lima, Perú",
      image: age4,
      quote:
        "Tenía mucho miedo de lastimarme la columna porque tengo antecedentes lumbares. Las rutinas son suaves pero queman de verdad en el músculo correcto. Me devolvió la seguridad en mí misma.",
      stars: 5,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="text-center">
        <span className="eyebrow-pill mb-2">RESULTADOS COMPROBADOS</span>
        <h2 className="font-display text-2xl font-black text-[color:var(--wine)] md:text-3xl">
          Mujeres Reales, Cambios Reales en 28 Días
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[color:var(--ink-muted)]">
          Más de 2.800 alumnas en toda Latinoamérica ya han transformado su silueta desde su casa.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl border-3 border-[color:var(--wine)] bg-white p-5 shadow-[4px_4px_0_var(--wine)] flex flex-col justify-between ${
              t.featured ? "ring-2 ring-[color:var(--coral)]" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-500">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <BadgeCheck size={14} className="text-emerald-600" /> Alumna Verificada
                </span>
              </div>

              <p className="text-xs font-medium leading-relaxed text-[color:var(--wine)] italic">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-4 border-t border-black/10 pt-3 flex items-center gap-3">
              <img
                src={t.image}
                alt={t.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-[color:var(--wine)]"
              />
              <div>
                <strong className="block text-xs font-black text-[color:var(--wine)]">
                  {t.name}
                </strong>
                <span className="text-[11px] text-[color:var(--ink-muted)]">{t.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Target Audience
 */
function VslQuizTargetAudience() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border-3 border-emerald-600 bg-emerald-50/70 p-6 shadow-[4px_4px_0_theme(colors.emerald.800)]">
        <div className="flex items-center gap-2 mb-3 text-emerald-900">
          <CheckCircle2 size={24} className="text-emerald-600" />
          <h3 className="font-display text-lg font-black">Este Programa ES Para Ti Si:</h3>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-emerald-950 font-medium">
          <li className="flex items-start gap-2">
            <span>✓</span> Tienes poco tiempo y prefieres entrenar 15 min en tu sala.
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span> Pasas muchas horas sentada y sientes tus glúteos "planos o dormidos".
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span> Quieres levantar y tonificar sin que tus piernas se ensanchen.
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span> Buscas un método seguro que proteja tus rodillas y espalda.
          </li>
        </ul>
      </div>

      <div className="rounded-3xl border-3 border-rose-500 bg-rose-50/70 p-6 shadow-[4px_4px_0_theme(colors.rose.800)]">
        <div className="flex items-center gap-2 mb-3 text-rose-900">
          <XCircle size={24} className="text-rose-500" />
          <h3 className="font-display text-lg font-black">Este Programa NO Es Para Ti Si:</h3>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-rose-950 font-medium">
          <li className="flex items-start gap-2">
            <span>✗</span> Buscas pastillas mágicas sin mover un solo músculo.
          </li>
          <li className="flex items-start gap-2">
            <span>✗</span> No estás dispuesta a dedicar 15 minutos diarios a tu salud.
          </li>
          <li className="flex items-start gap-2">
            <span>✗</span> Prefieres gastar miles de dólares en cirugías invasivas.
          </li>
          <li className="flex items-start gap-2">
            <span>✗</span> No seguirás las instrucciones de postura y técnica en video.
          </li>
        </ul>
      </div>
    </section>
  );
}

/**
 * 3-Pillar Method & Coaches Section
 */
function VslQuizMethodAndCoaches() {
  return (
    <div className="space-y-8">
      {/* 3 Pillars */}
      <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-white p-6 shadow-[6px_6px_0_var(--wine)] md:p-8">
        <div className="text-center mb-6">
          <span className="eyebrow-pill mb-2">CIENCIA Y BIOMECÁNICA</span>
          <h2 className="font-display text-2xl font-black text-[color:var(--wine)] md:text-3xl">
            Los 3 Pilares del Estímulo Brasileño
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-start gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--wine)] font-display text-base font-black text-[color:var(--shock-yellow)] shadow-[3px_3px_0_var(--coral)]">
              01
            </span>
            <h3 className="font-display text-base font-black text-[color:var(--wine)]">
              Aislamiento Posterior Puro
            </h3>
            <p className="text-xs text-[color:var(--ink-muted)] leading-relaxed">
              Ajustamos el ángulo de la cadera para que el glúteo trabaje al 100% sin sobrecargar
              tus muslos ni ensanchar tus piernas.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--wine)] font-display text-base font-black text-[color:var(--shock-yellow)] shadow-[3px_3px_0_var(--coral)]">
              02
            </span>
            <h3 className="font-display text-base font-black text-[color:var(--wine)]">
              Tensión Metabólica en 15 Min
            </h3>
            <p className="text-xs text-[color:var(--ink-muted)] leading-relaxed">
              No necesitas rutinas de 1 hora. Con estímulos continuos de 15 min activas la síntesis
              de colágeno y firmeza muscular.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--wine)] font-display text-base font-black text-[color:var(--shock-yellow)] shadow-[3px_3px_0_var(--coral)]">
              03
            </span>
            <h3 className="font-display text-base font-black text-[color:var(--wine)]">
              Cero Sobrecarga Articular
            </h3>
            <p className="text-xs text-[color:var(--ink-muted)] leading-relaxed">
              Movimientos controlados con peso corporal que protegen tu espalda baja y rodillas en
              todo momento.
            </p>
          </div>
        </div>
      </div>

      {/* Coaches Authority */}
      <div className="rounded-3xl border-3 border-[color:var(--wine)] bg-[color:var(--wine)] p-6 text-white shadow-[6px_6px_0_var(--coral)] md:p-8">
        <div className="grid gap-6 md:grid-cols-12 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="relative overflow-hidden rounded-2xl border-3 border-white/20 shadow-xl max-w-[220px]">
              <img src={coachPortrait} alt="Entrenadores" className="h-auto w-full object-cover" />
            </div>
          </div>

          <div className="md:col-span-8 space-y-3">
            <span className="rounded-full bg-[color:var(--lime)] px-3 py-1 text-xs font-black uppercase text-[color:var(--wine)]">
              TU EQUIPO DE ENTRENADORES
            </span>
            <h2 className="font-display text-2xl font-black md:text-3xl text-white">
              Especialistas en Biomecánica y Estética Femenina
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Hemos dedicado años a estudiar el patrón de activación muscular brasileño para crear
              un protocolo simple, seguro y efectivo que cualquier mujer pueda realizar en casa, sin
              importar su edad ni su condición física actual.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-[color:var(--shock-yellow)]">
              <span>✓ +10 Años de Experiencia</span>
              <span>✓ Especialistas en Glúteos</span>
              <span>✓ Soporte Personalizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 7-Day Guarantee
 */
function VslQuizGuarantee({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="rounded-3xl border-4 border-emerald-600 bg-emerald-50 p-6 md:p-8 text-center shadow-[6px_6px_0_theme(colors.emerald.800)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md mb-3">
        <ShieldCheck size={32} />
      </div>

      <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
        COMPRA 100% LIBRE DE RIESGO
      </span>

      <h2 className="font-display text-2xl font-black text-emerald-950 md:text-3xl mt-1">
        Garantía Incondicional de Devolución de 7 Días
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-emerald-900 leading-relaxed">
        Prueba el Desafío Glúteos Brasileños durante 7 días completos. Si por cualquier motivo no
        sientes la activación y los cambios en tu cuerpo, simplemente solicita tu reembolso con un
        clic y te devolvemos el 100% de tu dinero de inmediato ($9.90 USD). Sin preguntas ni
        trámites.
      </p>

      <div className="mt-5">
        <button
          type="button"
          onClick={onCtaClick}
          className="cta-button max-w-md mx-auto text-sm font-black uppercase text-white shadow-md hover:scale-[1.02]"
        >
          <span className="button-sheen" />
          <span>PROBAR EL MÉTODO SIN RIESGO POR $9.90</span>
        </button>
      </div>
    </section>
  );
}

/**
 * FAQ Accordion
 */
function VslQuizFaq({
  openFaq,
  setOpenFaq,
}: {
  openFaq: number | null;
  setOpenFaq: (idx: number | null) => void;
}) {
  const faqs = [
    {
      q: "¿Cómo y cuándo recibo mi acceso al programa?",
      a: "El acceso es 100% inmediato. Tras confirmar tu pago seguro de $9.90 USD en Hotmart, recibirás un correo electrónico con tus credenciales de acceso para entrar a la plataforma y comenzar hoy mismo.",
    },
    {
      q: "¿Necesito equipo o pesas para hacer las rutinas?",
      a: "No. El protocolo está diseñado para realizarse con peso corporal y apoyos simples que tienes en tu casa (como una silla o pared). Las bandas elásticas son opcionales para cuando quieras más resistencia.",
    },
    {
      q: "¿Es seguro si tengo dolor de rodillas o problemas de espalda?",
      a: "Sí. A diferencia de las sentadillas tradicionales con peso en barra, nuestros ejercicios biomecánicos eliminan la compresión axial sobre la columna y aíslan el glúteo sin impacto articular.",
    },
    {
      q: "¿Cuánto tiempo al día necesito dedicarle?",
      a: "Solo 15 a 20 minutos al día. Las sesiones son compactas y de alta densidad para adaptarse a tu rutina diaria sin complicaciones.",
    },
    {
      q: "¿Es un pago único o me cobrarán cada mes?",
      a: "Es un pago ÚNICO de solo $9.90 USD. No hay mensualidades, cargos sorpresa ni suscripciones ocultas. Tu acceso es de por vida con todas las actualizaciones futuras incluidas.",
    },
    {
      q: "¿Qué métodos de pago aceptan?",
      a: "Aceptamos todas las tarjetas de crédito, débito, PayPal y métodos locales disponibles en tu país a través de la pasarela cifrada de Hotmart.",
    },
    {
      q: "¿Cómo funciona la garantía de devolución de 7 días?",
      a: "Si dentro de los primeros 7 días sientes que el programa no cumple con tus expectativas, solicitas el reembolso directamente en la plataforma con un solo clic y se te devuelve el 100% de tu dinero.",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="text-center">
        <span className="eyebrow-pill mb-2">RESOLVEMOS TODAS TUS DUDAS</span>
        <h2 className="font-display text-2xl font-black text-[color:var(--wine)] md:text-3xl">
          Preguntas Frecuentes
        </h2>
      </div>

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
                onClick={() => setOpenFaq(isOpen ? null : index)}
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
  );
}

function ProfileTag({ icon, text }: Readonly<{ icon: ReactNode; text: string }>) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.07] px-3 py-2 text-[10px] font-bold text-white/80 backdrop-blur">
      {icon}
      {text}
    </span>
  );
}

function LiveViewerCounter() {
  const [count, setCount] = useState(1482);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
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
          El cupón de $9.90 expira en:
        </span>
        <span className="font-mono text-sm font-black text-[color:var(--wine)]">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
