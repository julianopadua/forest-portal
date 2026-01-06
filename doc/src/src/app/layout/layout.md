## 1. Visão geral e responsabilidade  

`src/app/layout.tsx` define o **layout raiz** da aplicação Next.js. Ele estabelece a estrutura HTML básica (elementos `<html>` e `<body>`), aplica a fonte global *Montserrat*, injeta o provedor de internacionalização (`I18nProvider`) e compõe os componentes de cabeçalho (`Header`) e rodapé (`Footer`). Também exporta o objeto `metadata` exigido pelo framework para SEO e ícones de página.

---

## 2. Posicionamento na arquitetura  

- **Camada:** UI (apresentação).  
- **Domínio:** *Shell* da aplicação – ponto de entrada visual que envolve todas as rotas.  
- **Responsabilidade:** Orquestrar componentes de layout e prover contexto global (i18n, fonte).  

---

## 3. Interfaces e exports  

| Export | Tipo | Descrição |
|--------|------|-----------|
| `metadata` | `Metadata` (Next) | Configurações de título, descrição e ícone da página. |
| `default function RootLayout` | React component | Layout raiz que recebe a prop `children: React.ReactNode` e devolve a árvore HTML completa. |

Nenhum outro símbolo é exportado.

---

## 4. Dependências e acoplamentos  

| Origem | Tipo | Motivo |
|--------|------|--------|
| `next` (type `Metadata`) | Externa | Define a forma esperada do objeto `metadata`. |
| `next/font/google` (`Montserrat`) | Externa | Carrega a fonte Google de forma otimizada. |
| `./globals.css` | Interna (arquivo de estilos) | Aplica estilos globais ao documento. |
| `@/components/layout/Header` | Interna | Componente de cabeçalho da UI. |
| `@/components/layout/Footer` | Interna | Componente de rodapé da UI. |
| `@/i18n/I18nProvider` | Interna | Contexto de internacionalização usado por toda a aplicação. |

O módulo não possui dependências circulares conhecidas; todas as importações são unidirecionais.

---

## 5. Leitura guiada do código (top‑down)

1. **Importação de tipos e fontes**  
   ```tsx
   import type { Metadata } from "next";
   import { Montserrat } from "next/font/google";
   ```
   - `Metadata` garante tipagem correta para o objeto `metadata`.  
   - `Montserrat` é configurado com subconjuntos, pesos e a variável CSS `--font-sans`.

2. **Importação de estilos e componentes**  
   ```tsx
   import "./globals.css";
   import Header from "@/components/layout/Header";
   import Footer from "@/components/layout/Footer";
   import { I18nProvider } from "@/i18n/I18nProvider";
   ```
   - `globals.css` afeta todo o documento.  
   - `Header`/`Footer` são componentes de layout reutilizáveis.  
   - `I18nProvider` fornece o contexto de idioma para os descendentes.

3. **Configuração da fonte**  
   ```tsx
   const montserrat = Montserrat({
     subsets: ["latin"],
     weight: ["300", "400", "500", "600", "700"],
     variable: "--font-sans",
     display: "swap",
   });
   ```
   - A fonte é carregada com `display: swap` para melhorar a experiência de carregamento.  
   - A variável CSS resultante (`--font-sans`) será inserida na classe do `<body>`.

4. **Exportação de `metadata`**  
   ```tsx
   export const metadata: Metadata = {
     title: "Forest Portal",
     description: "Instituto - portal e plataforma",
     icons: { icon: "/favicon_logo/favicon-32x32.png" },
   };
   ```
   - Utilizado pelo Next.js para gerar `<head>` automático.

5. **Componente `RootLayout`**  
   ```tsx
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="pt-BR">
         <body className={`min-h-dvh flex flex-col antialiased ${montserrat.variable}`}>
           <I18nProvider>
             <Header />
             <div className="flex-1 pt-20">{children}</div>
             <Footer />
           </I18nProvider>
         </body>
       </html>
     );
   }
   ```
   - `<html lang="pt-BR">` fixa o idioma padrão.  
   - Classe `min-h-dvh flex flex-col antialiased` garante altura mínima da viewport, layout flex vertical e renderização de texto suavizada.  
   - `montserrat.variable` injeta a fonte como classe CSS.  
   - O wrapper `<div className="flex-1 pt-20">` permite que o conteúdo ocupe o espaço restante, empurrando o `<Footer>` para o final da página.  

**Decisões de implementação relevantes**  
- Uso de `flex-1` para evitar *footer* flutuante.  
- Encapsulamento do provedor de i18n no nível mais alto para que todos os componentes filhos tenham acesso ao contexto.  
- Separação de `metadata` como exportação nomeada, seguindo a convenção do Next.js.

---

## 6. Fluxo de dados/estado/eventos  

O layout em si **não** mantém estado interno nem manipula eventos. Seu único fluxo de dados é a **prop `children`**, que representa a árvore de componentes da rota atual. O `I18nProvider` pode introduzir estado de idioma, mas isso está fora do escopo deste módulo.

---

## 7. Conexões com outros arquivos do projeto  

| Arquivo | Tipo de vínculo | Link (exemplo) |
|---------|----------------|----------------|
| `src/components/layout/Header.tsx` | Importação de componente | `[Header](/docs/src/components/layout/Header.md)` |
| `src/components/layout/Footer.tsx` | Importação de componente | `[Footer](/docs/src/components/layout/Footer.md)` |
| `src/i18n/I18nProvider.tsx` | Importação de provedor de contexto | `[I18nProvider](/docs/src/i18n/I18nProvider.md)` |
| `src/app/globals.css` | Importação de estilos globais | `[globals.css](/docs/src/app/globals.css)` |

Nenhum outro módulo importa `layout.tsx` diretamente; ele é reconhecido pelo Next.js como o layout raiz da aplicação.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Acoplamento ao idioma fixo** (`lang="pt-BR"`). | Limita a reutilização em projetos multilíngues. | Tornar o atributo `lang` dependente do contexto i18n (`<html lang={locale}>`). |
| **Fonte carregada globalmente**. | Pode aumentar o *bundle* inicial se a fonte for grande. | Avaliar uso de `next/font` fallback ou carregamento condicional por rota. |
| **Ausência de fallback de `Header`/`Footer`**. | Se algum desses componentes falhar, o layout quebra. | Envolver em `ErrorBoundary` ou validar a presença antes da renderização. |
| **Responsividade do `pt-20`**. | Valor fixo pode gerar espaçamento excessivo em telas pequenas. | Substituir por classes responsivas (`pt-20 md:pt-24`). |
| **Tipagem da prop `children`**. | Usa `React.ReactNode`, o que é adequado, mas não impede a passagem de `null`. | Se a aplicação exigir sempre conteúdo, usar `React.ReactElement` ou validar em tempo de execução. |

Implementar as melhorias acima aumentará a flexibilidade, a robustez e a performance do layout raiz.
