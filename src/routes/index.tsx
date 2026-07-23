import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroLanding from "@/assets/hero-landing.jpg";
import desafioCard from "@/assets/desafio-card.jpg";
import coach1 from "@/assets/coach-1.jpg";
import coach2 from "@/assets/coach-2.jpg";
import age1 from "@/assets/age-1.jpg";
import age2 from "@/assets/age-2.jpg";
import age3 from "@/assets/age-3.jpg";
import age4 from "@/assets/age-4.jpg";
import result1 from "@/assets/result-1.jpg";
import result2 from "@/assets/result-2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desafío Glúteos Brasileños · Test 28 días" },
      {
        name: "description",
        content:
          "Test rápido: descubre tu plan personalizado de 28 días para transformar tus glúteos en apenas 8 minutos por día. Sin gimnasio, sin rellenos.",
      },
      { property: "og:title", content: "Desafío Glúteos Brasileños" },
      {
        property: "og:description",
        content:
          "Responde el test y recibe tu entrenamiento personalizado de 28 días.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Option = { emoji?: string; label: string; sub?: string; image?: string };
type Question = {
  kind: "question";
  n: number;
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
  | { kind: "analyzing" }
  | { kind: "result" }
  | { kind: "final" };

const TOTAL = 13;

const questions: Question[] = [
  {
    kind: "question",
    n: 1,
    title: "¿Actualmente estás satisfecha con el tamaño y la forma de tu trasero?",
    options: [
      { emoji: "☹️", label: "Estoy Insatisfecha" },
      { emoji: "😀", label: "Estoy satisfecha, pero quiero mejorar" },
    ],
  },
  {
    kind: "question",
    n: 2,
    title: "¿Qué es lo que más te molesta cuando te miras al espejo?",
    options: [
      { emoji: "😩", label: "Mi trasero pequeño o sin volumen." },
      { emoji: "😢", label: "La falta de firmeza o definición." },
    ],
  },
  {
    kind: "question",
    n: 3,
    title: "¿Alguna vez has dejado de usar ropa ajustada o bikinis por no sentirte segura?",
    options: [
      { emoji: "🤯", label: "Sí, muchas veces" },
      { emoji: "🥹", label: "Algunas veces, pero trato de disimularlo." },
      { emoji: "😁", label: "No, eso no es un problema para mí." },
    ],
  },
  {
    kind: "question",
    n: 4,
    title:
      "¿Crees que es posible transformar tu trasero con entrenamientos rápidos y enfocados, hechos en casa?",
    options: [
      { emoji: "✅", label: "Sí, creo que es posible." },
      { emoji: "🤔", label: "Tal vez, pero nunca he visto algo funcionar para mí." },
      { emoji: "💪", label: "Sentirme más saludable y con más energía." },
      { emoji: "🙋", label: "No estoy segura, pero estoy dispuesta a intentarlo." },
    ],
  },
  {
    kind: "question",
    n: 5,
    title:
      "¿Si existiera un método probado que combinara entrenamientos cortos con un plan alimenticio simple, lo intentarías?",
    options: [
      { emoji: "😁", label: "Sí, con toda seguridad." },
      { emoji: "🤨", label: "Dependería de los resultados prometidos." },
      { emoji: "😏", label: "Muéstrame resultados" },
    ],
  },
  {
    kind: "question",
    n: 6,
    title: "¿Cuántos minutos al día puedes dedicar a tu entrenamiento?",
    options: [
      { emoji: "⚡", label: "Menos de 10 minutos." },
      { emoji: "🕰", label: "Entre 10 y 20 minutos." },
      { emoji: "🏋️", label: "Más de 20 minutos." },
    ],
  },
  {
    kind: "question",
    n: 7,
    title: "¿Con qué frecuencia podrías entrenar por semana?",
    options: [
      { emoji: "📅", label: "3 veces." },
      { emoji: "🔥", label: "4 a 5 veces." },
      { emoji: "💪", label: "Todos los días." },
    ],
  },
  {
    kind: "question",
    n: 8,
    title: "¿Cuántas comidas haces al día normalmente?",
    helper:
      "¡Esta es la clave de tu metabolismo! La Coach Luca descubrió que el 90% de las personas lo hace mal y por eso no logran levantar el trasero.",
    options: [
      { emoji: "😴", label: "1 a 2 comidas" },
      { emoji: "🍽️", label: "3 comidas básicas al día" },
      { emoji: "✅", label: "4 a 5 comidas" },
      { emoji: "🍿", label: "Como varias veces al día" },
    ],
  },
  {
    kind: "question",
    n: 9,
    title: "¿Cuál es tu edad?",
    grid: true,
    options: [
      { label: "18 - 29", image: age1 },
      { label: "30 - 39", image: age2 },
      { label: "40 - 49", image: age3 },
      { label: "50+", image: age4 },
    ],
  },
  {
    kind: "question",
    n: 10,
    title: "¿Crees que estás lista para transformar tu cuerpo y tu autoestima de una vez por todas?",
    options: [
      { emoji: "💪", label: "Sí, estoy lista." },
      { emoji: "🙌", label: "Casi lo tengo, solo necesito un empujón." },
      { emoji: "🌱", label: "Necesito más motivación para empezar." },
    ],
  },
  {
    kind: "question",
    n: 11,
    title: "¿Cuál de estos traseros sueñas con tener?",
    helper: "💡 Elige tu objetivo ideal, usaremos esta información para crear un plan que funcione para ti.",
    options: [
      { emoji: "🍑", label: "Levantado — Para llamar la atención desde lejos" },
      { emoji: "💪🏽", label: "Esculpido — Con curvas marcadas y poderosas" },
      { emoji: "🔥", label: "Musculoso — Definido y poderoso" },
      { emoji: "✨", label: "Redondito — Con volumen y forma perfecta" },
    ],
  },
  {
    kind: "question",
    n: 12,
    title: "¿Cuál es tu mayor obstáculo actual?",
    helper:
      "Conocer tu saboteador interno es fundamental. La Coach Luca creó estrategias específicas para vencer cada uno de estos obstáculos.",
    options: [
      { emoji: "😔", label: "Falta de motivación constante" },
      { emoji: "🍫", label: "Ansiedad y compulsión alimentaria" },
      { emoji: "⏰", label: "Rutina agitada sin tiempo" },
      { emoji: "❓", label: "No sé por dónde empezar" },
      { emoji: "💔", label: "La baja autoestima me sabotea" },
    ],
  },
  {
    kind: "question",
    n: 13,
    title: "¿Estás lista para levantar tu trasero en hasta 28 días?",
    options: [
      { emoji: "🔥", label: "SÍ, ESTOY 100% COMPROMETIDA" },
      { emoji: "💪", label: "ABSOLUTAMENTE, DARÉ TODO LO QUE TENGO" },
      { emoji: "🚀", label: "CON TODO, QUIERO EMPEZAR HOY" },
      { emoji: "🤔", label: "TODAVÍA ESTOY PENSANDO" },
    ],
  },
];

function Index() {
  const [screen, setScreen] = useState<Screen>({ kind: "landing" });
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [screen]);

  const go = (s: Screen) => setScreen(s);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[420px] px-5 pt-6 pb-10">
        {screen.kind === "landing" && <Landing onStart={() => go({ kind: "coach" })} />}
        {screen.kind === "coach" && <CoachScreen onNext={() => go(questions[0])} />}
        {screen.kind === "question" && (
          <QuestionScreen
            q={screen}
            selected={answers[screen.n]}
            onSelect={(i) => {
              setAnswers((a) => ({ ...a, [screen.n]: i }));
              setTimeout(() => {
                if (screen.n === 8) go({ kind: "info" });
                else if (screen.n === 13) go({ kind: "analyzing" });
                else go(questions[screen.n]); // next question
              }, 350);
            }}
          />
        )}
        {screen.kind === "info" && <InfoScreen onNext={() => go({ kind: "result" })} />}
        {screen.kind === "result" && <ResultScreen onNext={() => go(questions[8])} />}
        {screen.kind === "analyzing" && (
          <AnalyzingScreen onDone={() => go({ kind: "final" })} />
        )}
        {screen.kind === "final" && <FinalScreen />}
      </div>
    </main>
  );
}

