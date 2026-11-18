import { spots, type Spot, type ZoneId } from "@/lib/layout";

export type Hair =
  "crop" | "side" | "straight" | "quiff" | "wavy" | "curly" | "fade" | "fringe" | "spikes" | "part";
export type LineKind = "pc" | "console" | "arena" | "lounge" | "mural" | "walk";

export type Profile = {
  id: string;
  name: string;
  color: string;
  width: number;
  height: number;
  speed: number;
  hair: Hair;
  hairColor: string;
  headset?: boolean;
  skin: string;
  pants: string;
  shoes: string;
  top: "bare" | "tee" | "hoodie" | "jacket";
  smile: boolean;
  mustache: boolean;
  beard: "none" | "goatee" | "stubble";
  glasses: boolean;
  lines: Record<LineKind, string[]>;
};

export const crew: Profile[] = [
  {
    id: "gabriel",
    name: "Teramae",
    color: "#1f9d45",
    width: 1.12,
    height: 0.98,
    speed: 1.45,
    hair: "crop",
    hairColor: "#2c2622",
    skin: "#f0c2a0",
    pants: "#c8c8c8",
    shoes: "#3d312c",
    top: "tee",
    smile: true,
    mustache: true,
    beard: "goatee",
    glasses: false,
    lines: {
      pc: ["Setup novo. Sem fila.", "Quem vai de ranked agora?"],
      console: ["Um coop e a gente descansa.", "Controle é meu."],
      arena: ["Telão ligado. Entra quem quer.", "A casa joga junto."],
      lounge: ["Intervalo de cinco. Só cinco.", "Abre espaço no sofá."],
      mural: ["MED 2025 no mural. Não apaga.", "A foto fica aqui. É a cara da casa."],
      walk: ["Tô indo.", "Abre espaço."],
    },
  },
  {
    id: "saad",
    name: "Saad",
    color: "#e23d3d",
    width: 0.82,
    height: 1.02,
    speed: 1.55,
    hair: "side",
    hairColor: "#1a140f",
    skin: "#f3c7a8",
    pants: "#2a2a2a",
    shoes: "#f3f3f3",
    top: "hoodie",
    smile: false,
    mustache: false,
    beard: "stubble",
    glasses: false,
    lines: {
      pc: ["Eu seguro o site. Confia.", "Call no fone, sem grito."],
      console: ["Uma corrida só.", "Perdi de propósito. Quase."],
      arena: ["Um clutch e a gente sobe.", "Planta no canto, clássico."],
      lounge: ["Alguém viu meu headset?", "Água e volta."],
      mural: ["O mural do Teramae é lei.", "Foto boa. Não mexe."],
      walk: ["Chegando.", "Já tô no corredor."],
    },
  },
  {
    id: "mosca",
    name: "Mosca",
    color: "#2f6bff",
    width: 0.9,
    height: 0.9,
    speed: 1.85,
    hair: "fringe",
    hairColor: "#1a140f",
    skin: "#e8c4a8",
    pants: "#111111",
    shoes: "#1a1a1a",
    top: "jacket",
    smile: false,
    mustache: false,
    beard: "none",
    glasses: true,
    lines: {
      pc: ["Tô voando. Não peaka isso.", "Cafeína nível Mosca."],
      console: ["Esse boss é fácil. Mentira.", "Passa o controle."],
      arena: ["Drone no ar, info na call.", "Eu cubro o alto."],
      lounge: ["Geladeira e eu volto.", "Zuni o intervalo."],
      mural: ["MED no peito e no mural.", "Painel grande do jeito que tem que ser."],
      walk: ["Zunzunzun.", "Já passei."],
    },
  },
  {
    id: "kaiog",
    name: "Kaiog",
    color: "#f7f8fb",
    width: 1,
    height: 0.98,
    speed: 1.48,
    hair: "straight",
    hairColor: "#1a120e",
    skin: "#f0c8a4",
    pants: "#1a1a1a",
    shoes: "#111111",
    top: "hoodie",
    smile: true,
    mustache: false,
    beard: "none",
    glasses: false,
    lines: {
      pc: ["Call limpa, sem tilt.", "Eu igl essa rodada."],
      console: ["Party game pra desarmar.", "Sem ego no coop."],
      arena: ["Strat no quadro. Segue.", "Entrada marcada."],
      lounge: ["Respira. Aí a gente volta.", "Quem tá de água?"],
      mural: ["Mural atualizado. A casa tem nome.", "Mansão R6, escrito grande."],
      walk: ["Rotacionando.", "Mudando de ponto."],
    },
  },
  {
    id: "gordao",
    name: "Gordão",
    color: "#f2c14e",
    width: 1.78,
    height: 1.34,
    speed: 1.2,
    hair: "curly",
    hairColor: "#1a120e",
    skin: "#e8b896",
    pants: "#6a6d72",
    shoes: "#111111",
    top: "hoodie",
    smile: true,
    mustache: false,
    beard: "none",
    glasses: false,
    lines: {
      pc: ["A cadeira aguenta. Pode ir.", "Me chama quando for a última."],
      console: ["Sofá é meu main, mas eu jogo.", "Coop sentado, eu aceito."],
      arena: ["Abre espaço no meio.", "Eu seguro o bomba. Mentalmente."],
      lounge: ["Quem pediu a pizza?", "O sofá tava me esperando."],
      mural: ["Essa foto fica. Não discute.", "Painel enorme. Gostei."],
      walk: ["Devagar, que eu chego.", "Tô indo, sem pressa."],
    },
  },
  {
    id: "guigui",
    name: "Guigui",
    color: "#ff8a2a",
    width: 0.98,
    height: 1,
    speed: 1.6,
    hair: "fade",
    hairColor: "#1c1816",
    skin: "#e7b898",
    pants: "#8d7f70",
    shoes: "#f5f5f5",
    top: "tee",
    smile: true,
    mustache: false,
    beard: "none",
    glasses: false,
    lines: {
      pc: ["Clipou? Clipou.", "Áudio no talo."],
      console: ["Replay disso agora.", "Isso vai pro grupo."],
      arena: ["Gravando a ranked. Não erra.", "Câmera no telão."],
      lounge: ["Manda o clipe no grupo.", "Pausa pra ver o replay."],
      mural: ["Essa foto rende camiseta.", "Enquadramento perfeito."],
      walk: ["Cortando pro outro lado.", "Já tô na tomada."],
    },
  },
  {
    id: "guilherme",
    name: "Guilherme",
    color: "#7a4dff",
    width: 1.02,
    height: 1.1,
    speed: 1.46,
    hair: "wavy",
    hairColor: "#1a140f",
    skin: "#efc3a4",
    pants: "#1c1c1c",
    shoes: "#2a5fd0",
    top: "tee",
    smile: true,
    mustache: true,
    beard: "goatee",
    glasses: false,
    lines: {
      pc: ["Sem rush cego.", "A gente entra pelo terraço."],
      console: ["Uma casual. Sem ego.", "Quem perdeu, busca a água."],
      arena: ["Strat pronta. Olha o quadro.", "Fundo primeiro."],
      lounge: ["Depois dessa a gente para.", "Depois. Sério."],
      mural: ["O painel tem que ficar aceso.", "Nome da casa, bem no centro."],
      walk: ["Mudando de sala.", "Flanco limpo."],
    },
  },
  {
    id: "nakazone",
    name: "Nakazone",
    color: "#14b8b8",
    width: 1,
    height: 1,
    speed: 1.58,
    hair: "quiff",
    hairColor: "#14110f",
    skin: "#f0c4a0",
    pants: "#1a1a1a",
    shoes: "#222222",
    top: "tee",
    smile: true,
    mustache: false,
    beard: "none",
    glasses: false,
    lines: {
      pc: ["Aim aquecido.", "Crosshair no peito."],
      console: ["Deathmatch de controle.", "Uma e eu volto pro PC."],
      arena: ["Primeira bala é minha.", "Não pisca."],
      lounge: ["Alonga o pulso.", "Três minutos e eu volto."],
      mural: ["O mural brilha mais que o setup.", "Foto de respeito."],
      walk: ["Swingando pro outro ponto.", "Já chego."],
    },
  },
  {
    id: "nishio",
    name: "Nishio",
    color: "#ff4f8b",
    width: 1,
    height: 1.01,
    speed: 1.5,
    hair: "spikes",
    hairColor: "#1a140f",
    skin: "#f2c8a8",
    pants: "#2a2a2a",
    shoes: "#222222",
    top: "jacket",
    smile: true,
    mustache: false,
    beard: "none",
    glasses: false,
    lines: {
      pc: ["Eu cubro a retaguarda.", "Silêncio no clutch."],
      console: ["Info primeiro, botão depois.", "Eu fico de suporte."],
      arena: ["Não entrega a posição.", "Espera o meu ok."],
      lounge: ["Fone num ouvido só.", "Tô ouvindo a casa."],
      mural: ["A casa inteira cabe nesse painel.", "Deixa a foto em paz."],
      walk: ["Flanco.", "Retaguarda a caminho."],
    },
  },
  {
    id: "maphil",
    name: "Maphil",
    color: "#f4f7fb",
    width: 1,
    height: 1,
    speed: 1.52,
    hair: "part",
    hairColor: "#1a140f",
    skin: "#e8b890",
    pants: "#3a3a3a",
    shoes: "#222222",
    top: "hoodie",
    smile: false,
    mustache: false,
    beard: "none",
    glasses: false,
    lines: {
      pc: ["Música baixa, call alta.", "Quem tá de suporte?"],
      console: ["Última da noite. Juro.", "Escolhe o mapa."],
      arena: ["Fecha o mapa comigo.", "Eu entro no seu tempo."],
      lounge: ["Escolhe a playlist.", "Volume no meio."],
      mural: ["Mansão R6 escrito grande. Gostei.", "A foto segura a parede."],
      walk: ["Já tô quase aí.", "Cortando pelo hall."],
    },
  },
];

