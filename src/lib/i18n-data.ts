// ============================================================
// lib/i18n-data.ts — Multilingual dynamic content (Option A)
// Each field is stored as { en: "...", fr: "...", es: "..." }
// Use getLocalizedField(field, locale) to render in UI.
// ============================================================

export type LocalizedString = {
  en: string
  fr?: string
  es?: string
}

export type LocalizedStringArray = {
  en: string[]
  fr?: string[]
  es?: string[]
}

// ── Example Course Data ───────────────────────────────────────

export interface MultilingualCourse {
  id: string
  slug: string
  image: string
  level: "beginner" | "intermediate" | "advanced"
  title: LocalizedString
  description: LocalizedString
  tagline: LocalizedString
  modules: MultilingualModule[]
}

export interface MultilingualModule {
  id: string
  order: number
  title: LocalizedString
  lessons: MultilingualLesson[]
}

export interface MultilingualLesson {
  id: string
  order: number
  title: LocalizedString
  content: LocalizedString
  videoUrl?: string
  quiz?: MultilingualQuiz
}

export interface MultilingualQuiz {
  questions: MultilingualQuestion[]
}

export interface MultilingualQuestion {
  id: string
  question: LocalizedString
  options: LocalizedStringArray
  correctAnswer: LocalizedString
  explanation: LocalizedString
}

// ── Sample Data ───────────────────────────────────────────────