/* ------------------------------- Landing -------------------------------- */
function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="flex flex-col items-center text-center">
      <h1 className="text-[26px] font-extrabold uppercase leading-[1.15] tracking-tight text-foreground">
        Transforma tu cuerpo en apenas 28 dias y con apenas{" "}
        <span className="text-[color:var(--pink)]">8 minutos por día</span>
      </h1>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <img
          src={heroLanding}
          alt="Coach mostrando activación de glúteos"
          width={720}
          height={1080}
          className="h-auto w-full object-cover"
        />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        ¡Sin necesidad de gimnasio ni rellenos!
      </p>

      <p className="mt-6 text-[15px] font-bold text-foreground">
        ¡Responde el test rápido y recibe ya tu
        <br />
        entrenamiento personalizado!
      </p>
      <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[color:var(--pink)]">
        ¡Toca el botón de abajo!
      </p>
      <div className="mt-1 text-lg">👇🏽👇🏽👇🏽</div>

      <button
        onClick={onStart}
        className="mt-4 w-full rounded-full bg-[color:var(--pink)] py-4 text-base font-extrabold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-pink)] transition-transform active:scale-[0.98]"
      >
        ¡Empezar ahora!
      </button>

      <p className="mt-4 text-xs text-muted-foreground">
        ⚡ Atención: Solo un test gratuito por persona
      </p>
    </section>
  );
}