export type AgentState = "walk" | "use" | "chat";

export type Agent = {
  id: string;
  name: string;
  color: string;
  width: number;
  height: number;
  speed: number;
  hair: Hair;
  hairColor: string;
  headset: boolean;
  skin: string;
  pants: string;
  shoes: string;
  top: "bare" | "tee" | "hoodie" | "jacket";
  smile: boolean;
  mustache: boolean;
  beard: "none" | "goatee" | "stubble";
  glasses: boolean;
  lines: Record<LineKind, string[]>;
  x: number;
  z: number;
  yaw: number;
  face: number;
  path: { x: number; z: number }[];
  state: AgentState;
  room: ZoneId;
  spotId: string;
  spotFace: number;
  spotSit: boolean;
  sitting: boolean;
  partner: string | null;
  seek: string | null;
  dwell: number;
  phase: number;
  line: string;
  lineRev: number;
  lineAge: number;
  lineEvery: number;
  stuck: number;
  seen: string[];
};

type Solid = {
  x: number;
  y: number;
  z: number;
  hw: number;
  hy: number;
  hd: number;
  round?: boolean;
};

const BODY_H = 1.62;
const STEP_H = 0.2;
const BODY_R = 0.31;

function makeSolid(
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  round = false,
): Solid {
  return { x, y, z, hw: w / 2, hy: h / 2, hd: d / 2, round };
}

