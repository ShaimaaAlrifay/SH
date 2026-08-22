import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { Send, ArrowDown, Download, Plus, FileText } from "lucide-react";
import "../areeb-tailwind.css";

/* ============================================================
   AREEB — black + white + stars.
   No brand colors for now, per the temporary design system.
   Motion is built on raw Three.js (the only 3D/animation
   library actually bundled in this environment — Framer
   Motion / GSAP / Lenis are not importable here) plus native
   requestAnimationFrame + IntersectionObserver for the
   scroll-scrubbing that would otherwise be GSAP ScrollTrigger.
   ============================================================ */

const GLOBAL_CSS = `
  :root{
    --ink:#FFFFFF; --dim:#A0A0A0; --muted:#555555; --bg:#000000; --line:rgba(255,255,255,.1);
    --accent:#9E2F35;
  }
  .areeb{ background:var(--bg); color:var(--ink); font-family:'IBM Plex Sans Arabic','Inter',sans-serif; }
  .areeb ::selection{ background:#fff; color:#000; }
  .dim{ color:var(--dim); }
  .muted{ color:var(--muted); }
  .hairline{ border-color:var(--line); }

  @keyframes wordUp{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:translateY(0); } }
  @keyframes softIn{ from{ opacity:0; transform:translateY(10px);} to{ opacity:1; transform:translateY(0);} }
  .soft-in{ animation:softIn .7s cubic-bezier(.16,1,.3,1) both; }

  @keyframes tdot{0%,60%,100%{transform:translateY(0);opacity:.35;}30%{transform:translateY(-4px);opacity:1;}}
  .tdot{ animation:tdot 1.2s infinite ease-in-out; background:var(--dim); }

  .chat-scroll::-webkit-scrollbar{ width:6px; }
  .chat-scroll::-webkit-scrollbar-thumb{ background:var(--line); border-radius:10px; }
  .msg-bubble p{ margin-bottom:8px; } .msg-bubble p:last-child{ margin-bottom:0; }
  .msg-bubble ul{ padding-inline-start:18px; margin-bottom:8px; } .msg-bubble li{ margin-bottom:4px; }
  .msg-bubble strong{ font-weight:600; }

  .btn-line{ border:1px solid rgba(255,255,255,.3); color:var(--ink); transition:border-color .2s ease, background .2s ease; }
  .btn-line:hover{ border-color:#fff; background:rgba(255,255,255,.06); }
  .btn-solid{ background:#fff; color:#000; transition:opacity .2s ease; }
  .btn-solid:hover{ opacity:.85; }

  /* ---------- composer: a floating AI-native surface, not a form field.
     Two internal rows (growing text, then a slim action row) inside one
     rounded shell — no separate "start" button, no bevel, no inset
     shadow. Focus reads as a quiet burgundy glow (the site's one accent
     color, --crimson #9E2F35 reused here as --accent) rather than a
     bright white outline. */
  .ar-composer{ position:relative; border-radius:26px; border:1px solid rgba(255,255,255,.10);
    background:rgba(255,255,255,.035); padding:16px 18px 10px 18px;
    display:flex; flex-direction:column; gap:6px;
    transition:border-color .3s ease, box-shadow .3s ease, background .3s ease; }
  .ar-composer:focus-within{ border-color:rgba(158,47,53,.48);
    box-shadow:0 0 0 1px rgba(158,47,53,.14), 0 12px 34px -16px rgba(158,47,53,.4), 0 4px 20px -8px rgba(0,0,0,.5);
    background:rgba(255,255,255,.045); }

  .ar-composer-spark{ position:absolute; top:16px; left:20px; }

  .ar-composer-textarea{ width:100%; resize:none; background:transparent; border:0; outline:0;
    color:var(--ink); font-family:inherit; font-size:15.5px; line-height:1.65;
    text-align:right; max-height:170px; overflow-y:auto; padding:0; padding-left:26px; }
  .ar-composer-textarea::placeholder{ color:var(--dim); }
  .ar-composer-textarea::-webkit-scrollbar{ width:4px; }
  .ar-composer-textarea::-webkit-scrollbar-thumb{ background:rgba(255,255,255,.14); border-radius:8px; }

  .ar-composer-row{ display:flex; align-items:center; justify-content:space-between; }

  .ar-composer-plus{ width:32px; height:32px; border-radius:999px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center; color:var(--dim);
    border:1px solid rgba(255,255,255,.10); background:transparent; opacity:.55; }

  .ar-composer-send{ width:42px; height:42px; border-radius:999px; flex-shrink:0;
    background:#fff; color:#000; display:flex; align-items:center; justify-content:center;
    transition:transform .2s cubic-bezier(.16,1,.3,1), opacity .2s ease, box-shadow .25s ease, background .25s ease; }
  .ar-composer-send:hover:not(:disabled){ transform:scale(1.06); box-shadow:0 0 0 7px rgba(158,47,53,.12); }
  .ar-composer-send:active:not(:disabled){ transform:scale(.94); }
  .ar-composer-send:disabled{ opacity:.3; }
  .ar-composer-send:focus-visible{ outline:1px solid var(--accent); outline-offset:3px; }
  .ar-composer-send--sending{ background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.16); opacity:1 !important; }
  .ar-composer-send--sending:hover{ transform:none; box-shadow:none; }

  @media (max-width:640px){ .ar-composer{ border-radius:22px; padding:13px 14px 8px 14px; }
    .ar-composer-spark{ top:13px; left:15px; }
    .ar-composer-send{ width:38px; height:38px; }
    .ar-composer-plus{ width:29px; height:29px; } }

  /* ---------- the chat frame: a real contained workspace, not an
     infinite floating page. Everything (header, scrolling messages,
     anchored composer) lives inside one bordered, slightly-elevated
     surface — the starfield stays visible outside it. ---------- */
  .ar-frame{ width:100%; max-width:960px; height:700px; display:flex; flex-direction:column;
    border-radius:22px; border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.018);
    box-shadow:0 40px 90px -46px rgba(0,0,0,.65);
    overflow:hidden; }
  @media (max-width:900px){ .ar-frame{ height:76vh; max-height:640px; } }
  @media (max-width:640px){ .ar-frame{ height:80vh; max-height:600px; border-radius:18px; } }

  .ar-frame-header{ flex-shrink:0; height:60px; padding:0 20px;
    display:flex; align-items:center; justify-content:space-between; }
  .ar-frame-brand{ display:flex; align-items:center; gap:9px; }
  .ar-frame-status{ font-size:11.5px; }
  .ar-frame-divider{ flex-shrink:0; height:1px; background:rgba(255,255,255,.08); }

  .ar-frame-body{ flex:1; overflow-y:auto; padding:22px 22px 8px 22px;
    display:flex; flex-direction:column; gap:18px; scrollbar-gutter:stable; }
  .ar-frame-body::-webkit-scrollbar{ width:5px; }
  .ar-frame-body::-webkit-scrollbar-thumb{ background:rgba(255,255,255,.12); border-radius:10px; }

  .ar-frame-composer-wrap{ flex-shrink:0; padding:12px 16px 16px 16px;
    background:rgba(0,0,0,.14); }

  .ar-msg-user{ background:#F3F1EC; color:#0A0A0A; border-radius:16px 16px 16px 4px; }
  .ar-msg-areeb{ background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.055);
    border-radius:16px 16px 4px 16px; color:rgba(255,255,255,.92); }
  .ar-msg-areeb-wrap{ display:flex; flex-direction:column; gap:10px; }
  .ar-spark{ color:var(--accent); font-size:13px; line-height:1; flex-shrink:0;
    animation:arSparkPulse 3.4s ease-in-out infinite; }
  @keyframes arSparkPulse{ 0%,100%{ opacity:.5; transform:scale(1); text-shadow:0 0 0 rgba(158,47,53,0); }
    50%{ opacity:1; transform:scale(1.18); text-shadow:0 0 9px rgba(158,47,53,.6); } }
  @keyframes arMsgIn{ from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:translateY(0); } }
  .ar-msg-in{ animation:arMsgIn .38s cubic-bezier(.16,1,.3,1) both; }

  /* ---------- inline PRD artifact card — part of the AI message,
     never a page-level CTA. ---------- */
  .ar-artifact{ display:flex; align-items:flex-start; gap:12px;
    border-radius:15px; border:1px solid rgba(255,255,255,.10); background:rgba(255,255,255,.03);
    padding:14px 16px; max-width:340px; transition:border-color .25s ease, background .25s ease; }
  .ar-artifact:hover{ border-color:rgba(255,255,255,.18); background:rgba(255,255,255,.045); }
  .ar-artifact-icon{ width:34px; height:34px; border-radius:10px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    background:rgba(158,47,53,.14); color:var(--accent); }
  .ar-artifact-body{ flex:1; min-width:0; }
  .ar-artifact-title{ font-size:13px; font-weight:600; color:var(--ink); margin-bottom:3px;
    direction:ltr; text-align:left; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ar-artifact-sub{ font-size:11.5px; margin-bottom:8px; }
  .ar-artifact-row{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .ar-artifact-ready{ font-size:11.5px; color:#8FC79A; }
  .ar-artifact-progress{ display:flex; align-items:center; gap:7px; }
  .ar-artifact-download{ appearance:none; -webkit-appearance:none; cursor:pointer;
    display:flex; align-items:center; gap:5px; flex-shrink:0;
    font-size:11.5px; font-weight:600; color:var(--ink); font-family:inherit;
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.16); border-radius:999px; padding:5px 12px;
    transition:transform .15s ease, background .2s ease, border-color .2s ease; }
  .ar-artifact-download:hover{ background:rgba(255,255,255,.14); border-color:rgba(255,255,255,.3); transform:translateY(-1px); }
  .ar-artifact-download:active{ transform:translateY(0) scale(.96); }
`;

