// src/i18n/dictionaries.ts

export type Locale = "pt" | "en";

export type Dict = {
  common: {
    // já tinha
    language: string;
    pt: string;
    en: string;

    // novo - header/sidebar/modal
    menuTitle: string;
    openMenu: string;
    closeMenu: string;

    settings: string;
    textSize: string;
    textSoon: string;

    signIn: string;
    join: string;
    explore: string;

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
        data: string;
        markets: string;
        reports: string;
        education: string;
    };
    };

    marketing: {
    hero: {
        title: string;
        subtitle: string;
        ctaJoin: string;
        ctaExplore: string;
        cards: Array<{ title: string; desc: string }>;
    };
    sections: {
        mission: {
        id: string;
        title: string;
        subtitle: string;
        bullets: string[];
        };
        programs: {
        id: string;
        title: string;
        subtitle: string;
        cards: string[];
        cardDesc: string;
        };
        contents: {
        id: string;
        title: string;
        subtitle: string;
        tags: string[];
        ctaTitle: string;
        ctaDesc: string;
        ctaButton: string;
        };
        community: {
        id: string;
        title: string;
        subtitle: string;
        cards: Array<{ title: string; desc: string }>;
        ctaJoin: string;
        ctaExplore: string;
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

      menuTitle: "Menu",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",

      settings: "Configurações",
      textSize: "Tamanho do texto",
      textSoon: "Em breve",

      signIn: "Entrar",
      join: "Fazer parte",
      explore: "Usar sem logar",

      email: "Email",
      password: "Senha",
      submit: "Entrar",
      createAccount: "Não tenho conta - criar agora",

      themeToLight: "Trocar para light",
      themeToDark: "Trocar para dark",
    },

    footer: {
    brand: "Forest Institute",
    tagline: "Dados abertos, relatórios reprodutíveis e educação aplicada para o Brasil.",
    links: {
        data: "Dados abertos",
        markets: "Mercados",
        reports: "Relatórios",
        education: "Educação",
    },
    },

    marketing: {
    hero: {
        title: "Dados abertos para queimadas, clima e commodities.",
        subtitle:
        "Um portal público com datasets organizados, scrapers em código aberto e relatórios semanais gratuitos. Feito para monitoramento, prevenção e tomada de decisão com base em evidência.",
        ctaJoin: "Criar conta (grátis)",
        ctaExplore: "Explorar sem logar",
        cards: [
        {
            title: "Dados abertos",
            desc: "Queimadas, clima e variáveis críticas em formatos práticos e documentados.",
        },
        {
            title: "Mercados de commodities",
            desc: "Séries e indicadores para apoiar produtores, estudantes e análises de mercado.",
        },
        {
            title: "Relatórios semanais",
            desc: "Newsletter e relatórios por tema, com transparência e reprodutibilidade.",
        },
        {
            title: "Educação",
            desc: "Trilhas gratuitas: ENEM, tecnologia, Python, Git e IA aplicada.",
        },
        ],
    },

    sections: {
        mission: {
        id: "dados",
        title: "Dados abertos",
        subtitle:
            "Monitoramento e prevenção começam com acesso simples a dados confiáveis e bem organizados.",
        bullets: [
            "Queimadas e risco de fogo: focos, intensidade, recorrência e variáveis correlatas.",
            "Clima e ambiente: precipitação, temperatura, vento, umidade e séries históricas.",
            "Downloads prontos para análise: CSV, Parquet e tabelas consolidadas por período e região.",
            "Código aberto para coleta e limpeza: scrapers e pipelines reprodutíveis (rode no seu PC).",
        ],
        },

        programs: {
        id: "mercados",
        title: "Mercados de commodities",
        subtitle:
            "Dados e variáveis que conectam clima, safra, logística e preço. Foco em utilidade prática.",
        cards: ["Agro", "Energia", "Metais"],
        cardDesc:
            "Indicadores e séries para análise e acompanhamento, com explicações e fontes claras.",
        },

        contents: {
        id: "relatorios",
        title: "Relatórios e newsletter",
        subtitle:
            "Relatórios semanais gratuitos e reprodutíveis. Você recebe o insight e também o caminho para reproduzir.",
        tags: [
            "Newsletter semanal",
            "Queimadas e risco",
            "Clima e safra",
            "Mercados e preços",
            "Anomalias e alertas",
            "Código aberto",
        ],
        ctaTitle: "Receber por email",
        ctaDesc:
            "Inscreva-se para receber a newsletter e relatórios temáticos semanais. Sem spam, foco em sinal.",
        ctaButton: "Inscrever-se",
        },

        community: {
        id: "educacao",
        title: "Educação",
        subtitle:
            "Trilhas gratuitas para ampliar autonomia: estudar melhor, trabalhar melhor e usar tecnologia com propósito.",
        cards: [
            {
            title: "ENEM",
            desc: "Trilhas por competência, questões oficiais e prática guiada (inclui redação).",
            },
            {
            title: "Tecnologia e dados",
            desc: "Python, análise de dados, automação e fundamentos para entrar no mundo tech.",
            },
            {
            title: "IA aplicada",
            desc: "Como usar IA com método: produtividade, estudo, pesquisa e fluxo de trabalho.",
            },
        ],
        ctaJoin: "Começar agora",
        ctaExplore: "Ver conteúdos públicos",
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

      menuTitle: "Menu",
      openMenu: "Open menu",
      closeMenu: "Close menu",

      settings: "Settings",
      textSize: "Text size",
      textSoon: "Soon",

      signIn: "Sign in",
      join: "Join",
      explore: "Use without signing in",

      email: "Email",
      password: "Password",
      submit: "Sign in",
      createAccount: "I do not have an account - create now",

      themeToLight: "Switch to light",
      themeToDark: "Switch to dark",
    },

    footer: {
    brand: "Forest Institute",
    tagline: "Open data, reproducible reports, and applied education for Brazil.",
    links: {
        data: "Open data",
        markets: "Markets",
        reports: "Reports",
        education: "Education",
    },
    },

    marketing: {
    hero: {
        title: "Open data for wildfires, climate, and commodities.",
        subtitle:
        "A public portal with organized datasets, open-source scrapers, and free weekly reports. Built for monitoring, prevention, and evidence-based decision-making.",
        ctaJoin: "Create account (free)",
        ctaExplore: "Explore without signing in",
        cards: [
        {
            title: "Open data",
            desc: "Wildfires, climate, and key variables in practical, well-documented formats.",
        },
        {
            title: "Commodities markets",
            desc: "Time series and indicators to support producers, students, and market analysis.",
        },
        {
            title: "Weekly reports",
            desc: "Newsletter and topic-based reports with transparency and reproducibility.",
        },
        {
            title: "Education",
            desc: "Free tracks: ENEM, technology, Python, Git, and applied AI.",
        },
        ],
    },

    sections: {
        mission: {
        id: "data",
        title: "Open data",
        subtitle:
            "Monitoring and prevention start with simple access to reliable, well-structured data.",
        bullets: [
            "Wildfires and risk: hotspots, intensity, recurrence, and related variables.",
            "Climate and environment: rainfall, temperature, wind, humidity, and historical series.",
            "Analysis-ready downloads: CSV, Parquet, and consolidated tables by region and period.",
            "Open-source collection and cleaning: scrapers and reproducible pipelines (run locally).",
        ],
        },

        programs: {
        id: "markets",
        title: "Commodities markets",
        subtitle:
            "Variables that connect climate, crop cycles, logistics, and price. Built for practical use.",
        cards: ["Agriculture", "Energy", "Metals"],
        cardDesc:
            "Indicators and time series for tracking and analysis, with clear explanations and sources.",
        },

        contents: {
        id: "reports",
        title: "Reports and newsletter",
        subtitle:
            "Free weekly reports you can reproduce. You get the insight and the path to rebuild it.",
        tags: [
            "Weekly newsletter",
            "Wildfire risk",
            "Climate and crops",
            "Markets and prices",
            "Anomalies and alerts",
            "Open source",
        ],
        ctaTitle: "Get it by email",
        ctaDesc:
            "Subscribe to receive the newsletter and weekly topic-based reports. No spam, signal first.",
        ctaButton: "Subscribe",
        },

        community: {
        id: "education",
        title: "Education",
        subtitle:
            "Free tracks to build autonomy: study better, work better, and use technology with purpose.",
        cards: [
            {
            title: "ENEM",
            desc: "Competency-based tracks, official questions, and guided practice (includes essays).",
            },
            {
            title: "Tech and data",
            desc: "Python, data analysis, automation, and fundamentals to enter the tech world.",
            },
            {
            title: "Applied AI",
            desc: "How to use AI with method: productivity, study, research, and workflows.",
            },
        ],
        ctaJoin: "Start now",
        ctaExplore: "Browse public content",
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