const SOLIDS: Solid[] = [
  makeSolid(0, 1.55, -8.02, 22, 3.15, 0.18),
  makeSolid(-11, 0.38, -0.2, 0.16, 0.7, 16),
  makeSolid(11, 0.38, -0.2, 0.16, 0.7, 16),
  makeSolid(0, 1, 7.75, 22, 2, 0.08),
];

const WX0 = -10.7;
const WX1 = 10.7;
const WZ0 = -7.7;
const WZ1 = 7.3;
const CELL = 0.36;
const GW = Math.round((WX1 - WX0) / CELL);
const GH = Math.round((WZ1 - WZ0) / CELL);

function radiusOf(width: number) {
  return 0.28 * width;
}

function bodySpace(width: number) {
  return 0.4 * width;
}

function crowded(x: number, z: number, self: Agent, others: Agent[]) {
  for (const other of others) {
    if (other === self) continue;
    if (self.partner === other.id) continue;
    const gap = bodySpace(self.width) + bodySpace(other.width);
    if (Math.hypot(other.x - x, other.z - z) < gap) return true;
  }
  return false;
}

function blocksBody(box: Solid) {
  return box.y + box.hy >= STEP_H && box.y - box.hy <= BODY_H;
}

type Contact = { t: number; nx: number; nz: number };

function sweepCirclePoint(
  x: number,
  z: number,
  dx: number,
  dz: number,
  radius: number,
  cx: number,
  cz: number,
): Contact | null {
  const fx = x - cx;
  const fz = z - cz;
  const a = dx * dx + dz * dz;
  if (a < 1e-12) return null;
  const b = 2 * (fx * dx + fz * dz);
  const c = fx * fx + fz * fz - radius * radius;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / (2 * a);
  if (t < -1e-4 || t > 1) return null;
  const hx = x + dx * Math.max(0, t) - cx;
  const hz = z + dz * Math.max(0, t) - cz;
  const len = Math.hypot(hx, hz) || 1;
  return { t: Math.max(0, t), nx: hx / len, nz: hz / len };
}

function sweepSolid(
  x: number,
  z: number,
  dx: number,
  dz: number,
  radius: number,
  box: Solid,
): Contact | null {
  if (!blocksBody(box)) return null;
  if (box.round) return sweepCirclePoint(x, z, dx, dz, radius + box.hw, box.x, box.z);
  const minX = box.x - box.hw;
  const maxX = box.x + box.hw;
  const minZ = box.z - box.hd;
  const maxZ = box.z + box.hd;
  const qx = Math.max(minX, Math.min(x, maxX));
  const qz = Math.max(minZ, Math.min(z, maxZ));
  const ox = x - qx;
  const oz = z - qz;
  const od = ox * ox + oz * oz;
  if (od < radius * radius) {
    if (od < 1e-10) {
      const left = x - minX;
      const right = maxX - x;
      const back = z - minZ;
      const front = maxZ - z;
      const m = Math.min(left, right, back, front);
      if (m === left) return { t: 0, nx: -1, nz: 0 };
      if (m === right) return { t: 0, nx: 1, nz: 0 };
      if (m === back) return { t: 0, nx: 0, nz: -1 };
      return { t: 0, nx: 0, nz: 1 };
    }
    const d = Math.sqrt(od);
    return { t: 0, nx: ox / d, nz: oz / d };
  }
  let best: Contact | null = null;
  const keep = (hit: Contact | null) => {
    if (!hit || hit.t > 1) return;
    if (!best || hit.t < best.t) best = hit;
  };
  if (dx > 1e-8) {
    const t = (minX - radius - x) / dx;
    const zz = z + dz * t;
    if (zz >= minZ && zz <= maxZ)
      keep(t >= -1e-4 && t <= 1 ? { t: Math.max(0, t), nx: -1, nz: 0 } : null);
  } else if (dx < -1e-8) {
    const t = (maxX + radius - x) / dx;
    const zz = z + dz * t;
    if (zz >= minZ && zz <= maxZ)
      keep(t >= -1e-4 && t <= 1 ? { t: Math.max(0, t), nx: 1, nz: 0 } : null);
  }
  if (dz > 1e-8) {
    const t = (minZ - radius - z) / dz;
    const xx = x + dx * t;
    if (xx >= minX && xx <= maxX)
      keep(t >= -1e-4 && t <= 1 ? { t: Math.max(0, t), nx: 0, nz: -1 } : null);
  } else if (dz < -1e-8) {
    const t = (maxZ + radius - z) / dz;
    const xx = x + dx * t;
    if (xx >= minX && xx <= maxX)
      keep(t >= -1e-4 && t <= 1 ? { t: Math.max(0, t), nx: 0, nz: 1 } : null);
  }
  keep(sweepCirclePoint(x, z, dx, dz, radius, minX, minZ));
  keep(sweepCirclePoint(x, z, dx, dz, radius, maxX, minZ));
  keep(sweepCirclePoint(x, z, dx, dz, radius, minX, maxZ));
  keep(sweepCirclePoint(x, z, dx, dz, radius, maxX, maxZ));
  return best;
}