export const SAMPLE_COURSES: MultilingualCourse[] = [
  {
    id: "course-stocks-101",
    slug: "stock-market-101",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
    level: "beginner",
    title: {
      en: "Stock Market 101",
      fr: "Bourse 101",
      es: "Mercado de Valores 101",
    },
    description: {
      en: "A complete beginner's guide to understanding how the stock market works — from buying your first share to building a long-term portfolio.",
      fr: "Un guide complet pour débutants sur le fonctionnement de la bourse — de l'achat de votre première action à la construction d'un portefeuille à long terme.",
      es: "Una guía completa para principiantes sobre cómo funciona el mercado de valores — desde comprar tu primera acción hasta construir una cartera a largo plazo.",
    },
    tagline: {
      en: "Invest smarter, not harder",
      fr: "Investissez plus intelligemment",
      es: "Invierte más inteligentemente",
    },
    modules: [
      {
        id: "mod-1",
        order: 1,
        title: {
          en: "Introduction to Stocks",
          fr: "Introduction aux actions",
          es: "Introducción a las acciones",
        },
        lessons: [
          {
            id: "lesson-1-1",
            order: 1,
            title: {
              en: "What is a Stock?",
              fr: "Qu'est-ce qu'une action ?",
              es: "¿Qué es una acción?",
            },
            content: {
              en: "A stock represents a share of ownership in a company. When you buy a stock, you become a part-owner (shareholder) of that business. Companies issue stocks to raise capital for growth, and shareholders benefit from price appreciation and dividends.",
              fr: "Une action représente une part de propriété dans une entreprise. Lorsque vous achetez une action, vous devenez copropriétaire (actionnaire) de cette entreprise. Les entreprises émettent des actions pour lever des capitaux pour la croissance, et les actionnaires bénéficient de l'appréciation des prix et des dividendes.",
              es: "Una acción representa una participación en la propiedad de una empresa. Cuando compras una acción, te conviertes en copropietario (accionista) de ese negocio. Las empresas emiten acciones para recaudar capital para el crecimiento, y los accionistas se benefician de la apreciación de precios y dividendos.",
            },
            quiz: {
              questions: [
                {
                  id: "q1",
                  question: {
                    en: "What does owning a stock mean?",
                    fr: "Que signifie posséder une action ?",
                    es: "¿Qué significa poseer una acción?",
                  },
                  options: {
                    en: ["Lending money to a company", "Owning a part of a company", "Having a savings account", "Buying government bonds"],
                    fr: ["Prêter de l'argent à une entreprise", "Posséder une partie d'une entreprise", "Avoir un compte d'épargne", "Acheter des obligations d'État"],
                    es: ["Prestar dinero a una empresa", "Poseer una parte de una empresa", "Tener una cuenta de ahorros", "Comprar bonos del gobierno"],
                  },
                  correctAnswer: {
                    en: "Owning a part of a company",
                    fr: "Posséder une partie d'une entreprise",
                    es: "Poseer una parte de una empresa",
                  },
                  explanation: {
                    en: "Stocks represent equity — ownership in a company. As a shareholder, you have a claim on the company's assets and earnings.",
                    fr: "Les actions représentent des capitaux propres — la propriété d'une entreprise. En tant qu'actionnaire, vous avez droit aux actifs et aux bénéfices de l'entreprise.",
                    es: "Las acciones representan capital social — propiedad de una empresa. Como accionista, tienes derecho a los activos y ganancias de la empresa.",
                  },
                },
                {
                  id: "q2",
                  question: {
                    en: "Why do companies issue stocks?",
                    fr: "Pourquoi les entreprises émettent-elles des actions ?",
                    es: "¿Por qué las empresas emiten acciones?",
                  },
                  options: {
                    en: ["To pay taxes", "To raise capital for growth", "To reduce their workforce", "To lower product prices"],
                    fr: ["Pour payer des impôts", "Pour lever des capitaux pour la croissance", "Pour réduire leurs effectifs", "Pour baisser les prix des produits"],
                    es: ["Para pagar impuestos", "Para recaudar capital para el crecimiento", "Para reducir su fuerza laboral", "Para bajar los precios de los productos"],
                  },
                  correctAnswer: {
                    en: "To raise capital for growth",
                    fr: "Pour lever des capitaux pour la croissance",
                    es: "Para recaudar capital para el crecimiento",
                  },
                  explanation: {
                    en: "Companies issue stocks through an IPO to raise money without taking on debt. This capital funds expansion, research, and operations.",
                    fr: "Les entreprises émettent des actions via un IPO pour lever des fonds sans s'endetter. Ce capital finance l'expansion, la recherche et les opérations.",
                    es: "Las empresas emiten acciones a través de una OPV para recaudar dinero sin endeudarse. Este capital financia la expansión, la investigación y las operaciones.",
                  },
                },
              ],
            },
          },
          {
            id: "lesson-1-2",
            order: 2,
            title: {
              en: "How the Stock Exchange Works",
              fr: "Comment fonctionne la Bourse ?",
              es: "¿Cómo funciona la Bolsa?",
            },
            content: {
              en: "Stock exchanges like NYSE and NASDAQ are marketplaces where buyers and sellers trade shares. Prices fluctuate based on supply and demand, company performance, economic indicators, and market sentiment.",
              fr: "Les bourses comme NYSE et NASDAQ sont des marchés où les acheteurs et les vendeurs échangent des actions. Les prix fluctuent en fonction de l'offre et de la demande, des performances des entreprises, des indicateurs économiques et du sentiment du marché.",
              es: "Las bolsas de valores como NYSE y NASDAQ son mercados donde compradores y vendedores intercambian acciones. Los precios fluctúan según la oferta y la demanda, el rendimiento de la empresa, los indicadores económicos y el sentimiento del mercado.",
            },
          },
        ],
      },
      {
        id: "mod-2",
        order: 2,
        title: {
          en: "Risk & Diversification",
          fr: "Risque et Diversification",
          es: "Riesgo y Diversificación",
        },
        lessons: [
          {
            id: "lesson-2-1",
            order: 1,
            title: {
              en: "Understanding Investment Risk",
              fr: "Comprendre le risque d'investissement",
              es: "Entendiendo el riesgo de inversión",
            },
            content: {
              en: "Every investment carries risk — the possibility that you might lose money. Key risk types include market risk, company-specific risk, inflation risk, and liquidity risk. Understanding these helps you make informed decisions.",
              fr: "Chaque investissement comporte un risque — la possibilité de perdre de l'argent. Les principaux types de risques incluent le risque de marché, le risque spécifique à l'entreprise, le risque d'inflation et le risque de liquidité. Les comprendre vous aide à prendre des décisions éclairées.",
              es: "Cada inversión conlleva riesgo — la posibilidad de que puedas perder dinero. Los tipos de riesgo clave incluyen riesgo de mercado, riesgo específico de la empresa, riesgo de inflación y riesgo de liquidez. Comprender estos te ayuda a tomar decisiones informadas.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "course-crypto-101",
    slug: "crypto-blockchain-basics",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop",
    level: "beginner",
    title: {
      en: "Crypto & Blockchain Basics",
      fr: "Bases de la Crypto et Blockchain",
      es: "Bases de Cripto y Blockchain",
    },
    description: {
      en: "Demystify cryptocurrency and blockchain technology. Learn how Bitcoin works, what altcoins are, how wallets function, and how to stay safe in the crypto ecosystem.",
      fr: "Démystifiez les cryptomonnaies et la technologie blockchain. Apprenez comment fonctionne Bitcoin, ce que sont les altcoins, comment fonctionnent les portefeuilles et comment rester en sécurité dans l'écosystème crypto.",
      es: "Desmitifica las criptomonedas y la tecnología blockchain. Aprende cómo funciona Bitcoin, qué son las altcoins, cómo funcionan las billeteras y cómo mantenerte seguro en el ecosistema cripto.",
    },
    tagline: {
      en: "Understand the future of money",
      fr: "Comprendre l'avenir de l'argent",
      es: "Entiende el futuro del dinero",
    },
    modules: [
      {
        id: "mod-c1",
        order: 1,
        title: {
          en: "Blockchain Fundamentals",
          fr: "Fondamentaux de la Blockchain",
          es: "Fundamentos de Blockchain",
        },
        lessons: [
          {
            id: "lesson-c1-1",
            order: 1,
            title: {
              en: "What is Blockchain?",
              fr: "Qu'est-ce que la Blockchain ?",
              es: "¿Qué es Blockchain?",
            },
            content: {
              en: "A blockchain is a distributed ledger — a database shared across thousands of computers. Each 'block' contains a set of transactions, and once added to the 'chain', the data is immutable and transparent. This eliminates the need for a central authority like a bank.",
              fr: "Une blockchain est un registre distribué — une base de données partagée entre des milliers d'ordinateurs. Chaque 'bloc' contient un ensemble de transactions, et une fois ajouté à la 'chaîne', les données sont immuables et transparentes. Cela élimine le besoin d'une autorité centrale comme une banque.",
              es: "Una blockchain es un libro mayor distribuido — una base de datos compartida entre miles de computadoras. Cada 'bloque' contiene un conjunto de transacciones, y una vez añadido a la 'cadena', los datos son inmutables y transparentes. Esto elimina la necesidad de una autoridad central como un banco.",
            },
          },
        ],
      },
    ],
  },
]

// ── Notification templates ────────────────────────────────────

export interface MultilingualNotification {
  id: string
  type: "lesson_complete" | "certificate_earned" | "quiz_passed" | "streak"
  title: LocalizedString
  body: LocalizedString
}

export const NOTIFICATION_TEMPLATES: MultilingualNotification[] = [
  {
    id: "notif-lesson-complete",
    type: "lesson_complete",
    title: {
      en: "Lesson Complete! 🎉",
      fr: "Leçon terminée ! 🎉",
      es: "¡Lección completa! 🎉",
    },
    body: {
      en: "Great work! You've completed the lesson. Keep the momentum going.",
      fr: "Excellent travail ! Vous avez terminé la leçon. Continuez sur votre lancée.",
      es: "¡Gran trabajo! Has completado la lección. Sigue con el impulso.",
    },
  },
  {
    id: "notif-certificate",
    type: "certificate_earned",
    title: {
      en: "Certificate Earned! 🏆",
      fr: "Certificat obtenu ! 🏆",
      es: "¡Certificado obtenido! 🏆",
    },
    body: {
      en: "Congratulations! You've earned your NodLearn certificate.",
      fr: "Félicitations ! Vous avez obtenu votre certificat NodLearn.",
      es: "¡Felicidades! Has obtenido tu certificado NodLearn.",
    },
  },
]
