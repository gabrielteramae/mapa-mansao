import { useEffect, useRef } from "react";
import * as THREE from "three";
import { viewBridge } from "@/components/mansion/bridge";
import { useHouse } from "@/lib/house";
import type { RoomId } from "@/lib/layout";

const rooms: { id: RoomId; label: string; x: number; y: number; z: number; dot: string }[] = [
  { id: "mural", label: "Painel", x: 1.4, y: 2.4, z: -6.2, dot: "#ffd36a" },
  { id: "setup", label: "Setup", x: 8.4, y: 1.7, z: -0.4, dot: "#7eb6ff" },
  { id: "arena", label: "Arena", x: 1.2, y: 2.2, z: -3.2, dot: "#ffb15a" },
  { id: "consoles", label: "Jogos", x: -8.2, y: 1.9, z: -1.6, dot: "#ff7a2a" },
  { id: "lounge", label: "Lounge", x: 0.2, y: 1.3, z: 5, dot: "#7dffb2" },
];

export function RoomPills() {
  const root = useRef<HTMLDivElement>(null);
  const room = useHouse((s) => s.room);

  useEffect(() => {
    const v = new THREE.Vector3();
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (document.hidden) return;
      const camera = viewBridge.camera;
      const gl = viewBridge.gl;
      const host = root.current;
      if (!camera || !gl || !host) return;
      const rect = gl.domElement.getBoundingClientRect();
      rooms.forEach((spot, i) => {
        const el = host.children[i] as HTMLElement | undefined;
        if (!el) return;
        v.set(spot.x, spot.y, spot.z).project(camera);
        const behind = v.z > 1;
        const x = (v.x * 0.5 + 0.5) * rect.width;
        const y = (-v.y * 0.5 + 0.5) * rect.height;
        const hidden = behind || x < -40 || y < -40 || x > rect.width + 40 || y > rect.height + 40;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        el.style.opacity = hidden ? "0" : "1";
      });
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[6]">
      <div ref={root} className="overlay-root">
        {rooms.map((spot) => (
          <button
            key={spot.id}
            type="button"
            className={room === spot.id ? "room-tag is-on" : "room-tag"}
            onClick={() => useHouse.getState().setRoom(spot.id)}
          >
            <span className="room-dot" style={{ background: spot.dot }} />
            <strong className="text-in">{spot.label}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
