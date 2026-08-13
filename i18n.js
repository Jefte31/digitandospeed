(() => {
  "use strict";

  const KEY = "digitandoSpeedLanguage";
  const LANGS = {
    pt: { label: "Português", short: "PT-BR", html: "pt-BR" },
    en: { label: "English", short: "EN", html: "en" },
    fr: { label: "Français", short: "FR", html: "fr" },
    es: { label: "Español", short: "ES", html: "es" }
  };
  let lang = localStorage.getItem(KEY) || "pt";
  if (!LANGS[lang]) lang = "pt";
  const modality = location.pathname.toLowerCase().includes("numpad") ? "numpad" : "words";
  document.documentElement.lang = LANGS[lang].html;
  window.DS_LANGUAGE = lang;

  const M = {
    en: {
      "PONTOS":"POINTS","NÍVEL":"LEVEL","PPM":"WPM","PRECISÃO":"ACCURACY","ESCUDO":"SHIELD","TREINO":"TRAINING","MODO":"MODE","Palavras":"Words","PALAVRAS":"WORDS",
      "Fácil":"Easy","Médio":"Medium","Difícil":"Hard","Extremo":"Extreme","Mais tempo para digitar":"More time to type","Experiência padrão":"Standard experience","Mais rápido e intenso":"Faster and more intense","Para digitadores velozes":"For fast typists",
      "TREINE • ACELERE • DOMINE":"TRAIN • ACCELERATE • MASTER","Destrua as ameaças digitando as palavras em português antes que elas alcancem sua nave.":"Destroy the threats by typing the words before they reach your ship.","Vocabulário brasileiro":"English vocabulary","Dificuldade progressiva":"Progressive difficulty","Velocidade em tempo real":"Real-time speed","Precisão e combo":"Accuracy and combo",
      "ESCOLHA O TIPO DE TREINO":"CHOOSE TRAINING TYPE","Letras, acentos e frases":"Letters, accents and phrases","Teclado numérico 0–9":"Numeric keypad 0–9","ESCOLHA A DIFICULDADE":"CHOOSE DIFFICULTY","INICIAR MISSÃO":"START MISSION","Recorde local:":"Local record:",
      "TREINO DO TECLADO NUMÉRICO":"NUMERIC KEYPAD TRAINING","Destrua as sequências usando apenas os números de 0 a 9 antes que elas alcancem sua nave.":"Destroy the sequences using only numbers 0 through 9 before they reach your ship.","Teclado numérico":"Numeric keypad","Mais dígitos por nível":"More digits per level","Bônus e chefões":"Bonuses and bosses","TIPO DE TREINO":"TRAINING TYPE","Voltar ao treino PT-BR":"Back to word training","Números de 0 a 9":"Numbers 0 through 9","1–2 dígitos no início":"1–2 digits at first","Sequências progressivas":"Progressive sequences","Sequências maiores":"Longer sequences","Alta velocidade numérica":"High numeric speed","INICIAR TREINO NUMÉRICO":"START NUMERIC TRAINING","Recorde Numpad:":"Numpad record:",
      "MISSÃO SUSPENSA":"MISSION PAUSED","TREINO SUSPENSO":"TRAINING PAUSED","Missão pausada":"Mission paused","Seu progresso está seguro.":"Your progress is safe.","CONTINUAR":"CONTINUE","VOLTAR AO MENU":"BACK TO MENU","MISSÃO ENCERRADA":"MISSION ENDED","TREINO ENCERRADO":"TRAINING ENDED","Fim da missão":"Mission ended","PONTUAÇÃO":"SCORE","NOVO RECORDE!":"NEW RECORD!","NOVO RECORDE NUMPAD!":"NEW NUMPAD RECORD!","NOVA MISSÃO":"NEW MISSION",
      "COMANDANTE DA MISSÃO":"MISSION COMMANDER","Informe o nome do comandante para iniciar.":"Enter the commander's name to start.","🏆 VER RANKING":"🏆 VIEW RANKING","HISTÓRICO DE DESEMPENHO":"PERFORMANCE HISTORY","Ranking Palavras":"Word Ranking","Ranking Numpad":"Numpad Ranking","Melhores comandantes deste navegador, separados por dificuldade e nível alcançado.":"Best commanders on this browser, separated by difficulty and level reached.","FILTRAR POR NÍVEL ALCANÇADO":"FILTER BY LEVEL REACHED","Todos os níveis":"All levels","Comandante":"Commander","Ranking local: nomes e resultados ficam salvos somente neste navegador.":"Local ranking: names and results are stored only in this browser.","Anônimo":"Anonymous",
      "ERRO • FRASE LIBERADA":"ERROR • PHRASE RELEASED","ERRO • ALVO LIBERADO":"ERROR • TARGET RELEASED","ERRO • SEQUÊNCIA LIBERADA":"ERROR • SEQUENCE RELEASED","ERRO • NÚMERO LIBERADO":"ERROR • NUMBER RELEASED","PALAVRA REINICIADA":"WORD RESET","FRASE REINICIADA":"PHRASE RESET","NÚMERO REINICIADO":"NUMBER RESET","SEQUÊNCIA REINICIADA":"SEQUENCE RESET","ESCUDO DANIFICADO":"SHIELD DAMAGED","ESCUDO RESTAURADO!":"SHIELD RESTORED!","CHEFÃO DESTRUÍDO!":"BOSS DESTROYED!","BÔNUS DE LIMPEZA!":"CLEAR BONUS!"
    },
    fr: {
      "PONTOS":"POINTS","NÍVEL":"NIVEAU","PPM":"MPM","PRECISÃO":"PRÉCISION","ESCUDO":"BOUCLIER","TREINO":"ENTRAÎNEMENT","MODO":"MODE","Palavras":"Mots","PALAVRAS":"MOTS","NUMPAD":"PAVÉ NUM.",
      "Fácil":"Facile","Médio":"Moyen","Difícil":"Difficile","Extremo":"Extrême","Mais tempo para digitar":"Plus de temps pour taper","Experiência padrão":"Expérience standard","Mais rápido e intenso":"Plus rapide et intense","Para digitadores velozes":"Pour les dactylos rapides",
      "TREINE • ACELERE • DOMINE":"ENTRAÎNEZ • ACCÉLÉREZ • MAÎTRISEZ","Destrua as ameaças digitando as palavras em português antes que elas alcancem sua nave.":"Détruisez les menaces en tapant les mots avant qu'elles n'atteignent votre vaisseau.","Vocabulário brasileiro":"Vocabulaire français","Dificuldade progressiva":"Difficulté progressive","Velocidade em tempo real":"Vitesse en temps réel","Precisão e combo":"Précision et combo",
      "ESCOLHA O TIPO DE TREINO":"CHOISISSEZ LE TYPE D'ENTRAÎNEMENT","Letras, acentos e frases":"Lettres, accents et phrases","Teclado numérico 0–9":"Pavé numérique 0–9","ESCOLHA A DIFICULDADE":"CHOISISSEZ LA DIFFICULTÉ","INICIAR MISSÃO":"DÉMARRER LA MISSION","Recorde local:":"Record local :",
      "TREINO DO TECLADO NUMÉRICO":"ENTRAÎNEMENT AU PAVÉ NUMÉRIQUE","Destrua as sequências usando apenas os números de 0 a 9 antes que elas alcancem sua nave.":"Détruisez les séquences avec les chiffres de 0 à 9 avant qu'elles n'atteignent votre vaisseau.","Teclado numérico":"Pavé numérique","Mais dígitos por nível":"Plus de chiffres par niveau","Bônus e chefões":"Bonus et boss","TIPO DE TREINO":"TYPE D'ENTRAÎNEMENT","Voltar ao treino PT-BR":"Retour à l'entraînement des mots","Números de 0 a 9":"Chiffres de 0 à 9","1–2 dígitos no início":"1–2 chiffres au début","Sequências progressivas":"Séquences progressives","Sequências maiores":"Séquences plus longues","Alta velocidade numérica":"Grande vitesse numérique","INICIAR TREINO NUMÉRICO":"DÉMARRER L'ENTRAÎNEMENT","Recorde Numpad:":"Record pavé num. :",
      "MISSÃO SUSPENSA":"MISSION EN PAUSE","TREINO SUSPENSO":"ENTRAÎNEMENT EN PAUSE","Missão pausada":"Mission en pause","Seu progresso está seguro.":"Votre progression est sauvegardée.","CONTINUAR":"CONTINUER","VOLTAR AO MENU":"RETOUR AU MENU","MISSÃO ENCERRADA":"MISSION TERMINÉE","TREINO ENCERRADO":"ENTRAÎNEMENT TERMINÉ","Fim da missão":"Fin de la mission","PONTUAÇÃO":"SCORE","NOVO RECORDE!":"NOUVEAU RECORD !","NOVO RECORDE NUMPAD!":"NOUVEAU RECORD NUMÉRIQUE !","NOVA MISSÃO":"NOUVELLE MISSION",
      "COMANDANTE DA MISSÃO":"COMMANDANT DE MISSION","Informe o nome do comandante para iniciar.":"Entrez le nom du commandant pour commencer.","🏆 VER RANKING":"🏆 VOIR LE CLASSEMENT","HISTÓRICO DE DESEMPENHO":"HISTORIQUE DES PERFORMANCES","Ranking Palavras":"Classement Mots","Ranking Numpad":"Classement Pavé numérique","Melhores comandantes deste navegador, separados por dificuldade e nível alcançado.":"Meilleurs commandants de ce navigateur, classés par difficulté et niveau atteint.","FILTRAR POR NÍVEL ALCANÇADO":"FILTRER PAR NIVEAU ATTEINT","Todos os níveis":"Tous les niveaux","Comandante":"Commandant","Ranking local: nomes e resultados ficam salvos somente neste navegador.":"Classement local : noms et résultats sont enregistrés uniquement dans ce navigateur.","Anônimo":"Anonyme",
      "ERRO • FRASE LIBERADA":"ERREUR • PHRASE LIBÉRÉE","ERRO • ALVO LIBERADO":"ERREUR • CIBLE LIBÉRÉE","ERRO • SEQUÊNCIA LIBERADA":"ERREUR • SÉQUENCE LIBÉRÉE","ERRO • NÚMERO LIBERADO":"ERREUR • NOMBRE LIBÉRÉ","PALAVRA REINICIADA":"MOT RÉINITIALISÉ","FRASE REINICIADA":"PHRASE RÉINITIALISÉE","NÚMERO REINICIADO":"NOMBRE RÉINITIALISÉ","SEQUÊNCIA REINICIADA":"SÉQUENCE RÉINITIALISÉE","ESCUDO DANIFICADO":"BOUCLIER ENDOMMAGÉ","ESCUDO RESTAURADO!":"BOUCLIER RESTAURÉ !","CHEFÃO DESTRUÍDO!":"BOSS DÉTRUIT !","BÔNUS DE LIMPEZA!":"BONUS DE NETTOYAGE !"
    },
    es: {
      "PONTOS":"PUNTOS","NÍVEL":"NIVEL","PPM":"PPM","PRECISÃO":"PRECISIÓN","ESCUDO":"ESCUDO","TREINO":"ENTRENAMIENTO","MODO":"MODO","Palavras":"Palabras","PALAVRAS":"PALABRAS",
      "Fácil":"Fácil","Médio":"Medio","Difícil":"Difícil","Extremo":"Extremo","Mais tempo para digitar":"Más tiempo para escribir","Experiência padrão":"Experiencia estándar","Mais rápido e intenso":"Más rápido e intenso","Para digitadores velozes":"Para mecanógrafos veloces",
      "TREINE • ACELERE • DOMINE":"ENTRENA • ACELERA • DOMINA","Destrua as ameaças digitando as palavras em português antes que elas alcancem sua nave.":"Destruye las amenazas escribiendo las palabras antes de que alcancen tu nave.","Vocabulário brasileiro":"Vocabulario español","Dificuldade progressiva":"Dificultad progresiva","Velocidade em tempo real":"Velocidad en tiempo real","Precisão e combo":"Precisión y combo",
      "ESCOLHA O TIPO DE TREINO":"ELIGE EL TIPO DE ENTRENAMIENTO","Letras, acentos e frases":"Letras, acentos y frases","Teclado numérico 0–9":"Teclado numérico 0–9","ESCOLHA A DIFICULDADE":"ELIGE LA DIFICULTAD","INICIAR MISSÃO":"INICIAR MISIÓN","Recorde local:":"Récord local:",
      "TREINO DO TECLADO NUMÉRICO":"ENTRENAMIENTO DEL TECLADO NUMÉRICO","Destrua as sequências usando apenas os números de 0 a 9 antes que elas alcancem sua nave.":"Destruye las secuencias usando solo los números del 0 al 9 antes de que alcancen tu nave.","Teclado numérico":"Teclado numérico","Mais dígitos por nível":"Más dígitos por nivel","Bônus e chefões":"Bonos y jefes","TIPO DE TREINO":"TIPO DE ENTRENAMIENTO","Voltar ao treino PT-BR":"Volver al entrenamiento de palabras","Números de 0 a 9":"Números del 0 al 9","1–2 dígitos no início":"1–2 dígitos al inicio","Sequências progressivas":"Secuencias progresivas","Sequências maiores":"Secuencias más largas","Alta velocidade numérica":"Alta velocidad numérica","INICIAR TREINO NUMÉRICO":"INICIAR ENTRENAMIENTO NUMÉRICO","Recorde Numpad:":"Récord Numpad:",
      "MISSÃO SUSPENSA":"MISIÓN EN PAUSA","TREINO SUSPENSO":"ENTRENAMIENTO EN PAUSA","Missão pausada":"Misión pausada","Seu progresso está seguro.":"Tu progreso está seguro.","CONTINUAR":"CONTINUAR","VOLTAR AO MENU":"VOLVER AL MENÚ","MISSÃO ENCERRADA":"MISIÓN FINALIZADA","TREINO ENCERRADO":"ENTRENAMIENTO FINALIZADO","Fim da missão":"Fin de la misión","PONTUAÇÃO":"PUNTUACIÓN","NOVO RECORDE!":"¡NUEVO RÉCORD!","NOVO RECORDE NUMPAD!":"¡NUEVO RÉCORD NUMPAD!","NOVA MISSÃO":"NUEVA MISIÓN",
      "COMANDANTE DA MISSÃO":"COMANDANTE DE LA MISIÓN","Informe o nome do comandante para iniciar.":"Escribe el nombre del comandante para comenzar.","🏆 VER RANKING":"🏆 VER RANKING","HISTÓRICO DE DESEMPENHO":"HISTORIAL DE RENDIMIENTO","Ranking Palavras":"Ranking de Palabras","Ranking Numpad":"Ranking Numpad","Melhores comandantes deste navegador, separados por dificuldade e nível alcançado.":"Mejores comandantes de este navegador, separados por dificultad y nivel alcanzado.","FILTRAR POR NÍVEL ALCANÇADO":"FILTRAR POR NIVEL ALCANZADO","Todos os níveis":"Todos los niveles","Comandante":"Comandante","Ranking local: nomes e resultados ficam salvos somente neste navegador.":"Ranking local: nombres y resultados se guardan solo en este navegador.","Anônimo":"Anónimo",
      "ERRO • FRASE LIBERADA":"ERROR • FRASE LIBERADA","ERRO • ALVO LIBERADO":"ERROR • OBJETIVO LIBERADO","ERRO • SEQUÊNCIA LIBERADA":"ERROR • SECUENCIA LIBERADA","ERRO • NÚMERO LIBERADO":"ERROR • NÚMERO LIBERADO","PALAVRA REINICIADA":"PALABRA REINICIADA","FRASE REINICIADA":"FRASE REINICIADA","NÚMERO REINICIADO":"NÚMERO REINICIADO","SEQUÊNCIA REINICIADA":"SECUENCIA REINICIADA","ESCUDO DANIFICADO":"ESCUDO DAÑADO","ESCUDO RESTAURADO!":"¡ESCUDO RESTAURADO!","CHEFÃO DESTRUÍDO!":"¡JEFE DESTRUIDO!","BÔNUS DE LIMPEZA!":"¡BONO DE LIMPIEZA!"
    }
  };

  const map = M[lang] || {};
  const diffNames = { easy:{pt:"Fácil",en:"Easy",fr:"Facile",es:"Fácil"}, medium:{pt:"Médio",en:"Medium",fr:"Moyen",es:"Medio"}, hard:{pt:"Difícil",en:"Hard",fr:"Difficile",es:"Difícil"}, extreme:{pt:"Extremo",en:"Extreme",fr:"Extrême",es:"Extremo"} };
  const levelWord = {pt:"Nível",en:"Level",fr:"Niveau",es:"Nivel"}[lang];

  function dynamic(s) {
    let out = map[s] || s;
    if (out !== s) return out;
    if (/^Nível \d+$/.test(s)) return s.replace("Nível", levelWord);
    if (/^NÍVEL \d+$/.test(s)) return s.replace("NÍVEL", levelWord.toUpperCase());
    const reps = lang === "en" ? [["MISSÃO • ","MISSION • "],["BÔNUS • ","BONUS • "],["LIMPEZA TOTAL","TOTAL CLEAR"],["CÂMERA LENTA","SLOW MOTION"],["CHEFÃO NUMÉRICO","NUMERIC BOSS"],["CHEFÃO","BOSS"],["NÍVEL","LEVEL"],["10 SEGUNDOS","10 SECONDS"],["BÔNUS PERDIDO • MISSÃO CONTINUA","BONUS MISSED • MISSION CONTINUES"],["BÔNUS PERDIDO • TREINO CONTINUA","BONUS MISSED • TRAINING CONTINUES"],["ESCAPOU","ESCAPED"],["DANIFICADO","DAMAGED"],["AMEAÇAS ELIMINADAS","THREATS ELIMINATED"],["AMEAÇAS","THREATS"],["ALVOS ELIMINADOS","TARGETS ELIMINATED"],["ALVOS","TARGETS"],["ATIVO","ACTIVE"],["JÁ ESTAVA COMPLETO","WAS ALREADY FULL"],["COMPLETO","FULL"]]
      : lang === "fr" ? [["MISSÃO • ","MISSION • "],["BÔNUS • ","BONUS • "],["LIMPEZA TOTAL","NETTOYAGE TOTAL"],["CÂMERA LENTA","RALENTI"],["CHEFÃO NUMÉRICO","BOSS NUMÉRIQUE"],["CHEFÃO","BOSS"],["NÍVEL","NIVEAU"],["10 SEGUNDOS","10 SECONDES"],["BÔNUS PERDIDO • MISSÃO CONTINUA","BONUS MANQUÉ • LA MISSION CONTINUE"],["BÔNUS PERDIDO • TREINO CONTINUA","BONUS MANQUÉ • L'ENTRAÎNEMENT CONTINUE"],["ESCAPOU","S'EST ÉCHAPPÉ"],["DANIFICADO","ENDOMMAGÉ"],["AMEAÇAS ELIMINADAS","MENACES ÉLIMINÉES"],["AMEAÇAS","MENACES"],["ALVOS ELIMINADOS","CIBLES ÉLIMINÉES"],["ALVOS","CIBLES"],["ATIVO","ACTIF"],["JÁ ESTAVA COMPLETO","ÉTAIT DÉJÀ COMPLET"],["COMPLETO","COMPLET"]]
      : lang === "es" ? [["MISSÃO • ","MISIÓN • "],["BÔNUS • ","BONO • "],["LIMPEZA TOTAL","LIMPIEZA TOTAL"],["CÂMERA LENTA","CÁMARA LENTA"],["CHEFÃO NUMÉRICO","JEFE NUMÉRICO"],["CHEFÃO","JEFE"],["NÍVEL","NIVEL"],["BÔNUS PERDIDO • MISSÃO CONTINUA","BONO PERDIDO • LA MISIÓN CONTINÚA"],["BÔNUS PERDIDO • TREINO CONTINUA","BONO PERDIDO • EL ENTRENAMIENTO CONTINÚA"],["ESCAPOU","ESCAPÓ"],["DANIFICADO","DAÑADO"],["AMEAÇAS ELIMINADAS","AMENAZAS ELIMINADAS"],["AMEAÇAS","AMENAZAS"],["ALVOS ELIMINADOS","OBJETIVOS ELIMINADOS"],["ALVOS","OBJETIVOS"],["ATIVO","ACTIVO"],["JÁ ESTAVA COMPLETO","YA ESTABA COMPLETO"]] : [];
    reps.forEach(([a,b]) => { out = out.replace(a,b); });
    Object.values(diffNames).forEach(v => { if (v.pt.toUpperCase() !== v[lang].toUpperCase()) out = out.replaceAll(v.pt.toUpperCase(), v[lang].toUpperCase()); });
    return out;
  }
  window.DS_T = dynamic;

  function translateTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || node.parentElement?.id === "currentDifficulty") return;
    const raw = node.nodeValue;
    const trimmed = raw.trim();
    if (!trimmed) return;
    const translated = dynamic(trimmed);
    if (translated !== trimmed) node.nodeValue = raw.replace(trimmed, translated);
  }

  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) return translateTextNode(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) translateTextNode(n);
    applyAttrs(root);
  }

  function applyAttrs(root = document) {
    const commander = root.querySelector?.("#commanderName") || (root.id === "commanderName" ? root : null);
    if (commander) commander.placeholder = {pt:"Digite o nome do jogador",en:"Enter player name",fr:"Entrez le nom du joueur",es:"Escribe el nombre del jugador"}[lang];
    const sound = document.getElementById("soundBtn"); if (sound) { const s={pt:"Som",en:"Sound",fr:"Son",es:"Sonido"}[lang]; sound.title=s; sound.setAttribute("aria-label",s); }
    const pause = document.getElementById("pauseBtn"); if (pause) { const s={pt:"Pausar (Tab)",en:"Pause (Tab)",fr:"Pause (Tab)",es:"Pausar (Tab)"}[lang]; pause.title=s; pause.setAttribute("aria-label",s); }
  }

  function setDifficultyDisplay() {
    const current = document.getElementById("currentDifficulty");
    if (!current) return;
    const key = document.querySelector(".difficulty-btn.active")?.dataset.difficulty || "medium";
    current.classList.add("localized-difficulty");
    current.dataset.display = diffNames[key][lang];
  }

  function injectPicker() {
    if (document.getElementById("languagePicker")) return;
    const lead = document.querySelector("#startScreen .hero-panel .lead");
    if (!lead) return;
    const box = document.createElement("div");
    box.id="languagePicker"; box.className="language-picker";
    const title={pt:"IDIOMA",en:"LANGUAGE",fr:"LANGUE",es:"IDIOMA"}[lang];
    box.innerHTML=`<p class="language-title">${title}</p><div class="language-options">${Object.entries(LANGS).map(([k,v])=>`<button type="button" class="language-btn${k===lang?" active":""}" data-language="${k}" aria-pressed="${k===lang}"><strong>${v.short}</strong><span>${v.label}</span></button>`).join("")}</div>`;
    lead.insertAdjacentElement("afterend",box);
    box.querySelectorAll("[data-language]").forEach(b=>b.addEventListener("click",()=>{const next=b.dataset.language;if(next===lang)return;localStorage.setItem(KEY,next);location.reload();}));
  }

  function translateInstructions() {
    const tip=document.querySelector("#startScreen .keyboard-tip"); if(!tip)return;
    if(modality==="words") tip.innerHTML={pt:'Comece digitando qualquer palavra • <kbd>Tab</kbd> pausa/continua • <kbd>Espaço</kbd> faz parte das frases • <kbd>Backspace</kbd> reinicia o alvo',en:'Start typing any word • <kbd>Tab</kbd> pauses/resumes • <kbd>Space</kbd> is part of phrases • <kbd>Backspace</kbd> resets the target',fr:'Commencez à taper un mot • <kbd>Tab</kbd> pause/reprend • <kbd>Espace</kbd> fait partie des phrases • <kbd>Backspace</kbd> réinitialise la cible',es:'Empieza escribiendo cualquier palabra • <kbd>Tab</kbd> pausa/continúa • <kbd>Espacio</kbd> forma parte de las frases • <kbd>Backspace</kbd> reinicia el objetivo'}[lang];
    else tip.innerHTML={pt:'Digite apenas <kbd>0–9</kbd> • <kbd>Tab</kbd> pausa/continua • <kbd>Backspace</kbd> reinicia o alvo',en:'Type only <kbd>0–9</kbd> • <kbd>Tab</kbd> pauses/resumes • <kbd>Backspace</kbd> resets the target',fr:'Tapez seulement <kbd>0–9</kbd> • <kbd>Tab</kbd> pause/reprend • <kbd>Backspace</kbd> réinitialise la cible',es:'Escribe solo <kbd>0–9</kbd> • <kbd>Tab</kbd> pausa/continúa • <kbd>Backspace</kbd> reinicia el objetivo'}[lang];
  }

  const nativeFillText = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function(text, ...args) { return nativeFillText.call(this, dynamic(String(text)), ...args); };

  injectPicker();
  translateTree(document.body);
  translateInstructions();
  applyAttrs();
  setDifficultyDisplay();
  document.querySelectorAll(".difficulty-btn").forEach(b=>b.addEventListener("click",()=>setTimeout(setDifficultyDisplay,0)));

  new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === "characterData") translateTextNode(m.target);
      else if (m.type === "childList") m.addedNodes.forEach(n => translateTree(n));
      else if (m.type === "attributes" && m.target.classList?.contains("difficulty-btn")) setDifficultyDisplay();
    }
  }).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class"]});
})();
