# Documentação – `src/components/ui/Button.tsx`

---

## 1. Visão geral e responsabilidade  

Componente **Button** é um elemento de interface reutilizável que encapsula um `<button>` HTML com estilos predefinidos e suporte a variantes (`solid`, `ghost`) e tamanhos (`sm`, `md`). Ele centraliza a lógica de composição de classes CSS e garante consistência visual e de comportamento (ex.: estados `disabled`) em toda a aplicação.

---

## 2. Posicionamento na arquitetura  

| Camada / Domínio | Localização | Propósito |
|------------------|-------------|-----------|
| **UI – Componentes** | `src/components/ui/` | Conjunto de componentes de apresentação que não contêm lógica de negócio. |
| **Utilitário** | `src/lib/` (importa `cn`) | Função de concatenação de classes (similar a `classnames`). |

O botão reside na camada de **apresentação** e pode ser consumido por qualquer módulo que necessite de um controle de ação visualmente padronizado.

---

## 3. Interfaces e exports  

```tsx
export type ButtonVariant = "solid" | "ghost";
export type ButtonSize    = "sm" | "md";

export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;   // padrão: "solid"
    size?: ButtonSize;         // padrão: "md"
    className?: string;        // classes adicionais
    children?: React.ReactNode;
  }
): JSX.Element;
```

- **Export default**: a função `Button`.
- **Tipos auxiliares** (`ButtonVariant`, `ButtonSize`) são exportados implicitamente ao serem referenciados na assinatura da função (não há `export` explícito, mas podem ser reutilizados via importação de tipos se necessário).

---

## 4. Dependências e acoplamentos  

| Tipo | Origem | Motivo |
|------|--------|--------|
| **Externa** | `react` (tipos `React.ButtonHTMLAttributes`, `React.ReactNode`) | Fornece tipagem e propriedades padrão de `<button>`. |
| **Interna** | `@/lib/cn` | Função utilitária para combinar strings de classes de forma segura. Não há outros imports. |
| **Nenhum** | Não há dependências de componentes UI ou de estado. |

O componente tem **acoplamento baixo**: depende apenas de React e de um utilitário de concatenação de classes.

---

## 5. Leitura guiada do código (top‑down)

1. **Modo cliente** – ` "use client"; ` indica que o componente será renderizado no cliente (Next.js).  
2. **Importação de `cn`** – responsável por mesclar classes CSS, evitando valores `undefined` ou duplicados.  
3. **Definição de tipos** – `ButtonVariant` e `ButtonSize` restringem os valores aceitos.  
4. **Assinatura da função** – aceita todas as propriedades nativas de `<button>` (`React.ButtonHTMLAttributes<HTMLButtonElement>`) e adiciona:
   - `variant` (padrão `"solid"`),
   - `size` (padrão `"md"`),
   - `className` (extensão de estilos externos),
   - `children` (conteúdo interno).  
5. **Constantes de estilo**  
   - `base`: classes comuns a todas as variantes/tamanhos.  
   - `sizes`: mapa `Record<ButtonSize, string>` que associa cada tamanho a padding e tipografia.  
   - `solid` e `ghost`: estilos específicos de variante, usando variáveis CSS (`var(--border)`, `var(--primary)`, etc.).  
6. **Renderização**  
   ```tsx
   <button
     className={cn(base, sizes[size], variant === "solid" ? solid : ghost, className)}
     {...props}
   >
     {children}
   </button>
   ```
   - `cn` combina: estilos base → tamanho escolhido → variante → classes adicionais (`className`).  
   - Spread `...props` repassa atributos HTML padrão (ex.: `onClick`, `type`, `disabled`).  

**Decisões de implementação**  
- **Mapeamento de estilos** via objetos (`sizes`, `solid`, `ghost`) facilita a extensão futura (ex.: novos tamanhos ou variantes).  
- **Uso de variáveis CSS** permite que o tema da aplicação seja alterado sem tocar no componente.  
- **`disabled`** recebe estilos de opacidade e cursor via classe Tailwind (`disabled:opacity-60 disabled:cursor-not-allowed`).  

---

## 6. Fluxo de dados / estado / eventos  

O componente **não mantém estado interno**. Seu comportamento depende exclusivamente de:
- **Props** recebidas (`variant`, `size`, `className`, `children`, demais atributos HTML).  
- **Eventos** são propagados diretamente por `...props` (ex.: `onClick`, `onMouseEnter`).  

Não há lógica de ciclo de vida ou efeitos colaterais.

---

## 7. Conexões com outros arquivos do projeto  

- **Importa**: `cn` – utilitário de concatenação de classes.  
  - Documentação: `src/lib/cn` (link placeholder).  

- **Não há importações** de outros componentes UI nem exportações que sejam consumidas por outros módulos (conforme análise estática). Caso o projeto evolua, o botão pode ser referenciado por páginas ou outros componentes de UI.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Descrição | Recomendações |
|------|-----------|---------------|
| **Tipagem de `className`** | `className` aceita `string | undefined`. `cn` lida com `undefined`, mas a assinatura não reflete explicitamente. | Documentar que `className` pode ser omitido; considerar `className?: string`. |
| **Extensibilidade de variantes** | Atualmente apenas duas variantes. | Extrair variantes para um objeto configurável (`const variants = { solid: "...", ghost: "..." }`) para facilitar adição de novas opções. |
| **Acessibilidade** | Não há atributos ARIA padrão. | Avaliar necessidade de `aria-label` ou `role` quando o botão não contém texto visível. |
| **Testes** | Não há testes unitários associados. | Implementar testes de snapshot e de comportamento (ex.: verificação de classes geradas para cada combinação de `variant`/`size`). |
| **Tema** | Depende de variáveis CSS globais (`--primary`, `--border`, etc.). | Garantir que essas variáveis estejam definidas em todos os temas; caso contrário, o botão pode renderizar com cores inesperadas. |
| **Performance** | `cn` é chamado a cada renderização. | Se `cn` for puro e leve, não há impacto significativo; caso contrário, memoizar o resultado com `useMemo` quando as props não mudarem. |

--- 

*Esta documentação foi gerada com base no código-fonte disponível e nas convenções do projeto. Qualquer comportamento não explicitado no código deve ser verificado nas dependências (ex.: implementação de `cn`).*
