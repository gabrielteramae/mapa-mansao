import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { crew } from "@/lib/crew";
import { useHouse } from "@/lib/house";
import type { RoomId } from "@/lib/layout";

export function EnterText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={`${ch}${i}`} className="char-in" style={{ animationDelay: `${i * 38}ms` }}>
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </span>
  );
}

const nav: { id: RoomId; label: string; dot: string }[] = [
  { id: "geral", label: "Visão geral", dot: "#8eb4d4" },
  { id: "consoles", label: "Jogos", dot: "#e7b89a" },
  { id: "lounge", label: "Lounge", dot: "#9bb8c9" },
];

export function Hud() {
  const room = useHouse((s) => s.room);
  const member = useHouse((s) => s.member);
  const setRoom = useHouse((s) => s.setRoom);
  const setMember = useHouse((s) => s.setMember);
  const night = useHouse((s) => s.night);
  const toggleNight = useHouse((s) => s.toggleNight);
  const focus = crew.find((a) => a.id === member) ?? null;
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        className="pointer-events-auto absolute left-[max(0.75rem,env(safe-area-inset-left))] top-[max(0.75rem,env(safe-area-inset-top))] flex size-11 items-center justify-center rounded-full border border-black/10 bg-white sm:left-5 sm:top-5"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex w-5 flex-col gap-1">
          <span
            className={`h-0.5 w-full bg-black transition ${open ? "translate-y-1.5 rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-full bg-black transition ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-full bg-black transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
          />
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            className="pointer-events-auto absolute inset-0"
            onClick={close}
          />
          <div className="pointer-events-auto absolute left-[max(0.75rem,env(safe-area-inset-left))] top-[calc(max(0.75rem,env(safe-area-inset-top))+3.25rem)] z-20 max-h-[70dvh] w-[min(13rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-3 text-black shadow-lg sm:left-5">
            <p className="px-2 text-sm font-bold">Mansão R6</p>
            <div className="mt-2 flex flex-col">
              {crew.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-left text-sm font-bold ${
                    member === person.id ? "bg-[#b9d7f2]" : "bg-white"
                  }`}
                  onClick={() => {
                    setMember(member === person.id ? null : person.id);
                    close();
                  }}
                >
                  {person.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {focus && !open && (
        <button
          type="button"
          className="pointer-events-auto absolute left-16 top-4 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-bold text-black sm:left-20"
          onClick={() => setMember(null)}
        >
          {focus.name}
        </button>
      )}
      <button
        type="button"
        aria-label={
          night ? "Agora está escuro. Mudar para claro" : "Agora está claro. Mudar para escuro"
        }
        className="time-btn pointer-events-auto absolute right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-black sm:right-5 sm:top-5"
        onClick={() => toggleNight()}
      >
        {night ? <Moon className="size-5" /> : <Sun className="size-5" />}
      </button>

      <div className="hud-rise pointer-events-none absolute inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] flex justify-center px-3">
        <div className="pointer-events-auto flex max-w-full justify-center gap-2 overflow-x-auto pb-1">
          {nav.map((item, i) => {
            const on = item.id === room;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRoom(item.id)}
                className={`nav-pill text-in flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold text-black ${
                  on ? "border-transparent bg-[#b9d7f2]" : "border-black/10 bg-white"
                }`}
                data-on={on}
                style={{ animationDelay: `${0.15 + i * 0.07}s` }}
              >
                <span className="size-1.5 rounded-full" style={{ background: item.dot }} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