function firstContact(x: number, z: number, dx: number, dz: number, radius: number) {
  let best: Contact | null = null;
  for (const box of SOLIDS) {
    const hit = sweepSolid(x, z, dx, dz, radius, box);
    if (hit && (!best || hit.t < best.t)) best = hit;
  }
  return best;
}

function overlaps(x: number, z: number, radius: number, box: Solid) {
  if (!blocksBody(box)) return false;
  if (box.round) return (x - box.x) ** 2 + (z - box.z) ** 2 < (radius + box.hw) ** 2;
  const cx = Math.max(box.x - box.hw, Math.min(x, box.x + box.hw));
  const cz = Math.max(box.z - box.hd, Math.min(z, box.z + box.hd));
  return (x - cx) ** 2 + (z - cz) ** 2 < radius * radius;
}

function blockedAt(x: number, z: number, radius: number) {
  for (const box of SOLIDS) if (overlaps(x, z, radius, box)) return true;
  return false;
}

function hit(x: number, z: number) {
  return blockedAt(x, z, BODY_R);
}

const solid = new Uint8Array(GW * GH);
for (let r = 0; r < GH; r++) {
  for (let c = 0; c < GW; c++) {
    const x = WX0 + (c + 0.5) * CELL;
    const z = WZ0 + (r + 0.5) * CELL;
    let blocked = false;
    for (const box of SOLIDS) {
      if (!blocksBody(box)) continue;
      const reach = BODY_R + CELL * 0.5;
      if (box.round) {
        if ((x - box.x) ** 2 + (z - box.z) ** 2 < (reach + box.hw) ** 2) blocked = true;
      } else if (Math.abs(x - box.x) < box.hw + reach && Math.abs(z - box.z) < box.hd + reach) {
        blocked = true;
      }
      if (blocked) break;
    }
    if (blocked) solid[r * GW + c] = 1;
  }
}

function nearestOpen(x: number, z: number) {
  const sc = Math.max(0, Math.min(GW - 1, Math.floor((x - WX0) / CELL)));
  const sr = Math.max(0, Math.min(GH - 1, Math.floor((z - WZ0) / CELL)));
  if (!solid[sr * GW + sc]) return { c: sc, r: sr, x, z };
  for (let rad = 1; rad < 14; rad++) {
    for (let dc = -rad; dc <= rad; dc++) {
      for (let dr = -rad; dr <= rad; dr++) {
        if (Math.max(Math.abs(dc), Math.abs(dr)) !== rad) continue;
        const c = sc + dc;
        const r = sr + dr;
        if (c < 0 || r < 0 || c >= GW || r >= GH) continue;
        if (solid[r * GW + c]) continue;
        return { c, r, x: WX0 + (c + 0.5) * CELL, z: WZ0 + (r + 0.5) * CELL };
      }
    }
  }
  return { c: sc, r: sr, x, z };
}

function lineClear(x0: number, z0: number, x1: number, z1: number) {
  return firstContact(x0, z0, x1 - x0, z1 - z0, BODY_R) === null;
}

function astar(ax: number, az: number, tx: number, tz: number) {
  const s = nearestOpen(ax, az);
  const g = nearestOpen(tx, tz);
  const startI = s.r * GW + s.c;
  const goalI = g.r * GW + g.c;
  const bias = rnd() * Math.PI * 2;
  if (startI === goalI) return [{ x: tx, z: tz }];
  const open = [startI];
  const came = new Int16Array(GW * GH).fill(-1);
  const gScore = new Float32Array(GW * GH).fill(1e9);
  const fScore = new Float32Array(GW * GH).fill(1e9);
  gScore[startI] = 0;
  fScore[startI] = Math.hypot(s.c - g.c, s.r - g.r);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (fScore[open[i]!]! < fScore[open[bi]!]!) bi = i;
    const cur = open.splice(bi, 1)[0]!;
    if (cur === goalI) break;
    const cc = cur % GW;
    const cr = (cur / GW) | 0;
    for (const [dc, dr] of dirs) {
      const nc = cc + dc!;
      const nr = cr + dr!;
      if (nc < 0 || nr < 0 || nc >= GW || nr >= GH) continue;
      const ni = nr * GW + nc;
      if (solid[ni]) continue;
      if (dc !== 0 && dr !== 0 && (solid[cr * GW + nc] || solid[nr * GW + cc])) continue;
      const cost = dc !== 0 && dr !== 0 ? 1.42 : 1;
      const bend = 0.28 * (1 + Math.sin(nc * 0.85 + bias) + Math.cos(nr * 0.67 - bias));
      const ng = gScore[cur]! + cost + bend;
      if (ng >= gScore[ni]!) continue;
      came[ni] = cur;
      gScore[ni] = ng;
      fScore[ni] = ng + Math.hypot(nc - g.c, nr - g.r);
      if (!open.includes(ni)) open.push(ni);
    }
  }
  const cells: { x: number; z: number }[] = [];
  if (came[goalI] !== -1) {
    let cur = goalI;
    while (cur !== startI) {
      const c = cur % GW;
      const r = (cur / GW) | 0;
      cells.push({ x: WX0 + (c + 0.5) * CELL, z: WZ0 + (r + 0.5) * CELL });
      cur = came[cur]!;
    }
    cells.reverse();
  }
  const dest = hit(tx, tz) ? { x: g.x, z: g.z } : { x: tx, z: tz };
  cells.push(dest);
  const smooth: { x: number; z: number }[] = [];
  let anchorX = ax;
  let anchorZ = az;
  for (let i = 0; i < cells.length; i++) {
    const nxt = cells[i + 1];
    if (!nxt || !lineClear(anchorX, anchorZ, nxt.x, nxt.z)) {
      smooth.push(cells[i]!);
      anchorX = cells[i]!.x;
      anchorZ = cells[i]!.z;
    }
  }
  const last = smooth[smooth.length - 1];
  if (!last || last.x !== dest.x || last.z !== dest.z) smooth.push(dest);
  return smooth;
}