const REDUCED_MOTION = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

/* ============================================================
   Shared shader source for point clouds (stars + intelligence)
   ============================================================ */
const POINT_VERT = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSizeMul;
  varying float vTwinkle;
  void main(){
    vTwinkle = 0.45 + 0.55 * sin(uTime * 0.7 + aPhase * 6.2831);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (uSizeMul / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const POINT_FRAG = `
  varying float vTwinkle;
  uniform float uOpacity;
  void main(){
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vTwinkle * uOpacity;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

function fibonacciSphere(count, radius) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return pts;
}
function randomSpherePoint(radius) {
  const u = Math.random(), v = Math.random();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(Math.random());
  return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)];
}

/* ============================================================
   Starfield — ambient, full-page, persistent. This is the
   continuity device: it never disappears between sections.
   ============================================================ */
function Starfield() {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const N = IS_MOBILE ? 260 : 700;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 10;

    const positions = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const phases = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const [x, y, z] = randomSpherePoint(11);
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z - 4;
      sizes[i] = 0.5 + Math.random() * 1.3;
      phases[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) }, uOpacity: { value: 0.75 }, uSizeMul: { value: 26 } },
      vertexShader: POINT_VERT, fragmentShader: POINT_FRAG, transparent: true, depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf, t = 0;
    const animate = () => {
      if (!REDUCED_MOTION) { t += 0.012; mat.uniforms.uTime.value = t; points.rotation.y += 0.00025; points.rotation.x += 0.00008; }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geo.dispose(); mat.dispose(); renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" style={{ width: "100%", height: "100%" }} />;
}

/* ============================================================
   Intelligence — the reusable AI visual. A particle structure
   that reorganizes itself per semantic state:
   idle · listening · thinking · searching · processing ·
   answering · complete
   ============================================================ */
const AI_STATES = {
  idle: { organize: 0.5, chaos: 0.08, cluster: 0, flow: 0, spin: 0.12 },
  listening: { organize: 0.55, chaos: 0.12, cluster: 0, flow: 0, spin: 0.16 },
  thinking: { organize: 0.25, chaos: 0.38, cluster: 0, flow: 0, spin: 0.45 },
  searching: { organize: 0.15, chaos: 0.28, cluster: 0.75, flow: 0, spin: 0.55 },
  processing: { organize: 0.12, chaos: 0.85, cluster: 0.35, flow: 0, spin: 0.7 },
  answering: { organize: 0.6, chaos: 0.1, cluster: 0, flow: 0.65, spin: 0.3 },
  complete: { organize: 1, chaos: 0.02, cluster: 0, flow: 0, spin: 0.08 },
};

function Intelligence({ state = "idle", size = 320, interactive = false, className = "" }) {
  const mountRef = useRef(null);
  const stateRef = useRef(state);
  const paramsRef = useRef({ ...AI_STATES.idle });
  const targetRef = useRef(AI_STATES[state] || AI_STATES.idle);
  const mouseRef = useRef({ x: 0, y: 0, active: 0 });

  useEffect(() => { targetRef.current = AI_STATES[state] || AI_STATES.idle; stateRef.current = state; }, [state]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const N = IS_MOBILE ? 140 : 320;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.z = 8;

    const base = []; const organized = fibonacciSphere(N, 2.1);
    const clusterCenters = [[1.6, 1, 0.3], [-1.5, -0.8, 0.5], [0.2, -1.6, -0.6], [-0.6, 1.5, -0.3]].map((c) => new THREE.Vector3(...c));
    for (let i = 0; i < N; i++) base.push(randomSpherePoint(2.4));

    const positions = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const phases = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      positions[i * 3] = base[i][0]; positions[i * 3 + 1] = base[i][1]; positions[i * 3 + 2] = base[i][2];
      sizes[i] = 1.1 + Math.random() * 1.6;
      phases[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: pr }, uOpacity: { value: 0.95 }, uSizeMul: { value: 20 } },
      vertexShader: POINT_VERT, fragmentShader: POINT_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.active = 1;
    };
    const handleLeave = () => { mouseRef.current.active = 0; };
    if (interactive) {
      window.addEventListener("mousemove", handleMove);
      mount.addEventListener("mouseleave", handleLeave);
    }

    let running = false, raf = null, t0 = performance.now();
    const lerp = (a, b, tt) => a + (b - a) * tt;
    const pos = geo.attributes.position.array;

    const frame = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
      const p = paramsRef.current, tgt = targetRef.current;
      const k = Math.min(1, dt * 1.8);
      p.organize += (tgt.organize - p.organize) * k;
      p.chaos += (tgt.chaos - p.chaos) * k;
      p.cluster += (tgt.cluster - p.cluster) * k;
      p.flow += (tgt.flow - p.flow) * k;
      p.spin += (tgt.spin - p.spin) * k;

      if (!REDUCED_MOTION) {
        mat.uniforms.uTime.value += dt;
        group.rotation.y += dt * 0.12 * (0.4 + p.spin);
        group.rotation.x += dt * 0.04 * (0.4 + p.spin);

        for (let i = 0; i < N; i++) {
          const bx = base[i][0], by = base[i][1], bz = base[i][2];
          const ox = organized[i][0], oy = organized[i][1], oz = organized[i][2];
          let x = lerp(bx, ox, p.organize), y = lerp(by, oy, p.organize), z = lerp(bz, oz, p.organize);

          if (p.cluster > 0.01) {
            const c = clusterCenters[i % clusterCenters.length];
            x = lerp(x, c.x, p.cluster * 0.7); y = lerp(y, c.y, p.cluster * 0.7); z = lerp(z, c.z, p.cluster * 0.7);
          }
          if (p.chaos > 0.01) {
            const ph = phases[i] * 999;
            x += Math.sin(now / 260 + ph) * p.chaos * 0.9;
            y += Math.cos(now / 300 + ph * 1.3) * p.chaos * 0.9;
            z += Math.sin(now / 340 + ph * 0.7) * p.chaos * 0.9;
          }
          if (p.flow > 0.01) {
            x += ((now / 900 + phases[i] * 3) % 2 - 1) * p.flow * 1.6;
          }
          pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
        }
        geo.attributes.position.needsUpdate = true;

        if (interactive) {
          const targetTiltX = mouseRef.current.y * 0.18 * mouseRef.current.active;
          const targetTiltY = mouseRef.current.x * 0.22 * mouseRef.current.active;
          group.rotation.x += (targetTiltX - group.rotation.x % (Math.PI * 2)) * 0.02;
          group.rotation.y += (targetTiltY) * 0.01;
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; t0 = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!e.isIntersecting) { running = false; }
    }, { threshold: 0.01 });
    io.observe(mount);
    running = true;
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      if (interactive) { window.removeEventListener("mousemove", handleMove); mount.removeEventListener("mouseleave", handleLeave); }
      geo.dispose(); mat.dispose(); renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [interactive]);

  return <div ref={mountRef} className={className} style={{ width: size, height: size }} aria-hidden="true" />;
}

/* ============================================================
   Small monochrome 2D particle indicator — used at tiny sizes
   (chat avatars) where spinning up another WebGL context isn't
   worth it. Same state vocabulary as Intelligence.
   ============================================================ */
function MiniOrb({ state = "idle", size = 26 }) {
  const canvasRef = useRef(null);
  const paramsRef = useRef({ ...AI_STATES.idle });
  const targetRef = useRef(AI_STATES[state] || AI_STATES.idle);
  const particlesRef = useRef([]);
  useEffect(() => { targetRef.current = AI_STATES[state] || AI_STATES.idle; }, [state]);

  useEffect(() => {
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: 26 }, (_, i) => ({ angle: Math.random() * Math.PI * 2, radius: 0.5 + Math.random() * 0.5, speed: 0.15 + Math.random() * 0.25, depth: Math.random(), row: i % 6 }));
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr; canvas.height = size * dpr; ctx.scale(dpr, dpr);
    const lerp = (a, b, t) => a + (b - a) * t;
    let running = true, t0 = performance.now();
    const draw = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
      const p = paramsRef.current, tgt = targetRef.current;
      const k = Math.min(1, dt * 2.2);
      p.organize += (tgt.organize - p.organize) * k; p.chaos += (tgt.chaos - p.chaos) * k; p.spin += (tgt.spin - p.spin) * k;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2, cy = size / 2, R = size * 0.34;
      particlesRef.current.forEach((pt, i) => {
        if (!REDUCED_MOTION) pt.angle += pt.speed * dt * (0.5 + p.spin);
        const jitter = REDUCED_MOTION ? 0 : Math.sin(now / 260 + i) * p.chaos * R * 0.4;
        const orderR = R * (0.5 + 0.5 * Math.sin(pt.row * 1.4));
        const radius = lerp(R * pt.radius + jitter, orderR, p.organize);
        const x = cx + Math.cos(pt.angle) * radius, y = cy + Math.sin(pt.angle) * radius * 0.78;
        ctx.beginPath(); ctx.arc(x, y, 0.8 + pt.depth * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = "#fff"; ctx.globalAlpha = 0.3 + pt.depth * 0.6; ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (REDUCED_MOTION) return;
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    return () => { running = false; };
  }, [size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size }} aria-hidden="true" />;
}

/* ============================================================
   AreebMark — the real brand asset (the official logo file),
   served as a plain static file from public/assets/areeb/.
   animated=true plays a soft resolve-in the first time it
   scrolls into view.
   ============================================================ */
const AREEB_VIDEO_SRC = "/assets/areeb/logo-animation.mp4";
const AREEB_LOGO_SRC = "/assets/areeb/logo.png";

function AreebMark({ size = 32, animated = false, className = "" }) {
  const wrapRef = useRef(null);
  const [play, setPlay] = useState(!animated);
  useEffect(() => {
    if (!animated) return;
    const el = wrapRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [animated]);
  return (
    <div ref={wrapRef} className={className} style={{ width: size, height: size, lineHeight: 0 }}>
      <img
        src={AREEB_LOGO_SRC}
        alt="أريب"
        width={size}
        height={size}
        style={{
          width: size, height: size, objectFit: "contain", display: "block",
          opacity: play ? 1 : 0,
          transform: play ? "scale(1)" : "scale(.72)",
          transition: animated ? "opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)" : "none",
        }}
      />
    </div>
  );
}

/* ============================================================
   Reveal + scroll progress helpers
   ============================================================ */
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`${className} transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>{children}</div>;
}

/* ---------- inline PRD artifact — a generated-file attachment living
   inside an assistant message, not a page-level CTA. Three states:
   generating (real work in progress, backed by an actual PDF render —
   not a fake timer), ready (real blob, real size, click to save),
   error (quiet, no crash). ---------- */
function PrdArtifactCard({ artifact, onDownload }) {
  const { status, filename, pageCount } = artifact;
  return (
    <div className="ar-artifact">
      <div className="ar-artifact-icon" aria-hidden="true">
        <FileText size={17} />
      </div>
      <div className="ar-artifact-body">
        <div className="ar-artifact-title">{filename || "PRD — Product Requirements"}</div>
        {status === "generating" && (
          <>
            <div className="ar-artifact-sub dim">جاري إنشاء المستند...</div>
            <div className="ar-artifact-progress">
              <MiniOrb state="thinking" size={14} />
              <span className="dim" style={{ fontSize: 11.5 }}>أريب يحوّل المحادثة إلى PRD</span>
            </div>
          </>
        )}
        {status === "ready" && (
          <>
            <div className="ar-artifact-sub dim">{pageCount ? `PDF · ${pageCount} pages` : "PDF"}</div>
            <div className="ar-artifact-row">
              <span className="ar-artifact-ready">✓ تم إنشاء المستند</span>
              <button type="button" className="ar-artifact-download" onClick={onDownload}>
                <Download size={13} />
                تحميل
              </button>
            </div>
          </>
        )}
        {status === "error" && (
          <div className="ar-artifact-sub" style={{ color: "#ff8a8a" }}>تعذر توليد المستند. جرّب مرة ثانية.</div>
        )}
      </div>
    </div>
  );
}

function useScrollProgress(sectionRef, onFrame) {
  useEffect(() => {
    let running = false, raf = null;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const frame = () => {
      if (!running || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const dist = sectionRef.current.offsetHeight - window.innerHeight;
      const progress = clamp(dist > 0 ? -rect.top / dist : 0, 0, 1);
      onFrame(progress);
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(frame); }
        else if (!e.isIntersecting) { running = false; }
      });
    }, { threshold: 0.01 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => { running = false; if (raf) cancelAnimationFrame(raf); io.disconnect(); };
  }, [sectionRef, onFrame]);
}

