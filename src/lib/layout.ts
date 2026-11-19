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
  { id: "sofa-tv-1", room: "consoles", x: -7.55, z: -5.6, yaw: -Math.PI / 2, sit: true },
  { id: "sofa-tv-2", room: "consoles", x: -7.55, z: -3, yaw: -Math.PI / 2, sit: true },
  { id: "sofa-tv-3", room: "consoles", x: -7.55, z: -0.4, yaw: -Math.PI / 2, sit: true },
  { id: "sofa-tv-4", room: "consoles", x: -7.55, z: 2.2, yaw: -Math.PI / 2, sit: true },
  { id: "sofa-bar-1", room: "lounge", x: -2.1, z: 4.78, yaw: Math.PI, sit: true },
  { id: "sofa-bar-2", room: "lounge", x: 0.5, z: 4.78, yaw: Math.PI, sit: true },
  ...[-6.4, -4.55, -2.7, -0.85, 1, 2.85, 4.7, 6.4].map((z, i) => ({
    id: `pc${i + 1}`,
    room: "setup" as const,
    x: 8.22,
    z,
    yaw: Math.PI / 2,
    sit: true,
  })),
  { id: "pin1", room: "arena", x: 1.15, z: -1.45, yaw: Math.PI },
  { id: "pin2", room: "arena", x: 2.4, z: -1.45, yaw: Math.PI },
  { id: "pin3", room: "arena", x: 3.65, z: -1.45, yaw: Math.PI },
  { id: "pin4", room: "arena", x: 4.9, z: -1.45, yaw: Math.PI },
  { id: "pool1", room: "arena", x: -1.6, z: -2.05, yaw: Math.PI },
  { id: "pool2", room: "arena", x: -3.45, z: -3.4, yaw: Math.PI / 2 },
  { id: "mural1", room: "mural", x: -2.2, z: -6.35, yaw: Math.PI },
  { id: "mural2", room: "mural", x: 0.2, z: -6.35, yaw: Math.PI },
  { id: "mural3", room: "mural", x: 2.6, z: -6.35, yaw: Math.PI },
  { id: "bar1", room: "lounge", x: 3.2, z: 5.15, yaw: 0 },
  { id: "floor1", room: "lounge", x: -5.4, z: 2.6, yaw: 0.6 },
  { id: "floor2", room: "arena", x: -4.6, z: -1.4, yaw: -0.4 },
  { id: "floor3", room: "lounge", x: 0.4, z: 1.2, yaw: 0.8 },
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
