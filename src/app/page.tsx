"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useTransform,
  useInView,
  animate,
} from "framer-motion";
import {
  Github, Mail, Phone, MapPin, Award, Rocket, Trophy, Medal, Sparkles, GraduationCap,
  Terminal, Server, Monitor, Database, Brain, ShieldCheck, Wrench, Workflow, Copy, Check,
  ArrowUpRight, TreePine, Leaf, ChevronDown, type LucideIcon,
} from "lucide-react";

/* ───────────────────────── data ───────────────────────── */
type Lv = 1 | 2 | 3;
const PRO: Lv = 3, FAM: Lv = 2, EXP: Lv = 1;

const NAV = [
  { id: "home", label: "Home", icon: TreePine },
  { id: "impact", label: "Impact", icon: Sparkles },
  { id: "journey", label: "Journey", icon: Trophy },
  { id: "skills", label: "Skills", icon: Terminal },
  { id: "contact", label: "Contact", icon: Mail },
];

const ROLES = ["Backend engineer", "Security-first API designer", "AI-assisted developer", "Startup CTO", "Android champion"];

const STATS = [
  { to: 300, prefix: "₱", suffix: "K", label: "startup funding won at Project RISE" },
  { to: 3, label: "Codefest Android podium finishes" },
  { to: 40, prefix: "Top ", label: "of 150+ at AppCon Philippines 2024, AI Track" },
  { to: 7, prefix: "<", suffix: "%", label: "DOST JLSS national acceptance rate" },
];

const FOCUS = ["Software", "Backend systems", "AI-assisted development", "Cybersecurity", "IoT and hardware-software integration", "System architecture"];

const JOURNEY: { icon: LucideIcon; when: string; title: string; text: string }[] = [
  { icon: Award, when: "2025, national", title: "DOST JLSS Scholar (RA 10612)", text: "Fewer than 7 in 100 national applicants were accepted in the 2025 cycle." },
  { icon: Rocket, when: "Startup", title: "CTO of NurSYNC, an EdTech startup", text: "Architected and shipped a full-stack platform (Node.js/Express + MongoDB) solo, serving a 4-person cross-functional team. The team won ₱300K in startup funding at Project RISE." },
  { icon: Trophy, when: "2023 and 2025, local", title: "2× Champion, Codefest Android Development", text: "Won the STI Pasay-EDSA local level in 2023 and again in 2025." },
  { icon: Medal, when: "2024, cluster", title: "2nd Runner-Up, Codefest Android Development", text: "Cluster-level finish at STI Caloocan." },
  { icon: Brain, when: "2024, national", title: "Top 40, AppCon Philippines (AI Track)", text: "Ranked among 150+ national applicants. Proposed and developed an AI-powered solution for industry judges." },
  { icon: Sparkles, when: "Ongoing", title: "Hackathon, coding and mathematics awards", text: "Multiple awards at local and cluster levels. Certificates and supporting documents are available on request." },
];

const SKILLS: { icon: LucideIcon; title: string; items: [string, Lv][] }[] = [
  { icon: Terminal, title: "Languages", items: [["TypeScript", PRO], ["JavaScript", PRO], ["Python", PRO], ["Java", PRO], ["C++", PRO], ["PHP", PRO]] },
  { icon: Server, title: "Backend", items: [["Node.js", PRO], ["Express.js", PRO], ["FastAPI", PRO], ["Flask", PRO], ["REST APIs", PRO]] },
  { icon: Monitor, title: "Frontend", items: [["HTML", PRO], ["CSS", PRO], ["React", PRO], ["Next.js", PRO], ["Responsive design", PRO]] },
  { icon: Database, title: "Data", items: [["MongoDB", PRO], ["Database design", PRO], ["Schema modeling", PRO], ["SQL", FAM]] },
  { icon: ShieldCheck, title: "Cybersecurity", items: [["bcrypt hashing", PRO], ["JWT auth", PRO], ["Encryption", PRO], ["RBAC", PRO], ["Secure API development", PRO], ["Secure data handling", PRO], ["E2EE", FAM], ["OWASP Top 10", EXP]] },
  { icon: Brain, title: "Artificial intelligence", items: [["Prompting", PRO], ["LLM API integration", PRO], ["Training AI", EXP]] },
  { icon: Wrench, title: "Tools", items: [["Git", PRO], ["GitHub", PRO], ["Linux", PRO], ["Postman", PRO], ["Cloudinary", FAM], ["Kafka", EXP]] },
  { icon: Workflow, title: "Engineering practice", items: [["Agile / Scrum", PRO], ["Debugging", PRO], ["System architecture", FAM], ["OOP", FAM], ["Microservices", FAM], ["Cloud", FAM], ["Testing tools", EXP]] },
];

