# Digitando Speed 🚀⌨️

Jogo brasileiro de digitação espacial, inspirado no gênero de *typing shooters* e criado do zero para português do Brasil.

## O que já funciona

- Palavras em **português do Brasil**, incluindo acentos.
- Seleção automática do inimigo pela primeira letra digitada.
- Um disparo para cada tecla correta.
- Combo e multiplicador de pontuação.
- Pontuação, nível, vidas/escudo e dificuldade progressiva.
- Cálculo de **PPM (palavras por minuto)** e precisão.
- Efeitos de partículas, lasers, estrelas e áudio gerado no navegador.
- Pausa com `P` ou `Esc`.
- Recorde salvo no `localStorage` do navegador.
- Sem bibliotecas ou dependências externas.

## Rodar no Google Cloud Shell

```bash
git clone https://github.com/Jefte31/digitandospeed.git
cd digitandospeed
python3 -m http.server 8080
```

Depois, no Cloud Shell, use **Web Preview → Preview on port 8080**.

Também é possível executar localmente em qualquer computador com Python 3:

```bash
python3 -m http.server 8080
```

E abrir `http://localhost:8080` no navegador.

## Estrutura

```text
digitandospeed/
├── index.html   # interface e HUD
├── styles.css   # identidade visual e telas
├── words.js     # banco de palavras PT-BR
├── game.js      # motor do jogo
└── README.md
```

## Como jogar

1. Clique em **Iniciar missão**.
2. Digite a primeira letra de uma das palavras que estiverem descendo.
3. O jogo trava naquele alvo até a palavra ser concluída.
4. Cada tecla correta dispara um laser.
5. Erros quebram o combo; inimigos que alcançam a nave retiram um ponto de escudo.

## Próximos passos sugeridos

- modos Fácil, Normal, Difícil e Insano;
- chefes e inimigos especiais;
- power-ups;
- ranking online;
- login e perfil;
- conquistas;
- banco de palavras por tema;
- modo infantil e modo acentuação;
- desafios diários;
- versão instalável como PWA.

---

**Digitando Speed** — protótipo inicial em HTML5 Canvas, CSS e JavaScript puro.
