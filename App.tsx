import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ============================================================
   GLOBAL STYLE INJECTION
   ============================================================ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap');

    html, body, #root {
      background: #0C0C0C;
      margin: 0;
      padding: 0;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Kanit', sans-serif;
    }
    .hero-heading {
      background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

/* ============================================================
   REUSABLE: ContactButton
   ============================================================ */
const ContactButton = ({ className = "" }) => (
  <button
    className={`rounded-full text-white font-medium uppercase tracking-widest
      px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
      text-xs sm:text-sm md:text-base whitespace-nowrap ${className}`}
    style={{
      background:
        "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
      boxShadow:
        "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
      outline: "2px solid white",
      outlineOffset: "-3px",
    }}
  >
    Contact Me
  </button>
);

/* ============================================================
   REUSABLE: LiveProjectButton
   ============================================================ */
const LiveProjectButton = ({ className = "" }) => (
  <button
    className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest
      px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base whitespace-nowrap
      transition-colors duration-200 hover:bg-[#D7E2EA]/10 ${className}`}
  >
    Live Project
  </button>
);

/* ============================================================
   REUSABLE: FadeIn
   ============================================================ */
const FadeIn = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = "div",
  className = "",
  style = {},
}: {
  children?: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: any;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const MotionTag: any = (motion as any).create
    ? (motion as any).create(as)
    : (motion as any)[as];
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </MotionTag>
  );
};

/* ============================================================
   REUSABLE: Magnet (mouse-following magnetic effect)
   ============================================================ */
const Magnet = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
  style = {},
}) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0)");
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const distX = Math.abs(e.clientX - cx) - rect.width / 2;
      const distY = Math.abs(e.clientY - cy) - rect.height / 2;
      const dist = Math.max(distX, distY);

      if (dist < padding) {
        setTransition(activeTransition);
        const dx = (e.clientX - cx) / strength;
        const dy = (e.clientY - cy) / strength;
        setTransform(`translate3d(${dx}px, ${dy}px, 0)`);
      } else {
        setTransition(inactiveTransition);
        setTransform("translate3d(0px, 0px, 0)");
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform,
        transition,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ============================================================
   REUSABLE: AnimatedText (character-by-character scroll reveal)
   ============================================================ */
const AnimatedChar = ({ char, index, total, scrollYProgress }) => {
  const start = total > 1 ? index / total : 0;
  const end = total > 1 ? (index + 1) / total : 1;
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ visibility: "hidden" }}>{char === " " ? "\u00A0" : char}</span>
      <motion.span
        style={{ position: "absolute", left: 0, top: 0, opacity }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
};

