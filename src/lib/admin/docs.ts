// src/lib/admin/docs.ts

export const ADMIN_DOCS_MARKDOWN = `# Admin Task Manager - Guia de uso

Este painel é o centro de coordenação do trabalho do projeto Forest. Ele combina **Kanban** (execução contínua) com algumas convenções leves do **Scrum** (organização conceitual) para que qualquer pessoa nova entenda o estado real do projeto sem precisar pedir contexto.

---

## Como usar

1. **Crie uma task** no botão *New Task*. Cada campo do formulário tem uma descrição curta abaixo dele - leia antes de preencher.
2. **Mova as tasks** entre as colunas arrastando o card. O status muda imediatamente para todos.
3. **Filtre por domínio** nas abas: *All*, *Frontend*, *Backend*, *Data Pipeline*.
4. **Clique em uma task** para abrir o painel de detalhes com dependências de entrada e saída.
5. **Dependências bloqueiam automaticamente**: se uma task depende de outra que não está em *Done*, ela aparece como bloqueada (mesmo se o status manual for outro).

---

## Conceito de fluxo contínuo

O time opera em **fluxo contínuo** (Kanban): não há sprints fechados. Tasks entram pela esquerda (*Backlog*) e saem pela direita (*Done*). O objetivo é minimizar trabalho em paralelo (WIP) e empurrar cards até o fim.

- [Kanban: o método](https://www.atlassian.com/agile/kanban) - introdução conceitual.
- [Scrum vs Kanban](https://www.atlassian.com/agile/kanban/kanban-vs-scrum) - quando usar cada um.

---

## Status do board

### Backlog

Tudo que foi pensado, anotado, mas ainda não passou por refinamento. Pode estar incompleto.

- **Quando usar**: ideias novas, bugs reportados sem reprodução, débitos técnicos identificados.
- [O que é product backlog](https://www.atlassian.com/agile/scrum/backlogs) (Scrum, mas o conceito é o mesmo).

### Ready

Já foi refinada: tem título claro, descrição, escopo entendido e dependências mapeadas. Pronta para alguém pegar.

- **Quando usar**: depois que a task tem critério de aceite implícito ou explícito e está pronta para execução.
- [Definition of Ready](https://www.scrum.org/resources/blog/definition-ready-vs-definition-done).

### In Progress

Alguém está ativamente trabalhando nesta task agora. Limite o número de tasks aqui ao mínimo possível.

- **Quando usar**: assim que começar a execução. Nunca deixe uma task aqui sem alguém de fato trabalhando nela.
- [WIP limits](https://www.atlassian.com/agile/kanban/wip-limits).

### Blocked

A task não pode avançar agora: depende de algo (outra task, decisão externa, terceiro).

- **Quando usar**: o trabalho parou por motivo identificável. Documente o motivo no campo *Impact* ou *Description*.
- [Como gerenciar bloqueios em Kanban](https://www.atlassian.com/agile/kanban/cards).

### Review

Implementação concluída, aguardando revisão (PR review, validação de produto, QA).

- **Quando usar**: o autor terminou e passou a bola adiante para review/aceite.

### Done

Mergeada, em produção (ou no caminho determinístico para produção), aceita pelo solicitante.

- **Quando usar**: nada a fazer. Se voltar a aparecer trabalho, abra uma task nova.
- [Definition of Done](https://www.scrum.org/resources/what-definition-done).

---

## Dependências entre tasks

Uma task pode depender de N outras tasks. Modelamos isso como um **grafo direcionado** (\`task_dependencies\`).

- Se A depende de B, A só sai de bloqueio quando B estiver *Done*.
- Cards com dependências não resolvidas aparecem destacados (mesmo que o status manual seja \`In Progress\`, por exemplo).
- Use a aba *Dependencies* no formulário de criação para selecionar de quais tasks a nova task depende.

---

## Domínios

Cada task pertence a exatamente um domínio:

- **Frontend** (azul) - portal Next.js, React, UI.
- **Backend** (roxo) - APIs, autenticação, lógica server-side, Supabase.
- **Data Pipeline** (verde) - ingestão, transformação, manifestos no Storage, geração de relatórios.

A cor é consistente em badges, drawer e header dos filtros.

---

## Posicionamento metodológico

Este sistema é **híbrido**:

- **Kanban** para execução: fluxo contínuo, WIP baixo, sem sprints.
- **Scrum** apenas como vocabulário leve: usamos *Ready*, *Done*, *Backlog* com significados próximos ao Scrum porque são termos universais e fáceis de explicar.

Não rodamos cerimônias (daily, planning, review, retro) dentro deste board. Ele é a fonte de verdade do estado do trabalho, não da agenda.

Leituras recomendadas:

- [The Kanban Method](https://kanban.university/kanban-guide/) - referência canônica.
- [Scrum Guide](https://scrumguides.org/scrum-guide.html) - referência canônica do Scrum.
- [Kanban + Scrum (Scrumban)](https://www.atlassian.com/agile/agile-at-scale/scrumban).
`;