const TECH = ["TypeScript", "Node.js", "FastAPI", "MongoDB", "React", "Next.js", "Python", "JWT", "RBAC", "bcrypt", "Postman", "Linux", "Kafka", "LLM APIs"];

const CONTACT = [
  { icon: Mail, label: "Email", value: "hearnsmori37@gmail.com", href: "mailto:hearnsmori37@gmail.com" },
  { icon: Phone, label: "Phone", value: "+63-993-143-1471", href: "tel:+639931431471" },
  { icon: Github, label: "GitHub", value: "HearnsMori", href: "https://github.com/HearnsMori" },
  { icon: MapPin, label: "Based in", value: "Imus City, Cavite, Philippines", href: "https://maps.google.com/?q=Imus+City+Cavite+Philippines" },
];

/* ───────────────────────── 3D forest ───────────────────────── */
function ForestScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BG = "#06150d";
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(BG, 0.05);

    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 120);
    camera.position.set(0, 1.7, 8);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    el.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight("#9fe3b0", "#041008", 1.1));
    const moon = new THREE.DirectionalLight("#cfeedd", 1.1);
    moon.position.set(-6, 12, 6);
    scene.add(moon);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 240),
      new THREE.MeshStandardMaterial({ color: "#0a2414", roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = -50;
    scene.add(ground);

    // instanced pine trees
    const N = 190;
    const leaves = new THREE.InstancedMesh(
      new THREE.ConeGeometry(1, 2.4, 7),
      new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.95 }),
      N * 3
    );
    const trunks = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.12, 0.2, 1, 6),
      new THREE.MeshStandardMaterial({ color: "#2a1a0f", roughness: 1 }),
      N
    );
    const d = new THREE.Object3D();
    const col = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const x = side * (2.8 + Math.random() * 24);
      const z = 12 - Math.random() * 115;
      const s = 0.8 + Math.random() * 1.5;
      d.rotation.set(0, Math.random() * 6, 0);
      d.position.set(x, 0.5 * s, z);
      d.scale.set(s * 0.8, s * 1.4, s * 0.8);
      d.updateMatrix();
      trunks.setMatrixAt(i, d.matrix);
      col.setHSL(0.33 + Math.random() * 0.07, 0.45, 0.1 + Math.random() * 0.12);
      for (let l = 0; l < 3; l++) {
        const k = s * (1.6 - l * 0.38);
        d.position.set(x, s * (1.0 + l * 0.85), z);
        d.scale.set(k, k, k);
        d.updateMatrix();
        leaves.setMatrixAt(i * 3 + l, d.matrix);
        leaves.setColorAt(i * 3 + l, col);
      }
    }
    scene.add(leaves, trunks);

    // fireflies
    const FF = 280;
    const base = new Float32Array(FF * 3);
    const pos = new Float32Array(FF * 3);
    for (let i = 0; i < FF; i++) {
      base[i * 3] = (Math.random() - 0.5) * 42;
      base[i * 3 + 1] = 0.4 + Math.random() * 6;
      base[i * 3 + 2] = 12 - Math.random() * 112;
    }
    const fgeo = new THREE.BufferGeometry();
    fgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const flies = new THREE.Points(
      fgeo,
      new THREE.PointsMaterial({ color: "#ffd36b", size: 0.16, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    scene.add(flies);

    // the kodama spirit that guides the scroll
    const spirit = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.7, 1),
      new THREE.MeshBasicMaterial({ color: "#8fd19e", wireframe: true, transparent: true, opacity: 0.6 })
    );
    spirit.add(new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), new THREE.MeshBasicMaterial({ color: "#ffe9a8" })));
    spirit.add(new THREE.PointLight("#ffcf66", 45, 16, 2));
    scene.add(spirit);

    const mouse = { x: 0, y: 0 };
    let sp = 0;
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener("pointermove", onMove);
    addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const t = reduce ? 0 : clock.getElapsedTime();
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      sp += (scrollY / max - sp) * 0.06;
      const z = 8 - sp * 62;
      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (1.7 - mouse.y * 0.4 - camera.position.y) * 0.04;
      camera.position.z = z;
      camera.lookAt(mouse.x * 2, 1.8 - mouse.y * 0.6, z - 12);

      for (let i = 0; i < FF; i++) {
        pos[i * 3] = base[i * 3] + Math.sin(t * 0.5 + i) * 0.7;
        pos[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.8 + i * 1.7) * 0.45;
        pos[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 0.4 + i) * 0.7;
      }
      fgeo.attributes.position.needsUpdate = true;

      spirit.position.set(camera.position.x * 0.6 + Math.sin(t * 0.7) * 2.4, 2.1 + Math.sin(t * 1.1) * 0.35, z - 7 + Math.cos(t * 0.5));
      spirit.rotation.y += 0.01;
      spirit.rotation.x += 0.004;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", onResize);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className="scene" aria-hidden />;
}