function plan(ax: number, az: number, tx: number, tz: number) {
  const goal = nearestOpen(tx, tz);
  const dest = hit(tx, tz) ? { x: goal.x, z: goal.z } : { x: tx, z: tz };
  if (lineClear(ax, az, dest.x, dest.z)) return [dest];
  return astar(ax, az, dest.x, dest.z);
}

function slide(a: Agent, dx: number, dz: number) {
  const radius = radiusOf(a.width);
  let remainX = dx;
  let remainZ = dz;
  for (let iter = 0; iter < 3; iter++) {
    const len = Math.hypot(remainX, remainZ);
    if (len < 1e-5) break;
    const hit = firstContact(a.x, a.z, remainX, remainZ, radius);
    if (!hit) {
      a.x += remainX;
      a.z += remainZ;
      break;
    }
    const skin = 0.0008 / len;
    const travel = Math.max(0, hit.t - skin);
    a.x += remainX * travel;
    a.z += remainZ * travel;
    if (hit.t <= skin) {
      a.x += hit.nx * 0.002;
      a.z += hit.nz * 0.002;
    }
    const rest = 1 - travel;
    const rx = remainX * rest;
    const rz = remainZ * rest;
    const along = rx * hit.nx + rz * hit.nz;
    remainX = rx - hit.nx * Math.min(0, along);
    remainZ = rz - hit.nz * Math.min(0, along);
  }
}

function shoveOut(a: Agent) {
  const radius = radiusOf(a.width);
  for (let n = 0; n < 5; n++) {
    let moved = false;
    for (const box of SOLIDS) {
      if (!blocksBody(box)) continue;
      if (box.round) {
        const dx = a.x - box.x;
        const dz = a.z - box.z;
        const reach = radius + box.hw;
        const d = Math.hypot(dx, dz);
        if (d >= reach) continue;
        const pen = reach - d + 0.001;
        if (d < 1e-5) a.x += pen;
        else {
          a.x += (dx / d) * pen;
          a.z += (dz / d) * pen;
        }
        moved = true;
        continue;
      }
      const minX = box.x - box.hw;
      const maxX = box.x + box.hw;
      const minZ = box.z - box.hd;
      const maxZ = box.z + box.hd;
      const cx = Math.max(minX, Math.min(a.x, maxX));
      const cz = Math.max(minZ, Math.min(a.z, maxZ));
      const dx = a.x - cx;
      const dz = a.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= radius * radius) continue;
      const d = Math.sqrt(d2);
      if (d < 1e-5) {
        const left = a.x - minX;
        const right = maxX - a.x;
        const back = a.z - minZ;
        const front = maxZ - a.z;
        const min = Math.min(left, right, back, front);
        if (min === left) a.x -= left + radius;
        else if (min === right) a.x += right + radius;
        else if (min === back) a.z -= back + radius;
        else a.z += front + radius;
      } else {
        const pen = radius - d + 0.001;
        a.x += (dx / d) * pen;
        a.z += (dz / d) * pen;
      }
      moved = true;
    }
    if (!moved) break;
  }
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(0x6e1601);

