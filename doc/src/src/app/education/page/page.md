# 1. Visão geral e responsabilidade  

`src/app/education/page.tsx` define a **página de Educação** da aplicação Next.js.  
Ela renderiza um bloco centralizado contendo título, subtítulo e dois botões de chamada‑para‑ação (CTA) cujas mensagens são obtidas a partir do dicionário de internacionalização (`useI18n`). Também oferece um link de retorno à página inicial.  

A responsabilidade do módulo é **exibir conteúdo estático de marketing** relacionado à seção “community” e encaminhar o usuário para as próximas etapas (trilhas ENEM ou cursos de tecnologia) por meio de alertas temporários.

---

# 2. Onde este arquivo se encaixa na arquitetura  

| Camada / Domínio | Tipo | Localização |
|------------------|------|-------------|
| **Apresentação (UI)** | Página cliente (React component) | `src/app/education/page.tsx` |
| **Domínio** | Marketing → Community | Utiliza textos de `dict.marketing.sections.community` |
| **Infraestrutura** | Nenhum acesso direto a APIs ou serviços externos | — |

O arquivo pertence à camada **UI** da feature *Education* e funciona como ponto de entrada da rota `/education` (conforme convenção de rotas do Next.js 13+).

---

# 3. Interfaces e exports (o que ele expõe)  

```tsx
export default function EducationPage(): JSX.Element
```

- **Exportação padrão**: componente React funcional `EducationPage`.
- Não há tipos, interfaces ou funções auxiliares exportadas.

---

# 4. Dependências e acoplamentos  

| Dependência | Tipo | Motivo |
|-------------|------|--------|
| `next/link` | Biblioteca externa (Next.js) | Navegação client‑side para a home. |
| `@/components/ui/Button` | Módulo interno | Componente de botão reutilizável, aceita `variant` e `onClick`. |
| `@/i18n/I18nProvider` | Módulo interno | Hook `useI18n` para obter o dicionário de traduções. |
| `"use client"` | Diretiva Next.js | Marca o arquivo como componente cliente, permitindo uso de hooks e eventos. |

Acoplamento direto apenas ao **Button** e ao **I18nProvider**; não há dependências de estado global ou de camada de dados.

---

# 5. Leitura guiada do código (top‑down)  

1. **Diretiva `"use client"`** – garante que o componente seja renderizado no cliente, habilitando hooks.  
2. **Imports** – traz `Link`, `Button` e `useI18n`.  
3. **Definição do componente** `EducationPage`  
   - Invoca `useI18n()` → obtém `{ dict }`.  
   - Extrai `s = dict.marketing.sections.community` para simplificar o acesso a `title`, `subtitle`, `ctaPrimary` e `ctaSecondary`.  
4. **Estrutura JSX**  
   - Container externo (`mx-auto max-w-4xl …`) centraliza o conteúdo.  
   - Card interno (`rounded-3xl … backdrop-blur-xl`) aplica estilo visual.  
   - `<h1>` exibe `s.title`; `<p>` exibe `s.subtitle`.  
   - Dois botões:  
     - **Primário** – `onClick` dispara `alert("Depois liga nas trilhas ENEM")`.  
     - **Secundário** – variante `ghost`, alerta “Depois liga nos cursos de tecnologia”.  
   - Link para a home: `<Link href="/"><Button variant="ghost">{dict.common.home}</Button></Link>`.  

**Decisões de implementação**  
- Uso de `alert` como placeholder de ação futura (não há navegação real).  
- Texto estático obtido via i18n, permitindo futuras traduções sem alterar o componente.  
- Botões reutilizam o componente UI padrão, garantindo consistência visual.

---

# 6. Fluxo de dados/estado/eventos  

| Fonte | Destino | Tipo | Observação |
|-------|---------|------|------------|
| `useI18n()` | `dict` (local) | Leitura | Dicionário é estático durante a renderização. |
| Botões `onClick` | `alert()` | Evento | Função de efeito colateral simples; não altera estado interno. |
| Link `href="/"` | Navegação Next.js | Evento de roteamento | Redireciona para a página inicial. |

Não há estado interno nem gerenciamento de efeitos colaterais além dos alerts.

---

# 7. Conexões com outros arquivos do projeto  

- **Button** – `src/components/ui/Button.tsx` (documentação: [Button component]())  
- **I18nProvider** – `src/i18n/I18nProvider.tsx` (documentação: [I18nProvider]())  
- **Rota Next.js** – a presença do arquivo em `src/app/education/page.tsx` cria a rota `/education` automaticamente (Next.js 13+).  

Nenhum outro módulo importa `EducationPage`; ele é consumido exclusivamente pelo roteador do Next.js.

---

# 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Risco / Impacto | Recomendações |
|------|-----------------|---------------|
| **Uso de `alert`** | Experiência de usuário pobre; impede fluxo natural. | Substituir por navegação real (`router.push`) ou por abertura de modal com informações contextuais. |
| **Hard‑code de mensagens** | Mensagens de alerta estão fixas em português, ignorando i18n. | Externalizar textos de alerta para o dicionário (`dict.marketing.sections.community.alertEnem`, etc.). |
| **Acoplamento ao `Button`** | Se a API do componente mudar, a página quebrará. | Definir propTypes ou TypeScript interfaces para `Button` e validar compatibilidade. |
| **Ausência de testes** | Falta de cobertura unitária pode ocultar regressões de UI. | Criar testes de snapshot com React Testing Library e validar renderização e callbacks. |
| **Responsividade limitada** | Layout usa classes Tailwind, mas não há verificação de breakpoints críticos. | Revisar design em dispositivos menores; considerar `sm:` e `md:` para ajustes de tipografia e espaçamento. |
| **Acessibilidade** | Botões não possuem atributos `aria-label` e alertas não são anunciados por leitores de tela. | Incluir `aria-label` descritivo e substituir `alert` por componentes de notificação acessíveis. |

Implementar as melhorias acima aumentará a robustez, a usabilidade e a manutenção futura da página de Educação.
