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
      mission: string;
      contents: string;
      community: string;
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
      };
      community: {
        id: string;
        title: string;
        subtitle: string;
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
        tagline: "Conhecimento aplicado, comunidade e ferramentas.",
        links: {
        mission: "Missão",
        contents: "Conteúdos",
        community: "Comunidade",
        },
    },

    marketing: {
      hero: {
        title: "Um portal para aprender, construir e aplicar.",
        subtitle:
          "O Forest Institute organiza conhecimento em trilhas, ferramentas e comunidade. Você pode explorar como visitante ou entrar para salvar progresso, participar e acessar recursos avançados.",
        ctaJoin: "Quero fazer parte",
        ctaExplore: "Usar sem logar",
        cards: [
          { title: "Trilhas", desc: "Conteúdo estruturado por objetivos, não por acaso." },
          { title: "Ferramentas", desc: "Calculadoras, templates e checklists práticos." },
          { title: "Comunidade", desc: "Discussão, curadoria e projetos colaborativos." },
        ],
      },
      sections: {
        mission: {
          id: "missao",
          title: "Missão",
          subtitle:
            "Educação com foco em autonomia: aprender, testar, construir e aplicar no mundo real.",
          bullets: [
            "Curadoria de temas-chave, com linguagem clara e referências. Sem conteúdo inchado.",
            "Uma base viva: melhora contínua por feedback e revisão.",
          ],
        },
        programs: {
          id: "programas",
          title: "Programas",
          subtitle:
            "Trilhas por objetivo: fundamentos, prática guiada, e projetos para portfólio.",
          cards: ["Fundamentos", "Projetos", "Mentorias"],
          cardDesc: "Estrutura e entregáveis claros (você sabe onde está e pra onde vai).",
        },
        contents: {
          id: "conteudos",
          title: "Conteúdos",
          subtitle: "Biblioteca prática: notas, guias, templates, e módulos curtos.",
          tags: ["Guias", "Cheatsheets", "Templates", "Artigos", "Sprints", "Checklists"],
        },
        community: {
          id: "comunidade",
          title: "Comunidade",
          subtitle: "Um espaço para perguntas boas, projetos colaborativos e curadoria real.",
          ctaJoin: "Criar conta",
          ctaExplore: "Explorar como visitante",
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
        tagline: "Applied knowledge, community, and tools.",
        links: {
        mission: "Mission",
        contents: "Content",
        community: "Community",
        },
    },

    marketing: {
      hero: {
        title: "A portal to learn, build, and apply.",
        subtitle:
          "Forest Institute organizes knowledge into learning paths, tools, and community. You can explore as a visitor or sign in to save progress, participate, and access advanced resources.",
        ctaJoin: "Join the Institute",
        ctaExplore: "Use without signing in",
        cards: [
          { title: "Tracks", desc: "Content structured by goals, not by randomness." },
          { title: "Tools", desc: "Calculators, templates, and practical checklists." },
          { title: "Community", desc: "Discussion, curation, and collaborative projects." },
        ],
      },
      sections: {
        mission: {
          id: "mission",
          title: "Mission",
          subtitle:
            "Education focused on autonomy: learn, test, build, and apply in the real world.",
          bullets: [
            "Curated key topics with clear language and references. No bloated content.",
            "A living base: continuous improvement through feedback and review.",
          ],
        },
        programs: {
          id: "programs",
          title: "Programs",
          subtitle: "Goal-driven tracks: fundamentals, guided practice, and portfolio projects.",
          cards: ["Fundamentals", "Projects", "Mentorship"],
          cardDesc:
            "Clear structure and deliverables (you always know where you are and what comes next).",
        },
        contents: {
          id: "content",
          title: "Content",
          subtitle: "A practical library: notes, guides, templates, and short modules.",
          tags: ["Guides", "Cheat sheets", "Templates", "Articles", "Sprints", "Checklists"],
        },
        community: {
          id: "community",
          title: "Community",
          subtitle: "A place for good questions, collaborative projects, and real curation.",
          ctaJoin: "Create an account",
          ctaExplore: "Explore as a visitor",
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