const SYSTEM_PROMPT = `أنت "أريب"، مساعد ذكاء اصطناعي يعمل كـ Business Analyst وProduct Discovery Assistant خبير.

# الهوية واللهجة
- لغتك الأساسية العربية، ولهجتك الافتراضية حجازية سعودية (مكة/جدة) طبيعية ومهنية.
- تتكلم مثل Product Owner أو Business Analyst خبير جالس مع عميله — مو مثل بوت.

# الشخصية
ذكي، فضولي، منظم، عملي، ودود، محترف. ممنوع: أسلوب رسمي حكومي أو أكاديمي أو جاف.

# مستوى النبرة
70% احترافي، 20% ودود، 10% كاجوال.

# أسلوب الكتابة
جمل قصيرة، بدون فقرات طويلة. استخدم عناوين ونقاط لما يكون مناسب.

# منهجية الاكتشاف
لا تقترح حلول مباشرة. رتب تفكيرك: Problem → User → Process → Solution.
اسأل سؤال واحد أو سؤالين بالرد الواحد فقط.

# أسلوب الملاحظات
لا تقول "هذا خطأ". استخدم: "ممكن نعيد التفكير فيها بالطريقة هذي..." أو "أشوف فيه خيار أفضل...".

# تحليل المتطلبات
لما تلخص، رتبها: الهدف، المستخدمين، السيناريو، المتطلبات الوظيفية، الحالات الخاصة، المخاطر، الاقتراحات.

# إشارة الاكتمال
لا تكتب الملخص الكامل (الهدف، المستخدمين، السيناريو، المتطلبات الوظيفية، الحالات الخاصة، المخاطر، الاقتراحات) إلا لما تكون متأكد إنك جمعت كل المعلومات اللازمة ووضح عندك كل جانب من جوانب الفكرة — لا تستعجل. لما تكتب هذا الملخص الكامل فعليًا كرد نهائي، ضيف بآخر سطر من ردك، بسطر منفصل وبدون أي نص إضافي حوله، هذا الماركر بالضبط: <!--PRD_READY-->

# القاعدة الذهبية
وضّح الفكرة دائمًا بأبسط جملة ممكنة.`;

