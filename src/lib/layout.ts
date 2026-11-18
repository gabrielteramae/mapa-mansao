export type RoomId = "geral" | "setup" | "consoles" | "arena" | "mural" | "lounge";

export type ZoneId = Exclude<RoomId, "geral">;

export type Spot = {
  id: string;
  room: ZoneId;
  x: number;
  z: number;
  yaw: number;
  sit?: boolean;
};

export const PCS = [-5.4, -3.4, -1.4, 0.6] as const;
export const PC_Z = -2.58;
export const PC_STAND_Z = -1.5;

export const spots: Spot[] = [
  ...PCS.map((x, i) => ({
    id: `pc${i + 1}`,
    room: "setup" as const,
    x,
    z: PC_Z + 0.78,
    yaw: Math.PI,
    sit: true,
  })),
  { id: "mural1", room: "mural", x: -2.4, z: -6.2, yaw: Math.PI },
  { id: "mural2", room: "mural", x: 0.15, z: -6.3, yaw: Math.PI },
  { id: "mural3", room: "mural", x: 2.55, z: -6.15, yaw: Math.PI },
  { id: "arena1", room: "arena", x: -0.7, z: 1.15, yaw: Math.PI, sit: true },
  { id: "arena2", room: "arena", x: 0.7, z: 1.15, yaw: Math.PI, sit: true },
  { id: "tv1", room: "consoles", x: 3.15, z: 2.85, yaw: Math.PI, sit: true },
  { id: "tv2", room: "consoles", x: 4.25, z: 2.85, yaw: Math.PI, sit: true },
  { id: "fridge", room: "lounge", x: 5.55, z: -0.15, yaw: Math.PI / 2 },
  { id: "hall", room: "lounge", x: 2.55, z: 0.35, yaw: 0.2 },
  { id: "pool1", room: "lounge", x: 5.5, z: 1.35, yaw: Math.PI },
  { id: "pin1", room: "consoles", x: -5.45, z: 3.35, yaw: -Math.PI / 2 },
  { id: "guitar1", room: "lounge", x: -5.85, z: -1.3, yaw: -Math.PI / 2 },
  { id: "guitar2", room: "lounge", x: -5.85, z: -0.15, yaw: -Math.PI / 2 },
];

export const rooms: {
  id: RoomId;
  label: string;
  kicker: string;
  blurb: string;
}[] = [
  {
    id: "geral",
    label: "Visão geral",
    kicker: "CASA",
    blurb: "A mansão inteira, do mural até o sofá.",
  },
  {
    id: "setup",
    label: "Setup",
    kicker: "PCs GAMERS",
    blurb: "Quatro bancadas, ultrawide e LED embaixo da mesa.",
  },
  {
    id: "consoles",
    label: "Consoles",
    kicker: "VÍDEO GAME",
    blurb: "Telão, controles e o coop de fim de noite.",
  },
  {
    id: "arena",
    label: "Arena",
    kicker: "RANKED",
    blurb: "O telão grande. Quem senta aqui, joga sério.",
  },
  {
    id: "mural",
    label: "Mural",
    kicker: "MANSÃO R6",
    blurb: "O painel da casa, com a foto e o nome bem grandes.",
  },
  {
    id: "lounge",
    label: "Lounge",
    kicker: "SOFÁ",
    blurb: "Sofá, geladeira e o intervalo entre as partidas.",
  },
];
