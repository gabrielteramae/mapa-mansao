import { useLayoutEffect, useEffect } from "react";
import { ambience } from "@/lib/ambience";
import { useHouse } from "@/lib/house";

export function AmbienceHost() {
  const room = useHouse((s) => s.room);

  useLayoutEffect(() => {
    ambience.hydrate();
  }, []);

  useEffect(() => {
    ambience.setRoom(room);
  }, [room]);

  useEffect(() => {
    const unlock = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-sound-toggle]")) return;
      ambience.gesture();
    };
    const hide = () => ambience.onHide();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);

  return null;
}
