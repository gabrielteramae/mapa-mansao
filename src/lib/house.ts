import { create } from "zustand";
import type { RoomId } from "@/lib/layout";

export const lightMix = { current: 0 };

type House = {
  room: RoomId;
  member: string | null;
  frame: number;
  night: boolean;
  playing: boolean;
  speed: number;
  spin: boolean;
  hq: boolean;
  setRoom: (room: RoomId) => void;
  setMember: (member: string | null) => void;
  toggleNight: () => void;
  togglePlaying: () => void;
  cycleSpeed: () => void;
  toggleSpin: () => void;
  toggleHq: () => void;
};

export const useHouse = create<House>((set) => ({
  room: "geral",
  member: null,
  frame: 0,
  night: false,
  playing: true,
  speed: 1,
  spin: false,
  hq: true,
  setRoom: (room) => set((s) => ({ room, member: null, frame: s.frame + 1 })),
  setMember: (member) => set((s) => ({ member, frame: s.frame + 1 })),
  toggleNight: () => set((s) => ({ night: !s.night })),
  togglePlaying: () => set((s) => ({ playing: !s.playing })),
  cycleSpeed: () => set((s) => ({ speed: s.speed === 1 ? 2 : s.speed === 2 ? 0.5 : 1 })),
  toggleSpin: () => set((s) => ({ spin: !s.spin })),
  toggleHq: () => set((s) => ({ hq: !s.hq })),
}));
