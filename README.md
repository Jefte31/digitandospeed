# DIGITSPEED 🚀⌨️

Jogo de treino de digitação em estilo espacial, com modos de **palavras** e **teclado numérico (Numpad)**.

## Recursos atuais

- Treino de palavras em **Português, English, Français e Español**.
- Banco próprio de palavras, bônus e frases de chefão para cada idioma.
- Modo **Numpad** para treinamento com números de 0 a 9.
- Dificuldades Fácil, Médio, Difícil e Extremo.
- Chefões a cada 5 níveis e bônus especiais durante a partida.
- Seleção do alvo pela primeira letra ou número, priorizando o inimigo mais próximo da base.
- Campo de **Comandante da Missão**.
- Ranking local por jogador, modalidade, dificuldade e nível.
- Pontuação, precisão, PPM/WPM, combo e escudo.
- Pausa com `Tab`.
- Recordes e preferências salvos no `localStorage` do navegador.

## Rodar no Google Cloud Shell

```bash
git clone https://github.com/Jefte31/digitandospeed.git
cd digitandospeed
python3 -m http.server 8080 --bind 0.0.0.0
```

Depois use **Web Preview → Preview on port 8080**.

## Estrutura principal

```text
digitandospeed/
├── index.html
├── numpad.html
├── styles.css
├── difficulty.css
├── i18n.css
├── words.js
├── language-bootstrap.js
├── i18n.js
├── game.js
├── numpad.js
├── ranking.js
└── README.md
```

---

**DIGITSPEED** — treino de velocidade, precisão e domínio do teclado.
