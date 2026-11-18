import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getAgents, step, type Agent } from "@/lib/crew";
import { useHouse } from "@/lib/house";

const thighGeo = new THREE.CapsuleGeometry(0.07, 0.2, 4, 12);
const shinGeo = new THREE.CapsuleGeometry(0.062, 0.16, 4, 12);
const shoeGeo = new THREE.CapsuleGeometry(0.04, 0.14, 2, 10);
const torsoGeo = new THREE.CapsuleGeometry(0.16, 0.26, 6, 16);
const upperGeo = new THREE.CapsuleGeometry(0.055, 0.14, 4, 10);
const foreGeo = new THREE.CapsuleGeometry(0.048, 0.12, 4, 10);
const headGeo = new THREE.SphereGeometry(0.2, 32, 24);
const pupil = new THREE.MeshBasicMaterial({ color: "#241c18" });
const white = new THREE.MeshBasicMaterial({ color: "#fffaf6" });
const mouth = new THREE.MeshBasicMaterial({ color: "#c4786a" });
const glass = new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.35 });
const zip = new THREE.MeshStandardMaterial({ color: "#4a4a4a", roughness: 0.4 });
const ringMat = new THREE.MeshBasicMaterial({ color: "#8eb7e8", toneMapped: false });
const earring = new THREE.MeshStandardMaterial({
  color: "#d9d9d9",
  metalness: 0.6,
  roughness: 0.3,
});
const labels = new Map<string, THREE.Texture>();

function labelTexture(text: string) {
  const cached = labels.get(text);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const g = c.getContext("2d");
  if (!g) return null;
  g.clearRect(0, 0, 512, 128);
  g.font = "700 64px sans-serif";
  const tw = g.measureText(text).width;
  const bw = Math.min(480, tw + 56);
  const x = (512 - bw) / 2;
  g.fillStyle = "rgba(18,14,12,0.9)";
  g.beginPath();
  g.roundRect(x, 22, bw, 84, 42);
  g.fill();
  g.fillStyle = "#f0d7a2";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  labels.set(text, tex);
  return tex;
}

