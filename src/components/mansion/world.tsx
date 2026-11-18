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
    const {
      playing,
      speed
    } = useHouse.getState();
    if (!playing) return;
    const t = (group.userData.t ?? 0) + Math.min(dt, .05) * speed;
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
export function World() {
  const screens = useScreens();
  const mural = useMuralTexture();
  return <group><group name="city" position={[0, -12, 0]} visible={false}><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.48, -1]} material={ground}><planeGeometry args={[180, 140]} /></mesh><Skyline /><District /></group><TimeSurface /><RgbPulse /><mesh position={[0, -1.5, -.2]} material={trim}><boxGeometry args={[23.2, 3, 17.2]} /></mesh><mesh position={[0, .012, -.2]} material={wood}><boxGeometry args={[22, .04, 16]} /></mesh><mesh position={[0, .08, 7.65]} material={lamp}><boxGeometry args={[21.6, .05, .08]} /></mesh><mesh position={[0, 1.55, -8.02]} material={trim}><boxGeometry args={[22, 3.15, .18]} /></mesh><mesh position={[-11, .38, -.2]} material={trim}><boxGeometry args={[.16, .7, 16]} /></mesh><mesh position={[11, .38, -.2]} material={trim}><boxGeometry args={[.16, .7, 16]} /></mesh><mesh position={[.15, 1.72, -7.8]} material={panel}><boxGeometry args={[8.9, 2.7, .08]} /></mesh>{mural && <mesh position={[.15, 1.72, -7.74]}><planeGeometry args={[8.55, 2.48]} /><meshBasicMaterial map={mural} toneMapped={false} /></mesh>} <Zone id="mural" x={.1} z={-6.45} w={8.2} d={1.7} /><Zone id="setup" x={-2.2} z={-2.15} w={8.6} d={2.5} /><Zone id="arena" x={0} z={.7} w={4.6} d={2.7} /><Zone id="consoles" x={3.6} z={2.55} w={4.4} d={2.8} /><Zone id="lounge" x={-2.4} z={2.7} w={5.2} d={2.8} />{PCS.map((x, i) =><Desk key={x} x={x} map={screens.pcs[i] ?? null} phase={i * .22} />)} <pointLight position={[-2.4, .7, -1.8]} color="#ffb15a" intensity={2.2} distance={7} decay={2} /><group position={[0, 0, .15]} onClick={e => {
      e.stopPropagation();
      useHouse.getState().setRoom("arena");
    }}><mesh position={[0, 1.45, 0]} material={trim}><boxGeometry args={[2.7, 1.5, .08]} /></mesh>{screens.arena && <mesh position={[0, 1.45, .05]}><planeGeometry args={[2.5, 1.28]} /><meshBasicMaterial map={screens.arena} toneMapped={false} polygonOffset={true} polygonOffsetFactor={-1} /></mesh>} <mesh position={[0, .55, 0]} material={trim}><boxGeometry args={[.12, 1.05, .12]} /></mesh><Seat x={-.7} z={1} /><Seat x={.7} z={1} /></group><group position={[3.7, 0, 1.7]} onClick={e => {
      e.stopPropagation();
      useHouse.getState().setRoom("consoles");
    }}><mesh position={[0, 1.35, 0]} material={trim}><boxGeometry args={[2.15, 1.2, .08]} /></mesh>{screens.tv && <mesh position={[0, 1.35, .05]}><planeGeometry args={[1.98, 1.02]} /><meshBasicMaterial map={screens.tv} toneMapped={false} polygonOffset={true} polygonOffsetFactor={-1} /></mesh>} <mesh position={[-1.02, .7, 0]} material={trim}><boxGeometry args={[.06, .14, .06]} /></mesh><mesh position={[1.02, .7, 0]} material={trim}><boxGeometry args={[.06, .14, .06]} /></mesh><group position={[0, 0, .62]}><mesh position={[0, .32, 0]} material={wood}><boxGeometry args={[2.05, .5, .48]} /></mesh><mesh position={[0, .6, 0]} material={trim}><boxGeometry args={[2.12, .05, .52]} /></mesh><mesh position={[-.62, .86, 0]} material={cream}><boxGeometry args={[.1, .38, .24]} /></mesh><mesh position={[-.62, .86, .02]} material={dark}><boxGeometry args={[.035, .3, .1]} /></mesh><mesh position={[-.28, .7, .04]} material={dark}><boxGeometry args={[.32, .08, .22]} /></mesh><mesh position={[-.28, .75, .06]} material={leaf}><boxGeometry args={[.18, .02, .08]} /></mesh><mesh position={[.22, .66, .06]} material={cream}><boxGeometry args={[.18, .035, .11]} /></mesh><mesh position={[.5, .66, .06]} material={dark}><boxGeometry args={[.18, .035, .11]} /></mesh><mesh position={[.5, .68, .08]} material={leaf}><boxGeometry args={[.06, .012, .04]} /></mesh></group><Seat x={-.55} z={1.15} /><Seat x={.55} z={1.15} /></group><group position={[4.85, 0, -1.15]} onClick={e => {
      e.stopPropagation();
      useHouse.getState().setRoom("lounge");
    }}><mesh position={[0, .85, 0]} material={cream}><boxGeometry args={[.7, 1.6, .7]} /></mesh><mesh position={[.36, .9, 0]} material={trim}><boxGeometry args={[.03, 1.2, .55]} /></mesh><mesh position={[0, 1.35, .36]} material={glow}><boxGeometry args={[.28, .16, .02]} /></mesh></group><group position={[-4.7, 0, 2.45]}><mesh position={[0, .16, 0]} material={trim}><cylinderGeometry args={[.16, .18, .28, 10]} /></mesh><mesh position={[0, .48, 0]} material={leaf}><sphereGeometry args={[.28, 14, 12]} /></mesh></group><group position={[3.15, 0, 4.05]}><mesh position={[0, .14, 0]} material={trim}><cylinderGeometry args={[.14, .16, .24, 10]} /></mesh><mesh position={[0, .42, 0]} material={leaf}><sphereGeometry args={[.24, 14, 12]} /></mesh></group><mesh rotation={[-Math.PI / 2, 0, 0]} position={[-.4, .045, 2.15]} material={rugMat}><planeGeometry args={[5.4, 2.8]} /></mesh><mesh position={[-6.7, 1.7, -4.2]} material={curtain}><boxGeometry args={[.28, 2.5, 1.5]} /></mesh><mesh position={[6.55, 1.7, -4.15]} material={curtain}><boxGeometry args={[.28, 2.5, 1.5]} /></mesh><group position={[-5.05, 0, 1.05]}><mesh position={[0, .95, 0]} material={arcadeMat}><boxGeometry args={[.85, 1.7, .7]} /></mesh><mesh position={[0, 1.55, .28]} material={glow}><boxGeometry args={[.7, .22, .06]} /></mesh><mesh position={[0, 1.15, .32]} material={crtMat}><boxGeometry args={[.62, .48, .08]} /></mesh><mesh position={[0, 1.15, .37]}><planeGeometry args={[.5, .36]} /><meshBasicMaterial color="#5dffe0" toneMapped={false} /></mesh><mesh position={[0, .55, .36]} material={pillow}><boxGeometry args={[.46, .08, .12]} /></mesh></group><mesh position={[-5.7, 2.35, -5.58]}><planeGeometry args={[.85, 1.05]} /><meshBasicMaterial color="#ff5d8f" toneMapped={false} /></mesh><mesh position={[4.6, 2.45, -5.58]}><planeGeometry args={[.95, .7]} /><meshBasicMaterial color="#2ec4b6" toneMapped={false} /></mesh><mesh position={[5.7, 2.15, -5.58]}><planeGeometry args={[.55, .7]} /><meshBasicMaterial color="#ffd166" toneMapped={false} /></mesh><Extras /><Gear /><Sconces /><RoomLights /><BannerPlane /></group>;
}
