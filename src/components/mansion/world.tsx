// @ts-nocheck
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useHouse, lightMix } from "@/lib/house";
import { PCS, PC_Z, type ZoneId } from "@/lib/layout";


const dark = new THREE.MeshStandardMaterial({
  color: "#0c0c10",
  roughness: .42,
  metalness: .18
});
const panel = new THREE.MeshStandardMaterial({
  color: "#2a2a32",
  roughness: .72
});
const wood = new THREE.MeshStandardMaterial({
  color: "#101014",
  roughness: .55,
  metalness: .12
});
const trim = new THREE.MeshStandardMaterial({
  color: "#24242c",
  roughness: .62
});
const cream = new THREE.MeshStandardMaterial({
  color: "#f2f2f4",
  roughness: .4
});
const leaf = new THREE.MeshStandardMaterial({
  color: "#3ddc6e",
  roughness: .45
});
const ground = new THREE.MeshStandardMaterial({
  color: "#3dcc5a",
  roughness: 1
});
const glow = new THREE.MeshStandardMaterial({
  color: "#ff4fd8",
  emissive: "#ff4fd8",
  emissiveIntensity: .9,
  roughness: .35
});
const rgbStrip = new THREE.MeshStandardMaterial({
  color: "#ff2d55",
  emissive: "#ff2d55",
  emissiveIntensity: 1.4,
  roughness: .28
});
const rgbKeys = new THREE.MeshStandardMaterial({
  color: "#4d7cff",
  emissive: "#4d7cff",
  emissiveIntensity: 1.4,
  roughness: .28
});
const rgbCase = new THREE.MeshStandardMaterial({
  color: "#3ddc6e",
  emissive: "#3ddc6e",
  emissiveIntensity: 1.4,
  roughness: .28
});
const lamp = new THREE.MeshStandardMaterial({
  color: "#ffd56a",
  emissive: "#ffb703",
  emissiveIntensity: .85,
  roughness: .4
});
const pillow = new THREE.MeshStandardMaterial({
  color: "#ff5d8f",
  roughness: .6
});
const pillow2 = new THREE.MeshStandardMaterial({
  color: "#2ec4b6",
  roughness: .6
});
const curtain = new THREE.MeshStandardMaterial({
  color: "#ff7a3c",
  roughness: .75
});
const rugMat = new THREE.MeshStandardMaterial({
  color: "#ff4d6d",
  roughness: .85
});
const arcadeMat = new THREE.MeshStandardMaterial({
  color: "#3a86ff",
  roughness: .4
});
const crtMat = new THREE.MeshStandardMaterial({
  color: "#24124a",
  roughness: .3,
  metalness: .35
});
const neon = new THREE.MeshStandardMaterial({
  color: "#2ee56a",
  emissive: "#2ee56a",
  emissiveIntensity: .95,
  roughness: .35
});
const cityColors = ["#ff5d73", "#ffd166", "#2ec4b6", "#5b5bd6", "#f15bb5", "#ff9f1c", "#4cc9f0", "#9b5de5"];
function screenTexture(title, sub) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 288;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#07060c";
  g.fillRect(0, 0, 512, 288);
  const grd = g.createLinearGradient(0, 0, 512, 288);
  grd.addColorStop(0, "#1a1030");
  grd.addColorStop(1, "#3a1848");
  g.fillStyle = grd;
  g.fillRect(14, 14, 484, 260);
  g.strokeStyle = "#c4a2ff";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(400, 150, 42, 0, Math.PI * 2);
  g.moveTo(400, 98);
  g.lineTo(400, 202);
  g.moveTo(348, 150);
  g.lineTo(452, 150);
  g.stroke();
  g.fillStyle = "#e8c27a";
  g.fillRect(36, 40, 64, 6);
  g.fillStyle = "#f6ead8";
  let size = 52;
  g.font = `700 ${size}px Georgia, serif`;
  while (g.measureText(title).width > 280 && size > 28) {
    size -= 4;
    g.font = `700 ${size}px Georgia, serif`;
  }
  g.fillText(title, 36, 128);
  g.fillStyle = "#c4a2ff";
  g.font = "400 24px sans-serif";
  g.fillText(sub, 36, 176);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
