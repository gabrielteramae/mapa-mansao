import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { getAgents } from "@/lib/crew";
import { useHouse, lightMix } from "@/lib/house";
import type { RoomId } from "@/lib/layout";
import { viewApi } from "@/lib/view";
import { viewBridge } from "@/components/mansion/bridge";
import { World } from "@/components/mansion/world";
import { People, Simulator } from "@/components/mansion/people";

const ROOM_VIEW: Record<RoomId, { x: number; y: number; z: number; zoom: number | "fit" }> = {
  geral: { x: 0, y: 0.9, z: -0.2, zoom: "fit" },
  setup: { x: -2.2, y: 0.9, z: -1.7, zoom: 52 },
  consoles: { x: 3.5, y: 0.8, z: 2.1, zoom: 54 },
  arena: { x: 0, y: 0.9, z: 0.5, zoom: 56 },
  mural: { x: 0.1, y: 1.1, z: -2.5, zoom: 50 },
  lounge: { x: -2.3, y: 0.7, z: 2.2, zoom: 54 },
};

function fitZoom(width: number, height: number) {
  return THREE.MathUtils.clamp(Math.min(width / 12, height / 14), 30, 48);
}

const sunDay = new THREE.Color("#fffdf8");
const sunNight = new THREE.Color("#b9c7ea");
const hemiDay = new THREE.Color("#ffffff");
const hemiNight = new THREE.Color("#0c1224");
const groundDay = new THREE.Color("#f3ead8");
const groundNight = new THREE.Color("#05060a");
const fogDay = new THREE.Color("#f4fbff");
const fogNight = new THREE.Color("#010208");
const dayPos = new THREE.Vector3(8, 26, 12);
const nightPos = new THREE.Vector3(-12, 18, -8);

function Sky() {
  const { scene } = useThree();
  useEffect(() => {
    const previous = scene.background;
    scene.background = null;
    return () => {
      scene.background = previous;
    };
  }, [scene]);
  return null;
}

function DayLight() {
  const hq = useHouse((s) => s.hq);
  const map = hq ? 2048 : 1024;
  const hemi = useRef<THREE.HemisphereLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const { gl } = useThree();
  useFrame((_, dt) => {
    const goal = useHouse.getState().night ? 1 : 0;
    const step = 1 - Math.exp(-1.8 * Math.min(dt, 0.05));
    lightMix.current += (goal - lightMix.current) * step;
    const t = lightMix.current;
    if (hemi.current) {
      hemi.current.color.copy(hemiDay).lerp(hemiNight, t);
      hemi.current.groundColor.copy(groundDay).lerp(groundNight, t);
      hemi.current.intensity = THREE.MathUtils.lerp(0.72, 0.06, t);
    }
    if (amb.current) amb.current.intensity = THREE.MathUtils.lerp(0.42, 0.04, t);
    if (sun.current) {
      sun.current.position.lerpVectors(dayPos, nightPos, t);
      sun.current.color.copy(sunDay).lerp(sunNight, t);
      sun.current.intensity = THREE.MathUtils.lerp(2.15, 0.32, t);
    }
    gl.toneMappingExposure = THREE.MathUtils.lerp(hq ? 1.08 : 1, 0.78, t);
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#ffffff", "#f3ead8", 0.72]} />
      <ambientLight ref={amb} intensity={0.42} />
      <directionalLight
        ref={sun}
        castShadow
        position={[8, 26, 12]}
        intensity={2.15}
        color="#fffdf8"
        shadow-mapSize={[map, map]}
        shadow-bias={-0.00025}
        shadow-normalBias={0.02}
        shadow-camera-near={2}
        shadow-camera-far={70}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
    </>
  );
}

function BindBridge() {
  const { camera, gl } = useThree();
  useEffect(() => {
    viewBridge.camera = camera;
    viewBridge.gl = gl;
    return () => {
      if (viewBridge.camera === camera) viewBridge.camera = null;
      if (viewBridge.gl === gl) viewBridge.gl = null;
    };
  }, [camera, gl]);
  return null;
}

function CameraRig() {
  const { camera, size, controls } = useThree();
  const room = useHouse((s) => s.room);
  const member = useHouse((s) => s.member);
  const frame = useHouse((s) => s.frame);
  const goal = useRef(new THREE.Vector3(0, 0.9, -0.2));
  const zoomGoal = useRef(32);
  const live = useRef(true);

  useEffect(() => {
    let x = 0;
    let y = 0.9;
    let z = -0.2;
    let zoom = fitZoom(size.width, size.height);
    const phone = size.width < 700 ? 0.78 : 1;
    if (member) {
      const person = getAgents().find((a) => a.id === member);
      if (person) {
        x = person.x;
        y = 1;
        z = person.z;
        zoom = 108;
      }
    } else {
      const view = ROOM_VIEW[room];
      x = view.x;
      y = view.y;
      z = view.z;
      if (typeof view.zoom === "number") zoom = view.zoom * phone;
    }
    goal.current.set(x, y, z);
    zoomGoal.current = zoom;
    live.current = true;
  }, [room, member, frame, size.width, size.height]);

  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    const apply = (dir: number) => {
      live.current = false;
      cam.zoom = THREE.MathUtils.clamp(cam.zoom * (dir > 0 ? 1.14 : 1 / 1.14), 12, 120);
      cam.updateProjectionMatrix();
    };
    viewApi.closer = () => apply(1);
    viewApi.farther = () => apply(-1);
    const orbit = controls as {
      addEventListener?: (type: string, fn: () => void) => void;
      removeEventListener?: (type: string, fn: () => void) => void;
    } | null;
    const stop = () => {
      live.current = false;
    };
    orbit?.addEventListener?.("start", stop);
    return () => orbit?.removeEventListener?.("start", stop);
  }, [camera, controls]);

  useFrame(() => {
    if (!controls) return;
    const memberId = useHouse.getState().member;
    if (memberId) {
      const person = getAgents().find((a) => a.id === memberId);
      if (person) {
        goal.current.set(person.x, 1.2, person.z);
        zoomGoal.current = 108;
        live.current = true;
      }
    }
    if (!live.current) return;
    const orbit = controls as unknown as { target: THREE.Vector3 };
    const cam = camera as THREE.OrthographicCamera;
    orbit.target.lerp(goal.current, 0.18);
    cam.zoom += (zoomGoal.current - cam.zoom) * 0.18;
    cam.updateProjectionMatrix();
    if (
      !memberId &&
      orbit.target.distanceTo(goal.current) < 0.05 &&
      Math.abs(cam.zoom - zoomGoal.current) < 0.35
    ) {
      live.current = false;
    }
  });

  return null;
}

