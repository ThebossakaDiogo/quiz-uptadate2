import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  Clock3,
  Dumbbell,
  Gift,
  Heart,
  LockKeyhole,
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const goal = profileData.goals[answers[11] ?? 0];
  const obstacle = profileData.obstacles[answers[12] ?? 0];
  const age = profileData.ages[answers[9] ?? 1];
  const time = profileData.times[answers[6] ?? 0];
  const checkoutUrl = getDecoratedCheckoutUrl(CHECKOUT_URL);

  return (
    <section className="screen-enter pb-20 sm:pb-0">
      <header className="flex items-center justify-between">
        <BrandMark />
        <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--lime)]/25 px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] text-[color:var(--wine)]">
          <TicketPercent size={13} strokeWidth={3} /> 90% aplicado
        </span>
      </header>

      <div className="final-hero mt-6">
        <div className="relative z-10 text-left">
          <span className="dark-eyebrow">Tu resultado personalizado</span>
          <h1 className="mt-4 max-w-2xl font-display text-[2.4rem] font-black leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl">
            Tu próxima victoria cabe en <span className="text-[color:var(--lime)]">{time}.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/65 sm:text-base">
            Tu ruta prioriza <strong className="text-white">{goal.toLowerCase()}</strong> y reduce
            el impacto de tu principal barrera:{" "}
            <strong className="text-white">{obstacle.toLowerCase()}</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-8">
        <div>
          <div className="section-heading text-left">
            <span>Todo lo que necesitas para avanzar</span>
            <h2>Abre el día. Dale play. Cumple contigo.</h2>
          </div>

          <div className="mt-5 overflow-hidden rounded-[28px] bg-[color:var(--wine)] p-4 shadow-[0_24px_70px_-28px_oklch(0.21_0.07_28/0.65)] sm:p-6">
            <div className="program-visual">
              <img
                src={desafioCard}
                alt="Vista del programa de entrenamiento de 28 días"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--wine)] via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[color:var(--wine)]">
                <CirclePlay className="mr-1 inline" size={13} fill="currentColor" /> Acceso
                inmediato
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <IncludedItem
                icon={<CirclePlay size={19} />}
                title="28 rutinas guiadas"
                text="Secuencia visual para seguir sin improvisar."
              />
              <IncludedItem
                icon={<CalendarDays size={19} />}
                title="Calendario de progreso"
                text="Un mapa simple para mantener el ritmo."
              />
              <IncludedItem
                icon={<Utensils size={19} />}
                title="Guía de alimentación"
                text="Ideas prácticas para organizar tus comidas."
                badge="Bono"
              />
              <IncludedItem
                icon={<Zap size={19} />}
                title="Activación express"
                text="Calentamiento corto para conectar mejor."
                badge="Bono"
              />
              <IncludedItem
                icon={<Users size={19} />}
                title="Comunidad de apoyo"
                text="Un espacio para dudas, avances y motivación."
                badge="Bono"
              />
              <IncludedItem
                icon={<ShieldCheck size={19} />}
                title="Acceso de por vida"
                text="Vuelve a la ruta siempre que lo necesites."
              />
            </div>
          </div>
        </div>

        <aside className="offer-card lg:sticky lg:top-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--coral)]">
              Cupón BUMBUM90 aplicado
            </span>
            <span className="rounded-full bg-[color:var(--lime)]/25 px-2.5 py-1 text-[9px] font-black uppercase text-[color:var(--wine)]">
              Pago único
            </span>
          </div>
          <h3 className="mt-4 font-display text-2xl font-black leading-none tracking-[-0.04em] text-[color:var(--wine)]">
            Desafío Glúteos Brasileños
          </h3>
          <p className="mt-2 text-xs leading-5 text-[color:var(--ink-muted)]">
            Programa digital completo de 28 días, con acceso inmediato.
          </p>

          <div className="my-5 h-px bg-[color:var(--wine)]/8" />
          <p className="text-[11px] font-bold text-[color:var(--ink-muted)]">
            De <del className="text-[color:var(--coral)]">$199.00 USD</del> por:
          </p>
          <div className="mt-1 flex items-end gap-2">
            <span className="font-display text-5xl font-black tracking-[-0.055em] text-[color:var(--wine)]">
              $19.90
            </span>
            <span className="pb-1 text-xs font-black uppercase text-[color:var(--ink-muted)]">
              USD
            </span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-[color:var(--ink-muted)]">
            Sin mensualidades. El valor final se confirma en el checkout.
          </p>

          <a
            href={checkoutUrl}
            onClick={() => trackInitiateCheckout("main_offer_card")}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button group mt-5"
          >
            <span>Sí, quiero empezar mis 28 días</span>
            <ChevronRight size={20} />
            <span className="button-sheen" aria-hidden="true" />
          </a>
          <div className="mt-3 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
            <span className="flex items-center gap-1">
              <LockKeyhole size={12} /> Pago seguro
            </span>
            <span className="h-1 w-1 rounded-full bg-[color:var(--coral)]" />
            <span className="flex items-center gap-1">
              <Zap size={12} /> Acceso inmediato
            </span>
          </div>

          <div className="mt-5 flex gap-3 rounded-2xl bg-[color:var(--cream-deep)] p-4 text-left">
            <ShieldCheck className="shrink-0 text-[color:var(--coral)]" size={25} />
            <div>
              <strong className="text-xs text-[color:var(--wine)]">Garantía de 30 días</strong>
              <p className="mt-1 text-[10px] leading-4 text-[color:var(--ink-muted)]">
                Puedes solicitar el reembolso dentro del plazo informado en el checkout, según sus
                condiciones.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <SocialProof />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

      <div className="mt-9 rounded-[28px] bg-[color:var(--coral)] px-5 py-8 text-center text-white sm:px-9">
        <Sparkles className="mx-auto" size={25} />
        <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-black leading-none tracking-[-0.045em]">
          No necesitas una hora libre. Necesitas un primer día.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
          Empieza con la ruta que acabamos de crear a partir de tus respuestas.
        </p>
        <a
          href={checkoutUrl}
          onClick={() => trackInitiateCheckout("bottom_banner_cta")}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button cta-light group mx-auto mt-5 max-w-md"
        >
          <span>Quiero comenzar hoy</span>
          <ChevronRight size={20} />
          <span className="button-sheen" aria-hidden="true" />
        </a>
      </div>

      <div className="mobile-checkout-bar">
        <div>
          <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-white/55">
            90% OFF aplicado
          </span>
          <strong className="font-display text-xl text-white">$19.90 USD</strong>
        </div>
        <a
          href={checkoutUrl}
          onClick={() => trackInitiateCheckout("mobile_sticky_bar")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Empezar ahora <ChevronRight size={17} />
        </a>
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

function IncludedItem({
  icon,
  title,
  text,
  badge,
}: Readonly<{
  icon: ReactNode;
  title: string;
  text: string;
  badge?: string;
}>) {
  return (
    <div className="included-item">
      <span className="included-icon">{icon}</span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <strong>{title}</strong>
          {badge && <span>{badge}</span>}
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
}

function SocialProof() {
  return (
    <section className="mt-12">
      <div className="section-heading text-center">
        <span>Constancia que se siente</span>
        <h2>Pequeñas sesiones. Grandes cambios de hábito.</h2>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Testimonial
          name="Mariana, 34"
          text="Por primera vez no sentí que tenía que reorganizar toda mi vida para entrenar. Abrir la rutina y acompañarla fue mucho más fácil."
        />
        <Testimonial
          name="Carla, 42"
          text="La explicación de cada movimiento me dio seguridad. Ahora presto atención a la técnica en lugar de solo contar repeticiones."
          featured
        />
        <Testimonial
          name="Lucía, 51"
          text="Me gustó poder adaptar el ritmo. Terminar cada sesión corta me devolvió esa sensación de estar cumpliendo conmigo."
        />
      </div>
      <p className="mt-3 text-center text-[10px] leading-4 text-[color:var(--ink-muted)]">
        Relatos ilustrativos de experiencia. Los resultados individuales pueden variar.
      </p>
    </section>
  );
}

function Testimonial({
  name,
  text,
  featured = false,
}: Readonly<{
  name: string;
  text: string;
  featured?: boolean;
}>) {
  return (
    <article className={`testimonial-card ${featured ? "featured" : ""}`}>
      <div className="flex items-center justify-between">
        <Quote size={22} className="text-[color:var(--coral)]" fill="currentColor" />
        <span className="flex gap-0.5 text-[color:var(--coral)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} fill="currentColor" />
          ))}
        </span>
      </div>
      <p className="mt-5 text-sm font-medium leading-6 text-[color:var(--wine)]">“{text}”</p>
      <div className="mt-5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--wine)] font-display text-xs font-black text-white">
          {name[0]}
        </span>
        <strong className="text-xs text-[color:var(--wine)]">{name}</strong>
        <BadgeCheck size={14} className="text-[color:var(--coral)]" />
      </div>
    </article>
  );
}

