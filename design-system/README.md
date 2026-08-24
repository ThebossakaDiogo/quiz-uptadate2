# 🎨 Pacote de Design System e Schema - Quiz Funnel Neo-Pop

Este pacote foi extraído diretamente do projeto para que você possa reutilizar toda a identidade visual, tipografia, cores, botões, micro-interações, efeitos sonoros e estrutura de dados em qualquer outro projeto (React, Next.js, Vue, Svelte, HTML/CSS puro, Astro ou plataformas no-code).

---

## 📁 Estrutura da Pasta `design-system`

| Arquivo | Descrição |
| :--- | :--- |
| **`design.json`** | Especificação completa de Design Tokens (cores OKLCH/HEX, tipografia, sombras neo-brutalistas, raios de borda, gradientes e parâmetros de áudio). |
| **`schema.json`** | Estrutura de dados completa do Quiz (13 perguntas, fases, textos de apoio, tela de coach, análise intermediária, cupom raspável e oferta final). |
| **`styles.css`** | CSS puro, autônomo e sem dependências com todas as classes, animações `@keyframes`, botões com brilho *sheen*, orbs de fundo e cards. |
| **`audio-engine.js`** | Motor de síntese sonora em tempo real via Web Audio API (sem arquivos `.mp3` ou `.wav` externos, latência zero). |
| **`demo.html`** | Catálogo visual e interativo para você testar e copiar os componentes funcionando ao vivo no navegador. |

---

## 🚀 Como Usar em Outros Projetos

### 1. Usando os Estilos (`styles.css`)
Basta importar o arquivo `styles.css` no seu projeto:
```html
<link rel="stylesheet" href="styles.css">
```
Ou no React/Next.js:
```tsx
import "./design-system/styles.css";
```

### 2. Usando o Efeito Sonoro Interativo (`audio-engine.js`)
```javascript
import { uiAudio } from './design-system/audio-engine.js';

// Tocar sons de acordo com a ação:
uiAudio.play('click');   // Cliques normais
uiAudio.play('select');  // Seleção de cards de opções
uiAudio.play('back');    // Botão de voltar
uiAudio.play('success'); // Conclusão / CTA principal / Desbloqueio
```

### 3. Usando as Perguntas e Fluxo (`schema.json`)
O arquivo `schema.json` contém todo o fluxo estruturado. Você pode carregá-lo dinamicamente em seu código:
```javascript
import quizSchema from './design-system/schema.json';

console.log(quizSchema.meta.title);
console.log(quizSchema.screens.questions); // Array com as 13 perguntas
```

---

## 🎯 Principais Classes e Componentes Prontos

- `.quiz-canvas`: Fundo característico com gradientes radiais quentes e textura sutil.
- `.ambient-orb .ambient-orb-one`: Orbs luminosos flutuantes que criam sensação de profundidade.
- `.cta-button`: Botão primário com gradiente vibrante, sombra neo-brutalista sólida e efeito de reflexo (*sheen*).
- `.cta-light`: Variação com gradiente verde-limão elétrico de alta visibilidade.
- `.option-card`: Card de pergunta com letra identificadora e feedback tátil no hover/seleção.
- `.eyebrow-pill`: Pílula de destaque com borda neo-brutalista e sombra sólida.
- `.dark-panel`: Container escuro para seções de destaque e impacto visual.
- `.sound-control`: Botão flutuante para controle de áudio com LED pulsante.
