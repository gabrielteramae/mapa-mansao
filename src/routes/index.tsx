import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AmbienceHost } from "@/components/ambience";
import { EnterText, Hud } from "@/components/hud";
import { RoomPills } from "@/components/mansion/overlay";
import { useHouse } from "@/lib/house";

export const Route = createFileRoute("/")({
  component: Home,
});

const canvasReady = import("@/components/mansion/canvas");

const MIN_READ = 3400;

function Opening({ leaving }: { leaving: boolean }) {
  return (
    <div className={leaving ? "opening opening-out" : "opening"}>
      <div className="opening-mark" />
      <EnterText text="Mansão R6" className="opening-title font-bold" />
      <span className="opening-sub text-in">Carregando a Mansão</span>
    </div>
  );
}

function Home() {
  const night = useHouse((s) => s.night);
  const frame = useHouse((s) => s.frame);
  const [Canvas, setCanvas] = useState<
    null | typeof import("@/components/mansion/canvas").MansionCanvas
  >(null);
  const [phase, setPhase] = useState<"load" | "leave" | "done">("load");

  useEffect(() => {
    let dead = false;
    const started = performance.now();
    void canvasReady.then((mod) => {
      if (dead) return;
      setCanvas(() => mod.MansionCanvas);
      const wait = Math.max(0, MIN_READ - (performance.now() - started));
      window.setTimeout(() => {
        if (dead) return;
        setPhase("leave");
        window.setTimeout(() => {
          if (!dead) setPhase("done");
        }, 700);
      }, wait);
    });
    return () => {
      dead = true;
    };
  }, []);

  return (
    <main
      className={
        night
          ? "page-shell is-night fixed inset-0 h-dvh w-full overflow-hidden text-[#f4efe8]"
          : "page-shell fixed inset-0 h-dvh w-full overflow-hidden text-[#2c3440]"
      }
    >
      <div className="page-lights" aria-hidden="true">
        <span className="sun-glow" />
        <span className="lamp lamp-a" />
        <span className="lamp lamp-b" />
        <span className="lamp lamp-c" />
        <span className="lamp lamp-d" />
      </div>
      <div className="absolute inset-0">
        {Canvas ? <Canvas /> : null}
        {phase !== "done" && <Opening leaving={phase === "leave"} />}
        {phase === "done" && (
          <>
            <RoomPills />
            <div key={frame} className="view-fade" />
            <Hud />
            <AmbienceHost />
          </>
        )}
      </div>
    </main>
  );
}
