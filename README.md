# Mansão R6

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r187-000000?logo=three.js&logoColor=white)

Mapa isométrico da casa. Dez pessoas andam, sentam e jogam numa sala com PCs, arena, lounge e o painel **Mansão R6**.

Não é um jogo jogável. É a casa vista de cima, com a galera se mexendo sozinha.

## O que tem na casa

| Peça | Papel |
|---|---|
| Galera | Andam pela sala, sentam no sofá ou na cadeira e não entram um no outro. O Mosca usa óculos. |
| Setups | Quatro bancadas pretas, cadeira gamer, gabinete, teclado e mouse com RGB. |
| Telas | Rainbow Six, Dead by Daylight, League of Legends, Fortnite. O telão da arena abre com “Bem-vindo a Mansão R6”. |
| Painel | Foto e o nome da mansão na parede do fundo. |
| Dia e noite | O botão do sol troca o céu. De noite a luz amarela da sala fica mais forte. |

## Stack

- **React 19** e **TypeScript**
- **TanStack Start** e **Vite**
- **React Three Fiber** e **Three.js** para a sala
- **Tailwind CSS 4** no menu

## Estrutura

```
src/
├── components/
│   ├── hud.tsx                 # menu, dia/noite e as três salas
│   └── mansion/
│       ├── canvas.tsx          # câmera isométrica
│       ├── world.tsx           # móveis, telas, luz
│       ├── people.tsx          # os bonecos
│       └── overlay.tsx         # atalhos Painel, Setup, Arena, Jogos, Lounge
├── lib/
│   ├── crew.ts                 # quem é quem e como anda
│   ├── layout.ts               # onde cada um pode sentar
│   └── house.ts                # sala aberta e dia/noite
├── routes/
│   └── index.tsx
public/
├── faces/                      # referência de cada um
├── people/
├── mural/                      # foto do painel
└── screens/                    # capas dos jogos
```

## Como rodar

Precisa de Node 22.

```bash
git clone https://github.com/gabrielteramae/mapa-mansao.git
cd mapa-mansao
npm install
npm run dev
```

Abre em `http://127.0.0.1:8080`. Arrastar gira a casa. O menu escolhe alguém e aproxima a câmera.

```bash
npm run typecheck
npm test
npm run build
```

## O que não tem

`npm test` cobre o esqueleto do app (auth, preview, dados). Não tem teste da caminhada nem da câmera. A física é desvio: eles não se atravessam, mas não é um motor de colisão.

---

© 2026 Gabriel Teramae Chan
