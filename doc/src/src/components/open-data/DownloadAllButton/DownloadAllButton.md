# 📄 Documentação – `src/components/open-data/DownloadAllButton.tsx`

---

## 1. Visão geral e responsabilidade
O módulo exporta o componente **`DownloadAllButton`**, responsável por iniciar o download sequencial de um conjunto de arquivos a partir de URLs fornecidas.  
Ele exibe um botão que, ao ser acionado, cria dinamicamente elementos `<a>` com atributo `download`, dispara o clique e aguarda um intervalo entre as requisições para evitar sobrecarga do navegador.

---

## 2. Posicionamento na arquitetura
- **Camada:** UI (componente de apresentação/controle).  
- **Domínio:** *Open Data* – parte da interface que permite ao usuário baixar coleções de dados abertos.  
- **Tipo:** **Client Component** (Next.js) – indicado por `"use client"`; depende de APIs do navegador (`document`, `window`).

---

## 3. Interfaces e exports
```tsx
interface DownloadAllButtonProps {
  /** Lista de objetos contendo a URL do recurso e o nome sugerido para o arquivo. */
  urls: { url: string; name: string }[];
}

/** Exporta o componente funcional que renderiza o botão de download. */
export function DownloadAllButton({ urls }: DownloadAllButtonProps): JSX.Element
```
- **Exportação nomeada**: `DownloadAllButton`.
- **Prop `urls`**: array obrigatório; cada item deve possuir `url` (string) e `name` (string).

---

## 4. Dependências e acoplamentos
| Tipo | Módulo | Motivo |
|------|--------|--------|
| **Externa** | `react` (`useState`) | Gerencia o estado de “baixando”. |
| **Interna** | Nenhuma | O componente não importa utilitários ou estilos internos do projeto. |
| **Ambiente** | APIs do navegador (`document.createElement`, `appendChild`, `click`, `removeChild`) | Necessárias para disparar downloads. |
| **Next.js** | `"use client"` | Marca o arquivo como componente cliente, impedindo renderização no servidor. |

Não há acoplamento direto com outros módulos do repositório.

---

## 5. Leitura guiada do código (top‑down)

1. **Diretiva de cliente** – `"use client"` garante que o código seja executado apenas no navegador.  
2. **Importação** – `useState` de React para controle de estado local.  
3. **Definição da interface** – `DownloadAllButtonProps` descreve a forma esperada dos dados de entrada.  
4. **Hook de estado** – `isDownloading` indica se o processo está em andamento; impede cliques simultâneos.  
5. **`handleDownloadAll` (async)**  
   - Verifica se há URLs; sai cedo caso a lista esteja vazia.  
   - Define `isDownloading` como `true`.  
   - Loop `for` iterativo sobre `urls`:
     - Cria elemento `<a>` com `href`, `download` e `target="_blank"`.  
     - Anexa ao `document.body`, dispara `click()`, remove o elemento.  
     - Aguarda **450 ms** (`await new Promise(r => setTimeout(r, 450))`) antes de prosseguir, mitigando bloqueios de download simultâneo.  
   - Ao final, redefine `isDownloading` para `false`.  
6. **Renderização** – `<button>` com:
   - `onClick={handleDownloadAll}`  
   - `disabled` quando `isDownloading` ou a lista está vazia.  
   - Classes Tailwind que tratam de estilos claros/escuros, estado desabilitado e animações.  
   - **Conteúdo condicional**: spinner SVG + texto “Baixando...” enquanto `isDownloading` é `true`; caso contrário, ícone de download + texto “Baixar Coleção Completa”.

---

## 6. Fluxo de dados / estado / eventos
1. **Entrada** – Prop `urls` (array estático ou derivado de estado superior).  
2. **Evento** – Clique no botão → `handleDownloadAll`.  
3. **Estado interno** – `isDownloading` (boolean).  
4. **Efeito colateral** – Criação e remoção de elementos `<a>` que acionam downloads.  
5. **Saída visual** – Botão desabilitado e spinner enquanto o loop está em execução; retorno ao estado normal ao término.

---

## 7. Conexões com outros arquivos do projeto
- **Importações**: nenhuma importação interna; apenas `react`.  
- **Exportações**: `DownloadAllButton` pode ser consumido por qualquer componente que precise oferecer download em lote.  
- **Referências externas**: Não há arquivos que importem este módulo (conforme análise atual). Caso haja uso futuro, adicione links no formato `[NomeDoComponente](../caminho/para/arquivo)`.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas
| Item | Descrição | Recomendações |
|------|-----------|---------------|
| **Bloqueio de UI** | O `await` de 450 ms impede cliques, mas o loop ainda roda na thread principal. | Considerar `setTimeout` não‑bloqueante ou Web Workers para downloads muito extensos. |
| **Falha silenciosa** | Erros de rede ou URLs inválidas não são capturados; o processo continua. | Envolver a lógica de download em `try/catch` e expor feedback ao usuário (ex.: toast de erro). |
| **Acessibilidade** | O botão usa apenas texto e ícones; falta atributo `aria-label` quando o ícone está presente. | Incluir `aria-label="Baixar coleção completa"` e `aria-live` para anunciar estado de “baixando”. |
| **Limite de taxa** | O intervalo fixo de 450 ms pode ser insuficiente ou excessivo dependendo do tamanho dos arquivos e da política CORS. | Tornar o delay configurável via prop ou detectar `navigator.connection` para ajuste dinâmico. |
| **Compatibilidade** | Uso de `a.download` pode ser ignorado em navegadores que bloqueiam downloads automáticos (ex.: Safari). | Documentar limitações e, se necessário, fallback para `fetch` + `Blob` + `URL.createObjectURL`. |
| **Testabilidade** | A manipulação direta do DOM dificulta testes unitários. | Extrair a lógica de criação de link para função pura e mockar `document` nos testes. |

---
