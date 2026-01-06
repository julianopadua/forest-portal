# 1. Visão geral e responsabilidade  

O arquivo **`src/app/(marketing)/page.tsx`** implementa a página principal da área de *marketing* da aplicação Next.js.  
Ele combina:

* **Gerenciamento de tema** (detecção automática de modo claro/escuro e atualização dinâmica).  
* **Efeito visual de backdrop** que varia a paleta de cores em função da rolagem quando o tema escuro está ativo.  
* **Componentes de UI reutilizáveis** (`Reveal`, `Section`, `LinkCard`, `InfoCard`, `Paragraphs`).  
* **Renderização da página** (`MarketingHome`) que consome o dicionário de internacionalização (`useI18n`) e monta as seções de conteúdo (hero, sobre o instituto, dedicatória, criador).  

O objetivo é fornecer uma UI rica, responsiva e acessível, sem lógica de negócios – apenas apresentação e comportamento visual.

---

# 2. Onde este arquivo se encaixa na arquitetura  

| Camada / Domínio | Papel |
|------------------|-------|
| **UI – camada de apresentação** | Componentes React que compõem a página e seus efeitos visuais. |
| **Tema / utilitário de aparência** | Hooks (`useThemeMode`, `useScrollGreenBackdrop`) que leem o estado do `<html>` e manipulam variáveis CSS customizadas. |
| **Internacionalização** | Consome `useI18n` (provedor externo) para obter textos localizados. |
| **Roteamento Next.js** | Exporta o componente padrão que será usado como página em `/app/(marketing)/page`. |

Não há lógica de domínio ou acesso a serviços externos; o módulo está estritamente na camada de *view*.

---

# 3. Interfaces e exports  

| Export | Tipo | Descrição |
|--------|------|-----------|
| `default` | React component (`MarketingHome`) | Página raiz da rota *marketing*. |
| `useThemeMode` | Hook (`() => ThemeMode`) | Detecta o tema atual (light/dark) a partir da classe do `<html>` e de `prefers-color-scheme`. |
| `useScrollGreenBackdrop` | Hook (`(active: boolean) => void`) | Quando `active` é `true`, calcula valores HSL e opacidade baseados no scroll e os grava em variáveis CSS (`--bg-*`, `--glow-*`). |
| Componentes auxiliares (`ThemedBackdrop`, `Reveal`, `Section`, `LinkCard`, `InfoCard`, `Paragraphs`) | Funções React | Não são exportados explicitamente; são internos à página e usados apenas por `MarketingHome`. |

> **Nota:** Apenas o componente padrão é exportado; os demais símbolos permanecem privados ao módulo.

---

# 4. Dependências e acoplamentos  

| Origem | Tipo | Motivo |
|--------|------|--------|
| `next/link` | Dependência externa (Next.js) | Navegação client‑side. |
| `react` (`useEffect`, `useRef`, `useState`, `CSSProperties`, `ReactNode`) | Dependência externa (React) | Estado, efeitos colaterais e tipagem. |
| `@/i18n/I18nProvider` | Dependência interna (provedor de i18n) | Fornece o dicionário de textos (`useI18n`). |
| `document`, `window` | API do navegador | Leitura de classes, media queries, scroll, resize. |
| `process.env.NEXT_PUBLIC_PORTFOLIO_URL` | Variável de ambiente | URL opcional para o portfólio do criador. |

Não há importações de outros módulos da aplicação; o arquivo é autônomo, exceto pelo provedor de i18n.

---

# 5. Leitura guiada do código (top‑down)

```tsx
// Detecta o tema atual a partir da classe do <html> ou da preferência do usuário.
function getThemeFromHtml(): ThemeMode { … }

function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  useEffect(() => {
    setTheme(getThemeFromHtml());
    const obs = new MutationObserver(() => setTheme(getThemeFromHtml()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return theme;
}
```

*Invariantes*: `theme` sempre será `"light"` ou `"dark"`; a `MutationObserver` garante sincronismo com mudanças de classe.

```tsx
// Atualiza variáveis CSS (--bg-*, --glow-*) em função da posição de scroll.
function useScrollGreenBackdrop(active: boolean) {
  useEffect(() => {
    if (!active) { /* limpa propriedades */ return; }
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const update = () => { … cálculo de HSL e escrita em style.setProperty … };
    const onScroll = () => { if (!reduceMotion && !raf) raf = requestAnimationFrame(update); };
    update(); // estado inicial
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { … limpeza … };
  }, [active]);
}
```

*Decisão*: usa `requestAnimationFrame` para evitar repinturas excessivas; respeita a preferência de “reduced motion”.

```tsx
// Renderiza o backdrop com estilos diferentes para dark / light.
function ThemedBackdrop() {
  const theme = useThemeMode();
  const isDark = theme === "dark";
  useScrollGreenBackdrop(isDark);
  const darkStyle: CSSProperties = { backgroundImage: [ … ].join(", ") };
  const lightStyle: CSSProperties = { backgroundImage: [ … ].join(", ") };
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* camadas dark e light com transição de opacidade */}
    </div>
  );
}
```