/* ───────────────────────── small pieces ───────────────────────── */
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, to, { duration: 2.2, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [seen, to]);
  return <span ref={ref}>{prefix}{v}{suffix}</span>;
}

function Typer({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i];
    const full = !del && n === w.length;
    const t = setTimeout(() => {
      if (full) return setDel(true);
      if (del && n === 0) { setDel(false); setI((i + 1) % words.length); return; }
      setN(n + (del ? -1 : 1));
    }, full ? 1500 : del ? 35 : 75);
    return () => clearTimeout(t);
  }, [n, del, i, words]);
  return <>{words[i].slice(0, n)}</>;
}

function Tilt({ children }: { children: ReactNode }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [7, -7]), { stiffness: 220, damping: 20 });
  const ry = useSpring(useTransform(x, [0, 1], [-7, 7]), { stiffness: 220, damping: 20 });
  const gx = useTransform(x, (v) => `${v * 100}%`);
  const gy = useTransform(y, (v) => `${v * 100}%`);
  const bg = useMotionTemplate`radial-gradient(280px circle at ${gx} ${gy}, rgba(255,211,107,.16), transparent 62%)`;
  return (
    <motion.div
      className="card"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => { x.set(0.5); y.set(0.5); }}
    >
      <motion.div className="glow" style={{ background: bg }} />
      {children}
    </motion.div>
  );
}

const Reveal = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const Head = ({ t, s }: { t: string; s?: string }) => (
  <Reveal>
    <h2 className="h2">{t}</h2>
    {s && <p className="sub">{s}</p>}
  </Reveal>
);

