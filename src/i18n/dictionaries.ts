// src/i18n/dictionaries.ts

export type Locale = "pt" | "en";

export type Dict = {
  common: {
    language: string;
    pt: string;
    en: string;

    home: string;
    blog: string;
    aboutUs: string;

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
    quickLinks: string;
    contact: string;
    social: string;
    email: string;
    links: {
      home: string;
      blog: string;
      aboutUs: string;
      openData: string;
      commodities: string;
      reports: string;
      education: string;
    };
    socialLinks: {
      instagram: string;
      linkedin: string;
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
      blog: "Blog",
      aboutUs: "Quem somos",

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
      quickLinks: "Links rápidos",
      contact: "Contato",
      social: "Redes sociais",
      email: "contato@forest.institute",
      links: {
        home: "Home",
        blog: "Blog",
        aboutUs: "Quem somos",
        openData: "Dados abertos",
        commodities: "Commodities",
        reports: "Reports",
        education: "Educação",
      },
      socialLinks: {
        instagram: "Instagram",
        linkedin: "LinkedIn",
      },
    },

    marketing: {
      hero: {
        title: "Dados abertos para queimadas, clima e decisões no mundo real.",
        subtitle:
          "Somos uma organização sem fins lucrativos que centraliza dados públicos, publica o esquema completo para reproduzir localmente e automatiza a extração de múltiplas fontes com pipelines abertos. Aqui você encontra dados abertos de órgãos públicos voltados a monitoramento climático, mercados financeiros, mercados de commodities e investimentos bancários.",
        ctaPrimary: "",

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

        primaryCards: [],
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
        subtitle: "Propósito público e compromissos claros para dados abertos úteis no mundo real.",
        cards: {
          purpose: {
            title: "Propósito institucional",
            paragraphs: [
              "Nossa atuação parte do entendimento contemporâneo da ciência sobre sistemas: dados públicos de diferentes domínios só geram valor quando tratados como partes interdependentes de uma mesma realidade operacional.",
              "A Teoria Geral dos Sistemas, proposta por Ludwig von Bertalanffy entre as décadas de 1940 e 1960, orienta esta abordagem ao permitir transformar dados em bulk em insights interdisciplinares aplicáveis a decisões concretas.",
              "Por isso, organizamos dados abertos estruturados e auditáveis com transparência metodológica completa, do processo de coleta e validação até a transformação final.",
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
              "Dados abertos de órgãos públicos nacionais: INPE, INMET, CVM, Ibama, IBGE, Conab, ANP e outras fontes relevantes.",
              "Dados internacionais de organismos e agências globais.",
              "Dados de sensoriamento remoto e imagens de satélite.",
              "Dados de investimentos de organizações supranacionais como BID e Banco Mundial.",
              "Análise de sistemas complexos e interdependentes, como a interação entre mercado de commodities e variáveis climáticas.",
              "Trilha de aprendizado gratuita com passo a passo para reproduzir localmente as rotinas e automações do projeto.",
              "Uso responsável e orientação a impacto socioambiental.",
              "Documentação pública como requisito, não como etapa opcional.",
              "Escalabilidade por automação, modularidade e padrões de dados abertos.",
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
      blog: "Blog",
      aboutUs: "About us",

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
      quickLinks: "Quick links",
      contact: "Contact",
      social: "Social",
      email: "contact@forest.institute",
      links: {
        home: "Home",
        blog: "Blog",
        aboutUs: "About us",
        openData: "Open data",
        commodities: "Commodities",
        reports: "Reports",
        education: "Education",
      },
      socialLinks: {
        instagram: "Instagram",
        linkedin: "LinkedIn",
      },
    },

    marketing: {
      hero: {
        title: "Open data for wildfires, climate, and real-world decisions.",
        subtitle:
          "We are a nonprofit organization that centralizes public data, publishes the full local replication scheme, and automates extraction from multiple sources with open pipelines. Here you can access open data from public agencies focused on climate monitoring, financial markets, commodities markets, and banking investments.",
        ctaPrimary: "",

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
        primaryCards: [],
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
        subtitle: "Public purpose and clear commitments for useful open data in the real world.",
        cards: {
          purpose: {
            title: "Institutional purpose",
            paragraphs: [
              "Our work is grounded in contemporary systems science: public data from different domains only creates value when treated as interdependent parts of the same operational reality.",
              "General Systems Theory, proposed by Ludwig von Bertalanffy from the 1940s to the 1960s, informs this approach by enabling bulk data to be transformed into interdisciplinary insights for real decisions.",
              "For this reason, we organize open, structured, auditable data with full methodological transparency, from collection and validation to final transformation.",
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
              "Open data from national public agencies: INPE, INMET, CVM, Ibama, IBGE, Conab, ANP, and other relevant sources.",
              "International data from global organizations and agencies.",
              "Remote sensing and satellite imagery data.",
              "Investment data from supranational organizations such as the IDB and World Bank.",
              "Analysis of complex and interdependent systems, such as the interaction between commodity markets and climate variables.",
              "Free learning track with step-by-step guides to reproduce the project's routines and automations locally.",
              "Responsible use and a socio-environmental impact orientation.",
              "Public documentation as a requirement, not an optional step.",
              "Scalability through automation, modularity, and open data standards.",
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