function renderMarkdownLite(md) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let html = esc(md);
  html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>").replace(/^## (.*)$/gm, "<h3>$1</h3>").replace(/^# (.*)$/gm, "<h3>$1</h3>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|\n)((?:[-*] .+\n?)+)/g, (m, pre, block) => {
    const items = block.trim().split("\n").map((l) => `<li>${l.replace(/^[-*]\s+/, "")}</li>`).join("");
    return `${pre}<ul>${items}</ul>`;
  });
  html = html.split("\n").map((line) => (/^<(h3|ul|li)/.test(line.trim()) || line.trim() === "" ? line : `<p>${line}</p>`)).join("");
  return html;
}

const HERO_WORDS = ["اسأل.", "أريب", "يفهم", "الباقي."];
const CONCEPTS = [
  { key: "understand", label: "Understand", ar: "يفهم", text: "يجمع كل التفاصيل المتفرقة في نقطة وحدة." },
  { key: "connect", label: "Connect", ar: "يربط", text: "يوصل النقاط ببعض، حتى لو متفرقة." },
  { key: "think", label: "Think", ar: "يفكر", text: "يزن الاحتمالات قبل لا يقرر." },
  { key: "respond", label: "Respond", ar: "يرد", text: "يرجع لك بإجابة واضحة ومنظمة." },
];