const AnimatedText = ({ text, className = "", style = {} }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const chars = text.split("");

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => (
        <AnimatedChar
          key={i}
          char={char}
          index={i}
          total={chars.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
};

/* ============================================================
   PLACEHOLDER VISUAL PRIMITIVES
   (Used in place of external/unverified image URLs)
   ============================================================ */
const PortraitPlaceholder = () => (
  <svg viewBox="0 0 520 640" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id="portraitBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a3f47" />
        <stop offset="55%" stopColor="#1b1d21" />
        <stop offset="100%" stopColor="#0C0C0C" />
      </linearGradient>
      <radialGradient id="portraitGlow" cx="50%" cy="20%" r="65%">
        <stop offset="0%" stopColor="#BBCCD7" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#BBCCD7" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="520" height="640" fill="url(#portraitGlow)" />
    <ellipse cx="260" cy="190" rx="120" ry="135" fill="url(#portraitBody)" />
    <path
      d="M120 640 C120 430 170 330 260 330 C350 330 400 430 400 640 Z"
      fill="url(#portraitBody)"
    />
    <ellipse cx="260" cy="170" rx="95" ry="105" fill="#26282c" opacity="0.6" />
  </svg>
);

const DecorShape = ({ kind }) => {
  const common = "w-full h-full";
  if (kind === "moon")
    return (
      <svg viewBox="0 0 200 200" className={common}>
        <defs>
          <linearGradient id="moonGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D7E2EA" />
            <stop offset="100%" stopColor="#4a4f57" />
          </linearGradient>
        </defs>
        <path
          d="M130 30 a70 70 0 1 0 0 140 a55 55 0 1 1 0 -140 Z"
          fill="url(#moonGrad)"
        />
      </svg>
    );
  if (kind === "lego")
    return (
      <svg viewBox="0 0 200 200" className={common}>
        <defs>
          <linearGradient id="legoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#BBCCD7" />
            <stop offset="100%" stopColor="#3a3f47" />
          </linearGradient>
        </defs>
        <rect x="40" y="80" width="120" height="80" rx="10" fill="url(#legoGrad)" />
        <circle cx="70" cy="65" r="16" fill="url(#legoGrad)" />
        <circle cx="130" cy="65" r="16" fill="url(#legoGrad)" />
      </svg>
    );
  if (kind === "p59")
    return (
      <svg viewBox="0 0 200 200" className={common}>
        <defs>
          <linearGradient id="p59Grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#646973" />
            <stop offset="100%" stopColor="#0C0C0C" />
          </linearGradient>
        </defs>
        <polygon points="100,20 180,160 20,160" fill="url(#p59Grad)" />
        <circle cx="100" cy="120" r="28" fill="#D7E2EA" opacity="0.85" />
      </svg>
    );
  return (
    <svg viewBox="0 0 200 200" className={common}>
      <defs>
        <linearGradient id="groupGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D7E2EA" />
          <stop offset="100%" stopColor="#646973" />
        </linearGradient>
      </defs>
      <rect x="30" y="60" width="60" height="100" rx="8" fill="url(#groupGrad)" />
      <circle cx="140" cy="90" r="45" fill="url(#groupGrad)" opacity="0.85" />
    </svg>
  );
};

const ProjectImage = ({ seed, className = "", style = {} }) => {
  const hues = {
    a: ["#23262b", "#0C0C0C"],
    b: ["#3a3f47", "#15171a"],
    c: ["#BBCCD7", "#3a3f47"],
  };
  const [c1, c2] = hues[seed] || hues.a;
  const gid = `pg-${seed}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={className} style={{ overflow: "hidden", ...style }}>
      <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill={`url(#${gid})`} />
        <circle cx="300" cy="100" r="90" fill="#D7E2EA" opacity="0.08" />
        <circle cx="80" cy="320" r="120" fill="#D7E2EA" opacity="0.06" />
      </svg>
    </div>
  );
};

const MarqueeTile = ({ seed }) => (
  <div
    className="rounded-2xl flex-shrink-0 overflow-hidden"
    style={{ width: 420, height: 270, willChange: "transform" }}
  >
    <ProjectImage seed={seed} className="w-full h-full" />
  </div>
);

/* ============================================================
   1. HERO SECTION
   ============================================================ */
const HeroSection = () => {
  const navLinks = ["About", "Price", "Projects", "Contact"];
  return (
    <section className="h-screen flex flex-col relative" style={{ overflowX: "clip" }}>
      <FadeIn delay={0} y={-20} as="nav">
        <nav className="flex justify-between px-6 md:px-10 pt-6 md:pt-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider
                text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              {link}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center
              text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
          >
            Hi, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      {/* Hero Portrait */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10
          top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0
          w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]"
      >
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3}>
            <div className="aspect-[520/640]">
              <PortraitPlaceholder />
            </div>
          </Magnet>
        </FadeIn>
      </div>

      <div className="flex-1" />

      <div className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug
              max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

/* ============================================================
   2. MARQUEE SECTION
   ============================================================ */
const MarqueeSection = () => {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const row1Seeds = Array.from({ length: 11 }, (_, i) => `a`);
  const row2Seeds = Array.from({ length: 10 }, (_, i) => `b`);

  const row1Tripled = [...row1Seeds, ...row1Seeds, ...row1Seeds];
  const row2Tripled = [...row2Seeds, ...row2Seeds, ...row2Seeds];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const newOffset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(newOffset);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 relative"
      style={{ overflowX: "clip" }}
    >
      <div className="flex flex-col gap-3">
        <div
          className="flex gap-3"
          style={{
            transform: `translateX(${offset - 200}px)`,
            willChange: "transform",
          }}
        >
          {row1Tripled.map((seed, i) => (
            <MarqueeTile key={`r1-${i}`} seed={seed} />
          ))}
        </div>
        <div
          className="flex gap-3"
          style={{
            transform: `translateX(${-(offset - 200)}px)`,
            willChange: "transform",
          }}
        >
          {row2Tripled.map((seed, i) => (
            <MarqueeTile key={`r2-${i}`} seed={seed} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   3. ABOUT SECTION
   ============================================================ */
const AboutSection = () => {
  const aboutText =
    "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

  return (
    <section
      id="about"
      className="min-h-screen px-5 sm:px-8 md:px-10 py-20 relative flex flex-col items-center justify-center"
      style={{ overflowX: "clip" }}
    >
      {/* Decorative corner shapes */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none"
      >
        <DecorShape kind="moon" />
      </FadeIn>
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] pointer-events-none"
      >
        <DecorShape kind="p59" />
      </FadeIn>
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none"
      >
        <DecorShape kind="lego" />
      </FadeIn>
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none"
      >
        <DecorShape kind="group" />
      </FadeIn>

      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            About me
          </h2>
        </FadeIn>

        <AnimatedText
          text={aboutText}
          className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
          style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
        />
      </div>

      <div className="mt-16 sm:mt-20 md:mt-24">
        <FadeIn delay={0.1} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

/* ============================================================
   4. SERVICES SECTION
   ============================================================ */
const services = [
  {
    num: "01",
    name: "3D Modeling",
    desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
  },
  {
    num: "02",
    name: "Rendering",
    desc: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
  },
  {
    num: "03",
    name: "Motion Design",
    desc: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.",
  },
  {
    num: "04",
    name: "Branding",
    desc: "Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.",
  },
  {
    num: "05",
    name: "Web Design",
    desc: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.",
  },
];

const ServicesSection = () => (
  <section
    id="price"
    className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
      px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
  >
    <FadeIn delay={0} y={40}>
      <h2
        className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Services
      </h2>
    </FadeIn>

    <div className="max-w-5xl mx-auto">
      {services.map((s, i) => (
        <FadeIn key={s.num} delay={i * 0.1} y={20}>
          <div
            className="flex items-center gap-6 sm:gap-10 py-8 sm:py-10 md:py-12"
            style={{ borderBottom: "1px solid rgba(12, 12, 12, 0.15)" }}
          >
            <span
              className="font-black text-[#0C0C0C] leading-none flex-shrink-0"
              style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
            >
              {s.num}
            </span>
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3
                className="font-medium uppercase text-[#0C0C0C]"
                style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
              >
                {s.name}
              </h3>
              <p
                className="font-light leading-relaxed max-w-2xl text-[#0C0C0C]"
                style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)", opacity: 0.6 }}
              >
                {s.desc}
              </p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

/* ============================================================
   5. PROJECTS SECTION
   ============================================================ */
const projectsData = [
  {
    num: "01",
    category: "Client",
    name: "Nextlevel Studio",
    seeds: ["a", "b", "c"],
  },
  {
    num: "02",
    category: "Personal",
    name: "Aura Brand Identity",
    seeds: ["b", "c", "a"],
  },
  {
    num: "03",
    category: "Client",
    name: "Solaris Digital",
    seeds: ["c", "a", "b"],
  },
];

const ProjectCard = ({ project, index, total, progress }) => {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [0, 1], [1, targetScale]);

  return (
    <div
      className="sticky top-24 md:top-32"
      style={{ top: `${96 + index * 28}px` }}
    >
      <motion.div
        style={{ scale, transformOrigin: "top center" }}
        className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]
          bg-[#0C0C0C] p-4 sm:p-6 md:p-8 h-[85vh] flex flex-col"
      >
        {/* Top row */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6 md:mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="font-black text-[#D7E2EA] leading-none"
              style={{ fontSize: "clamp(2.5rem, 7vw, 100px)" }}
            >
              {project.num}
            </span>
            <div className="flex flex-col">
              <span className="text-[#D7E2EA]/50 uppercase tracking-widest text-xs sm:text-sm font-medium">
                {project.category}
              </span>
              <span className="hero-heading font-bold uppercase text-xl sm:text-2xl md:text-3xl leading-tight">
                {project.name}
              </span>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Bottom row: image grid */}
        <div className="flex gap-3 sm:gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-3 sm:gap-4" style={{ width: "40%" }}>
            <ProjectImage
              seed={project.seeds[0]}
              className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] w-full"
              style={{ height: "clamp(130px, 16vw, 230px)" }}
            />
            <ProjectImage
              seed={project.seeds[1]}
              className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] w-full flex-1"
              style={{ height: "clamp(160px, 22vw, 340px)" }}
            />
          </div>
          <div style={{ width: "60%" }}>
            <ProjectImage
              seed={project.seeds[2]}
              className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] w-full h-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-20"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-24"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Project
        </h2>
      </FadeIn>

      <div className="flex flex-col gap-12 md:gap-16">
        {projectsData.map((project, i) => (
          <ProjectCard
            key={project.num}
            project={project}
            index={i}
            total={projectsData.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};

/* ============================================================
   FOOTER (minimal, contact anchor)
   ============================================================ */
const Footer = () => (
  <footer
    id="contact"
    className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-16 sm:py-20 flex flex-col items-center gap-6 text-center"
  >
    <span className="hero-heading font-black uppercase text-2xl sm:text-3xl tracking-tight">
      Let&apos;s work together
    </span>
    <ContactButton />
    <p className="text-[#D7E2EA]/40 text-xs sm:text-sm uppercase tracking-widest mt-6">
      © {new Date().getFullYear()} Jack. All rights reserved.
    </p>
  </footer>
);

/* ============================================================
   ROOT APP
   ============================================================ */
export default function JackPortfolio() {
  return (
    <>
      <GlobalStyles />
      <div className="bg-[#0C0C0C] min-h-screen" style={{ overflowX: "clip" }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <Footer />
      </div>
    </>
  );
}