/* --------------------------------- Coach -------------------------------- */
function CoachScreen({ onNext }: { onNext: () => void }) {
  return (
    <section className="flex flex-col items-center text-center">
      <span className="inline-block rounded-full bg-[color:var(--pink)] px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary-foreground">
        Tu Coach
      </span>
      <h2 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-foreground">
        Coach Luca
      </h2>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[color:var(--pink)]">
        Especialista en glúteos femeninos
      </p>

      <div className="mt-5 grid w-full grid-cols-2 gap-3">
        <img src={coach1} alt="Coach Luca 1" className="aspect-[3/4] w-full rounded-2xl object-cover" />
        <img src={coach2} alt="Coach Luca 2" className="aspect-[3/4] w-full rounded-2xl object-cover" />
      </div>

      <div className="mt-5 w-full rounded-2xl border border-[color:var(--pink-soft)] bg-[color:var(--pink-soft)]/40 p-5 text-[13px] leading-relaxed text-foreground">
        <p>
          <b>12 años como educador físico</b>, más de{" "}
          <span className="font-bold text-[color:var(--pink)]">4 millones de seguidores</span> y{" "}
          <b>50.000+ mujeres transformadas</b> en Brasil y el mundo.
        </p>
        <p className="mt-3">
          Reconocido como una de las mayores autoridades en entrenamiento femenino enfocado en glúteos,
          especializado en <b>activación, firmeza y proyección de los glúteos</b> sin gimnasio.
        </p>
      </div>

      <h3 className="mt-8 text-lg font-extrabold uppercase text-foreground">Resultados reales 🍑</h3>
      <div className="mt-3 grid w-full grid-cols-2 gap-3">
        <img src={result1} alt="Resultado 1" className="aspect-square w-full rounded-xl object-cover" />
        <img src={result2} alt="Resultado 2" className="aspect-square w-full rounded-xl object-cover" />
      </div>

      <button
        onClick={onNext}
        className="mt-8 w-full rounded-full bg-[color:var(--pink)] py-4 text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-pink)] active:scale-[0.98]"
      >
        Quiero empezar ahora →
      </button>
    </section>
  );
}