export default function AreebLanding() {
  /* ---------- HERO scroll story ---------- */
  const heroRef = useRef(null);
  const [heroAiState, setHeroAiState] = useState("idle");
  const wordRefs = useRef([]);
  const userMsgRef = useRef(null);
  const fragRefs = useRef([]);
  const responseRef = useRef(null);
  const heroSimplifyRef = useRef(null);
  const scrollHintRef = useRef(null);
  const [chromeVisible, setChromeVisible] = useState(false);

  const onHeroFrame = useCallback((progress) => {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const mapClamp = (v, a, b) => clamp((v - a) / (b - a), 0, 1);

    wordRefs.current.forEach((el, i) => {
      if (!el) return;
      const p = mapClamp(progress, 0.02 + i * 0.03, 0.14 + i * 0.03);
      el.style.opacity = String(p);
      el.style.transform = `translateY(${(1 - p) * 16}px)`;
    });

    const pMsg = mapClamp(progress, 0.2, 0.3);
    const pMsgOut = mapClamp(progress, 0.42, 0.5);
    if (userMsgRef.current) { userMsgRef.current.style.opacity = String(pMsg * (1 - pMsgOut)); userMsgRef.current.style.transform = `translateY(${(1 - pMsg) * 12}px)`; }

    let nextState = "idle";
    if (progress >= 0.2 && progress < 0.4) nextState = "listening";
    else if (progress >= 0.4 && progress < 0.6) nextState = "thinking";
    else if (progress >= 0.6 && progress < 0.75) nextState = "processing";
    else if (progress >= 0.75 && progress < 0.9) nextState = "answering";
    else if (progress >= 0.9) nextState = "complete";
    setHeroAiState((cur) => (cur === nextState ? cur : nextState));

    const pFrag = mapClamp(progress, 0.42, 0.6);
    const pFragOut = mapClamp(progress, 0.68, 0.78);
    fragRefs.current.forEach((el, i) => {
      if (!el) return;
      const stagger = mapClamp(progress, 0.42 + i * 0.02, 0.58 + i * 0.02);
      el.style.opacity = String(stagger * (1 - pFragOut));
      const angle = (i / fragRefs.current.length) * Math.PI * 2;
      const radius = 130 + i * 6;
      const converge = mapClamp(progress, 0.6, 0.75);
      const r = radius * (1 - converge * 0.7);
      el.style.transform = `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r * 0.7}px)`;
    });

    const pResp = mapClamp(progress, 0.78, 0.88);
    if (responseRef.current) { responseRef.current.style.opacity = String(pResp); responseRef.current.style.transform = `translateY(${(1 - pResp) * 12}px)`; }

    const pSimplify = mapClamp(progress, 0.92, 1);
    if (heroSimplifyRef.current) heroSimplifyRef.current.style.opacity = String(pSimplify);

    if (scrollHintRef.current) scrollHintRef.current.style.opacity = String(progress < 0.04 ? 1 : mapClamp(progress, 0.94, 1));
    setChromeVisible(progress > 0.15);
  }, []);
  useScrollProgress(heroRef, onHeroFrame);

  /* ---------- "How Areeb Thinks" section: converge → connect → video-scrub (sparkle→logo) ---------- */
  const conceptSectionRef = useRef(null);
  const [activeConcept, setActiveConcept] = useState(0);
  const conceptVideoRef = useRef(null);
  const videoDurationRef = useRef(9);
  const converegeDotRefs = useRef([]);
  const connectDotRefs = useRef([]);
  const connectLineRefs = useRef([]);
  const conceptVideoWrapRef = useRef(null);

  const onConceptFrame = useCallback((progress) => {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const mapClamp = (v, a, b) => clamp((v - a) / (b - a), 0, 1);

    const idx = Math.min(CONCEPTS.length - 1, Math.floor(progress * CONCEPTS.length));
    setActiveConcept((cur) => (cur === idx ? cur : idx));

    // Stage 1 — يفهم: scattered dots converge into a single point
    const pConverge = mapClamp(progress, 0, 0.25);
    const pConvergeOut = mapClamp(progress, 0.22, 0.27);
    converegeDotRefs.current.forEach((el, i) => {
      if (!el) return;
      const angle = (i / converegeDotRefs.current.length) * Math.PI * 2;
      const startR = 120 + (i % 3) * 18;
      const r = lerp(startR, 0, pConverge);
      el.style.transform = `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r * 0.7}px)`;
      el.style.opacity = String((0.3 + pConverge * 0.7) * (1 - pConvergeOut));
    });

    // Stage 2 — يربط: nodes appear and connect, typing-style
    const pConnect = mapClamp(progress, 0.25, 0.5);
    const pConnectOut = mapClamp(progress, 0.47, 0.52);
    connectDotRefs.current.forEach((el, i) => {
      if (!el) return;
      const local = mapClamp(progress, 0.26 + i * 0.05, 0.34 + i * 0.05);
      el.style.opacity = String(local * (1 - pConnectOut));
      el.style.transform = `scale(${lerp(0.4, 1, local)})`;
    });
    connectLineRefs.current.forEach((el, i) => {
      if (!el) return;
      const local = mapClamp(progress, 0.32 + i * 0.05, 0.46 + i * 0.05);
      el.style.opacity = String(local * (1 - pConnectOut));
      el.style.transform = `scaleX(${local})`;
    });

    // Stages 3+4 — يفكر / يرد: scrub the real logo animation video continuously
    const pVideoWrap = mapClamp(progress, 0.5, 0.6);
    if (conceptVideoWrapRef.current) conceptVideoWrapRef.current.style.opacity = String(pVideoWrap);
    const video = conceptVideoRef.current;
    if (video && video.readyState >= 1) {
      const dur = videoDurationRef.current;
      const sparkleEnd = Math.min(3, dur * 0.33);
      let t;
      if (progress < 0.75) t = mapClamp(progress, 0.5, 0.75) * sparkleEnd;
      else t = sparkleEnd + mapClamp(progress, 0.75, 1) * (dur - sparkleEnd);
      t = clamp(t, 0, dur - 0.02);
      if (Math.abs(video.currentTime - t) > 0.03) video.currentTime = t;
    }
  }, []);
  useScrollProgress(conceptSectionRef, onConceptFrame);

  /* ---------- scripted chat demo (plays once on view) ---------- */
  const demoRef = useRef(null);
  const [demoPlayed, setDemoPlayed] = useState(false);
  const [demoAiState, setDemoAiState] = useState("idle");
  const [demoStage, setDemoStage] = useState(0); // 0 none, 1 user msg, 2 thinking, 3 answer
  useEffect(() => {
    const el = demoRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !demoPlayed) {
        setDemoPlayed(true);
        const timers = [
          setTimeout(() => setDemoStage(1), 300),
          setTimeout(() => { setDemoAiState("thinking"); setDemoStage(2); }, 1100),
          setTimeout(() => setDemoAiState("processing"), 2000),
          setTimeout(() => setDemoAiState("answering"), 2900),
          setTimeout(() => { setDemoAiState("complete"); setDemoStage(3); }, 3500),
        ];
        return () => timers.forEach(clearTimeout);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [demoPlayed]);

  /* ---------- real functional chat ---------- */
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [orbState, setOrbState] = useState("thinking");
  const [orbVisible, setOrbVisible] = useState(false);
  const chatBodyRef = useRef(null);
  const composerRef = useRef(null);
  const orbTimers = useRef([]);
  const msgIdRef = useRef(0);
  const prdStartedRef = useRef(false);
  const PRD_READY_MARKER = "<!--PRD_READY-->";
  const nextMsgId = () => `m${++msgIdRef.current}`;

  useEffect(() => { if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; }, [messages, sending, orbVisible]);
  useEffect(() => () => orbTimers.current.forEach(clearTimeout), []);

  /* auto-grow the composer textarea up to ~150px, then it scrolls internally */
  useEffect(() => {
    const el = composerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  }, [chatInput]);

  const updateArtifact = useCallback((id, patch) => {
    setMessages((cur) => cur.map((m) => (m.id === id ? { ...m, artifact: { ...m.artifact, ...patch } } : m)));
  }, []);

  /* ---------- PRD generation as an inline conversation artifact ----------
     Areeb itself decides discovery is complete (system prompt instructs it
     to emit a hidden <!--PRD_READY--> marker only once it has a full Goal /
     Users / Scenario / Functional Requirements / Edge Cases / Risks /
     Suggestions picture — stripped out of the displayed reply below). The
     moment that fires, this appends an assistant message carrying a file
     "artifact" (generating → ready/error), exactly like a real generated
     attachment inside the conversation — never a separate page-level
     button. Rendering to PDF happens entirely client-side via
     @react-pdf/renderer (dynamically imported so its fonts/layout engine
     never ship in the initial bundle); the actual browser save only
     happens when the user clicks "تحميل" on the card itself. */
  const runPrdGeneration = useCallback(async (history) => {
    const cardId = nextMsgId();
    setMessages((cur) => [
      ...cur,
      { id: cardId, role: "assistant", content: "جمعت المتطلبات من المحادثة وحوّلتها إلى PRD.", artifact: { status: "generating" } },
    ]);
    try {
      const response = await fetch("http://localhost:3001/api/generate-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "generation_failed");
      const { buildPRDBlob, countPdfPages } = await import("../lib/prdPdf.jsx");
      const { blob, filename } = await buildPRDBlob(data);
      const pageCount = await countPdfPages(blob);
      updateArtifact(cardId, { status: "ready", blob, filename, pageCount });
      setMessages((cur) => [
        ...cur,
        { id: nextMsgId(), role: "assistant", content: "راجعي الملف، وإذا تبغي أعدل أي جزء نقدر نكمل من هنا." },
      ]);
    } catch (err) {
      console.error("PRD generation failed:", err);
      updateArtifact(cardId, { status: "error" });
    }
  }, [updateArtifact]);

  const downloadArtifact = useCallback(async (message) => {
    if (!message.artifact || message.artifact.status !== "ready") return;
    const { triggerPRDDownload } = await import("../lib/prdPdf.jsx");
    triggerPRDDownload(message.artifact.blob, message.artifact.filename);
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || sending) return;
    setChatOpen(true);
    const userMsg = { id: nextMsgId(), role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setChatInput(""); setSending(true);
    orbTimers.current.forEach(clearTimeout); orbTimers.current = [];
    setOrbVisible(true); setOrbState("thinking");
    orbTimers.current.push(setTimeout(() => setOrbState("processing"), 550));
    const historyForApi = nextHistory.map(({ role, content }) => ({ role, content }));
    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: [
            { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
          ],
          messages: historyForApi,
        }),
      });
      const data = await response.json();
      const textBlock = (data.content || []).map((b) => b.text || "").filter(Boolean).join("\n");
      const rawReply = textBlock || "عذرًا، ما قدرت أوصل رد الآن. جرّب مرة ثانية.";
      const isReady = rawReply.includes(PRD_READY_MARKER);
      const reply = rawReply.split(PRD_READY_MARKER).join("").trim();
      setOrbState("answering");
      await new Promise((r) => setTimeout(r, 420));
      setOrbState("complete");
      await new Promise((r) => setTimeout(r, 380));
      setOrbVisible(false);
      setMessages((cur) => [...cur, { id: nextMsgId(), role: "assistant", content: reply }]);
      if (isReady && !prdStartedRef.current) {
        prdStartedRef.current = true;
        runPrdGeneration([...historyForApi, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      setOrbVisible(false);
      setMessages((cur) => [...cur, { id: nextMsgId(), role: "assistant", content: "صار خطأ بالاتصال. تأكد من الاتصال وجرّب مرة ثانية." }]);
    } finally { setSending(false); }
  }, [messages, sending, runPrdGeneration]);

  return (
    <div className="areeb relative min-h-screen" dir="rtl" lang="ar">
      <style>{GLOBAL_CSS}</style>
      <Starfield />

      {/* minimal chrome */}
      <div className="areeb-corner-mark fixed top-5 z-50 transition-opacity duration-700" style={{ insetInlineEnd: 20, opacity: chromeVisible ? 1 : 0, pointerEvents: chromeVisible ? "auto" : "none" }}>
        <AreebMark size={28} />
      </div>

      <main className="relative z-10">
        {/* ============ HERO ============ */}
        <section ref={heroRef} className="relative" style={{ height: "440vh" }}>
          <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6">
            {/* headline */}
            <div className="absolute flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pointer-events-none" style={{ top: "16%", maxWidth: 680 }}>
              {HERO_WORDS.map((w, i) => (
                <span key={i} ref={(el) => (wordRefs.current[i] = el)} className="font-bold" style={{ fontSize: "clamp(30px,6vw,58px)", opacity: 0, display: "inline-block" }}>{w}</span>
              ))}
            </div>

            {/* the intelligence structure */}
            <div className="absolute flex items-center justify-center pointer-events-none" style={{ top: "50%", transform: "translateY(-46%)" }}>
              <Intelligence state={heroAiState} size={IS_MOBILE ? 260 : 400} interactive />
            </div>

            {/* user message */}
            <div ref={userMsgRef} className="absolute pointer-events-none" style={{ top: "58%", opacity: 0, padding: "9px 16px", border: "1px solid rgba(255,255,255,.18)", borderRadius: 14 }}>
              <span className="dim text-sm">عندي فكرة، بس مو عارف من فين أبدأ.</span>
            </div>

            {/* knowledge fragments */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative" style={{ width: 1, height: 1 }}>
                {["فكرة", "خطوات", "—", "وضوح", "•"].map((t, i) => (
                  <div key={i} ref={(el) => (fragRefs.current[i] = el)} className="absolute muted text-xs" style={{ opacity: 0, transform: "translate(-50%,-50%)", whiteSpace: "nowrap" }}>{t}</div>
                ))}
              </div>
            </div>

            {/* response */}
            <div ref={responseRef} className="absolute text-center pointer-events-none" style={{ top: "68%", opacity: 0 }}>
              <p className="font-semibold" style={{ fontSize: "clamp(18px,2.6vw,26px)" }}>خلينا نبدأ من الأساس.</p>
            </div>

            <div ref={heroSimplifyRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0, background: "radial-gradient(ellipse at center, transparent 55%, #000 96%)" }} />

            <div ref={scrollHintRef} className="absolute bottom-10 flex flex-col items-center gap-2 dim" style={{ transition: "opacity .4s ease" }}>
              <ArrowDown size={16} />
            </div>
          </div>
        </section>

        {/* ============ HOW AREEB THINKS ============ */}
        <section ref={conceptSectionRef} className="relative" style={{ height: "380vh" }}>
          <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6">
            {/* Stage 1 — يفهم: scattered dots converge into one point */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative" style={{ width: 1, height: 1 }}>
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} ref={(el) => (converegeDotRefs.current[i] = el)} className="absolute rounded-full" style={{ width: 4, height: 4, background: "#fff", opacity: 0, transform: "translate(-50%,-50%)" }} />
                ))}
              </div>
            </div>

            {/* Stage 2 — يربط: nodes appear and connect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative" style={{ width: 220, height: 60 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} ref={(el) => (connectDotRefs.current[i] = el)} className="absolute rounded-full" style={{ width: 8, height: 8, background: "#fff", opacity: 0, top: "50%", right: `${i * 70}px`, transform: "translateY(-50%) scale(.4)" }} />
                ))}
                {[0, 1, 2].map((i) => (
                  <div key={i} ref={(el) => (connectLineRefs.current[i] = el)} className="absolute" style={{ height: 1, width: 62, background: "rgba(255,255,255,.5)", opacity: 0, top: "50%", right: `${i * 70 + 8}px`, transform: "translateY(-50%) scaleX(0)", transformOrigin: "right center" }} />
                ))}
              </div>
            </div>

            {/* Stages 3+4 — يفكر / يرد: the real logo animation, scrubbed by scroll */}
            <div ref={conceptVideoWrapRef} className="absolute flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
              <video ref={conceptVideoRef} src={AREEB_VIDEO_SRC} muted playsInline preload="auto"
                onLoadedMetadata={(e) => { videoDurationRef.current = e.target.duration || 9; }}
                style={{ width: IS_MOBILE ? 240 : 320, height: IS_MOBILE ? 240 : 320, objectFit: "contain" }} />
            </div>

            <div className="absolute left-0 right-0 flex justify-center gap-8 md:gap-16 pointer-events-none" style={{ top: "14%" }}>
              {CONCEPTS.map((c, i) => (
                <div key={c.key} className="text-center transition-opacity duration-500" style={{ opacity: i === activeConcept ? 1 : 0.25 }}>
                  <div className="font-bold" style={{ fontSize: 15 }}>{c.label}</div>
                  <div className="dim text-xs">{c.ar}</div>
                </div>
              ))}
            </div>
            <div className="absolute text-center pointer-events-none" style={{ bottom: "16%", maxWidth: 420, padding: "0 24px" }}>
              <p className="dim transition-opacity duration-500" style={{ fontSize: 15 }}>{CONCEPTS[activeConcept].text}</p>
            </div>
          </div>
        </section>

        {/* ============ SCRIPTED CHAT DEMO ============ */}
        <section ref={demoRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 gap-8">
          <div className="flex flex-col items-center gap-6" style={{ minHeight: 220 }}>
            {demoStage >= 1 && (
              <div className="soft-in" style={{ padding: "9px 16px", border: "1px solid rgba(255,255,255,.18)", borderRadius: 14 }}>
                <span className="dim text-sm">عندي فكرة، بس مو عارف من فين أبدأ.</span>
              </div>
            )}
            {demoStage >= 2 && demoStage < 3 && (
              <div className="soft-in"><MiniOrb state={demoAiState} size={40} /></div>
            )}
            {demoStage >= 3 && (
              <div className="soft-in" style={{ padding: "9px 16px", background: "#fff", borderRadius: 14 }}>
                <span style={{ color: "#000", fontSize: 14 }}>خلينا نكونها خطوة خطوة.</span>
              </div>
            )}
          </div>
        </section>

        {/* ============ REAL CHAT / INVITATION ============ */}
        <section className="px-6 py-28">
          <Reveal className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-bold mb-3" style={{ fontSize: "clamp(22px,3.5vw,30px)" }}>وش أول فكرة تبغى نحولها إلى منتج؟</h2>
            <p className="dim text-[15px]">صف فكرتك بجملتين، وخلينا نبدأ نسأل الأسئلة الصح.</p>
          </Reveal>

          <Reveal className="ar-frame mx-auto">
            <div className="ar-frame-header">
              <div className="ar-frame-brand">
                <span className="ar-spark" aria-hidden="true">✦</span>
                <span className="font-bold" style={{ fontSize: 14 }}>أريب</span>
              </div>
              <span className="ar-frame-status dim">
                {orbVisible
                  ? ({ thinking: "أريب يفكر...", processing: "أريب يرتب الفكرة...", answering: "أريب يكتب الرد...", complete: "خلاص" }[orbState] || "")
                  : "جاهز للمساعدة"}
              </span>
            </div>
            <div className="ar-frame-divider" />

            <div ref={chatBodyRef} className="ar-frame-body">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`ar-msg-in flex items-start gap-2 max-w-[85%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  {m.role === "assistant" && <span className="ar-spark mt-1" aria-hidden="true">✦</span>}
                  {m.role === "user" ? (
                    <div className="ar-msg-user px-4 py-2.5 text-[14px] leading-7">{m.content}</div>
                  ) : (
                    <div className="ar-msg-areeb-wrap">
                      {m.content && (
                        <div
                          className="ar-msg-areeb msg-bubble px-4 py-3 text-[14.5px] leading-8"
                          dangerouslySetInnerHTML={{ __html: renderMarkdownLite(m.content) }}
                        />
                      )}
                      {m.artifact && <PrdArtifactCard artifact={m.artifact} onDownload={() => downloadArtifact(m)} />}
                    </div>
                  )}
                </div>
              ))}
              {orbVisible && (
                <div className="ar-msg-in flex items-center gap-3 max-w-[85%] self-start">
                  <MiniOrb state={orbState} size={24} />
                  <span className="dim text-xs">
                    {{ thinking: "أريب يفكر...", processing: "أريب يرتب الفكرة...", answering: "أريب يكتب الرد...", complete: "خلاص" }[orbState] || ""}
                  </span>
                </div>
              )}
            </div>

            <div className="ar-frame-composer-wrap">
              <div className="ar-composer">
                <span className="ar-spark ar-composer-spark" aria-hidden="true">✦</span>
                <textarea
                  ref={composerRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (chatInput.trim()) sendMessage(chatInput);
                    }
                  }}
                  placeholder={chatOpen ? "اكتب ردك..." : "اكتب فكرتك هنا..."}
                  dir="rtl"
                  rows={1}
                  className="ar-composer-textarea"
                />
                <div className="ar-composer-row">
                  <button type="button" className="ar-composer-plus" disabled aria-label="إرفاق ملف (قريبًا)">
                    <Plus size={15} />
                  </button>
                  <button
                    onClick={() => chatInput.trim() && sendMessage(chatInput)}
                    disabled={sending || !chatInput.trim()}
                    className={`ar-composer-send${sending ? " ar-composer-send--sending" : ""}`}
                    aria-label={sending ? "أريب يرد..." : "إرسال"}
                  >
                    {sending ? <MiniOrb state={orbState} size={18} /> : <Send size={17} style={{ transform: "scaleX(-1)" }} />}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="py-10 px-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <AreebMark size={22} />
          <span className="font-bold">أريب</span>
        </div>
        <p className="muted text-xs">أريب © 2026</p>
      </footer>
    </div>
  );
}
