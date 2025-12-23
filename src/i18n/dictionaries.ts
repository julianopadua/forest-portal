// src/i18n/dictionaries.ts

export type Locale = "pt" | "en";

export type Dict = {
  common: {
    language: string;
    pt: string;
    en: string;

    home: string;

    menuTitle: string;
    openMenu: string;
    closeMenu: string;

    settings: string;
    textSize: string;
    textSoon: string;

    signIn: string;

    email: string;
    password: string;
    submit: string;
    createAccount: string;

    themeToLight: string;
    themeToDark: string;
  };

  footer: {
    brand: string;
    tagline: string;
    links: {
      home: string;
      openData: string;
      commodities: string;
      reports: string;
      education: string;
    };
  };

  marketing: {
    hero: {
      title: string;
      subtitle: string;
      ctaPrimary: string;

      // Mantido por compatibilidade.
      cards: Array<{ title: string; desc: string }>;

      // Novo (consolidado com a page.tsx).
      primaryCards: Array<{ href: string; title: string; desc: string }>;
    };

    sections: {
      mission: {
        id: string;
        title: string;
        subtitle: string;
        bullets: string[];
        cta: string;
      };
      programs: {
        id: string;
        title: string;
        subtitle: string;
        cards: string[];
        cardDesc: string;
        cta: string;
      };
      contents: {
        id: string;
        title: string;
        subtitle: string;
        tags: string[];
        cta: string;
      };
      community: {
        id: string;
        title: string;
        subtitle: string;
        ctaPrimary: string;
        ctaSecondary: string;
      };
    };

    aboutInstitute: {
      id: string;
      title: string;
      subtitle: string;
      cards: {
        purpose: { title: string; paragraphs: string[] };
        delivery: { title: string; bullets: string[] };
        commitments: { title: string; bullets: string[] };
        outcomes: { title: string; paragraphs: string[] };
      };
    };

    dedication: {
      id: string;
      title: string;
      subtitle: string;
      people: Array<{ name: string; paragraphs: string[] }>;
      note: { title: string; body: string };
    };

    creator: {
      id: string;
      title: string;
      subtitle: string;
      authorCard: { title: string; body: string };
      contactCard: {
        title: string;
        withUrl: string;
        withoutUrl: string;
        button: string;
      };
    };
  };

  explore: {
    title: string;
    body: string;
    backHome: string;
    join: string;
  };

  join: {
    title: string;
    body: string;
    continue: string;
    backHome: string;
  };
};