function Hair({ agent }: { agent: Agent; shirt: THREE.Material }) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: agent.hairColor, roughness: 0.8 }),
    [agent.hairColor],
  );
  if (agent.hair === "curly") {
    return (
      <group>
        <mesh position={[0, 0.12, 0]} material={mat}>
          <sphereGeometry args={[0.22, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        </mesh>
        <mesh position={[0.09, 0.16, 0.04]} material={mat}>
          <sphereGeometry args={[0.07, 8, 8]} />
        </mesh>
        <mesh position={[-0.08, 0.17, 0.02]} material={mat}>
          <sphereGeometry args={[0.065, 8, 8]} />
        </mesh>
      </group>
    );
  }
  if (agent.hair === "quiff") {
    return (
      <group>
        <mesh position={[0, 0.1, -0.02]} material={mat}>
          <sphereGeometry args={[0.21, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        <mesh position={[0, 0.22, 0.05]} rotation={[0.45, 0, 0]} material={mat}>
          <boxGeometry args={[0.16, 0.14, 0.1]} />
        </mesh>
      </group>
    );
  }
  if (agent.hair === "side") {
    return (
      <group>
        <mesh position={[0, 0.11, 0]} material={mat}>
          <sphereGeometry args={[0.214, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        </mesh>
        <mesh position={[0.09, 0.13, 0.1]} rotation={[0.25, 0, -0.6]} material={mat}>
          <boxGeometry args={[0.18, 0.045, 0.1]} />
        </mesh>
      </group>
    );
  }
  if (agent.hair === "fringe") {
    return (
      <group>
        <mesh position={[0, 0.12, -0.01]} material={mat}>
          <sphereGeometry args={[0.216, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        </mesh>
        <mesh position={[0, 0.05, 0.16]} material={mat}>
          <boxGeometry args={[0.24, 0.07, 0.05]} />
        </mesh>
      </group>
    );
  }
  if (agent.hair === "wavy") {
    return (
      <group>
        <mesh position={[0, 0.08, -0.02]} material={mat}>
          <sphereGeometry args={[0.22, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        </mesh>
        <mesh position={[0.13, 0.02, 0]} material={mat}>
          <sphereGeometry args={[0.07, 8, 8]} />
        </mesh>
        <mesh position={[-0.13, 0.02, 0]} material={mat}>
          <sphereGeometry args={[0.07, 8, 8]} />
        </mesh>
      </group>
    );
  }
  if (agent.hair === "straight") {
    return (
      <mesh position={[0, 0.13, 0.02]} scale={[1.08, 0.62, 1.08]} material={mat}>
        <sphereGeometry args={[0.2, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
      </mesh>
    );
  }
  if (agent.hair === "fade") {
    return (
      <mesh position={[0, 0.15, 0]} scale={[0.9, 0.48, 0.92]} material={mat}>
        <sphereGeometry args={[0.2, 12, 10]} />
      </mesh>
    );
  }
  if (agent.hair === "spikes") {
    return (
      <group>
        <mesh position={[0, 0.1, 0]} material={mat}>
          <sphereGeometry args={[0.2, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
        {[
          [0, 0.2, 0.02],
          [-0.07, 0.18, 0.04],
          [0.07, 0.18, 0.03],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]} material={mat}>
            <coneGeometry args={[0.035, 0.1, 6]} />
          </mesh>
        ))}
      </group>
    );
  }
  if (agent.hair === "part") {
    return (
      <group>
        <mesh position={[-0.04, 0.13, 0]} rotation={[0, 0, 0.15]} material={mat}>
          <sphereGeometry args={[0.16, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        <mesh position={[0.06, 0.12, 0.02]} rotation={[0, 0, -0.2]} material={mat}>
          <sphereGeometry args={[0.14, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
      </group>
    );
  }
  return (
    <mesh position={[0, 0.14, 0]} scale={[1.02, 0.5, 1.02]} material={mat}>
      <sphereGeometry args={[0.2, 12, 10]} />
    </mesh>
  );
}

function Face({ agent, skin }: { agent: Agent; skin: THREE.Material }) {
  const wide = agent.smile ? 0.1 : 0.06;
  const brow = useMemo(
    () => new THREE.MeshStandardMaterial({ color: agent.hairColor, roughness: 0.85 }),
    [agent.hairColor],
  );
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.07, 0.03, 0.16]}>
          <mesh material={white}>
            <sphereGeometry args={[0.032, 8, 8]} />
          </mesh>
          <mesh position={[0, 0, 0.022]} material={pupil}>
            <sphereGeometry args={[0.015, 8, 8]} />
          </mesh>
          <mesh position={[0, 0.055, -0.01]} rotation={[0, 0, side * -0.25]} material={brow}>
            <boxGeometry args={[0.055, 0.012, 0.02]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.0, 0.185]} material={skin}>
        <sphereGeometry args={[0.028, 8, 8]} />
      </mesh>
      <mesh position={[0, agent.smile ? -0.055 : -0.04, 0.17]} material={mouth}>
        <boxGeometry args={[wide, agent.smile ? 0.028 : 0.014, 0.02]} />
      </mesh>
      {agent.mustache && (
        <mesh position={[0, -0.045, 0.19]} material={brow}>
          <boxGeometry args={[0.12, 0.032, 0.035]} />
        </mesh>
      )}
      {agent.beard === "goatee" && (
        <group>
          <mesh position={[0, -0.09, 0.185]} material={brow}>
            <boxGeometry args={[0.04, 0.07, 0.04]} />
          </mesh>
          <mesh position={[0, -0.145, 0.145]} material={brow}>
            <boxGeometry args={[0.07, 0.07, 0.05]} />
          </mesh>
        </group>
      )}
      {agent.beard === "stubble" &&
        [
          [-0.04, -0.07],
          [0.04, -0.07],
          [0, -0.09],
          [-0.025, -0.055],
          [0.025, -0.055],
        ].map(([x, y]) => (
          <mesh key={`${x}${y}`} position={[x!, y!, 0.16]} material={brow}>
            <sphereGeometry args={[0.012, 6, 6]} />
          </mesh>
        ))}
      {agent.glasses && (
        <group position={[0, 0.035, 0.195]}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.072, 0, 0]} material={glass}>
              <torusGeometry args={[0.048, 0.01, 8, 14]} />
            </mesh>
          ))}
          <mesh material={glass}>
            <boxGeometry args={[0.05, 0.01, 0.01]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function NameTag({ name, hot }: { name: string; hot: boolean }) {
  const map = useMemo(() => labelTexture(name), [name]);
  if (!map) return null;
  const wide = Math.min(1.2, 0.46 + name.length * 0.065);
  return (
    <sprite position={[0, 1.96, 0]} scale={[wide * (hot ? 1.08 : 1), 0.28, 1]} renderOrder={4}>
      <spriteMaterial
        map={map}
        transparent
        depthWrite={false}
        depthTest={false}
        color={hot ? "#d7e8ff" : "#ffffff"}
      />
    </sprite>
  );
}

function Person({ index }: { index: number }) {
  const hips = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const shinL = useRef<THREE.Group>(null);
  const shinR = useRef<THREE.Group>(null);
  const foreL = useRef<THREE.Group>(null);
  const foreR = useRef<THREE.Group>(null);
  const sit = useRef(0);
  const agent = getAgents()[index]!;
  const hot = useHouse((s) => s.member === agent.id);
  const shirt = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: agent.color,
        roughness: agent.top === "jacket" ? 0.45 : 0.78,
      }),
    [agent.color, agent.top],
  );
  const skin = useMemo(
    () => new THREE.MeshStandardMaterial({ color: agent.skin, roughness: 0.62 }),
    [agent.skin],
  );
  const legMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: agent.pants, roughness: 0.84 }),
    [agent.pants],
  );
  const footMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: agent.shoes, roughness: 0.68 }),
    [agent.shoes],
  );
  const limb = agent.top === "bare" ? skin : shirt;
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const g = group.current;
    const a = getAgents()[index];
    if (!g || !a) return;
    g.position.set(a.x, 0, a.z);
    g.rotation.y = a.yaw;
  }, [index]);

  useFrame((_, dt) => {
    const a = getAgents()[index];
    const g = group.current;
    if (!a || !g) return;
    const capped = Math.min(dt, 0.05);
    const goal = a.sitting ? 1 : 0;
    sit.current += (goal - sit.current) * (1 - Math.exp(-8 * capped));
    const s = sit.current;
    const walking = a.state === "walk" ? 1 : 0;
    const stride = Math.sin(a.phase * 8.4);
    const swing = stride * walking;
    const bob = walking * Math.abs(Math.sin(a.phase * 8.4)) * 0.08;
    const breath = (1 - walking) * Math.sin(a.phase * 1.8) * 0.02;
    const follow = 1 - Math.exp(-9 * capped);
    g.position.x += (a.x - g.position.x) * follow;
    g.position.z += (a.z - g.position.z) * follow;
    const sofa = a.spotId.startsWith("sofa");
    const gaming =
      s > 0.55 &&
      !sofa &&
      (a.spotId.startsWith("pc") || a.spotId.startsWith("tv") || a.spotId.startsWith("arena"));
    const chatting = a.state === "chat";
    const mate = a.partner ? getAgents().find((o) => o.id === a.partner) : undefined;
    let look = (1 - walking) * Math.sin(a.phase * 0.65) * 0.22;
    if (mate && chatting) {
      const ang = Math.atan2(mate.x - a.x, mate.z - a.z);
      look = THREE.MathUtils.clamp(
        Math.atan2(Math.sin(ang - a.yaw), Math.cos(ang - a.yaw)),
        -0.8,
        0.8,
      );
    }
    const type = Math.sin(a.phase * 6);
    const reach = gaming ? -0.85 + type * 0.06 : sofa ? -0.15 : chatting ? -0.35 : -0.2;
    const seatY = sofa ? 0.58 : 0.5;
    const y = THREE.MathUtils.lerp(bob + breath, seatY - 0.74 * agent.height, s);
    g.position.y += (y - g.position.y) * follow;
    const turn = Math.atan2(Math.sin(a.yaw - g.rotation.y), Math.cos(a.yaw - g.rotation.y));
    g.rotation.y += turn * follow;
    g.rotation.z = -stride * 0.06 * walking + (1 - walking) * Math.sin(a.phase * 0.7) * 0.02;
    if (hips.current) hips.current.rotation.z = stride * 0.05 * walking;
    if (torso.current) {
      torso.current.rotation.x = walking * 0.12 + breath + (gaming ? 0.16 : 0) + (sofa ? -0.14 : 0);
      torso.current.rotation.z = -stride * 0.08 * walking;
    }
    if (head.current) {
      head.current.rotation.z = stride * 0.05 * walking;
      head.current.rotation.y = a.sitting ? look * 0.85 : look;
      head.current.rotation.x =
        (gaming ? 0.12 : sofa ? -0.08 : 0) + (chatting ? Math.sin(a.phase * 1.5) * 0.06 : 0);
    }
    const liftL = Math.max(0, -stride) * walking;
    const liftR = Math.max(0, stride) * walking;
    if (legL.current) legL.current.rotation.x = THREE.MathUtils.lerp(stride * 0.65, -1.05, s);
    if (legR.current) legR.current.rotation.x = THREE.MathUtils.lerp(-stride * 0.65, -1.05, s);
    if (shinL.current) shinL.current.rotation.x = THREE.MathUtils.lerp(liftL * 0.85, 1.15, s);
    if (shinR.current) shinR.current.rotation.x = THREE.MathUtils.lerp(liftR * 0.85, 1.15, s);
    const armBlend = Math.max(s, chatting ? 0.65 : 0);
    const elbow = gaming ? -0.7 : sofa ? -0.45 : chatting ? -0.25 : 0.12;
    if (armL.current) {
      armL.current.rotation.x = THREE.MathUtils.lerp(-swing * 0.75, reach, armBlend);
      armL.current.rotation.z = gaming ? 0.15 : 0;
    }
    if (armR.current) {
      armR.current.rotation.x = THREE.MathUtils.lerp(swing * 0.75, reach, armBlend);
      armR.current.rotation.z = gaming ? -0.15 : 0;
    }
    if (foreL.current) foreL.current.rotation.x = THREE.MathUtils.lerp(0.12 + liftR * 0.2, elbow, armBlend);
    if (foreR.current)
      foreR.current.rotation.x = THREE.MathUtils.lerp(
        0.12 + liftL * 0.2,
        elbow + (chatting ? Math.sin(a.phase * 2) * 0.15 : 0),
        armBlend,
      );
  });

  return (
    <group ref={group} scale={[1, agent.height, 1]}>
      <group ref={hips} position={[0, 0.74, 0]}>
        <group ref={legL} position={[-0.12, 0, 0]}>
          <mesh geometry={thighGeo} material={legMat} position={[0, -0.17, 0]} />
          <group ref={shinL} position={[0, -0.34, 0]}>
            <mesh geometry={shinGeo} material={legMat} position={[0, -0.15, 0]} />
            <mesh
              geometry={shoeGeo}
              material={footMat}
              position={[0, -0.3, 0.05]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          </group>
        </group>
        <group ref={legR} position={[0.12, 0, 0]}>
          <mesh geometry={thighGeo} material={legMat} position={[0, -0.17, 0]} />
          <group ref={shinR} position={[0, -0.34, 0]}>
            <mesh geometry={shinGeo} material={legMat} position={[0, -0.15, 0]} />
            <mesh
              geometry={shoeGeo}
              material={footMat}
              position={[0, -0.3, 0.05]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          </group>
        </group>
        <group ref={torso} position={[0, 0.31, 0]} scale={[agent.width, 1, 1]}>
          <mesh
            geometry={torsoGeo}
            material={agent.top === "bare" ? skin : shirt}
            scale={agent.id === "saad" ? [1.02, 1, 0.52] : [1.4, 1, 0.86]}
          />
          {agent.top === "hoodie" && agent.id !== "saad" && (
            <mesh position={[0, -0.06, 0.15]} material={shirt}>
              <boxGeometry args={[0.2, 0.14, 0.04]} />
            </mesh>
          )}
          {agent.top === "jacket" && agent.id !== "nishio" && (
            <mesh position={[0, 0.02, 0.15]} material={zip}>
              <boxGeometry args={[0.03, 0.42, 0.02]} />
            </mesh>
          )}
          <group ref={armL} position={[-0.28, 0.17, 0]}>
            <mesh geometry={upperGeo} material={limb} position={[0, -0.12, 0]} />
            <group ref={foreL} position={[0, -0.24, 0]}>
              <mesh geometry={foreGeo} material={limb} position={[0, -0.11, 0]} />
              <mesh position={[0, -0.24, 0]} material={skin}>
                <sphereGeometry args={[0.055, 16, 12]} />
              </mesh>
            </group>
          </group>
          <group ref={armR} position={[0.28, 0.17, 0]}>
            <mesh geometry={upperGeo} material={limb} position={[0, -0.12, 0]} />
            <group ref={foreR} position={[0, -0.24, 0]}>
              <mesh geometry={foreGeo} material={limb} position={[0, -0.11, 0]} />
              <mesh position={[0, -0.24, 0]} material={skin}>
                <sphereGeometry args={[0.055, 16, 12]} />
              </mesh>
            </group>
          </group>
          <mesh position={[0, 0.27, 0]} material={skin}>
            <cylinderGeometry args={[0.07, 0.08, 0.12, 8]} />
          </mesh>
          <group ref={head} position={[0, 0.45, 0]}>
            <mesh geometry={headGeo} material={skin} />
            <Face agent={agent} skin={skin} />
            <Hair agent={agent} shirt={shirt} />
            {agent.id === "guigui" && (
              <mesh position={[-0.18, -0.02, 0.04]} material={earring}>
                <sphereGeometry args={[0.015, 8, 8]} />
              </mesh>
            )}
          </group>
        </group>
      </group>
      <NameTag name={agent.name} hot={hot} />
      {hot && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} material={ringMat}>
          <ringGeometry args={[0.34, 0.42, 24]} />
        </mesh>
      )}
      <mesh
        position={[0, 0.9, 0]}
        onClick={(e) => {
          e.stopPropagation();
          const cur = useHouse.getState().member;
          useHouse.getState().setMember(cur === agent.id ? null : agent.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <cylinderGeometry args={[0.36, 0.36, 1.7, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function Simulator() {
  useFrame((_, dt) => {
    const { playing, speed } = useHouse.getState();
    if (!playing) return;
    step(dt * speed);
  });
  return null;
}

export function People() {
  const list = getAgents();
  return (
    <group>
      {list.map((a, i) => (
        <Person key={a.id} index={i} />
      ))}
    </group>
  );
}