function paintCover(img) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 576;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#05040a";
  g.fillRect(0, 0, c.width, c.height);
  const scale = Math.min(c.width / img.width, c.height / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  g.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
function loadCover(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(paintCover(img));
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
function welcomeTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 576;
  const g = c.getContext("2d");
  if (!g) return null;
  const grd = g.createLinearGradient(0, 0, 1024, 576);
  grd.addColorStop(0, "#12081f");
  grd.addColorStop(1, "#3a1860");
  g.fillStyle = grd;
  g.fillRect(0, 0, 1024, 576);
  g.fillStyle = "#f4efe4";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "700 96px Georgia, serif";
  g.fillText("Bem-vindo", 512, 230);
  g.font = "700 78px Georgia, serif";
  g.fillText("a Mansão R6", 512, 350);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
function useScreens() {
  const [pcs, setPcs] = useState([null, null, null, null]);
  const arena = useMemo(() => screenTexture("Mansão R6", "CASA"), []);
  const tv = useMemo(() => welcomeTexture(), []);
  useEffect(() => {
    let dead = false;
    const sources = ["screens/r6.jpg?v=2", "screens/fortnite.jpg?v=2", "screens/lol.jpg?v=2", "screens/dbd.jpg?v=2"].map((file) => `${import.meta.env.BASE_URL}${file}`);
    void Promise.all(sources.map(loadCover)).then(maps => {
      if (!dead) setPcs(maps);
    });
    return () => {
      dead = true;
    };
  }, []);
  return {
    pcs,
    arena,
    tv
  };
}
function useMuralTexture() {
  const [tex, setTex] = useState(null);
  useEffect(() => {
    let dead = false;
    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}mural/gabriel.jpg?v=3`;
    img.onload = () => {
      if (dead) return;
      const c = document.createElement("canvas");
      c.width = 2048;
      c.height = 720;
      const g = c.getContext("2d");
      if (!g) return;
      g.fillStyle = "#f4f7fb";
      g.fillRect(0, 0, 2048, 720);
      const dx = 48;
      const dy = 36;
      const dw = 620;
      const dh = 648;
      const scale = Math.max(dw / img.width, dh / img.height);
      const sw = dw / scale;
      const sh = dh / scale;
      const sx = (img.width - sw) / 2;
      const sy = Math.max(0, (img.height - sh) * .02);
      g.save();
      g.beginPath();
      g.roundRect(dx, dy, dw, dh, 28);
      g.clip();
      g.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      g.restore();
      g.strokeStyle = "#1c2430";
      g.lineWidth = 8;
      g.beginPath();
      g.roundRect(dx, dy, dw, dh, 28);
      g.stroke();
      g.fillStyle = "#1c2430";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = "700 150px Georgia, serif";
      g.fillText("Mansão", 1360, 280);
      g.font = "700 210px Georgia, serif";
      g.fillText("R6", 1360, 470);
      const next = new THREE.CanvasTexture(c);
      next.colorSpace = THREE.SRGBColorSpace;
      next.anisotropy = 8;
      setTex(next);
    };
    return () => {
      dead = true;
    };
  }, []);
  return tex;
}
function Zone({
  id,
  x,
  z,
  w,
  d
}) {
  const on = useHouse(s => s.room === id);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, .025, z]} onClick={e => {
    e.stopPropagation();
    useHouse.getState().setRoom(id);
  }} onPointerOver={() => {
    document.body.style.cursor = "pointer";
  }} onPointerOut={() => {
    document.body.style.cursor = "";
  }}><planeGeometry args={[w, d]} /><meshStandardMaterial color={on ? "#ffd166" : "#ff8a3c"} emissive={on ? "#ff4d6d" : "#000000"} emissiveIntensity={on ? .28 : 0} roughness={1} /></mesh>;
}
function Desk({
  x,
  map,
  phase
}) {
  return <group position={[x, 0, PC_Z]} onClick={e => {
    e.stopPropagation();
    useHouse.getState().setRoom("setup");
  }}><mesh position={[0, .74, 0]} material={wood}><boxGeometry args={[1.42, .07, .72]} /></mesh><mesh position={[0, .36, 0]} material={trim}><boxGeometry args={[1.2, .7, .58]} /></mesh><mesh position={[0, .69, .34]} material={rgbStrip}><boxGeometry args={[1.28, .018, .03]} /></mesh><group position={[0, 1.24, -.22]}><mesh position={[0, .3, 0]} material={trim}><boxGeometry args={[1.08, .05, .06]} /></mesh><mesh position={[0, -.3, 0]} material={trim}><boxGeometry args={[1.08, .05, .06]} /></mesh><mesh position={[-.52, 0, 0]} material={trim}><boxGeometry args={[.06, .56, .06]} /></mesh><mesh position={[.52, 0, 0]} material={trim}><boxGeometry args={[.06, .56, .06]} /></mesh><mesh position={[0, 0, -.02]} material={dark}><boxGeometry args={[.98, .54, .02]} /></mesh>{map && <mesh position={[0, 0, .02]}><planeGeometry args={[.94, .5]} /><meshBasicMaterial map={map} toneMapped={false} polygonOffset={true} polygonOffsetFactor={-1} /></mesh>}</group><mesh position={[0, .84, -.22]} material={trim}><boxGeometry args={[.07, .14, .06]} /></mesh><mesh position={[-.02, .8, .04]} material={dark}><boxGeometry args={[.46, .02, .16]} /></mesh><mesh position={[-.02, .812, .11]} material={rgbKeys}><boxGeometry args={[.44, .01, .015]} /></mesh><mesh position={[.32, .8, .1]} material={dark}><boxGeometry args={[.09, .025, .13]} /></mesh><mesh position={[.32, .816, .1]} material={rgbKeys}><boxGeometry args={[.05, .008, .07]} /></mesh><group position={[.92, 0, .08]}><mesh position={[0, .38, 0]} material={dark}><boxGeometry args={[.24, .76, .46]} /></mesh><mesh position={[0, .4, .22]} material={trim}><boxGeometry args={[.16, .48, .02]} /></mesh><mesh position={[0, .22, .23]} material={rgbCase}><boxGeometry args={[.12, .03, .012]} /></mesh></group><DeskAccent phase={phase} /><GamerChair /></group>;
}
function GamerChair() {
  return <group position={[0, 0, .78]}><mesh position={[0, .06, 0]} rotation={[-Math.PI / 2, 0, 0]} material={trim}><cylinderGeometry args={[.24, .24, .04, 8]} /></mesh><mesh position={[0, .22, 0]} material={trim}><cylinderGeometry args={[.035, .045, .28, 6]} /></mesh><mesh position={[0, .42, 0]} material={dark}><boxGeometry args={[.48, .08, .46]} /></mesh><mesh position={[0, .8, .18]} material={dark}><boxGeometry args={[.48, .64, .08]} /></mesh><mesh position={[0, 1.14, .22]} material={rgbCase}><boxGeometry args={[.34, .025, .02]} /></mesh><mesh position={[-.28, .52, 0]} material={trim}><boxGeometry args={[.06, .05, .28]} /></mesh><mesh position={[.28, .52, 0]} material={trim}><boxGeometry args={[.06, .05, .28]} /></mesh></group>;
}
function Seat({
  x = 0,
  z = 0
}) {
  return <group position={[x, 0, z]}><mesh position={[-.16, .22, 0]} material={trim}><boxGeometry args={[.05, .44, .05]} /></mesh><mesh position={[.16, .22, 0]} material={trim}><boxGeometry args={[.05, .44, .05]} /></mesh><mesh position={[0, .46, 0]} material={dark}><boxGeometry args={[.42, .06, .4]} /></mesh><mesh position={[0, .7, .16]} material={dark}><boxGeometry args={[.42, .36, .06]} /></mesh></group>;
}
function paintRgb(mat, hue, night) {
  mat.color.setHSL(hue % 1, .86, .4 + night * .14);
  mat.emissive.copy(mat.color);
  mat.emissiveIntensity = .7 + night * 1.5;
}
function RgbPulse() {
  useFrame(({
    clock
  }) => {
    const night = lightMix.current;
    const t = clock.elapsedTime * .07;
    paintRgb(rgbStrip, t, night);
    paintRgb(rgbKeys, t + .2, night);
    paintRgb(rgbCase, t + .45, night);
  });
  return null;
}
function DeskAccent({
  phase
}) {
  const light = useRef(null);
  useFrame(({
    clock
  }) => {
    const lamp = light.current;
    if (!lamp) return;
    const night = lightMix.current;
    lamp.color.setHSL((clock.elapsedTime * .07 + phase) % 1, .9, .55);
    lamp.intensity = .25 + night * 1.35;
  });
  return <pointLight ref={light} position={[0, 1.05, .15]} distance={2.6} decay={2} />;
}
function TimeSurface() {
  const night = useHouse(s => s.night);
  useEffect(() => {
    ground.color.set(night ? "#178a3a" : "#3dcc5a");
    treeMat.color.set(night ? "#14944a" : "#2ee56a");
  }, [night]);
  return null;
}
function Skyline() {
  const night = useHouse(s => s.night);
  const buildings = useMemo(() => {
    return Array.from({
      length: 22
    }, (_, i) => ({
      x: -16 + i * 1.5,
      h: 2.2 + i * 37 % 9 * .55,
      w: 1.05 + i % 3 * .28,
      z: -10.2 - i % 3 * .85,
      color: cityColors[i % cityColors.length]
    }));
  }, []);
  return <group>{buildings.map((b, i) =><group key={b.x}><mesh position={[b.x, b.h / 2 - .48, b.z]}><boxGeometry args={[b.w, b.h, b.w * .72]} /><meshStandardMaterial color={b.color} roughness={night ? .7 : .5} /></mesh>{Array.from({
        length: Math.min(5, Math.floor(b.h / .7))
      }, (_, row) => Array.from({
        length: 2
      }, (_, col) =><mesh key={`${b.x}-${row}-${col}`} position={[b.x - b.w * .22 + col * b.w * .44, row * .62 + .07, b.z + b.w * .38]}><planeGeometry args={[.16, .18]} /><meshBasicMaterial color={night ? row % 2 === col % 2 ? "#fff1b8" : "#b7dcff" : "#d5e4f2"} toneMapped={false} /></mesh>))}</group>)}</group>;
}
const felt = new THREE.MeshStandardMaterial({
  color: "#1f8a4c",
  roughness: .42
});
const ballYellow = new THREE.MeshStandardMaterial({
  color: "#f2c14e",
  roughness: .35
});
const ballWhite = new THREE.MeshStandardMaterial({
  color: "#f7f7fb",
  roughness: .35
});
const trunkMat = new THREE.MeshStandardMaterial({
  color: "#6b4423",
  roughness: .9
});
const treeMat = new THREE.MeshStandardMaterial({
  color: "#1d4a32",
  roughness: .8
});
const planeWhite = new THREE.MeshStandardMaterial({
  color: "#f7f9fc",
  roughness: .32,
  metalness: .04
});
const planeBlue = new THREE.MeshStandardMaterial({
  color: "#1d4ed8",
  roughness: .38,
  metalness: .06
});
const winOn = new THREE.MeshBasicMaterial({
  color: "#fff3c4",
  toneMapped: false
});
const winDay = new THREE.MeshBasicMaterial({
  color: "#d7e7f6",
  toneMapped: false
});
const winOff = new THREE.MeshBasicMaterial({
  color: "#1a222c",
  toneMapped: false
});
function Guitar({
  x,
  z,
  color,
  neck
}) {
  return <group position={[x, 0, z]} rotation={[0, .5, 0]}><mesh position={[0, .55, 0]} material={trim}><boxGeometry args={[.06, 1.05, .06]} /></mesh><mesh position={[.02, .7, 0]} rotation={[0, 0, .2]}><boxGeometry args={[.22, .32, .07]} /><meshStandardMaterial color={color} roughness={.55} /></mesh><mesh position={[.06, 1.05, 0]} rotation={[0, 0, .2]}><boxGeometry args={[.04, .46, .03]} /><meshStandardMaterial color={neck} roughness={.5} /></mesh></group>;
}
function Gear() {
  return <group><group position={[5.55, 0, .45]}><mesh position={[0, .38, 0]} material={wood}><boxGeometry args={[1.15, .7, 1.7]} /></mesh><mesh position={[0, .76, 0]} material={felt}><boxGeometry args={[1.02, .06, 1.52]} /></mesh><mesh position={[.22, .84, .18]} material={ballYellow}><sphereGeometry args={[.055, 10, 10]} /></mesh><mesh position={[-.16, .84, -.12]} material={ballWhite}><sphereGeometry args={[.055, 10, 10]} /></mesh><mesh position={[.05, .84, -.28]} material={pillow}><sphereGeometry args={[.055, 10, 10]} /></mesh></group><group position={[-6.35, 0, 3.35]}><mesh position={[0, .38, 0]} material={dark}><boxGeometry args={[.72, .76, .72]} /></mesh><mesh position={[0, 1.15, .08]} rotation={[-.4, 0, 0]} material={crtMat}><boxGeometry args={[.64, .95, .1]} /></mesh><mesh position={[0, 1.16, .16]} rotation={[-.4, 0, 0]}><planeGeometry args={[.5, .72]} /><meshBasicMaterial color="#7c5cff" toneMapped={false} /></mesh><mesh position={[.3, .55, .3]} material={arcadeMat}><boxGeometry args={[.08, .4, .08]} /></mesh></group><Guitar x={-6.65} z={-1.3} color="#e23d3d" neck="#d08945" /><Guitar x={-6.65} z={-.15} color="#f2c14e" neck="#d7dde6" /><group position={[4.75, 0, 2.4]}><mesh position={[0, .18, 0]} material={crtMat}><boxGeometry args={[.55, .3, .4]} /></mesh><mesh position={[.16, .36, .05]}><boxGeometry args={[.2, .05, .1]} /><meshStandardMaterial color="#2f6bff" /></mesh><mesh position={[-.16, .36, .05]}><boxGeometry args={[.2, .05, .1]} /><meshStandardMaterial color="#e23d3d" /></mesh></group></group>;
}
function District() {
  const night = useHouse(s => s.night);
  const hq = useHouse(s => s.hq);
  const blocks = useMemo(() => {
    const out = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 10; col++) {
        const i = row * 10 + col;
        out.push({
          x: -28 + col * 6.2,
          z: -15 - row * 4.2,
          h: 3 + i * 5 % 9 * .7,
          w: 2.2 + i % 3 * .35,
          color: cityColors[i % cityColors.length]
        });
      }
    }
    for (let i = 0; i < 7; i++) {
      out.push({
        x: -26,
        z: -8 + i * 3.6,
        h: 3.2 + i % 4 * 1.1,
        w: 2.1,
        color: cityColors[(i + 2) % cityColors.length]
      });
      out.push({
        x: 26,
        z: -8 + i * 3.6,
        h: 3.4 + i % 5 * .9,
        w: 2.1,
        color: cityColors[(i + 5) % cityColors.length]
      });
      out.push({
        x: -32,
        z: -6 + i * 4,
        h: 4 + i % 3 * 1.4,
        w: 2.4,
        color: cityColors[(i + 1) % cityColors.length]
      });
      out.push({
        x: 32,
        z: -6 + i * 4,
        h: 4.2 + i % 4 * 1.2,
        w: 2.4,
        color: cityColors[(i + 4) % cityColors.length]
      });
    }
    return out;
  }, []);
  return <group>{[[-22, -6], [-8, 8], [6, 12], [18, -4], [24, 10], [-18, 14], [12, -12], [-30, 2]].map(([x, z]) =><group key={`${x}-${z}`} position={[x, -.48, z]}><mesh position={[0, .35, 0]} material={trunkMat}><cylinderGeometry args={[.09, .12, .7, 6]} /></mesh><mesh position={[0, .95, 0]} material={treeMat}><sphereGeometry args={[.48, 8, 8]} /></mesh></group>)}{blocks.map((b, i) =><group key={`block-${i}`}><mesh position={[b.x, b.h / 2 - .48, b.z]}><boxGeometry args={[b.w, b.h, b.w * .7]} /><meshStandardMaterial color={b.color} roughness={night ? .7 : .48} /></mesh><mesh position={[b.x, b.h * .45 - .08, b.z + b.w * .36]} material={night ? winOn : winDay}><planeGeometry args={[.36, .42]} /></mesh>{night && hq && i % 14 === 0 && <pointLight position={[b.x, b.h * .45 - .08, b.z]} color="#ffe7a3" intensity={4} distance={14} decay={2} />}</group>)}</group>;
}
function Sconces() {
  const spots = [[-7.55, 1.7, -2.2], [-7.55, 1.7, 2.2], [7.55, 1.7, -2.2], [7.55, 1.7, 2.4]];
  const mats = useMemo(() => spots.map(() => new THREE.MeshStandardMaterial({
    color: "#e8c27a",
    emissive: "#e8b15a",
    emissiveIntensity: .15
  })), []);
  const lights = useRef([]);
  useFrame(() => {
    const t = lightMix.current;
    const glow = THREE.MathUtils.lerp(.15, 1.6, t);
    const lamp = THREE.MathUtils.lerp(0, 2.4, t);
    mats.forEach(mat => {
      mat.emissiveIntensity = glow;
    });
    lights.current.forEach(lampLight => {
      if (lampLight) lampLight.intensity = lamp;
    });
  });
  return <group>{spots.map(([x, y, z], i) =><group key={`lamp-${i}`}><mesh position={[x, y, z]} material={mats[i]}><boxGeometry args={[.08, .28, .16]} /></mesh><pointLight ref={node => {
        lights.current[i] = node;
      }} position={[x + (x > 0 ? -.4 : .4), y, z]} color="#ffb15a" intensity={0} distance={4.5} decay={2} /></group>)}</group>;
}
function RoomLights() {
  const warm = useRef(null);
  const cool = useRef(null);
  const fill = useRef(null);
  useFrame(() => {
    const k = THREE.MathUtils.lerp(1.1, 2.2, lightMix.current);
    if (warm.current) warm.current.intensity = 6 * k;
    if (cool.current) cool.current.intensity = 5 * k;
    if (fill.current) fill.current.intensity = 4 * k;
  });
  return <><pointLight ref={warm} position={[-2.2, 2.2, 1.2]} color="#e8b15a" intensity={.72} distance={12} decay={2} /><pointLight ref={cool} position={[3.2, 1.8, 1.6]} color="#ffd56a" intensity={.6} distance={10} decay={2} /><pointLight ref={fill} position={[.2, 2.4, 2.2]} color="#ffb15a" intensity={.48} distance={11} decay={2} /></>;
}
function bannerTexture() {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 2048, 512);
  g.fillStyle = "#1c2430";
  g.font = "700 216px Georgia, serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("Mansão R6", 1024, 272);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}
function BannerPlane() {
  const ref = useRef(null);
  const map = useMemo(() => bannerTexture(), []);
  const front = useMemo(() => new THREE.MeshBasicMaterial({
    map: map ?? undefined,
    side: THREE.FrontSide,
    toneMapped: false
  }), [map]);
  const back = useMemo(() => front.clone(), [front]);
  const lamp = useRef(null);
  const aim = useRef(null);
  const flagA = useRef(null);
  const flagB = useRef(null);
  const wave = (mesh, time) => {
    if (!mesh) return;
    const pos = mesh.geometry.attributes.position;
    if (!pos) return;
    const saved = mesh.geometry.userData.base;
    const base = saved ?? (mesh.geometry.userData.base = Array.from(pos.array));
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const free = (-x + .85) / 1.7;
      const z = Math.sin(time * 8 + free * 6) * .14 * free + Math.sin(time * 5 + y * 6) * .035 * free;
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  };
  useFrame((_, dt) => {
    const group = ref.current;
    if (!group) return;
    if (lamp.current && aim.current) lamp.current.target = aim.current;
    const t = (group.userData.t ?? 0) + Math.min(dt, .05);
    group.userData.t = t;
    wave(flagA.current, t);
    wave(flagB.current, t);
    const trip = t % 36 / 36;
    const goingLeft = trip < .5;
    const u = goingLeft ? trip / .5 : (trip - .5) / .5;
    const x = goingLeft ? 26 - u * 52 : -26 + u * 52;
    group.position.set(x, 11.2, -2);
    group.rotation.set(0, goingLeft ? Math.PI : 0, 0);
  });
  return <group ref={ref} scale={2.15}><mesh position={[.15, 0, 0]} material={planeWhite}><boxGeometry args={[2.35, .42, .42]} /></mesh><mesh position={[1.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]} material={planeBlue}><coneGeometry args={[.21, .62, 10]} /></mesh><mesh position={[.35, .2, 0]} material={planeBlue}><boxGeometry args={[.55, .22, .32]} /></mesh><mesh position={[.05, 0, 0]} material={planeWhite}><boxGeometry args={[.85, .08, 3.1]} /></mesh><mesh position={[-.95, .38, 0]} material={planeBlue}><boxGeometry args={[.42, .55, .08]} /></mesh><mesh position={[-.95, .02, 0]} material={planeWhite}><boxGeometry args={[.42, .06, 1.15]} /></mesh><mesh position={[-1.55, -.05, 0]} material={planeBlue}><boxGeometry args={[.08, .08, .55]} /></mesh><mesh position={[1.62, 0, 0]}><sphereGeometry args={[.07, 12, 12]} /><meshBasicMaterial color="#fff6d0" /></mesh><spotLight ref={lamp} position={[1.35, 0, 0]} angle={.42} penumbra={.6} intensity={10} distance={22} color="#fff4cc" decay={2} /><object3D ref={aim} position={[8, 0, 0]} /><mesh ref={flagA} position={[-2.55, -.15, .02]} material={front}><planeGeometry args={[1.7, .48, 32, 8]} /></mesh><mesh ref={flagB} position={[-2.55, -.15, -.02]} rotation={[0, Math.PI, 0]} material={back}><planeGeometry args={[1.7, .48, 32, 8]} /></mesh></group>;
}
function Extras() {
  const cases = cityColors;
  return <group><group position={[-6.35, 0, -4.15]}><mesh position={[0, .75, 0]} material={crtMat}><boxGeometry args={[.36, 1.5, 1.15]} /></mesh>{cases.map((color, i) =><mesh key={`shelf-${i}`} position={[.16, .28 + i % 4 * .32, -.4 + Math.floor(i / 4) * .7]}><boxGeometry args={[.08, .22, .28]} /><meshStandardMaterial color={color} roughness={.5} /></mesh>)}</group><group position={[4.6, 0, -4.45]}><mesh position={[0, .8, 0]} material={crtMat}><boxGeometry args={[2.2, 1.6, .32]} /></mesh>{cases.map((color, i) =><mesh key={`poster-${i}`} position={[-.8 + i % 4 * .52, .35 + Math.floor(i / 4) * .7, .14]}><boxGeometry args={[.4, .48, .08]} /><meshStandardMaterial color={color} roughness={.5} /></mesh>)}</group><mesh position={[1.15, .22, 2.65]} material={pillow}><sphereGeometry args={[.38, 16, 12]} /></mesh><mesh position={[-.35, .2, 3.25]} material={pillow2}><sphereGeometry args={[.34, 16, 12]} /></mesh><group position={[-2.35, 0, .15]}><mesh position={[0, .24, 0]} material={trim}><boxGeometry args={[.42, .08, .42]} /></mesh><mesh position={[0, .55, -.16]} material={pillow}><boxGeometry args={[.42, .46, .08]} /></mesh></group><group position={[2.45, 0, -.55]}><mesh position={[0, .24, 0]} material={trim}><boxGeometry args={[.42, .08, .42]} /></mesh><mesh position={[0, .55, -.16]} material={glow}><boxGeometry args={[.42, .46, .08]} /></mesh></group><group position={[2.35, 0, 3.7]}><mesh position={[0, .28, 0]} material={crtMat}><boxGeometry args={[1.6, .5, .46]} /></mesh>{["#7c5cff", "#e8b15a", "#c4a2ff"].map((color, i) =><group key={color} position={[-.48 + i * .48, .68, 0]}><mesh material={crtMat}><boxGeometry args={[.38, .32, .28]} /></mesh><mesh position={[0, 0, .15]}><planeGeometry args={[.28, .18]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh></group>)} <mesh position={[0, .08, .28]} material={neon}><boxGeometry args={[1.45, .04, .04]} /></mesh></group><group position={[5.15, 0, -2.35]}><mesh position={[0, .28, 0]} material={dark}><boxGeometry args={[.55, .5, .55]} /></mesh><mesh position={[0, .62, -.18]} material={pillow}><boxGeometry args={[.5, .4, .1]} /></mesh><mesh position={[0, .58, .32]} rotation={[.5, 0, 0]} material={crtMat}><torusGeometry args={[.18, .035, 8, 16]} /></mesh></group>{[-1.7, 1.7].map(x =><group key={x} position={[x, 0, -.35]}><mesh position={[0, .45, 0]} material={crtMat}><boxGeometry args={[.26, .9, .26]} /></mesh><mesh position={[0, .7, .14]} material={neon}><boxGeometry args={[.16, .1, .02]} /></mesh></group>)}</group>;
}
function TvLounge({ z, map }) {
  return (
    <group position={[-9.2, 0, z]}>
      <mesh position={[-0.55, 1.28, 0]} rotation={[0, Math.PI / 2, 0]} material={trim}>
        <boxGeometry args={[1.55, 0.9, 0.06]} />
      </mesh>
      <mesh position={[-0.5, 1.28, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.4, 0.76]} />
        <meshBasicMaterial map={map ?? undefined} color={map ? "#fff" : "#1a1030"} toneMapped={false} />
      </mesh>
      <mesh position={[-0.55, 0.62, 0]} material={trim}>
        <boxGeometry args={[0.08, 0.55, 0.08]} />
      </mesh>
      <mesh position={[-0.35, 0.32, 0]} material={dark}>
        <boxGeometry args={[0.55, 0.22, 1.35]} />
      </mesh>
      <mesh position={[-0.32, 0.52, -0.32]} material={cream}>
        <boxGeometry args={[0.16, 0.22, 0.34]} />
      </mesh>
      <mesh position={[-0.32, 0.48, 0.34]} material={dark}>
        <boxGeometry args={[0.28, 0.1, 0.28]} />
      </mesh>
      <mesh position={[-0.32, 0.54, 0.34]} material={neon}>
        <boxGeometry args={[0.16, 0.02, 0.16]} />
      </mesh>
      <mesh position={[1.7, 0.36, 0]} material={arcadeMat}>
        <boxGeometry args={[0.7, 0.32, 1.55]} />
      </mesh>
      <mesh position={[1.98, 0.66, 0]} material={arcadeMat}>
        <boxGeometry args={[0.16, 0.4, 1.55]} />
      </mesh>
    </group>
  );
}

function Pinball({ x, z, color }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.85, 0]} material={crtMat}>
        <boxGeometry args={[0.72, 1.55, 1.05]} />
      </mesh>
      <mesh position={[0, 1.15, 0.32]} rotation={[-0.55, 0, 0]}>
        <planeGeometry args={[0.55, 0.85]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.42, 0.48]} material={neon}>
        <boxGeometry args={[0.5, 0.05, 0.08]} />
      </mesh>
    </group>
  );
}

function Hoop({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.15, 0]} material={arcadeMat}>
        <boxGeometry args={[0.9, 2.15, 0.62]} />
      </mesh>
      <mesh position={[0, 1.72, 0.28]} material={lamp}>
        <torusGeometry args={[0.2, 0.028, 8, 16]} />
      </mesh>
      <mesh position={[0, 0.48, 0.22]} material={lamp}>
        <sphereGeometry args={[0.11, 12, 10]} />
      </mesh>
    </group>
  );
}

function GamingDesk({ z, color }) {
  return (
    <group position={[9.2, 0, z]}>
      <mesh position={[0.15, 0.74, 0]} material={dark}>
        <boxGeometry args={[0.72, 0.06, 1.2]} />
      </mesh>
      <mesh position={[0.42, 0.4, 0]} material={trim}>
        <boxGeometry args={[0.06, 0.68, 1.05]} />
      </mesh>
      <mesh position={[0.42, 1.18, 0]} rotation={[0, -Math.PI / 2, 0]} material={trim}>
        <boxGeometry args={[1.05, 0.62, 0.05]} />
      </mesh>
      <mesh position={[0.38, 1.18, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.96, 0.52]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0.05, 0.8, 0.15]} material={rgbKeys}>
        <boxGeometry args={[0.22, 0.03, 0.42]} />
      </mesh>
      <mesh position={[0.02, 0.8, -0.32]} material={rgbStrip}>
        <boxGeometry args={[0.12, 0.03, 0.18]} />
      </mesh>
      <mesh position={[-0.05, 0.95, 0.42]} material={rgbCase}>
        <boxGeometry args={[0.22, 0.42, 0.38]} />
      </mesh>
      <mesh position={[-0.85, 0.46, 0]} material={trim}>
        <boxGeometry args={[0.46, 0.08, 0.46]} />
      </mesh>
      <mesh position={[-0.85, 0.72, 0.18]} material={trim}>
        <boxGeometry args={[0.46, 0.5, 0.08]} />
      </mesh>
    </group>
  );
}

function LedRails() {
  const panel = useRef(null);
  const games = useRef(null);
  const desks = useRef(null);
  useFrame(({ clock }) => {
    const night = lightMix.current;
    const t = clock.elapsedTime * 0.07;
    const paint = (light, hue) => {
      if (!light) return;
      light.color.setHSL(hue % 1, 0.9, 0.55);
      light.intensity = 6 + night * 14;
    };
    paint(panel.current, t);
    paint(games.current, t + 0.33);
    paint(desks.current, t + 0.66);
  });
  return (
    <group>
      <mesh position={[1.4, 0.28, -7.55]} material={rgbStrip}>
        <boxGeometry args={[10.2, 0.045, 0.05]} />
      </mesh>
      <mesh position={[-9.55, 0.07, -1.6]} material={rgbKeys}>
        <boxGeometry args={[0.05, 0.04, 8.8]} />
      </mesh>
      <mesh position={[-1.6, 0.78, -3.4]} material={rgbCase}>
        <boxGeometry args={[2.28, 0.035, 1.28]} />
      </mesh>
      <mesh position={[3.6, 0.22, 5.42]} material={rgbStrip}>
        <boxGeometry args={[1.52, 0.035, 0.04]} />
      </mesh>
      <mesh position={[9.72, 0.08, -0.5]} material={rgbKeys}>
        <boxGeometry args={[0.045, 0.04, 12.1]} />
      </mesh>
      <pointLight ref={panel} position={[1.4, 1.4, -6.4]} distance={16} decay={2} />
      <pointLight ref={games} position={[-8, 1.2, -1.6]} distance={12} decay={2} />
      <pointLight ref={desks} position={[8.4, 1.3, -0.4]} distance={14} decay={2} />
    </group>
  );
}

function RoomSet({ screens }) {
  const tvs = [-5.6, -3, -0.4, 2.2];
  const pcZ = [-6.3, -4.65, -3, -1.35, 0.3, 1.95, 3.6, 5.25];
  const pcColors = ["#4d7cff", "#ff2d55", "#3ddc6e", "#ffd56a", "#c084fc", "#2ec4b6", "#ff8a2a", "#f4f7fb"];
  return (
    <group>
      {tvs.map((z, i) => (
        <TvLounge key={z} z={z} map={screens[i] ?? null} />
      ))}
      <group position={[-1.6, 0, -3.4]}>
        <mesh position={[0, 0.72, 0]} material={leaf}>
          <boxGeometry args={[2.2, 0.08, 1.2]} />
        </mesh>
        <mesh position={[0, 0.4, 0]} material={dark}>
          <boxGeometry args={[2.05, 0.55, 1.05]} />
        </mesh>
        <mesh position={[0.35, 0.8, 0.15]} material={lamp}>
          <sphereGeometry args={[0.06, 10, 10]} />
        </mesh>
        <mesh position={[-0.2, 0.8, -0.1]} material={cream}>
          <sphereGeometry args={[0.06, 10, 10]} />
        </mesh>
      </group>
      <Pinball x={1.15} z={-4.7} color="#ff4fd8" />
      <Pinball x={2.85} z={-4.7} color="#4d7cff" />
      <Pinball x={4.55} z={-4.7} color="#ffd56a" />
      <Hoop x={1.15} z={-2.3} />
      <Hoop x={2.85} z={-2.3} />
      <Hoop x={4.55} z={-2.3} />
      <mesh position={[-2.1, 0.36, 4.85]} material={pillow}>
        <boxGeometry args={[1.8, 0.32, 0.75]} />
      </mesh>
      <mesh position={[-2.1, 0.66, 5.15]} material={pillow}>
        <boxGeometry args={[1.8, 0.4, 0.16]} />
      </mesh>
      <mesh position={[0.7, 0.36, 4.85]} material={arcadeMat}>
        <boxGeometry args={[1.6, 0.32, 0.75]} />
      </mesh>
      <mesh position={[0.7, 0.66, 5.15]} material={arcadeMat}>
        <boxGeometry args={[1.6, 0.4, 0.16]} />
      </mesh>
      <mesh position={[-0.4, 0.38, 3.7]} material={trim}>
        <boxGeometry args={[1.1, 0.08, 0.6]} />
      </mesh>
      <mesh position={[1.5, 0.38, 5.7]} material={trim}>
        <boxGeometry args={[0.9, 0.08, 0.55]} />
      </mesh>
      <mesh position={[3.6, 0.55, 5.7]} material={dark}>
        <boxGeometry args={[1.5, 1.05, 0.55]} />
      </mesh>
      <mesh position={[3.6, 1.12, 5.7]} material={lamp}>
        <boxGeometry args={[1.55, 0.06, 0.6]} />
      </mesh>
      <mesh position={[-4.1, 0.28, 6.1]} material={pillow2}>
        <sphereGeometry args={[0.38, 16, 12]} />
      </mesh>
      <mesh position={[-3.1, 0.26, 5.5]} material={glow}>
        <sphereGeometry args={[0.34, 16, 12]} />
      </mesh>
      <mesh position={[2.3, 0.28, 6.15]} material={pillow}>
        <sphereGeometry args={[0.36, 16, 12]} />
      </mesh>
      <mesh position={[-0.7, 0.46, 6.15]} material={trim}>
        <boxGeometry args={[0.42, 0.08, 0.42]} />
      </mesh>
      <mesh position={[-0.7, 0.72, 6.32]} material={trim}>
        <boxGeometry args={[0.42, 0.46, 0.08]} />
      </mesh>
      <mesh position={[1.7, 0.46, 3.55]} material={cream}>
        <boxGeometry args={[0.42, 0.08, 0.42]} />
      </mesh>
      <mesh position={[1.7, 0.72, 3.38]} material={cream}>
        <boxGeometry args={[0.42, 0.46, 0.08]} />
      </mesh>
      {pcZ.map((z, i) => (
        <GamingDesk key={z} z={z} color={pcColors[i]} />
      ))}
      <pointLight position={[-8, 2.2, -1.5]} color="#9ecbff" intensity={10} distance={12} decay={2} />
      <pointLight position={[1.2, 2.6, -3.2]} color="#ffb15a" intensity={12} distance={14} decay={2} />
      <pointLight position={[8.2, 2.2, 0]} color="#7aa2ff" intensity={9} distance={14} decay={2} />
      <pointLight position={[0, 2.1, 5]} color="#ffd59a" intensity={9} distance={11} decay={2} />
    </group>
  );
}

export function World() {
  const mural = useMuralTexture();
  const screens = useScreens();
  return (
    <group>
      <mesh position={[0, -1.5, -0.2]} material={trim}>
        <boxGeometry args={[23.2, 3, 17.2]} />
      </mesh>
      <mesh position={[0, 0.012, -0.2]} material={wood}>
        <boxGeometry args={[22, 0.04, 16]} />
      </mesh>
      <mesh position={[0, 1.55, -8.02]} material={trim}>
        <boxGeometry args={[22, 3.15, 0.18]} />
      </mesh>
      <mesh position={[-11, 0.38, -0.2]} material={trim}>
        <boxGeometry args={[0.16, 0.7, 16]} />
      </mesh>
      <mesh position={[11, 0.38, -0.2]} material={trim}>
        <boxGeometry args={[0.16, 0.7, 16]} />
      </mesh>
      <mesh position={[1.4, 1.72, -7.8]} material={panel}>
        <boxGeometry args={[10.4, 2.7, 0.08]} />
      </mesh>
      {mural && (
        <mesh position={[1.4, 1.72, -7.74]}>
          <planeGeometry args={[10, 2.48]} />
          <meshBasicMaterial map={mural} toneMapped={false} />
        </mesh>
      )}
      <Zone id="mural" x={1.4} z={-6.4} w={10} d={1.6} />
      <Zone id="consoles" x={-8.2} z={-1.6} w={3.4} d={9} />
      <Zone id="arena" x={1.4} z={-3.3} w={7} d={4.2} />
      <Zone id="lounge" x={0.2} z={5} w={8} d={3.2} />
      <Zone id="setup" x={8.6} z={-0.4} w={2.4} d={12.2} />
      <RoomSet screens={screens.pcs} />
      <RgbPulse />
      <LedRails />
      <pointLight position={[0, 3.4, -1]} color="#ffe0b0" intensity={14} distance={30} decay={2} />
      <BannerPlane />
    </group>
  );
}