/* ------------------------------- Question ------------------------------- */
function QuestionScreen({
  q,
  selected,
  onSelect,
}: {
  q: Question;
  selected: number | undefined;
  onSelect: (i: number) => void;
}) {
  const progress = (q.n / TOTAL) * 100;
  return (
    <section className="flex flex-col items-center text-center">
      <img
        src={desafioCard}
        alt="Desafío Glúteos Brasileños"
        className="h-40 w-40 rounded-2xl object-cover"
      />
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--pink-soft)]">
        <div
          className="h-full rounded-full bg-[color:var(--pink)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {q.n === 1 ? (
          <span className="text-[color:var(--success)]">¡Vamos a comenzar!</span>
        ) : (
          `Pregunta ${q.n} de ${TOTAL}`
        )}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">¡Responde con atención!</p>

      <h2 className="mt-4 text-[22px] font-extrabold leading-tight text-foreground">
        {q.title}
      </h2>

      {q.helper ? (
        <p className="mt-3 text-[13px] italic text-muted-foreground">{q.helper}</p>
      ) : (
        <p className="mt-3 text-[13px] italic text-muted-foreground">
          (Selecciona una de las opciones abajo)
        </p>
      )}

      <div
        className={`mt-5 grid w-full gap-3 ${q.grid ? "grid-cols-2" : "grid-cols-1"}`}
      >
        {q.options.map((opt, i) => (
          <OptionButton
            key={i}
            option={opt}
            selected={selected === i}
            grid={!!q.grid}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </section>
  );
}

function OptionButton({
  option,
  selected,
  grid,
  onClick,
}: {
  option: Option;
  selected: boolean;
  grid: boolean;
  onClick: () => void;
}) {
  if (grid && option.image) {
    return (
      <button
        onClick={onClick}
        className={`overflow-hidden rounded-2xl border-2 bg-card text-left transition-all active:scale-[0.98] ${
          selected ? "border-[color:var(--pink)] shadow-[var(--shadow-pink)]" : "border-border"
        }`}
      >
        <img src={option.image} alt={option.label} className="aspect-[4/5] w-full object-cover" />
        <div className="py-3 text-center text-sm font-bold text-foreground">{option.label}</div>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border-2 bg-card px-5 py-4 text-left transition-all active:scale-[0.98] ${
        selected ? "border-[color:var(--pink)] shadow-[var(--shadow-pink)]" : "border-border"
      }`}
    >
      <span className="flex-1 pr-3 text-[14px] font-bold leading-snug text-foreground">
        {option.emoji ? <span className="mr-1">{option.emoji}</span> : null}
        {option.label}
      </span>
      <span
        className={`h-5 w-5 shrink-0 rounded-full border-2 ${
          selected
            ? "border-[color:var(--pink)] bg-[color:var(--pink)] ring-4 ring-[color:var(--pink-soft)]"
            : "border-muted-foreground/40"
        }`}
      />
    </button>
  );
}

/* --------------------------- Info (after Q8) ---------------------------- */
function InfoScreen({ onNext }: { onNext: () => void }) {
  return (
    <section
      className="-mx-5 min-h-[100dvh] px-5 py-10 text-center"
      style={{ background: "linear-gradient(180deg, oklch(0.22 0.09 300), oklch(0.15 0.07 300))" }}
    >
      <span className="inline-block rounded-full bg-[color:var(--pink)] px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-[var(--shadow-pink)]">
        ⚠ Información importante
      </span>
      <h2 className="mt-6 text-2xl font-extrabold leading-tight text-white">
        ¿Por qué entrenas duro y tu trasero{" "}
        <span className="text-[color:var(--pink)]">no reacciona</span>?
      </h2>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
        <div className="rounded-xl border-l-4 border-[color:var(--pink)] bg-white/5 p-4">
          <p className="text-[15px] font-bold text-white">
            El 95% de las mujeres +30 tienen{" "}
            <span className="text-[color:var(--pink)]">"trasero tímido"</span>
          </p>
          <p className="mt-2 text-[13px] text-white/80">
            El cuerpo desactiva el glúteo central y transfiere el esfuerzo a la lumbar y los muslos.
          </p>
        </div>

        <p className="mt-5 text-[13px] text-white/80">
          Resultado: tu entrenamiento <b className="text-white">cansa, pero no levanta</b>. No es
          falta de esfuerzo — es un problema de activación.
        </p>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-[14px] font-bold text-white">💡 La buena noticia:</p>
          <p className="mt-2 text-[13px] text-white/85">
            Esto{" "}
            <span className="font-bold text-[color:var(--pink)]">
              puede reprogramarse por completo
            </span>{" "}
            sin gimnasio y sin peso pesado — con el protocolo que llamo el{" "}
            <span className="font-bold text-[color:var(--pink)]">Método Glúteos Brasileños 🍑</span>.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={onNext}
          className="rounded-2xl bg-[color:var(--success)] px-4 py-4 text-sm font-bold text-white active:scale-[0.98]"
        >
          🧐<div className="mt-1 text-[11px]">✅ Ya lo sabía</div>
        </button>
        <button
          onClick={onNext}
          className="rounded-2xl bg-[color:var(--pink-strong)] px-4 py-4 text-sm font-bold text-white active:scale-[0.98]"
        >
          😱<div className="mt-1 text-[11px]">❌ ¡No lo sabía!</div>
        </button>
      </div>
    </section>
  );
}

/* -------------------------- Result (perfil ELITE) ----------------------- */
function ResultScreen({ onNext }: { onNext: () => void }) {
  return (
    <section
      className="-mx-5 min-h-[100dvh] px-5 py-10 text-center"
      style={{ background: "linear-gradient(180deg, oklch(0.18 0.09 300), oklch(0.12 0.06 300))" }}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--pink)] text-2xl text-white shadow-[var(--shadow-pink)]">
        ✓
      </div>
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--pink)]">
        Tu perfil genético · Analizado
      </p>
      <h2 className="mt-2 text-2xl font-extrabold text-white">
        <span className="italic">¡Análisis</span> Completado! 🎉
      </h2>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--pink)]">
          Perfil genético detectado
        </p>
        <p className="mt-1 text-[15px] font-bold text-white">
          18 - 29 años → Resultado <span className="text-[color:var(--pink)]">ELITE 🏆</span>
        </p>
        <p className="mt-1 text-[13px] text-white/80">
          Predisposición genética para transformarse rápido. 🚀
        </p>
      </div>

      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--pink)]">
        Tu plan · 30 días
      </p>

      <div className="mt-3 space-y-3 text-left">
        <PlanRow days="7 días" text={<>Tu trasero se pone <u>firme y duro</u></>} pct="20%" />
        <PlanRow days="21 días" text={<><u>Ruptura</u> de células de celulitis</>} pct="50%" />
      </div>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
        <div className="text-4xl font-extrabold text-[color:var(--pink)]">
          96<span className="text-lg text-white/60">/100</span>
        </div>
        <p className="text-[12px] text-white/85">
          Tu plan es <b>96% compatible</b> con tu cuerpo — resultados en días. 🎯
        </p>
      </div>

      <p className="mt-6 text-sm text-white">
        ¡Tu resultado fue <span className="font-bold text-[color:var(--pink)]">sorprendente</span>! 🎉
      </p>

      <button
        onClick={onNext}
        className="mt-4 w-full rounded-2xl bg-[color:var(--success)] py-4 text-sm font-extrabold uppercase text-white active:scale-[0.98]"
      >
        Continuar mi transformación →
      </button>
      <p className="mt-3 text-[10px] uppercase tracking-widest text-white/50">
        🔒 Análisis seguro · sin compromiso · gratuito
      </p>
    </section>
  );
}

function PlanRow({ days, text, pct }: { days: string; text: React.ReactNode; pct: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--pink)]/20 text-lg">🍑</div>
      <div className="flex-1">
        <span className="inline-block rounded-full bg-[color:var(--pink-strong)]/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--pink)]">
          {days}
        </span>
        <p className="mt-1 text-[13px] font-bold text-white">{text}</p>
      </div>
      <div className="text-xs font-bold text-white/70">{pct}</div>
    </div>
  );
}

/* ------------------------------ Analyzing ------------------------------- */
function AnalyzingScreen({ onDone }: { onDone: () => void }) {
  const steps = [
    "Analizando tus respuestas",
    "Preparando los 28 días",
    "Calculando tu potencial",
    "¡Casi listo!",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= steps.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((n) => n + 1), 1100);
    return () => clearTimeout(t);
  }, [idx, onDone, steps.length]);

  return (
    <section
      className="-mx-5 flex min-h-[100dvh] flex-col items-center justify-center px-5"
      style={{ background: "linear-gradient(180deg, oklch(0.72 0.19 358), oklch(0.60 0.20 358))" }}
    >
      <div className="w-full rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--pink-soft)] text-3xl">
          🧠
        </div>
        <h2 className="mt-4 text-xl font-extrabold uppercase italic text-[color:var(--purple-deep)]">
          Analizando tus respuestas...
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Procesando tu perfil personalizado</p>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-[color:var(--pink-soft)]">
          <div
            className="h-full rounded-full bg-[color:var(--pink)] transition-all duration-700"
            style={{ width: `${Math.min(100, ((idx + 1) / steps.length) * 100)}%` }}
          />
        </div>

        <ul className="mt-6 space-y-3 text-left">
          {steps.map((s, i) => (
            <li
              key={s}
              className={`flex items-center gap-3 text-[12px] font-bold uppercase tracking-wider ${
                i <= idx ? "text-[color:var(--pink)]" : "text-muted-foreground/50"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  i <= idx
                    ? "border-[color:var(--pink)] bg-[color:var(--pink)] text-white"
                    : "border-muted-foreground/30"
                }`}
              >
                {i < idx ? "✓" : i === idx ? "●" : ""}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
        Preparando tu plan personalizado
      </p>
    </section>
  );
}

/* --------------------------------- Final -------------------------------- */
function FinalScreen() {
  return (
    <section className="flex flex-col items-center text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--pink)] text-3xl text-white shadow-[var(--shadow-pink)]">
        🎉
      </div>
      <h2 className="mt-5 text-2xl font-extrabold uppercase leading-tight text-foreground">
        ¡Tu plan personalizado está listo!
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Basado en tus respuestas, la Coach Luca preparó un protocolo específico para tu perfil.
      </p>

      <div className="mt-6 w-full rounded-2xl border border-[color:var(--pink-soft)] bg-[color:var(--pink-soft)]/40 p-5 text-left">
        <p className="text-[13px] font-bold text-foreground">🍑 Método Glúteos Brasileños</p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          28 días · 8 minutos por día · sin gimnasio · sin rellenos
        </p>
      </div>

      <a
        href="#"
        className="mt-6 w-full rounded-full bg-[color:var(--pink)] py-4 text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-pink)]"
      >
        Quiero mi plan ahora →
      </a>
    </section>
  );
}
