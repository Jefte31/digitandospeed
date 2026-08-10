// Bancos multilíngues do Digitando Speed.
// O idioma é escolhido pelo valor salvo em digitandoSpeedLanguage.
const DIGITANDO_WORD_BANKS = {
  pt: {
    easy: [
      "asa", "ave", "azul", "bola", "bom", "café", "céu", "chuva", "cor", "doce", "eco", "faro", "fogo", "gato", "giro", "hora",
      "ilha", "jogo", "lado", "lago", "luz", "mar", "mesa", "mundo", "nave", "noite", "onda", "paz", "pipa", "riso", "roda", "sal",
      "sol", "som", "tela", "terra", "vida", "vento", "voz", "zona", "água", "ação", "açúcar", "avô", "bebê", "botão", "caça", "cão",
      "chá", "fácil", "irmã", "limão", "maçã", "mãe", "mês", "pão", "pé", "você", "xícara", "ótimo", "único", "íris", "órgão", "queijo",
      "quilo", "xadrez", "zebra", "jarra", "kiwi", "web", "watt", "yoga", "yakisoba", "karaokê", "whisky"
    ],
    medium: [
      "alegria", "amanhã", "amigo", "avião", "batalha", "beleza", "brasil", "caminho", "canção", "cidade", "coração", "corrida", "criança", "desafio", "escola", "espaço",
      "estrela", "família", "feliz", "futuro", "galáxia", "história", "janela", "jardim", "liberdade", "máquina", "missão", "música", "oceano", "planeta", "praia", "rápido",
      "saúde", "segredo", "sonho", "tempo", "teclado", "universo", "viagem", "vitória", "ângulo", "câmera", "cômodo", "lâmpada", "médico", "pêssego", "tênis", "ônibus",
      "número", "fênix", "herói", "baú", "juízo", "raízes", "saída", "país", "difícil", "possível", "atenção", "emoção", "eleição", "questão", "razão", "feijão",
      "limões", "opções", "ações", "condição", "direção", "proteção", "tradição", "educação", "início", "exército", "experiência", "exemplo", "qualidade", "química", "quiosque", "xampu",
      "xadrezista", "zoológico", "jovem", "ketchup", "waffle", "website", "youtuber", "kilowatt", "workflow", "keyboard", "layout", "pixel", "àquela", "àquele"
    ],
    hard: [
      "aceleração", "aprendizado", "brasileiro", "comunicação", "concentração", "conhecimento", "criatividade", "desenvolver", "determinação", "eletricidade", "extraordinário", "habilidade",
      "imaginação", "independência", "inteligência", "maravilhoso", "oportunidade", "persistência", "possibilidade", "programação", "responsável", "sustentável", "tecnologia", "velocidade",
      "administração", "alfabetização", "apresentação", "argumentação", "articulação", "atualização", "característica", "circunstância", "colaboração", "compreensão", "configuração", "consciência",
      "consequência", "construção", "curiosidade", "decisão", "democrático", "descrição", "eficiência", "equilíbrio", "especialização", "estratégia", "evolução", "flexibilidade",
      "frequência", "identificação", "informação", "inovação", "integração", "interpretação", "organização", "participação", "percepção", "planejamento", "preocupação", "qualificação",
      "recuperação", "referência", "relação", "resolução", "significância", "transformação", "transmissão", "utilização", "visualização", "conexão", "exceção", "expansão", "oxigênio", "wikipédia", "workstation", "yakisoba", "karaokê"
    ],
    expert: [
      "aperfeiçoamento", "autoconhecimento", "compatibilidade", "desenvolvimento", "extraordinariamente", "interdisciplinar", "multidisciplinar", "responsabilidade", "sustentabilidade", "transformação",
      "ultraprocessado", "vulnerabilidade", "acessibilidade", "caracterização", "complementaridade", "conscientização", "contextualização", "descentralização", "disponibilidade", "empreendedorismo",
      "especialmente", "experimentação", "funcionalidade", "implementação", "imprevisibilidade", "incompatibilidade", "incompreensível", "institucionalização", "internacionalização", "interoperabilidade",
      "modernização", "personalização", "profissionalização", "representatividade", "ressignificação", "simultaneamente", "sistematização", "tecnologicamente", "territorialização", "universalização", "visualizável"
    ],
    bonus: [
      "inconstitucionalidade", "extraordinariamente", "interdisciplinaridade", "multidisciplinaridade", "internacionalização", "eletroencefalograma", "otorrinolaringologista", "paralelepípedo",
      "anticonstitucionalmente", "desproporcionalidade", "impermeabilização", "descaracterização", "profissionalização", "institucionalização", "responsabilização", "incompreensibilidade",
      "representatividade", "sustentabilidade", "compatibilização", "contextualização", "descentralização", "hipersensibilidade", "microprocessamento", "eletromagnetismo", "circunstancialmente",
      "contemporaneidade", "interdependência", "transdisciplinaridade", "extraordinário", "aperfeiçoamento"
    ],
    boss: [
      "velocidade e precisão vencem qualquer desafio", "cada tecla correta aproxima você da vitória", "concentração transforma prática em habilidade", "quem domina o teclado controla a missão",
      "o conhecimento abre caminhos para o futuro", "persistência e atenção constroem grandes resultados", "tecnologia e criatividade movem o mundo", "pratique com calma para ganhar velocidade",
      "uma mente focada supera qualquer obstáculo", "a experiência cresce a cada nova tentativa", "disciplina e constância fortalecem a aprendizagem", "digitar com precisão é melhor que correr sem controle",
      "a prática diária transforma esforço em excelência", "atenção aos detalhes faz toda a diferença", "desafios maiores revelam habilidades extraordinárias", "conhecimento criatividade e coragem mudam destinos",
      "o próximo nível começa com uma tecla correta", "confiança nasce quando prática encontra persistência", "uma decisão rápida exige atenção e precisão", "cada erro corrigido também faz parte da evolução"
    ]
  },

  en: {
    easy: [
      "air", "apple", "arm", "ball", "beach", "bird", "blue", "boat", "book", "box", "boy", "cake", "cat", "chair", "cloud", "cold", "day", "dog", "door", "dream",
      "earth", "easy", "fish", "fire", "flower", "food", "game", "green", "hand", "happy", "home", "house", "idea", "jump", "key", "lake", "light", "love", "moon", "music",
      "night", "ocean", "page", "peace", "phone", "rain", "road", "rock", "room", "school", "sea", "ship", "sky", "smile", "snow", "star", "sun", "table", "time", "tree", "voice",
      "water", "wind", "world", "yellow", "zebra", "quick", "quiet", "king", "window", "yoga", "pixel", "web", "watt", "keyboard"
    ],
    medium: [
      "adventure", "airplane", "answer", "autumn", "balance", "battle", "beauty", "bridge", "camera", "challenge", "change", "circle", "city", "coffee", "color", "computer",
      "country", "creative", "danger", "decision", "energy", "family", "future", "garden", "golden", "history", "holiday", "island", "journey", "knowledge", "language", "letter",
      "library", "machine", "memory", "mission", "moment", "mountain", "nature", "number", "planet", "practice", "problem", "program", "question", "rainbow", "reason", "rocket",
      "secret", "shadow", "simple", "space", "speed", "story", "strong", "summer", "system", "teacher", "technology", "travel", "universe", "victory", "village", "weather",
      "weekend", "welcome", "wonder", "writing", "yellowish", "website", "workflow", "layout", "ketchup", "waffle", "kilowatt", "youtuber"
    ],
    hard: [
      "acceleration", "achievement", "administration", "adventurous", "application", "architecture", "attention", "communication", "competition", "concentration", "configuration", "connection",
      "consequence", "construction", "creativity", "development", "determination", "education", "electricity", "environment", "experience", "extraordinary", "flexibility", "generation",
      "identification", "imagination", "independence", "information", "innovation", "integration", "intelligence", "interpretation", "opportunity", "organization", "participation", "performance",
      "persistence", "possibility", "preparation", "professional", "programming", "qualification", "relationship", "resolution", "responsibility", "significance", "specialization", "strategy",
      "sustainable", "transformation", "transmission", "understanding", "visualization", "workstation", "accessibility", "compatibility", "collaboration", "curiosity", "efficiency", "evolution"
    ],
    expert: [
      "acknowledgement", "characterization", "complementarity", "conceptualization", "contextualization", "decentralization", "disproportionately", "entrepreneurship", "experimentation", "extraordinarily",
      "implementation", "incompatibility", "incomprehensible", "institutionalization", "interdisciplinary", "internationalization", "interoperability", "misinterpretation", "multidisciplinary", "personalization",
      "professionalization", "representativeness", "responsiveness", "simultaneously", "standardization", "sustainability", "technologically", "unpredictability", "universalization", "vulnerability"
    ],
    bonus: [
      "counterrevolutionary", "electroencephalogram", "institutionalization", "internationalization", "interdisciplinary", "multidisciplinary", "miscommunication", "characterization", "professionalization",
      "representativeness", "incomprehensibility", "disproportionality", "interdependence", "contextualization", "decentralization", "microarchitecture", "electromagnetism", "extraordinarily",
      "compatibility", "sustainability", "unpredictability", "responsibility", "transdisciplinary", "hyperconnectivity"
    ],
    boss: [
      "speed and accuracy overcome every challenge", "every correct key brings you closer to victory", "focus turns practice into real skill", "those who master the keyboard control the mission",
      "knowledge opens paths toward the future", "persistence and attention create strong results", "technology and creativity move the world", "practice calmly to build greater speed",
      "a focused mind can overcome any obstacle", "experience grows with every new attempt", "discipline and consistency strengthen learning", "typing accurately is better than rushing without control",
      "daily practice transforms effort into excellence", "attention to detail makes all the difference", "greater challenges reveal extraordinary abilities", "knowledge creativity and courage can change destinies",
      "the next level begins with one correct key", "confidence grows when practice meets persistence"
    ]
  },

  fr: {
    easy: [
      "ami", "arbre", "bleu", "bon", "bras", "café", "chat", "chaud", "clé", "cœur", "ciel", "eau", "école", "été", "fleur", "froid", "feu", "fille", "garçon", "heure",
      "île", "jeu", "jour", "lac", "livre", "lune", "main", "maison", "mer", "monde", "mot", "neige", "nuit", "oiseau", "pain", "paix", "pied", "plage", "pluie", "porte",
      "route", "rue", "sac", "sel", "soleil", "son", "table", "temps", "terre", "tête", "vent", "vert", "vie", "ville", "voix", "zèbre", "étoile", "écran", "clé", "yoga",
      "kiwi", "web", "watt", "pixel", "clavier", "rapide", "calme", "joie", "rêve", "rose"
    ],
    medium: [
      "aventure", "avion", "avenir", "beauté", "bonheur", "bataille", "bateau", "bureau", "caméra", "chanson", "chemin", "classe", "couleur", "courage", "défi", "espace",
      "famille", "forêt", "futur", "galaxie", "histoire", "jardin", "langage", "liberté", "lumière", "machine", "mémoire", "mission", "musique", "nature", "nombre", "océan",
      "planète", "possible", "pratique", "question", "raison", "réponse", "rivière", "santé", "secret", "simple", "sourire", "système", "technologie", "travail", "univers", "victoire",
      "village", "voyage", "énergie", "équipe", "évolution", "qualité", "décision", "attention", "émotion", "direction", "protection", "tradition", "éducation", "expérience", "exemple",
      "chimie", "hôpital", "héros", "fenêtre", "théâtre", "météo", "weekend", "website", "workflow", "layout", "kilowatt", "youtuber"
    ],
    hard: [
      "accélération", "administration", "apprentissage", "architecture", "communication", "concentration", "configuration", "connaissance", "conséquence", "construction", "créativité", "développement",
      "détermination", "électricité", "extraordinaire", "flexibilité", "fréquence", "identification", "imagination", "indépendance", "information", "innovation", "intégration", "intelligence",
      "interprétation", "organisation", "participation", "perception", "persévérance", "planification", "possibilité", "préparation", "programmation", "qualification", "récupération", "référence",
      "relation", "résolution", "responsabilité", "signification", "spécialisation", "stratégie", "transformation", "transmission", "utilisation", "visualisation", "collaboration", "compréhension",
      "conscience", "curiosité", "démocratique", "description", "efficacité", "équilibre", "exception", "expansion", "oxygène", "wikipédia", "workstation"
    ],
    expert: [
      "accessibilité", "caractérisation", "complémentarité", "conceptualisation", "conscientisation", "contextualisation", "décentralisation", "disponibilité", "entrepreneuriat", "expérimentation",
      "extraordinairement", "fonctionnalité", "implémentation", "imprévisibilité", "incompatibilité", "incompréhensible", "institutionnalisation", "interdisciplinaire", "internationalisation", "interopérabilité",
      "multidisciplinaire", "personnalisation", "professionnalisation", "représentativité", "simultanément", "systématisation", "technologiquement", "territorialisation", "universalisation", "vulnérabilité"
    ],
    bonus: [
      "anticonstitutionnellement", "électroencéphalogramme", "otorhinolaryngologiste", "internationalisation", "institutionnalisation", "interdisciplinarité", "multidisciplinarité", "professionnalisation",
      "représentativité", "incompréhensibilité", "disproportionnalité", "imperméabilisation", "contextualisation", "décentralisation", "hypersensibilité", "microprocesseur", "électromagnétisme",
      "circonstanciellement", "contemporanéité", "interdépendance", "transdisciplinarité", "extraordinaire", "perfectionnement", "responsabilisation"
    ],
    boss: [
      "vitesse et précision surmontent tous les défis", "chaque touche correcte vous rapproche de la victoire", "la concentration transforme la pratique en compétence", "maîtriser le clavier permet de contrôler la mission",
      "la connaissance ouvre les chemins du futur", "persévérance et attention produisent de grands résultats", "technologie et créativité font avancer le monde", "pratiquez calmement pour gagner en vitesse",
      "un esprit concentré surmonte tous les obstacles", "l'expérience grandit à chaque nouvelle tentative", "discipline et constance renforcent l'apprentissage", "taper avec précision vaut mieux que courir sans contrôle",
      "la pratique quotidienne transforme l'effort en excellence", "l'attention aux détails fait toute la différence", "les grands défis révèlent des capacités extraordinaires", "connaissance créativité et courage changent les destins",
      "le niveau suivant commence par une touche correcte", "la confiance naît lorsque la pratique rencontre la persévérance"
    ]
  },

  es: {
    easy: [
      "ala", "amigo", "azul", "barco", "bien", "bola", "café", "calle", "casa", "cielo", "color", "día", "dulce", "flor", "fuego", "gato", "giro", "hora", "isla", "juego",
      "lado", "lago", "luz", "mano", "mar", "mesa", "mundo", "nave", "noche", "ola", "pan", "paz", "pie", "playa", "risa", "rojo", "sal", "sol", "sonido", "taza", "tierra",
      "vida", "viento", "voz", "agua", "acción", "azúcar", "bebé", "botón", "caña", "fácil", "limón", "mamá", "mes", "niño", "país", "rápido", "único", "árbol", "órgano", "queso",
      "kilogramo", "ajedrez", "cebra", "jarra", "kiwi", "web", "watt", "yoga", "pixel", "tecla"
    ],
    medium: [
      "alegría", "mañana", "amable", "avión", "batalla", "belleza", "camino", "canción", "ciudad", "corazón", "carrera", "desafío", "escuela", "espacio", "estrella", "familia",
      "felicidad", "futuro", "galaxia", "historia", "jardín", "libertad", "máquina", "misión", "música", "océano", "planeta", "posible", "salud", "secreto", "sueño", "tiempo",
      "teclado", "universo", "viaje", "victoria", "ángulo", "cámara", "médico", "número", "héroe", "raíces", "salida", "difícil", "atención", "emoción", "elección", "cuestión",
      "razón", "opciones", "acciones", "condición", "dirección", "protección", "tradición", "educación", "inicio", "ejército", "experiencia", "ejemplo", "calidad", "química", "quiosco",
      "zoológico", "joven", "ketchup", "waffle", "website", "youtuber", "kilowatt", "workflow", "layout", "ventana", "memoria", "energía"
    ],
    hard: [
      "aceleración", "aprendizaje", "arquitectura", "comunicación", "concentración", "conocimiento", "creatividad", "desarrollo", "determinación", "electricidad", "extraordinario", "habilidad",
      "imaginación", "independencia", "inteligencia", "maravilloso", "oportunidad", "persistencia", "posibilidad", "programación", "responsable", "sostenible", "tecnología", "velocidad",
      "administración", "alfabetización", "presentación", "argumentación", "articulación", "actualización", "característica", "circunstancia", "colaboración", "comprensión", "configuración", "conciencia",
      "consecuencia", "construcción", "curiosidad", "decisión", "democrático", "descripción", "eficiencia", "equilibrio", "especialización", "estrategia", "evolución", "flexibilidad",
      "frecuencia", "identificación", "información", "innovación", "integración", "interpretación", "organización", "participación", "percepción", "planificación", "preocupación", "calificación",
      "recuperación", "referencia", "relación", "resolución", "transformación", "transmisión", "utilización", "visualización", "conexión", "excepción", "expansión", "oxígeno", "wikipedia", "workstation"
    ],
    expert: [
      "perfeccionamiento", "autoconocimiento", "compatibilidad", "extraordinariamente", "interdisciplinario", "multidisciplinario", "responsabilidad", "sostenibilidad", "vulnerabilidad", "accesibilidad",
      "caracterización", "complementariedad", "concientización", "contextualización", "descentralización", "disponibilidad", "emprendimiento", "experimentación", "funcionalidad", "implementación",
      "imprevisibilidad", "incompatibilidad", "incomprensible", "institucionalización", "internacionalización", "interoperabilidad", "modernización", "personalización", "profesionalización", "representatividad",
      "resignificación", "simultáneamente", "sistematización", "tecnológicamente", "territorialización", "universalización"
    ],
    bonus: [
      "anticonstitucionalmente", "electroencefalograma", "otorrinolaringólogo", "internacionalización", "interdisciplinariedad", "multidisciplinariedad", "desproporcionalidad", "impermeabilización",
      "descaracterización", "profesionalización", "institucionalización", "responsabilización", "incomprensibilidad", "representatividad", "sostenibilidad", "compatibilización", "contextualización",
      "descentralización", "hipersensibilidad", "microprocesamiento", "electromagnetismo", "circunstancialmente", "contemporaneidad", "interdependencia", "transdisciplinariedad", "extraordinario", "perfeccionamiento"
    ],
    boss: [
      "velocidad y precisión superan cualquier desafío", "cada tecla correcta te acerca a la victoria", "la concentración transforma la práctica en habilidad", "quien domina el teclado controla la misión",
      "el conocimiento abre caminos hacia el futuro", "persistencia y atención construyen grandes resultados", "la tecnología y la creatividad mueven el mundo", "practica con calma para ganar velocidad",
      "una mente enfocada supera cualquier obstáculo", "la experiencia crece con cada nuevo intento", "disciplina y constancia fortalecen el aprendizaje", "escribir con precisión es mejor que correr sin control",
      "la práctica diaria transforma esfuerzo en excelencia", "la atención a los detalles marca la diferencia", "los grandes desafíos revelan habilidades extraordinarias", "conocimiento creatividad y coraje cambian destinos",
      "el siguiente nivel comienza con una tecla correcta", "la confianza nace cuando la práctica encuentra persistencia"
    ]
  }
};

const savedLanguage = localStorage.getItem("digitandoSpeedLanguage") || "pt";
window.DIGITANDO_WORDS_BY_LANGUAGE = DIGITANDO_WORD_BANKS;
window.DIGITANDO_WORDS = DIGITANDO_WORD_BANKS[savedLanguage] || DIGITANDO_WORD_BANKS.pt;