function prefersReduced() {
  return (
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function lerpAngle(a: number, b: number, t: number) {
  const d = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + d * t;
}

function pick<T>(arr: T[], prev?: T): T {
  if (arr.length === 1) return arr[0]!;
  let i = Math.floor(rnd() * arr.length);
  if (arr[i] === prev) i = (i + 1) % arr.length;
  return arr[i]!;
}

function setPath(a: Agent, x: number, z: number, direct = false) {
  let path = plan(a.x, a.z, x, z);
  if (!direct && !a.spotSit) {
    const via = openPoint(a, 1.6, 3.2);
    if (
      via &&
      lineClear(a.x, a.z, via.x, via.z) &&
      lineClear(via.x, via.z, x, z)
    ) {
      path = [
        { x: via.x, z: via.z },
        { x, z },
      ];
    }
  }
  if (!path.length) return false;
  const end = path[path.length - 1]!;
  if (path.length < 2 && !lineClear(a.x, a.z, end.x, end.z)) return false;
  a.path = path;
  a.state = "walk";
  a.sitting = false;
  a.partner = null;
  a.seen = [...(a.seen ?? []), keyOf(x, z)].slice(-8);
  return true;
}

function keyOf(x: number, z: number) {
  return `${Math.round(x * 2)},${Math.round(z * 2)}`;
}

function openPoint(a: Agent, minDist: number, maxDist: number) {
  const found: { x: number; z: number }[] = [];
  for (let n = 0; n < 28; n++) {
    const x = -9.6 + rnd() * 19.2;
    const z = -6.6 + rnd() * 13.2;
    if (hit(x, z)) continue;
    const dist = Math.hypot(x - a.x, z - a.z);
    if (dist < minDist || dist > maxDist) continue;
    if ((a.seen ?? []).includes(keyOf(x, z))) continue;
    found.push({ x, z });
  }
  if (!found.length) return null;
  return found[Math.floor(rnd() * found.length)]!;
}

function goToSpot(a: Agent, spot: Spot) {
  a.spotId = spot.id;
  a.spotFace = spot.yaw;
  a.spotSit = Boolean(spot.sit);
  a.room = spot.room;
  a.seek = null;
  const wiggle = spot.sit ? 0 : 0.16;
  return setPath(a, spot.x + (rnd() - 0.5) * wiggle, spot.z + (rnd() - 0.5) * wiggle);
}

function freshSpot(a: Agent, agents: Agent[]) {
  const options = spots.filter(
    (s) =>
      s.id !== a.spotId &&
      !a.seen.includes(s.id) &&
      !agents.some((o) => o.id !== a.id && o.spotId === s.id && (o.sitting || o.state === "use")),
  );
  if (!options.length) return randomSpot(a);
  return options[Math.floor(rnd() * options.length)]!;
}

function wander(a: Agent) {
  const point = openPoint(a, 2.6, 6.4);
  if (!point) return false;
  a.spotId = "roam";
  a.spotSit = false;
  a.spotFace = Math.atan2(point.x - a.x, point.z - a.z);
  a.seek = null;
  return setPath(a, point.x, point.z);
}

function escape(a: Agent) {
  const end = a.path[a.path.length - 1];
  a.path = [];
  a.spotSit = false;
  a.seek = null;
  if (end && Math.hypot(end.x - a.x, end.z - a.z) > 0.8 && setPath(a, end.x, end.z, true)) return;
  const base = rnd() * Math.PI * 2;
  for (let i = 0; i < 8; i++) {
    const ang = base + i * 0.8;
    const x = Math.min(9.4, Math.max(-9.4, a.x + Math.sin(ang) * 2.1));
    const z = Math.min(6.6, Math.max(-6.8, a.z + Math.cos(ang) * 2.1));
    if (hit(x, z) || !lineClear(a.x, a.z, x, z)) continue;
    a.seen = [...(a.seen ?? []), keyOf(a.x, a.z)].slice(-8);
    if (setPath(a, x, z, true)) return;
  }
  wander(a);
}

function randomSpot(a: Agent) {
  const options = spots.filter((s) => s.id !== a.spotId);
  return options[Math.floor(rnd() * options.length)]!;
}

function startChat(a: Agent, b: Agent) {
  a.state = "chat";
  b.state = "chat";
  a.partner = b.id;
  b.partner = a.id;
  a.seek = null;
  b.seek = null;
  a.path = [];
  b.path = [];
  const stay = a.spotSit && b.spotSit;
  a.sitting = stay;
  b.sitting = stay;
  a.dwell = stay ? 4.2 : 3.2;
  b.dwell = a.dwell;
  a.lineAge = 0;
  b.lineAge = 0;
  a.face = Math.atan2(b.x - a.x, b.z - a.z);
  b.face = Math.atan2(a.x - b.x, a.z - b.z);
}

function endChat(a: Agent, agents: Agent[]) {
  const b = agents.find((o) => o.id === a.partner);
  a.partner = null;
  if (b && b.partner === a.id) {
    b.partner = null;
    b.state = "use";
    b.dwell = 0.6;
    b.face = b.spotFace;
    b.sitting = b.spotSit;
  }
  decide(a, agents);
}

function chatCount(agents: Agent[]) {
  return agents.filter((a) => a.state === "chat").length / 2;
}

function decide(a: Agent, agents: Agent[]) {
  const roll = rnd();
  if (roll < 0.16 && chatCount(agents) < 2) {
    const pool = agents.filter(
      (o) =>
        o.id !== a.id &&
        o.state !== "chat" &&
        !o.partner &&
        !o.seek &&
        !agents.some((s) => s.seek === o.id),
    );
    if (pool.length) {
      const other = pick(pool);
      const ang = rnd() * Math.PI * 2;
      let x = other.x + Math.sin(ang) * (1.25 + rnd() * 0.45);
      let z = other.z + Math.cos(ang) * (1.25 + rnd() * 0.45);
      x = Math.min(9.4, Math.max(-9.4, x));
      z = Math.min(6.6, Math.max(-6.8, z));
      if (!hit(x, z)) {
        a.seek = other.id;
        a.room = other.room;
        a.spotSit = false;
        if (setPath(a, x, z)) return;
        a.seek = null;
      }
    }
  }
  if (roll < 0.42) {
    const spot = freshSpot(a, agents);
    a.seen = [...a.seen, spot.id].slice(-8);
    if (goToSpot(a, spot)) return;
  }
  if (wander(a)) return;
  goToSpot(a, randomSpot(a));
}

function plant(a: Agent) {
  const spot = spots.find((s) => s.id === a.spotId);
  if (!spot) return;
  a.x = spot.x;
  a.z = spot.z;
  a.face = spot.yaw;
  a.yaw = spot.yaw;
  a.sitting = true;
}

function arrive(a: Agent, agents: Agent[]) {
  if (a.seek) {
    const other = agents.find((o) => o.id === a.seek);
    const close =
      other &&
      Math.hypot(other.x - a.x, other.z - a.z) < 1.45 &&
      other.state !== "chat" &&
      !other.partner;
    a.seek = null;
    if (other && close && chatCount(agents) < 2) {
      if (a.spotSit) plant(a);
      if (other.spotSit) plant(other);
      startChat(a, other);
      return;
    }
  }
  a.state = "use";
  a.sitting = a.spotSit;
  a.face = a.spotFace;
  if (a.spotSit) plant(a);
  a.room = spots.find((s) => s.id === a.spotId)?.room ?? a.room;
  a.dwell = (a.spotSit ? 3.2 : 1.8) + rnd() * 2.4;
  a.lineEvery = 3.1 + rnd() * 2.2;
  a.lineAge = 0;
  if (!a.sitting || chatCount(agents) >= 2) return;
  const mate = agents.find(
    (o) =>
      o !== a &&
      o.sitting &&
      o.state === "use" &&
      !o.partner &&
      Math.hypot(o.x - a.x, o.z - a.z) < 1.8,
  );
  if (!mate) return;
  startChat(a, mate);
  plant(a);
  plant(mate);
}

function shuffle<T>(list: T[]) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

const posts: Record<string, { x: number; z: number; yaw: number; sit: boolean; spot: string; room: ZoneId }> = {
  gabriel: { x: -7.3, z: -5.6, yaw: -Math.PI / 2, sit: true, spot: "sofa-tv", room: "consoles" },
  saad: { x: -7.3, z: -3, yaw: -Math.PI / 2, sit: true, spot: "sofa-tv", room: "consoles" },
  mosca: { x: -7.3, z: -0.4, yaw: -Math.PI / 2, sit: true, spot: "sofa-tv", room: "consoles" },
  kaiog: { x: -1.6, z: -2.15, yaw: Math.PI, sit: false, spot: "pool", room: "arena" },
  gordao: { x: 1.15, z: -3.55, yaw: Math.PI, sit: false, spot: "pin", room: "arena" },
  guigui: { x: 2.85, z: -1.15, yaw: Math.PI, sit: false, spot: "hoop", room: "arena" },
  guilherme: { x: 8.2, z: -4.65, yaw: Math.PI / 2, sit: true, spot: "pc1", room: "setup" },
  nakazone: { x: 8.2, z: -1.35, yaw: Math.PI / 2, sit: true, spot: "pc2", room: "setup" },
  nishio: { x: 8.2, z: 1.95, yaw: Math.PI / 2, sit: true, spot: "pc3", room: "setup" },
  maphil: { x: -2.1, z: 4.7, yaw: Math.PI, sit: true, spot: "sofa-bar", room: "lounge" },
};

function createAgents(): Agent[] {
  return crew.map((c) => {
    const post = posts[c.id] ?? { x: 0, z: 0, yaw: Math.PI, sit: false, spot: "still", room: "lounge" as const };
    const agent: Agent = {
      id: c.id,
      name: c.name,
      color: c.color,
      width: c.width,
      height: c.height,
      speed: c.speed,
      hair: c.hair,
      hairColor: c.hairColor,
      headset: Boolean(c.headset),
      skin: c.skin,
      pants: c.pants,
      shoes: c.shoes,
      top: c.top,
      smile: c.smile,
      mustache: c.mustache,
      beard: c.beard,
      glasses: c.glasses,
      lines: c.lines,
      x: post.x,
      z: post.z,
      yaw: post.yaw,
      face: post.yaw,
      path: [],
      state: "use",
      room: post.room,
      spotId: post.spot,
      spotFace: post.yaw,
      spotSit: post.sit,
      sitting: post.sit,
      partner: null,
      seek: null,
      dwell: 1.6 + rnd() * 5,
      phase: rnd() * 8,
      line: "",
      lineRev: 0,
      lineAge: 0,
      lineEvery: 3.5,
      stuck: 0,
      seen: [],
    };
    return agent;
  });
}

let agents: Agent[] | null = null;

export function getAgents() {
  if (!agents) agents = createAgents();
  else {
    for (const a of agents) {
      const profile = crew.find((c) => c.id === a.id);
      if (!profile) continue;
      a.color = profile.color;
      a.mustache = profile.mustache;
      a.beard = profile.beard;
      a.width = profile.width;
      a.height = profile.height;
      a.top = profile.top;
      a.glasses = profile.glasses;
      a.seen ??= [];
    }
  }
  return agents;
}

export function step(_dt: number) {
  return;
}

const PHYSICS_STEP = 1 / 60;
let physicsAcc = 0;

function tick(dt: number) {
  const list = getAgents();
  const reduced = prefersReduced();
  const moveDt = reduced ? 0 : Math.min(dt, 0.05);
  const timeDt = Math.min(dt, 0.05);

  for (const a of list) {
    if (a.partner) {
      const mate = list.find((o) => o.id === a.partner);
      if (!mate || mate.partner !== a.id) {
        a.partner = null;
        if (a.state === "chat") {
          a.state = "use";
          a.dwell = 0.4;
        }
      }
    }
    a.phase += timeDt;
    if (a.state === "chat" && a.partner) {
      const b = list.find((o) => o.id === a.partner);
      if (b) a.face = Math.atan2(b.x - a.x, b.z - a.z);
    }

    if (a.state === "walk") {
      if (moveDt === 0) {
        const dest = a.path[a.path.length - 1];
        if (dest) {
          a.x = dest.x;
          a.z = dest.z;
          shoveOut(a);
        }
        a.path = [];
        arrive(a, list);
        continue;
      }
      const dest = a.path[0];
      if (!dest) {
        arrive(a, list);
        continue;
      }
      const dx = dest.x - a.x;
      const dz = dest.z - a.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.1) {
        slide(a, dx, dz);
        a.path.shift();
        if (a.path.length === 0) arrive(a, list);
      } else {
        const ease = Math.min(1, dist / 0.6);
        const s = Math.min(dist, a.speed * moveDt * (0.42 + 0.58 * ease));
        let dirX = dx / dist;
        let dirZ = dz / dist;
        let slow = 1;
        for (const other of list) {
          if (other === a || other.id === a.partner) continue;
          const ox = other.x - a.x;
          const oz = other.z - a.z;
          const od = Math.hypot(ox, oz) || 0.0001;
          const look = bodySpace(a.width) + bodySpace(other.width) + 0.15;
          if (od > look) continue;
          const ahead = (ox * dirX + oz * dirZ) / od;
          if (ahead < 0) continue;
          const near = 1 - od / look;
          const rightX = dirZ;
          const rightZ = -dirX;
          dirX += rightX * near;
          dirZ += rightZ * near;
          slow *= 1 - near * 0.55;
        }
        const vl = Math.hypot(dirX, dirZ) || 1;
        const step = s * Math.max(0.7, slow);
        const ux = dirX / vl;
        const uz = dirZ / vl;
        let stepX = ux * step;
        let stepZ = uz * step;
        if (crowded(a.x + stepX, a.z + stepZ, a, list)) {
          const side = (a.stuck ?? 0) % 2 === 0 ? 1 : -1;
          stepX = uz * step * side;
          stepZ = -ux * step * side;
        }
        if (crowded(a.x + stepX, a.z + stepZ, a, list)) {
          a.stuck = (a.stuck ?? 0) + 1;
          if (a.stuck > 22) {
            a.stuck = 0;
            a.path = [];
            escape(a);
          }
        } else {
          const beforeX = a.x;
          const beforeZ = a.z;
          slide(a, stepX, stepZ);
          const movedX = a.x - beforeX;
          const movedZ = a.z - beforeZ;
          if (Math.hypot(movedX, movedZ) < 0.004) {
            a.stuck = (a.stuck ?? 0) + 1;
            if (a.stuck > 22) {
              a.stuck = 0;
              a.path = [];
              escape(a);
            }
          } else {
            a.stuck = 0;
            a.yaw = lerpAngle(a.yaw, Math.atan2(movedX, movedZ), Math.min(1, moveDt * 8));
          }
        }
      }
      continue;
    }

    if (a.sitting) {
      a.yaw = lerpAngle(a.yaw, a.spotFace, Math.min(1, timeDt * 4));
      a.dwell -= timeDt;
      if (a.dwell <= 0) decide(a, list);
      continue;
    }
    a.yaw = lerpAngle(
      a.yaw,
      a.sitting ? a.spotFace : a.state === "use" ? a.face + Math.sin(a.phase * 0.4) * 0.16 : a.face,
      Math.min(1, timeDt * (reduced ? 1 : 4)),
    );
    a.dwell -= timeDt;
    if (a.dwell <= 0) {
      if (a.state === "chat") {
        if (a.partner) endChat(a, list);
        else decide(a, list);
      } else {
        decide(a, list);
      }
    }
  }

  if (moveDt === 0) return;

  for (const a of list) {
    if (!a.sitting) shoveOut(a);
  }

  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i]!;
        const b = list[j]!;
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const d = Math.hypot(dx, dz) || 0.0001;
        if (a.partner === b.id && d > 0.9) continue;
        const min = a.partner === b.id ? 0.95 : (bodySpace(a.width) + bodySpace(b.width)) * 0.96;
        if (d >= min) continue;
        if (a.sitting && b.sitting) {
          if (a.spotId !== b.spotId) continue;
          b.sitting = false;
          b.spotSit = false;
          goToSpot(b, randomSpot(b));
          continue;
        }
        const nx = dx / d;
        const nz = dz / d;
        const gap = min - d;
        if (a.sitting) {
          if (!blockedAt(b.x + nx * gap, b.z + nz * gap, radiusOf(b.width))) {
            b.x += nx * gap;
            b.z += nz * gap;
          }
        } else if (b.sitting) {
          if (!blockedAt(a.x - nx * gap, a.z - nz * gap, radiusOf(a.width))) {
            a.x -= nx * gap;
            a.z -= nz * gap;
          }
        } else {
          const ax = a.x - nx * gap * 0.5;
          const az = a.z - nz * gap * 0.5;
          const bx = b.x + nx * gap * 0.5;
          const bz = b.z + nz * gap * 0.5;
          if (!blockedAt(ax, az, radiusOf(a.width))) {
            a.x = ax;
            a.z = az;
          }
          if (!blockedAt(bx, bz, radiusOf(b.width))) {
            b.x = bx;
            b.z = bz;
          }
        }
      }
    }
  }
}
