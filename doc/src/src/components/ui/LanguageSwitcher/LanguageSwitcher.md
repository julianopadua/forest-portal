# Documentação – `src/components/ui/LanguageSwitcher.tsx`

---

## 1. Visão geral e responsabilidade
Componente **React** responsável por exibir e permitir a troca do idioma da aplicação entre português (`pt`) e inglês (`en`). Utiliza o provedor de internacionalização (`useI18n`) para obter o idioma corrente, a função de atualização e o dicionário de textos.

---

## 2. Onde este arquivo se encaixa na arquitetura
- **Camada:** UI (apresentação).  
- **Domínio:** *Internationalization* (i18n).  
- **Padrão:** *Presentational component* que delega a lógica de estado ao `I18nProvider`.  

---

## 3. Interfaces e exports
```tsx
export default function LanguageSwitcher(): JSX.Element
```
- Exporta, por padrão, a função de componente React `LanguageSwitcher`. Não há tipos ou interfaces adicionais exportados.

---

## 4. Dependências e acoplamentos
| Tipo | Módulo | Motivo da dependência |
|------|--------|-----------------------|
| **Interna** | `@/components/ui/Button` | Componente de botão estilizado usado para as opções de idioma. |
| **Interna** | `@/i18n/I18nProvider` | Hook `useI18n` que fornece `locale`, `setLocale` e `dict`. |
| **Externa** | React (implícito) | JSX e hooks. |
| **Externa** | Tailwind CSS (implícito) | Classes utilitárias (`flex`, `gap-2`, etc.) para layout e estilo. |

Acoplamento direto apenas ao `Button` e ao contexto de i18n; ambos são abstrações de camada superior, facilitando a substituição.

---

## 5. Leitura guiada do código (top‑down)

1. **Modo cliente** – `"use client"` indica que o componente será renderizado no navegador, permitindo uso de hooks de estado.
2. **Importações** – traz `Button` (UI) e `useI18n` (contexto de idioma).
3. **Hook `useI18n`** – desestrutura `locale` (idioma ativo), `setLocale` (mutador) e `dict` (dicionário de textos).
4. **Estrutura JSX**  
   - `<div className="flex items-center gap-2">` cria um contêiner flexível.  
   - `<span>` exibe o rótulo “Language” usando `dict.common.language`.  
   - Dois `<Button>` configurados como `variant="ghost"`:
     - `onClick` chama `setLocale` com `"pt"` ou `"en"`.  
     - `className` ajusta a opacidade (`opacity-100` quando o idioma corresponde ao `locale`, caso contrário `opacity-60`).  
     - O conteúdo do botão vem de `dict.common.pt` e `dict.common.en`.
5. **Decisão de implementação** – a opacidade visual indica o idioma ativo, evitando a necessidade de estado adicional no componente.

---

## 6. Fluxo de dados / estado / eventos
- **Entrada:** `locale`, `setLocale` e `dict` provenientes do `I18nProvider`.  
- **Evento:** Clique nos botões dispara `setLocale('pt')` ou `setLocale('en')`.  
- **Propagação:** `setLocale` atualiza o contexto global; o provedor re‑renderiza todos os consumidores, inclusive `LanguageSwitcher`, que então reflete a nova opacidade.  
- **Estado interno:** inexistente; o componente é *stateless*.

---

## 7. Conexões com outros arquivos do projeto
- **`@/components/ui/Button`** – componente de botão reutilizável (documentação: [Button.tsx](../Button.tsx)).  
- **`@/i18n/I18nProvider`** – provedor de internacionalização que expõe `useI18n` (documentação: [I18nProvider.tsx](../../i18n/I18nProvider.tsx)).  

Nenhum outro módulo importa `LanguageSwitcher` diretamente, conforme análise estática do repositório.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas
| Item | Descrição | Recomendações |
|------|-----------|---------------|
| **Acoplamento ao `Button`** | Depende de propriedades específicas (`variant`, `className`). | Definir uma interface mínima ou usar `React.ComponentPropsWithoutRef<'button'>` para reduzir acoplamento. |
| **Hard‑code de idiomas** | Os códigos `"pt"` e `"en"` estão fixos. | Extrair para um enum ou constante central (`SUPPORTED_LOCALES`) para facilitar extensões. |
| **Acessibilidade** | Botões não possuem atributos `aria-pressed` ou `aria-label`. | Incluir `aria-pressed={locale === 'pt'}` etc., e garantir contraste adequado da opacidade. |
| **Teste unitário** | Não há cobertura de teste explícita. | Implementar testes com React Testing Library para validar troca de idioma e renderização condicional de opacidade. |
| **Performance** | Cada clique força re‑renderização global via contexto. | Avaliar se a granularidade do contexto pode ser refinada (ex.: separar provider de idioma do resto da UI). |

---
