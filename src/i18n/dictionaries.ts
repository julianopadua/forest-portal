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
      cards: Array<{ title: string; desc: string }>;
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
          "O Forest Institute organiza dados públicos e scripts de coleta em pipelines reproduzíveis. Publicamos relatórios semanais e trilhas educacionais gratuitas para ampliar autonomia e capacidade técnica.",
        ctaPrimary: "Explorar dados abertos",
        cards: [
          {
            title: "Dados abertos",
            desc: "Clima, queimadas e variáveis ambientais organizadas e documentadas.",
          },
          {
            title: "Commodities",
            desc: "Indicadores e variáveis que conectam clima, produção e mercado.",
          },
          {
            title: "Reports",
            desc: "Relatórios semanais e newsletter com leitura orientada por dados.",
          },
          {
            title: "Educação",
            desc: "Trilhas ENEM e tecnologia com prática, ferramentas e projetos.",
          },
        ],
      },
      sections: {
        mission: {
          id: "open-data",
          title: "Dados abertos",
          subtitle:
            "Base pública organizada para monitoramento e prevenção de queimadas no Brasil, com foco em reprodutibilidade.",
          bullets: [
            "Consolidação de fontes públicas em formatos consistentes e prontos para análise.",
            "Documentação clara de variáveis, periodicidade e limitações dos dados.",
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
          title: "Reports e newsletter",
          subtitle:
            "Relatórios gratuitos, recorrentes, baseados nos dados e nos pipelines do instituto.",
          tags: ["Relatório semanal", "Newsletter", "Mercado", "Clima", "Queimadas", "Código aberto"],
          cta: "Abrir página de reports",
        },
        community: {
          id: "education",
          title: "Educação",
          subtitle:
            "Trilhas gratuitas para ENEM e tecnologia, com prática guiada, exercícios e ferramentas de estudo.",
          ctaPrimary: "Abrir educação",
          ctaSecondary: "Ver trilhas",
        },
      },
    },

    // Mantive essas rotas por compatibilidade com seu projeto atual.
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
          "Forest Institute organizes public data and scraping scripts into reproducible pipelines. We publish weekly reports and free learning tracks to expand autonomy and technical capacity.",
        ctaPrimary: "Explore open data",
        cards: [
          {
            title: "Open data",
            desc: "Climate, fires, and environmental variables, organized and documented.",
          },
          {
            title: "Commodities",
            desc: "Indicators that connect climate, production, and markets.",
          },
          {
            title: "Reports",
            desc: "Weekly reports and a newsletter with data-driven analysis.",
          },
          {
            title: "Education",
            desc: "ENEM prep and tech learning with practice, tools, and projects.",
          },
        ],
      },
      sections: {
        mission: {
          id: "open-data",
          title: "Open data",
          subtitle:
            "A curated public base for monitoring and preventing fires in Brazil, focused on reproducibility.",
          bullets: [
            "Unified public sources in consistent formats ready for analysis.",
            "Clear documentation of variables, frequency, and limitations.",
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
          title: "Reports and newsletter",
          subtitle:
            "Free recurring reports based on the institute data and pipelines.",
          tags: ["Weekly report", "Newsletter", "Market", "Climate", "Fires", "Open source"],
          cta: "Open the reports page",
        },
        community: {
          id: "education",
          title: "Education",
          subtitle:
            "Free learning tracks for ENEM and technology, with guided practice, exercises, and study tools.",
          ctaPrimary: "Open education",
          ctaSecondary: "View tracks",
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