function ShadowCatch() {
  const scene = useThree((s) => s.scene);
  const night = useHouse((s) => s.night);
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      let city = false;
      let parent: THREE.Object3D | null = mesh;
      while (parent) {
        if (parent.name === "city") city = true;
        parent = parent.parent;
      }
      const geo = mesh.geometry;
      const kind = geo?.type ?? "";
      const flat = kind === "PlaneGeometry" || kind === "CircleGeometry" || kind === "RingGeometry";
      const mat = mesh.material as THREE.Material | undefined;
      const invisible = !!mat && "opacity" in mat && mat.opacity === 0;
      if (mesh.name === "sun" || city || flat || invisible) {
        mesh.castShadow = false;
      } else {
        mesh.castShadow = true;
      }
      mesh.receiveShadow = !city && !invisible;
    });
  }, [scene, night]);
  return null;
}

function Spin() {
  const spin = useHouse((s) => s.spin);
  const speed = useHouse((s) => s.speed);
  const playing = useHouse((s) => s.playing);
  const controls = useThree((s) => s.controls) as {
    autoRotate?: boolean;
    autoRotateSpeed?: number;
  } | null;
  useFrame(() => {
    if (!controls) return;
    controls.autoRotate = spin && playing;
    controls.autoRotateSpeed = 0.8 * speed;
  });
  return null;
}

function Tune() {
  const gl = useThree((s) => s.gl);
  const hq = useHouse((s) => s.hq);
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = hq ? 1.08 : 1;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.type = THREE.PCFShadowMap;
    gl.shadowMap.enabled = true;
    gl.shadowMap.needsUpdate = true;
    gl.setClearColor(0x000000, 0);
  }, [gl, hq]);
  return null;
}

function Air() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog("#f4fbff", 90, 160);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  useFrame(() => {
    const fog = scene.fog as THREE.Fog | null;
    if (!fog) return;
    const t = lightMix.current;
    fog.color.copy(fogDay).lerp(fogNight, t);
    fog.near = THREE.MathUtils.lerp(90, 34, t);
    fog.far = THREE.MathUtils.lerp(160, 78, t);
  });
  return null;
}

export function MansionCanvas() {
  const hq = useHouse((s) => s.hq);
  return (
    <Canvas
      orthographic
      frameloop="always"
      className="block h-full w-full touch-none"
      style={{ width: "100%", height: "100%", display: "block" }}
      dpr={hq ? [1, 2] : 1}
      shadows={{ type: THREE.PCFShadowMap }}
      camera={{ position: [11, 15, 11], zoom: 32, near: -40, far: 120 }}
      gl={{ antialias: true, alpha: true, stencil: false, powerPreference: "high-performance" }}
    >
      <Sky />
      <Tune />
      <BindBridge />
      <DayLight />
      <Simulator />
      <World />
      <People />
      <ShadowCatch />
      <OrbitControls
        makeDefault
        target={[0, 0.9, -0.2]}
        enablePan={false}
        enableDamping
        dampingFactor={0.12}
        rotateSpeed={0.55}
        zoomSpeed={0.7}
        minPolarAngle={0.42}
        maxPolarAngle={0.92}
        minZoom={24}
        maxZoom={90}
      />
      <CameraRig />
      <Spin />
      <Air />
    </Canvas>
  );
}