function Photo() {
  const [ok, setOk] = useState(true);
  return (
    <motion.div className="ph" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
      <motion.div className="phin" animate={{ y: [-8, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="face">
          <span>森</span>
          {ok && <img src="/mori.jpg" alt="Hearns Sastrillas Mori" onError={() => setOk(false)} />}
        </div>
        {[
          { t: "DOST Scholar", c: "b1" },
          { t: "CTO, NurSYNC", c: "b2" },
          { t: "2× Codefest champion", c: "b3" },
        ].map((b, i) => (
          <motion.span key={b.t} className={`fb ${b.c}`} animate={{ y: [0, -9, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}>
            {b.t}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── page ───────────────────────── */
export default function Page() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const [active, setActive] = useState("home");
  const [copied, setCopied] = useState(false);
  const tl = useRef<HTMLDivElement>(null);
  const { scrollYProgress: tlp } = useScroll({ target: tl, offset: ["start 70%", "end 60%"] });

  useEffect(() => {
    document.title = "Hearns Sastrillas Mori | Computer Science, Backend and AI";
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV.forEach((n) => { const s = document.getElementById(n.id); if (s) io.observe(s); });
    return () => io.disconnect();
  }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText("hearnsmori37@gmail.com"); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <>
      <style>{CSS}</style>
      <ForestScene />
      <div className="veil" />
      <motion.div className="bar" style={{ scaleX: bar }} />

      <nav className="nav" aria-label="Sections">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={active === n.id ? "on" : ""} aria-label={n.label}>
            {active === n.id && <motion.i layoutId="pill" className="pill" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <n.icon size={16} />
            <span>{n.label}</span>
          </a>
        ))}
      </nav>

      <main>
        {/* hero */}
        <section id="home" className="hero">
          <motion.div className="kanji" initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: "easeOut" }}>森</motion.div>
          <div className="wrap hgrid">
            <div>
              <motion.p className="tag" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <i className="pulse" /> Mori means forest in Japanese
              </motion.p>
              <motion.h1
                className="name"
                initial="h"
                animate="s"
                variants={{ s: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
              >
                {["Hearns", "Sastrillas", "Mori"].map((w) => (
                  <span key={w} className="w">
                    {w.split("").map((c, i) => (
                      <motion.span
                        key={i}
                        style={{ display: "inline-block" }}
                        variants={{
                          h: { y: "115%", rotateX: -80, opacity: 0 },
                          s: { y: 0, rotateX: 0, opacity: 1, transition: { type: "spring", damping: 14, stiffness: 110 } },
                        }}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.h1>
              <motion.p className="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                <Leaf size={20} /> <Typer words={ROLES} /><span className="caret" />
              </motion.p>
              <motion.p className="lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
                4th-year Computer Science student at STI College Pasay-EDSA. DOST scholar, award-winning developer, and CTO who ships secure backend systems and AI-powered products.
              </motion.p>
              <motion.div className="row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
                <motion.a whileHover={{ y: -3, scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn pri" href="mailto:hearnsmori37@gmail.com"><Mail size={18} /> Email me</motion.a>
                <motion.a whileHover={{ y: -3, scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn" href="https://github.com/HearnsMori" target="_blank" rel="noreferrer"><Github size={18} /> GitHub</motion.a>
                <motion.a whileHover={{ y: -3, scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn" href="#journey">See my journey <ChevronDown size={18} /></motion.a>
              </motion.div>
            </div>
            <Photo />
          </div>
        </section>

        {/* impact */}
        <section id="impact">
          <div className="wrap">
            <Head t="Building quietly, shipping seriously" s="Backend depth, security habits and a record of winning when it counts." />
            <div className="g g4 stats">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <Tilt>
                    <div className="num"><Counter to={s.to} prefix={s.prefix} suffix={s.suffix} /></div>
                    <p className="cap">{s.label}</p>
                  </Tilt>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div className="sum">
                <p>
                  I focus on software, backend systems and system architecture, with a growing practice in AI-assisted development, cybersecurity and IoT hardware-software integration. As CTO of a funded EdTech startup I shipped production backend systems, and I design APIs security-first, following the OWASP Top 10.
                </p>
                <div className="chips">
                  {FOCUS.map((f) => <motion.span whileHover={{ y: -3 }} key={f} className="chip">{f}</motion.span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* journey */}
        <section id="journey">
          <div className="wrap">
            <Head t="Achievements and experience" s="Each one a ring in the trunk." />
            <div className="tl" ref={tl}>
              <div className="rail"><motion.i style={{ scaleY: tlp }} /></div>
              {JOURNEY.map((j, i) => (
                <motion.div
                  key={j.title}
                  className="item"
                  initial={{ opacity: 0, x: i % 2 ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ type: "spring", damping: 20, stiffness: 90 }}
                >
                  <motion.div className="node" whileInView={{ scale: [0.4, 1.25, 1] }} viewport={{ once: true }} transition={{ duration: 0.6 }}><j.icon size={16} /></motion.div>
                  <Tilt>
                    <p className="when">{j.when}</p>
                    <h3>{j.title}</h3>
                    <p className="txt">{j.text}</p>
                  </Tilt>
                </motion.div>
              ))}
              <div className="item">
                <div className="node"><GraduationCap size={16} /></div>
                <Reveal>
                  <Tilt>
                    <p className="when">2023 to present</p>
                    <h3>Bachelor of Science in Computer Science</h3>
                    <p className="txt">STI College Pasay-EDSA</p>
                  </Tilt>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* skills */}
        <section id="skills">
          <div className="wrap">
            <Head t="Skills" s="Dots show depth: three is proficient, two is familiar, one is exposure." />
            <div className="marq" aria-hidden>
              <motion.div className="track" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 34, repeat: Infinity, ease: "linear" }}>
                {[...TECH, ...TECH].map((t, i) => <span key={i}>{t}<Leaf size={13} /></span>)}
              </motion.div>
            </div>
            <div className="g g2">
              {SKILLS.map((g, i) => (
                <Reveal key={g.title} delay={(i % 2) * 0.1}>
                  <Tilt>
                    <div className="sh"><g.icon size={20} /><h3>{g.title}</h3></div>
                    <div className="chips">
                      {g.items.map(([n, lv]) => (
                        <motion.span key={n} whileHover={{ y: -3, scale: 1.05 }} className="chip" title={["", "Exposure", "Familiar", "Proficient"][lv]}>
                          {n}
                          <s>{[1, 2, 3].map((k) => <b key={k} className={k <= lv ? "on" : ""} />)}</s>
                        </motion.span>
                      ))}
                    </div>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* contact */}
        <section id="contact">
          <div className="wrap">
            <Head t="Let’s grow something together" s="Open to roles and projects where full-stack and systems depth matter." />
            <div className="g g2">
              {CONTACT.map((c, i) => (
                <Reveal key={c.label} delay={(i % 2) * 0.1}>
                  <Tilt>
                    <a className="clink" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      <span className="ci"><c.icon size={20} /></span>
                      <span className="ct"><small>{c.label}</small><b>{c.value}</b></span>
                      <ArrowUpRight size={20} />
                    </a>
                  </Tilt>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="row center">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn pri" onClick={copy}>
                  {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? "Email copied" : "Copy email"}
                </motion.button>
              </div>
            </Reveal>
            <footer>
              <span className="fk">森</span>
              <p>Built with Next.js, three.js and framer-motion. Scroll back up to walk the forest again.</p>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}

/* ───────────────────────── styles ───────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,800&family=Hanken+Grotesk:wght@400;500;600&family=Noto+Serif+JP:wght@700&display=swap');
:root{--bg:#06150d;--card:rgba(11,38,24,.58);--fg:#e4f5e9;--mut:#9cc2a8;--moss:#6fb67f;--lantern:#ffd36b;--bark:#b08a5b;--line:rgba(143,209,158,.18)}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--fg);font-family:'Hanken Grotesk',system-ui,sans-serif;line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:'Fraunces',Georgia,serif;margin:0}
a{color:inherit}
:focus-visible{outline:2px solid var(--lantern);outline-offset:3px}
.scene{position:fixed;inset:0;z-index:0}
.veil{position:fixed;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(6,21,13,.1) 20%,rgba(3,12,7,.8) 100%)}
main{position:relative;z-index:2}
.bar{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;transform-origin:0 50%;background:linear-gradient(90deg,var(--moss),var(--lantern));box-shadow:0 0 14px var(--lantern)}
.nav{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:50;display:flex;gap:2px;padding:5px;border-radius:999px;background:rgba(5,20,12,.62);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--line)}
.nav a{position:relative;isolation:isolate;display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:999px;color:var(--mut);text-decoration:none;font-size:14px;font-weight:500;transition:color .25s}
.nav a.on{color:#0a1c10}
.nav .pill{position:absolute;inset:0;z-index:-1;border-radius:999px;background:linear-gradient(135deg,var(--moss),var(--lantern))}
.wrap{max-width:1120px;margin:0 auto;padding:0 22px}
section{padding:110px 0}
.hero{position:relative;min-height:100svh;display:flex;align-items:center;padding:96px 0 60px}
.kanji{position:absolute;right:-1%;top:4%;font:700 clamp(260px,42vw,560px)/1 'Noto Serif JP',serif;color:rgba(111,182,127,.07);pointer-events:none;user-select:none}
.hgrid{position:relative;display:grid;grid-template-columns:1.35fr 1fr;gap:44px;align-items:center}
.tag{display:inline-flex;align-items:center;gap:10px;margin:0;padding:7px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(11,38,24,.5);color:var(--mut);font-size:14px}
.pulse{width:8px;height:8px;border-radius:50%;background:var(--lantern);box-shadow:0 0 0 0 rgba(255,211,107,.7);animation:pulse 2s infinite}
@keyframes pulse{70%{box-shadow:0 0 0 10px rgba(255,211,107,0)}100%{box-shadow:0 0 0 0 rgba(255,211,107,0)}}
.name{margin:20px 0 14px;font-size:clamp(46px,9vw,104px);font-weight:800;line-height:.96;letter-spacing:-.025em;perspective:700px;text-shadow:0 0 50px rgba(111,182,127,.25)}
.w{display:block;overflow:hidden;padding-bottom:.08em}
.role{display:flex;align-items:center;gap:10px;margin:0 0 14px;font-size:clamp(18px,2.6vw,26px);color:var(--lantern);min-height:1.6em}
.caret{display:inline-block;width:2px;height:1.1em;margin-left:3px;background:var(--lantern);animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.lead{max-width:56ch;margin:0 0 28px;font-size:18px;color:var(--mut)}
.row{display:flex;flex-wrap:wrap;gap:12px}
.row.center{justify-content:center;margin-top:34px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border-radius:999px;border:1px solid var(--line);background:rgba(11,38,24,.55);backdrop-filter:blur(10px);color:var(--fg);font:500 16px 'Hanken Grotesk',sans-serif;text-decoration:none;cursor:pointer}
.btn.pri{border:0;background:linear-gradient(135deg,var(--lantern),#f0a93c);color:#1b1305;font-weight:600;box-shadow:0 8px 30px rgba(255,211,107,.25)}
.ph{position:relative;width:min(340px,72vw);aspect-ratio:1;margin:0 auto}
.phin{position:absolute;inset:0}
.ph:before{content:"";position:absolute;inset:-7px;border-radius:50%;background:conic-gradient(var(--moss),var(--lantern),transparent 60%,var(--moss));animation:spin 8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.face{position:absolute;inset:0;border-radius:50%;overflow:hidden;background:#0a2414;display:grid;place-items:center;box-shadow:0 20px 70px rgba(0,0,0,.5)}
.face span{font:700 110px 'Noto Serif JP',serif;color:var(--moss)}
.face img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fb{position:absolute;padding:8px 14px;border-radius:999px;font-size:13px;font-weight:600;white-space:nowrap;color:#1b1305;background:var(--lantern);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.b1{top:6%;left:-14%}.b2{bottom:14%;right:-12%;background:var(--moss)}.b3{bottom:-3%;left:4%;background:#e8f5ec}
.h2{font-size:clamp(32px,5vw,56px);font-weight:700;line-height:1.08;letter-spacing:-.02em;margin-bottom:12px}
.sub{max-width:60ch;margin:0 0 40px;color:var(--mut);font-size:18px}
.g{display:grid;gap:18px}
.g4{grid-template-columns:repeat(4,1fr)}
.g2{grid-template-columns:repeat(2,1fr)}
.card{position:relative;overflow:hidden;height:100%;padding:26px;border-radius:24px;background:var(--card);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--line);box-shadow:0 18px 50px rgba(0,0,0,.35);transform-style:preserve-3d}
.glow{position:absolute;inset:0;pointer-events:none}
.num{font:700 clamp(38px,5vw,56px)/1 'Fraunces',serif;color:var(--lantern);margin-bottom:10px;text-shadow:0 0 30px rgba(255,211,107,.3)}
.cap{margin:0;color:var(--mut);font-size:15px}
.sum{margin-top:18px;padding:30px;border-radius:24px;border:1px solid var(--line);background:rgba(8,28,17,.5);backdrop-filter:blur(14px)}
.sum p{margin:0;max-width:70ch;font-size:19px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.chip{display:inline-flex;align-items:center;gap:9px;padding:7px 13px;border-radius:12px;font-size:14px;font-weight:500;background:rgba(111,182,127,.1);border:1px solid var(--line)}
.chip s{display:flex;gap:3px;text-decoration:none}
.chip b{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.16)}
.chip b.on{background:var(--lantern);box-shadow:0 0 7px var(--lantern)}
.tl{position:relative;padding-left:50px}
.rail{position:absolute;left:17px;top:0;bottom:0;width:2px;background:var(--line)}
.rail i{position:absolute;inset:0;transform-origin:top;background:linear-gradient(var(--moss),var(--lantern));box-shadow:0 0 14px var(--lantern)}
.item{position:relative;margin-bottom:22px}
.node{position:absolute;left:-50px;top:24px;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:var(--bg);border:1px solid var(--lantern);color:var(--lantern);box-shadow:0 0 18px rgba(255,211,107,.35)}
.when{margin:0 0 4px;font-size:14px;color:var(--bark);font-weight:600}
.item h3{font-size:clamp(20px,2.6vw,26px);margin-bottom:8px}
.txt{margin:0;color:var(--mut)}
.marq{overflow:hidden;margin:0 -22px 26px;padding:14px 0;border-block:1px solid var(--line);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.track{display:flex;gap:34px;width:max-content;white-space:nowrap}
.track span{display:inline-flex;align-items:center;gap:34px;font:600 22px 'Fraunces',serif;color:var(--mut)}
.track svg{color:var(--lantern)}
.sh{display:flex;align-items:center;gap:12px;color:var(--moss)}
.sh h3{font-size:22px;color:var(--fg)}
.clink{display:flex;align-items:center;gap:16px;text-decoration:none}
.ci{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:rgba(255,211,107,.12);color:var(--lantern);flex:none}
.ct{display:flex;flex-direction:column;flex:1;min-width:0}
.ct small{color:var(--mut);font-size:14px}
.ct b{font-weight:600;font-size:17px;overflow-wrap:anywhere}
footer{margin-top:90px;text-align:center;color:var(--mut)}
.fk{display:block;font:700 72px/1 'Noto Serif JP',serif;color:var(--moss);opacity:.5}
footer p{margin:8px 0 0;font-size:14px}
@media(max-width:900px){.g4{grid-template-columns:repeat(2,1fr)}.hgrid{grid-template-columns:1fr;gap:34px}.ph{order:-1;width:min(260px,62vw)}.hero{padding-top:110px}.b1{left:-8%}.b2{right:-6%}}
@media(max-width:640px){.g2{grid-template-columns:1fr}.nav a span{display:none}.nav a{padding:11px 14px}section{padding:80px 0}.tl{padding-left:44px}.node{left:-44px;width:32px;height:32px}.rail{left:15px}.lead{font-size:16px}.card{padding:20px}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;