```tsx
// Animação de entrada ao entrar no viewport.
function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e?.isIntersecting && setVisible(true),
      { threshold: 0.12 }
    );
    ref.current && obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}
      className={["transition duration-700 ease-out", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"].join(" ")}>
      {children}
    </div>
  );
}
```

```tsx
// Componentes de layout reutilizáveis.
function Section({ id, title, subtitle, children }) { … }
function LinkCard({ href, title, desc }) { … }
function InfoCard({ title, children }) { … }
function Paragraphs({ items }) { … }
```

```tsx
// Página principal – consome o dicionário de i18n e monta a UI.
export default function MarketingHome() {
  const { dict } = useI18n();
  const m = dict.marketing;
  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL;
  const openDataHref = `/${m.sections.mission.id}`;

  return (
    <div className="relative">
      <ThemedBackdrop />
      <div className="relative z-10">
        {/* HERO, ABOUT, DEDICATION, CREATOR – cada um usando Section/InfoCard/LinkCard */}
      </div>
    </div>
  );
}
```

*Decisões de implementação*:

* **Separação de concerns** – lógica de tema e efeito de scroll isolados em hooks.
* **CSS custom properties** – permite que o backdrop seja controlado via JavaScript sem re‑renderizações de React.
* **`Reveal`** – usa `IntersectionObserver` para animações “lazy” e respeita `prefers-reduced-motion` (herdado do hook de scroll).
* **Componentes pequenos e composáveis** – facilitam a manutenção e reutilização.

---

# 6. Fluxo de dados/estado/eventos  

| Fonte | Destino | Tipo | Observação |
|-------|---------|------|------------|
| `useI18n` → `dict` | `MarketingHome` | Dados estáticos (texto) | Não mutável durante a renderização. |
| `document.documentElement.classList` → `useThemeMode` | `theme` (state) | Estado interno | Atualizado por `MutationObserver`. |
| `window.scrollY` → `useScrollGreenBackdrop` → variáveis CSS (`--bg-*`, `--glow-*`) | `ThemedBackdrop` (estilos) | Efeito visual | Executado somente quando o tema escuro está ativo. |
| `IntersectionObserver` → `Reveal.visible` | Classe CSS de transição | Evento de visibilidade | Dispara uma única vez por elemento. |
| Clique em `<Link>` | Navegação client‑side | Evento de UI | Gerenciado por `next/link`. |
| `window.resize` → `onScroll` (re‑cálculo) | Atualização de backdrop | Evento de UI | Garante consistência ao mudar tamanho da janela. |

Nenhum fluxo de dados atravessa limites de módulo; tudo permanece dentro da camada de apresentação.

---

# 7. Conexões com outros arquivos do projeto  

* **Importa** `useI18n` de `@/i18n/I18nProvider` – provê o dicionário de textos.  
* **Exporta** o componente padrão que será consumido pelo roteador de páginas do Next.js (arquivo `src/app/(marketing)/page.tsx` corresponde à rota `/marketing`).  

Não há outros módulos que importam este arquivo (conforme análise estática).  

> **Links de documentação** (não disponíveis no momento):  
> * `@/i18n/I18nProvider` – *[documentação interna]*  
> * `next/link` – *[Next.js Docs – Link Component]*  

---

# 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Acesso direto ao `document`/`window`** | Quebra de renderização no SSR (Server‑Side Rendering). O arquivo já está marcado com `"use client"`; porém, se a política mudar, será necessário mover a lógica para um componente client‑only. | Manter a diretiva `"use client"` e garantir que o bundle não seja usado em SSR. |
| **`MutationObserver` sem debounce** | Pode disparar muitas atualizações caso a classe do `<html>` seja alterada rapidamente. | Avaliar necessidade de debounce ou verificação de mudança efetiva antes de chamar `setTheme`. |
| **Cálculo de cores no scroll** | Operação potencialmente custosa em dispositivos de baixa performance. | Verificar se a taxa de atualização (`requestAnimationFrame`) é suficiente; considerar reduzir a frequência ou usar `throttle`. |
| **Preferência de “reduced motion”** – aplicada apenas ao scroll, não ao `Reveal`. | Inconsistência de acessibilidade. | Extender a lógica de `Reveal` para respeitar `prefers-reduced-motion` (já está implícito via CSS `motion-reduce:transition-none`). |
| **Tipagem de `process.env.NEXT_PUBLIC_PORTFOLIO_URL`** | Pode ser `undefined`; o código já trata, mas a tipagem implícita pode gerar warnings. | Definir tipo explícito (`string | undefined`) ou usar `process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? ""`. |
| **Repetição de estilos CSS inline** | Duplicação de strings HSL em `darkStyle`/`lightStyle`. | Extrair constantes ou gerar dinamicamente via função utilitária para melhorar manutenção. |
| **Testabilidade** | Hooks e componentes dependem de APIs de navegador, dificultando testes unitários. | Utilizar `jsdom` ou abstrair acesso a `document`/`window` em helpers que podem ser mockados. |

Implementar as melhorias acima aumentará a robustez, a performance e a conformidade de acessibilidade da página.