function FaqSection({
  openFaq,
  setOpenFaq,
}: Readonly<{
  openFaq: number | null;
  setOpenFaq: (value: number | null) => void;
}>) {
  const faqs = [
    {
      q: "¿Necesito pesas o equipo?",
      a: "No. Las rutinas principales usan el peso corporal. Una banda elástica puede ampliar las progresiones, pero no es obligatoria para empezar.",
    },
    {
      q: "¿Qué pasa si pierdo un día?",
      a: "Retomas desde donde paraste. El objetivo es construir constancia sostenible, no una secuencia perfecta que genere culpa.",
    },
    {
      q: "¿Es adecuado para principiantes?",
      a: "El programa propone variaciones y progresión gradual. Si tienes dolor, una lesión o una condición médica, consulta a un profesional antes de iniciar.",
    },
    {
      q: "¿Cómo recibo el acceso?",
      a: "Después de la confirmación del pago, la plataforma de checkout envía las instrucciones de acceso al correo utilizado en la compra.",
    },
    {
      q: "¿Es suscripción?",
      a: "No. La oferta mostrada corresponde a un pago único. Confirma el importe, la moneda y las condiciones finales directamente en el checkout.",
    },
  ];

  return (
    <section className="mx-auto mt-12 max-w-3xl">
      <div className="section-heading text-center">
        <span>Sin dudas pendientes</span>
        <h2>Preguntas frecuentes</h2>
      </div>
      <div className="mt-6 space-y-2.5">
        {faqs.map((item, index) => {
          const open = openFaq === index;
          return (
            <div key={item.q} className={`faq-item ${open ? "is-open" : ""}`}>
              <button onClick={() => setOpenFaq(open ? null : index)} aria-expanded={open}>
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
              </button>
              <div className="faq-answer">
                <div>
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