export const dictionaries: Record<Locale, Dict> = {
  pt: {
    common: {
      language: "Idioma",
      pt: "Português",
      en: "Inglês",

      home: "Home",

      menuTitle: "Menu",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",

      settings: "Configurações",
      textSize: "Tamanho do texto",
      textSoon: "Em breve",

      signIn: "Entrar",

      email: "Email",
      password: "Senha",
      submit: "Entrar",
      createAccount: "Não tenho conta - criar agora",

      themeToLight: "Trocar para light",
      themeToDark: "Trocar para dark",
    },

    footer: {
      brand: "Forest Institute",
      tagline: "Dados abertos, relatórios e educação aplicada.",
      links: {
        home: "Home",
        openData: "Dados abertos",
        commodities: "Commodities",
        reports: "Reports",
        education: "Educação",
      },
    },

    marketing: {
      hero: {
        title: "Dados abertos para clima, queimadas e decisão no mundo real.",
        subtitle:
          "O Instituto Forest organiza dados públicos e scripts de coleta em pipelines reproduzíveis. Publicamos relatórios automatizados, documentação e trilhas de aprendizado abertas para ampliar autonomia e capacidade técnica.",
        ctaPrimary: "Explorar dados abertos",

        // Mantido por compatibilidade (title/desc apenas).
        cards: [
          {
            title: "Dados abertos",
            desc: "Clima, queimadas e decisão no mundo real.",
          },
          {
            title: "Relatórios",
            desc: "Relatórios automatizados, customizáveis e reproduzíveis localmente.",
          },
          {
            title: "Educação",
            desc: "Espaço aberto que visa o aprendizado e a colaboração.",
          },
          {
            title: "Sobre o Instituto",
            desc: "Missão pública, princípios e compromisso open source.",
          },
        ],

        primaryCards: [
          {
            href: "/open-data",
            title: "Dados abertos",
            desc: "Clima, queimadas e decisão no mundo real.",
          },
          {
            href: "/reports",
            title: "Relatórios",
            desc: "Relatórios automatizados, customizáveis e reproduzíveis localmente.",
          },
          {
            href: "/education",
            title: "Educação",
            desc: "Espaço aberto que visa o aprendizado e a colaboração.",
          },
          {
            href: "#sobre-o-instituto",
            title: "Sobre o Instituto",
            desc: "Missão pública, princípios e compromisso open source.",
          },
        ],
      },

      // Mantive as rotas/ids atuais.
      sections: {
        mission: {
          id: "open-data",
          title: "Dados abertos",
          subtitle:
            "Catálogo público de séries históricas e variáveis críticas para decisões técnicas, com transparência metodológica e reprodutibilidade.",
          bullets: [
            "Consolidação de fontes públicas em formatos consistentes e prontos para análise.",
            "Documentação clara de variáveis, periodicidade, limites e suposições do dado.",
          ],
          cta: "Abrir página de dados abertos",
        },
        programs: {
          id: "commodities",
          title: "Mercados de commodities",
          subtitle:
            "Variáveis climáticas e de mercado para apoiar produtores, analistas e decisões sob risco.",
          cards: ["Clima e produção", "Indicadores de mercado", "Risco e proteção"],
          cardDesc:
            "Dados e contexto para acompanhar plantio, colheita, oferta, demanda e volatilidade.",
          cta: "Abrir página de commodities",
        },
        contents: {
          id: "reports",
          title: "Relatórios",
          subtitle:
            "Relatórios recorrentes baseados nos dados e pipelines do Instituto, com foco em rastreabilidade e método público.",
          tags: ["Relatório", "Automação", "Reprodutível", "Clima", "Queimadas", "Open source"],
          cta: "Abrir página de relatórios",
        },
        community: {
          id: "education",
          title: "Educação",
          subtitle:
            "Trilhas abertas, com prática guiada, exercícios e ferramentas de estudo para colaboração e capacitação.",
          ctaPrimary: "Abrir educação",
          ctaSecondary: "Ver trilhas",
        },
      },

      aboutInstitute: {
        id: "sobre-o-instituto",
        title: "Instituto Forest",
        subtitle: "Organização sem fins lucrativos, open source e orientada à utilidade pública.",
        cards: {
          purpose: {
            title: "Propósito institucional",
            paragraphs: [
              "Fornecer dados abertos, estruturados e auditáveis a partir de fontes relevantes para economia, logística, agricultura, saúde e segurança social, com foco em aplicações práticas e decisões no mundo real.",
              "O Instituto prioriza transparência metodológica: o dado final deve ser acompanhado do processo que o produz, incluindo coleta, validação e transformação.",
            ],
          },
          delivery: {
            title: "Entrega e método",
            bullets: [
              "Catálogo de dados abertos e séries históricas padronizadas.",
              "Códigos completos de scraping, processamento e geração de relatórios, disponibilizados gratuitamente.",
              "Reprodutibilidade por versionamento, documentação e trilhas de auditoria.",
              "Contribuição comunitária por práticas open source.",
            ],
          },
          commitments: {
            title: "Compromissos",
            bullets: [
              "Uso responsável e orientação a impacto socioambiental.",
              "Documentação pública como requisito, não como etapa opcional.",
              "Escalabilidade por automação, modularidade e padrões de dados.",
            ],
          },
          outcomes: {
            title: "Resultados esperados",
            paragraphs: [
              "Reduzir assimetrias de informação e custo de acesso a dados, fortalecendo decisões técnicas em políticas públicas, cadeias produtivas, logística e proteção socioambiental.",
            ],
          },
        },
      },

      dedication: {
        id: "dedicatoria",
        title: "Dedicatória",
        subtitle:
          "Este projeto reconhece um legado de serviço público, conservação e responsabilidade intergeracional.",
        people: [
          {
            name: "Mariceia Barbosa Silva Pádua",
            paragraphs: [
              "Engenheira florestal formada pela Universidade Federal de Lavras, com atuação técnica no serviço público ambiental. Seu trabalho se associa à gestão e proteção de unidades de conservação, com ênfase em manejo, monitoramento e respostas operacionais a riscos ambientais.",
              "Ao assumir responsabilidades de gestão em unidade de conservação estadual, sua trajetória materializa o componente menos visível e mais essencial da conservação: execução contínua, presença em campo e disciplina institucional.",
              "Esta dedicatória registra a dimensão pública desse compromisso e o exemplo de rigor técnico aplicado a um bem coletivo.",
            ],
          },
          {
            name: "Maria Tereza Jorge Pádua",
            paragraphs: [
              "Engenheira agrônoma, ambientalista e conservacionista reconhecida pela contribuição decisiva na criação e consolidação de áreas protegidas no Brasil, com atuação institucional e técnica em políticas de conservação.",
              "Sua trajetória se relaciona à estruturação de instrumentos e redes de conservação, articulando ciência, gestão pública e proteção territorial.",
              "Esta dedicatória sustenta que acesso aberto ao conhecimento, à evidência e ao método é parte do mesmo projeto público que sustenta a conservação: ampliar capacidades e proteger a vida em escala.",
            ],
          },
        ],
        note: {
          title: "Nota de reconhecimento",
          body:
            "O Instituto Forest opera sob uma premissa simples e exigente: confiança pública depende de método público. A abertura do processo é parte do produto.",
        },
      },

      creator: {
        id: "criador",
        title: "Quem eu sou",
        subtitle: "Autoria, responsabilidade e canal de contato.",
        authorCard: {
          title: "Juliano Pádua",
          body:
            "Criador do Instituto Forest. Esta seção será refinada a partir do currículo, com foco em trajetória técnica, pesquisa aplicada, engenharia de dados e compromisso com transparência reprodutível.",
        },
        contactCard: {
          title: "Contato e portfólio",
          withUrl: "Canal de contato e referências profissionais via portfólio.",
          withoutUrl: "Defina NEXT_PUBLIC_PORTFOLIO_URL para habilitar o redirecionamento ao portfólio.",
          button: "Abrir portfólio",
        },
      },
    },

    explore: {
      title: "Explorar como visitante",
      body:
        "Aqui você pode navegar por conteúdos públicos do Forest Institute sem criar uma conta. Algumas funcionalidades ficam restritas para membros.",
      backHome: "Voltar para a home",
      join: "Fazer parte do Instituto",
    },

    join: {
      title: "Fazer parte do Instituto",
      body:
        "Criar uma conta permite salvar progresso, participar da comunidade e acessar conteúdos e ferramentas exclusivas. Nesta versão inicial, o fluxo de cadastro ainda será conectado.",
      continue: "Continuar para cadastro",
      backHome: "Voltar para a home",
    },
  },

  en: {
    common: {
      language: "Language",
      pt: "Portuguese",
      en: "English",

      home: "Home",

      menuTitle: "Menu",
      openMenu: "Open menu",
      closeMenu: "Close menu",

      settings: "Settings",
      textSize: "Text size",
      textSoon: "Soon",

      signIn: "Sign in",

      email: "Email",
      password: "Password",
      submit: "Sign in",
      createAccount: "I do not have an account - create now",

      themeToLight: "Switch to light",
      themeToDark: "Switch to dark",
    },

    footer: {
      brand: "Forest Institute",
      tagline: "Open data, weekly reports, and applied education.",
      links: {
        home: "Home",
        openData: "Open data",
        commodities: "Commodities",
        reports: "Reports",
        education: "Education",
      },
    },

    marketing: {
      hero: {
        title: "Open data for climate, fires, and real-world decision-making.",
        subtitle:
          "Forest Institute organizes public data and scraping scripts into reproducible pipelines. We publish automated reports, documentation, and open learning tracks to expand autonomy and technical capacity.",
        ctaPrimary: "Explore open data",

        // Kept for compatibility (title/desc only).
        cards: [
          {
            title: "Open data",
            desc: "Climate, fires, and decision-making in the real world.",
          },
          {
            title: "Reports",
            desc: "Automated, customizable reports that can be reproduced locally.",
          },
          {
            title: "Education",
            desc: "An open space focused on learning and collaboration.",
          },
          {
            title: "About the Institute",
            desc: "Public mission, principles, and an open source commitment.",
          },
        ],

        // New (aligned with page.tsx): includes href.
        primaryCards: [
          {
            href: "/open-data",
            title: "Open data",
            desc: "Climate, fires, and decision-making in the real world.",
          },
          {
            href: "/reports",
            title: "Reports",
            desc: "Automated, customizable reports that can be reproduced locally.",
          },
          {
            href: "/education",
            title: "Education",
            desc: "An open space focused on learning and collaboration.",
          },
          {
            href: "#sobre-o-instituto",
            title: "About the Institute",
            desc: "Public mission, principles, and an open source commitment.",
          },
        ],
      },

      sections: {
        mission: {
          id: "open-data",
          title: "Open data",
          subtitle:
            "A public catalog of time series and critical variables for technical decisions, with methodological transparency and reproducibility.",
          bullets: [
            "Unified public sources in consistent formats ready for analysis.",
            "Clear documentation of variables, cadence, constraints, and assumptions.",
          ],
          cta: "Open the open data page",
        },
        programs: {
          id: "commodities",
          title: "Commodities markets",
          subtitle:
            "Climate and market variables to support producers, analysts, and risk-aware decisions.",
          cards: ["Climate and production", "Market indicators", "Risk and hedging"],
          cardDesc:
            "Data and context to track planting, harvest, supply, demand, and volatility.",
          cta: "Open the commodities page",
        },
        contents: {
          id: "reports",
          title: "Reports",
          subtitle:
            "Recurring reports based on the Institute data and pipelines, focused on traceability and public method.",
          tags: ["Reports", "Automation", "Reproducible", "Climate", "Fires", "Open source"],
          cta: "Open the reports page",
        },
        community: {
          id: "education",
          title: "Education",
          subtitle:
            "Open learning tracks with guided practice, exercises, and study tools for collaboration and capacity building.",
          ctaPrimary: "Open education",
          ctaSecondary: "View tracks",
        },
      },

      aboutInstitute: {
        id: "sobre-o-instituto",
        title: "Forest Institute",
        subtitle: "A nonprofit, open source organization oriented toward public benefit.",
        cards: {
          purpose: {
            title: "Institutional purpose",
            paragraphs: [
              "Provide open, structured, auditable data from sources relevant to economy, logistics, agriculture, health, and social security, focused on practical applications and real-world decisions.",
              "The Institute prioritizes methodological transparency: the final dataset must be accompanied by the process that produces it, including collection, validation, and transformation.",
            ],
          },
          delivery: {
            title: "Delivery and method",
            bullets: [
              "Open data catalog and standardized historical series.",
              "Full scraping, processing, and report-generation code, published for free.",
              "Reproducibility through versioning, documentation, and audit trails.",
              "Community contribution through open source practices.",
            ],
          },
          commitments: {
            title: "Commitments",
            bullets: [
              "Responsible use and a socio-environmental impact orientation.",
              "Public documentation as a requirement, not an optional step.",
              "Scalability through automation, modularity, and data standards.",
            ],
          },
          outcomes: {
            title: "Expected outcomes",
            paragraphs: [
              "Reduce information asymmetries and the cost of accessing data, strengthening technical decisions in public policy, supply chains, logistics, and socio-environmental protection.",
            ],
          },
        },
      },

      dedication: {
        id: "dedicatoria",
        title: "Dedication",
        subtitle:
          "This project acknowledges a legacy of public service, conservation, and intergenerational responsibility.",
        people: [
          {
            name: "Mariceia Barbosa Silva Pádua",
            paragraphs: [
              "A forest engineer trained at the Federal University of Lavras, with technical work in public environmental service. Her work relates to the management and protection of conservation units, with emphasis on stewardship, monitoring, and operational responses to environmental risks.",
              "By taking on management responsibilities in a state conservation unit, her trajectory reflects the less visible and most essential side of conservation: continuous execution, field presence, and institutional discipline.",
              "This dedication records the public dimension of that commitment and the example of technical rigor applied to a collective good.",
            ],
          },
          {
            name: "Maria Tereza Jorge Pádua",
            paragraphs: [
              "An agronomist, environmentalist, and conservationist recognized for a decisive contribution to the creation and consolidation of protected areas in Brazil, with institutional and technical work in conservation policy.",
              "Her trajectory relates to building conservation instruments and networks, bridging science, public management, and territorial protection.",
              "This dedication argues that open access to knowledge, evidence, and method is part of the same public project that sustains conservation: expanding capabilities and protecting life at scale.",
            ],
          },
        ],
        note: {
          title: "Recognition note",
          body:
            "Forest Institute operates under a simple and demanding premise: public trust depends on public method. Opening the process is part of the product.",
        },
      },

      creator: {
        id: "criador",
        title: "Who I am",
        subtitle: "Authorship, accountability, and a contact channel.",
        authorCard: {
          title: "Juliano Pádua",
          body:
            "Creator of Forest Institute. This section will be refined from the CV, focusing on technical trajectory, applied research, data engineering, and a commitment to reproducible transparency.",
        },
        contactCard: {
          title: "Contact and portfolio",
          withUrl: "Contact channel and professional references via portfolio.",
          withoutUrl: "Set NEXT_PUBLIC_PORTFOLIO_URL to enable portfolio redirect.",
          button: "Open portfolio",
        },
      },
    },
    explore: {
      title: "Explore as a visitor",
      body:
        "Here you can browse Forest Institute public content without creating an account. Some features are restricted to members.",
      backHome: "Back to home",
      join: "Join the Institute",
    },

    join: {
      title: "Join the Institute",
      body:
        "Creating an account lets you save progress, join the community, and access exclusive content and tools. In this early version, the signup flow will be connected later.",
      continue: "Continue to signup",
      backHome: "Back to home",
    },
  },
};
