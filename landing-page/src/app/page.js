"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const navRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollVideoRef = useRef(null);
  const orbitRef = useRef(null);
  const footerRef = useRef(null);
  const footerCanvasRef = useRef(null);
  const footerBrandRef = useRef(null);

  // Glasses 3D scene refs
  const glassesRunwayRef = useRef(null);
  const glassesCanvasRef = useRef(null);
  const glassesDarkOverlayRef = useRef(null);
  const glassesInnerTitleRef = useRef(null);
  const titleLine1Ref = useRef(null);
  const titleLine2Ref = useRef(null);
  const callout1Ref = useRef(null);
  const callout2Ref = useRef(null);
  const callout3Ref = useRef(null);
  const progressFillRef = useRef(null);
  const progressLabelRef = useRef(null);
  const glassesModelRef = useRef(null);
  const ctaGlowRef = useRef(null);
  const heroRef = useRef(null);
  const cloudSceneRef = useRef(null);
  const statRef1 = useRef(null);
  const statRef2 = useRef(null);
  const statRef3 = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 20) {
          navRef.current.classList.add("scrolled");
        } else {
          navRef.current.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Stat CountUp configs: [ref, endVal, decimals, suffix]
    const statConfigs = [
      [statRef1, 6, 0, "M+"],
      [statRef2, 60, 0, "%"],
      [statRef3, null, 0, ""],  // "4–6h" is not numeric — handled separately
    ];
    let countersStarted = false;

    const startCounters = () => {
      if (countersStarted) return;
      countersStarted = true;
      import("countup.js").then(({ CountUp }) => {
        statConfigs.forEach(([ref, end, dec, suffix]) => {
          if (!ref.current || end === null) return;
          const cu = new CountUp(ref.current, end, {
            duration: 2.2,
            decimal: ".",
            suffix,
            useEasing: true,
          });
          if (!cu.error) cu.start();
        });
        // "4–6h" — animate the "4" and "6" separately using a custom text swap
        if (statRef3.current) {
          let n = 0;
          const el = statRef3.current;
          el.textContent = "0h";
          const step = () => {
            n += 0.15;
            const lo = Math.min(Math.floor(n), 4);
            const hi = Math.min(Math.floor(n * 1.5), 6);
            if (lo < 4 || hi < 6) {
              el.textContent = `${lo}–${hi}h`;
              requestAnimationFrame(step);
            } else {
              el.textContent = "4–6h";
            }
          };
          requestAnimationFrame(step);
        }
      });
    };

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            // Trigger counters when first stat-cell enters view
            if (e.target.classList.contains("stat-cell")) startCounters();
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.13 }
    );

    const elements = document.querySelectorAll(
      ".feat-text, .feat-visual, .reveal, .stat-cell"
    );
    elements.forEach((el) => io.observe(el));

    return () => {
      elements.forEach((el) => io.unobserve(el));
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = scrollContainerRef.current;
    const video = scrollVideoRef.current;
    if (!container || !video) return;

    video.pause();

    const triggers = [];

    // Video scrub
    triggers.push(
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration;
          }
        },
      })
    );

    // Orbit text rotation — full 360° over the scroll runway
    const orbit = orbitRef.current;
    if (orbit) {
      gsap.fromTo(
        orbit,
        { rotation: 0, transformOrigin: "center center" },
        {
          rotation: 360,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.id === "scroll-video")
        .forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = footerRef.current;
    const canvas = footerCanvasRef.current;
    const brand = footerBrandRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    const TOTAL_FRAMES = 120;
    const frames = [];
    let currentFrame = -1;
    let ready = false;

    // Draw a frame from the array — instant GPU blit, zero decoding
    const drawFrame = (idx) => {
      if (idx === currentFrame || !ready) return;
      currentFrame = idx;
      if (frames[idx]) {
        ctx.drawImage(frames[idx], 0, 0, canvas.width, canvas.height);
      }
    };

    // Size the canvas to its CSS dimensions × device pixel ratio
    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      // Redraw current frame at new size
      if (currentFrame >= 0 && frames[currentFrame]) {
        ctx.drawImage(frames[currentFrame], 0, 0, canvas.width, canvas.height);
      }
    };

    // Extract frames from a hidden video element
    const extractFrames = async () => {
      const vid = document.createElement("video");
      vid.src = "/footer_video.mp4";
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = "auto";

      await new Promise((resolve) => {
        vid.addEventListener("loadeddata", resolve, { once: true });
        vid.load();
      });

      sizeCanvas();

      const dur = vid.duration;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        vid.currentTime = (i / (TOTAL_FRAMES - 1)) * dur;
        await new Promise((r) =>
          vid.addEventListener("seeked", r, { once: true })
        );
        const bmp = await createImageBitmap(vid);
        frames.push(bmp);
      }

      ready = true;
      drawFrame(0);

      // Clean up the hidden video
      vid.src = "";
      vid.load();
    };

    extractFrames();
    window.addEventListener("resize", sizeCanvas);

    // Scroll-driven frame picker
    const videoTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const idx = Math.round(self.progress * (TOTAL_FRAMES - 1));
        drawFrame(idx);
      },
    });

    // Brand text: scrub-driven fade + rise
    let brandTrigger;
    if (brand) {
      gsap.set(brand, { opacity: 0, yPercent: 20 });
      brandTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top 40%",
        end: "25% top",
        scrub: 1,
        animation: gsap.to(brand, {
          opacity: 1,
          yPercent: 0,
          ease: "none",
        }),
      });
    }

    return () => {
      videoTrigger.kill();
      if (brandTrigger) brandTrigger.kill();
      window.removeEventListener("resize", sizeCanvas);
      frames.forEach((f) => f.close());
    };
  }, []);

  // ── Glasses 3D Scene ──
  useEffect(() => {
    const canvas = glassesCanvasRef.current;
    if (!canvas) return;

    let rafId;
    let renderer;
    let ro;
    let disposed = false;

    const init = async () => {
      const [THREE, { GLTFLoader }, { DRACOLoader }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/loaders/DRACOLoader.js"),
      ]);

      if (disposed) return;

      // ── Renderer ──
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // ── Scene + Camera ──
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0, 3.5);

      // ── Lights ──
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
      keyLight.position.set(4, 5, 4);
      const fillLight = new THREE.DirectionalLight(0x6da1ac, 1.4);
      fillLight.position.set(-4, -1, -3);
      const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
      rimLight.position.set(0, -4, -4);
      scene.add(ambient, keyLight, fillLight, rimLight);

      // ── Size canvas to its CSS display size ──
      const resize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(canvas);

      // ── Load GLB model via fetch → arraybuffer → parse ──
      // Uses fetch directly to avoid Three.js FileLoader URL resolution issues
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(window.location.origin + "/draco/");

      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      let model = null;
      try {
        const res = await fetch(window.location.origin + "/glasses-v2.glb");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = await res.arrayBuffer();
        if (disposed) { dracoLoader.dispose(); return; }
        const gltf = await gltfLoader.parseAsync(buffer, window.location.origin + "/");
        if (disposed) { dracoLoader.dispose(); return; }

        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        model.position.sub(center);
        model.scale.setScalar(1.6 / maxDim);

        model.traverse((obj) => {
          if (obj.isMesh && obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => {
              m.roughness = Math.min(m.roughness ?? 0.5, 0.55);
              m.metalness = Math.max(m.metalness ?? 0.5, 0.45);
              m.needsUpdate = true;
            });
          }
        });

        scene.add(model);
        glassesModelRef.current = model;
      } catch (err) {
        console.error("Glasses model load failed:", err);
      }

      dracoLoader.dispose();

      // ── Render loop ──
      const tick = () => {
        rafId = requestAnimationFrame(tick);
        if (model) model.position.y = Math.sin(Date.now() * 0.0008) * 0.04;
        renderer.render(scene, camera);
      };
      tick();
    };

    init();

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      if (renderer) renderer.dispose();
      glassesModelRef.current = null;
    };
  }, []);

  // ── CTA Glow ──
  useEffect(() => {
    const glow = ctaGlowRef.current;
    if (!glow) return;

    let rafId;
    let width = 115;
    let direction = 1;
    const breathingRange = 3;
    const animationSpeed = 0.008;
    const topOffset = 12;

    const gradientColors = ["#ffffff", "#fae4d8", "#e4eafb", "#e8efff", "#fae4d8", "#ffffff", "#ffffff"];
    const gradientStops  = [25, 48, 62, 73, 83, 93, 100];

    const animate = () => {
      if (width >= 115 + breathingRange) direction = -1;
      if (width <= 115 - breathingRange) direction = 1;
      width += direction * animationSpeed;

      const stops = gradientStops.map((s, i) => `${gradientColors[i]} ${s}%`).join(", ");
      glow.style.background = `radial-gradient(${width}% ${width + topOffset}% at 50% 130%, ${stops})`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const btn = document.querySelector("#cta .btn-3d");
    const onEnter = () => { glow.style.opacity = 1; };
    const onLeave = () => { glow.style.opacity = 0; };

    if (btn) {
      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (btn) {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  // ── Glasses GSAP ScrollTriggers ──
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const runway      = glassesRunwayRef.current;
    const overlay     = glassesDarkOverlayRef.current;
    const canvas      = glassesCanvasRef.current;
    const innerTitle  = glassesInnerTitleRef.current;
    const line1       = titleLine1Ref.current;
    const line2       = titleLine2Ref.current;
    const c1          = callout1Ref.current;
    const c2          = callout2Ref.current;
    const c3          = callout3Ref.current;
    const fill        = progressFillRef.current;
    const label       = progressLabelRef.current;
    if (!runway || !overlay) return;

    const triggers = [];

    // ── Circle clip-path: single timeline so init state is always correct ──
    // 0–30%:  hold at 0  (white phase, text panning)
    // 30–52%: grow to full screen
    // 52–80%: hold full  (dark section, callouts)
    // 80–100%: shrink back to 0
    const clipTl = gsap.timeline({ defaults: { ease: "none" } })
      .fromTo(overlay,
        { clipPath: "circle(0vw at 50% 50%)" },
        { clipPath: "circle(0vw at 50% 50%)", duration: 0.30 }
      )
      .to(overlay, { clipPath: "circle(150vmax at 50% 50%)", duration: 0.22, ease: "power2.in" })
      .to(overlay, { clipPath: "circle(150vmax at 50% 50%)", duration: 0.28 })
      .to(overlay, { clipPath: "circle(0vw at 50% 50%)",    duration: 0.20, ease: "power2.out" });

    triggers.push(
      ScrollTrigger.create({
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        animation: clipTl,
      })
    );

    // ── Canvas parallax ──
    if (canvas) {
      triggers.push(
        ScrollTrigger.create({
          trigger: runway,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          animation: gsap.fromTo(canvas, { y: "0vh" }, { y: "-12vh", ease: "none" }),
        })
      );
    }

    // ── Text pan: lines sweep in opposite directions over full scroll ──
    if (line1 && line2) {
      triggers.push(
        ScrollTrigger.create({
          trigger: runway,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          animation: gsap.timeline()
            .fromTo(line1, { x: "14vw" }, { x: "-20vw", ease: "none" }, 0)
            .fromTo(line2, { x: "-14vw" }, { x: "20vw",  ease: "none" }, 0),
        })
      );
    }

    // ── Master onUpdate: rotation, inner title fade, callouts, progress ──
    triggers.push(
      ScrollTrigger.create({
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;

          // Model rotation
          const m = glassesModelRef.current;
          if (m) {
            m.rotation.y = p * Math.PI * 4;
            m.rotation.x = Math.sin(p * Math.PI) * 0.2;
          }

          // Inner title: fade in 30–40%, hold 40–48%, fade out 48–54%
          if (innerTitle) {
            const it =
              p < 0.30 ? 0 :
              p < 0.40 ? (p - 0.30) / 0.10 :
              p < 0.48 ? 1 :
              p < 0.54 ? 1 - (p - 0.48) / 0.06 :
              0;
            innerTitle.style.opacity = it;
          }

          // Callout visibility — clean non-overlapping windows within dark section (55–80%)
          gsap.set(c1, { autoAlpha: p > 0.55 && p < 0.63 ? 1 : 0 });
          gsap.set(c2, { autoAlpha: p > 0.64 && p < 0.72 ? 1 : 0 });
          gsap.set(c3, { autoAlpha: p > 0.73 && p < 0.80 ? 1 : 0 });

          // Progress bar
          if (fill)  fill.style.width  = `${p * 100}%`;
          if (label) label.textContent = `${Math.round(p * 100)}%`;
        },
      })
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  // ── Hero Cloud Background ──
  useEffect(() => {
    const hero = heroRef.current;
    const scene = cloudSceneRef.current;
    if (!hero || !scene) return;

    // ── Cloud definitions ──
    // Each cloud: x/y as % of scene, layer (0=bg,1=mid,2=fg), scale, disperse vector
    const CLOUD_DEFS = [
      // Background layer — large, low opacity, slow
      { x: 12, y: 30, layer: 0, scale: 1.8, dx: -1,  dy: -0.4 },
      { x: 78, y: 20, layer: 0, scale: 2.1, dx:  1,  dy: -0.3 },
      { x: 45, y: 55, layer: 0, scale: 1.6, dx:  0,  dy: -0.6 },
      { x: 88, y: 65, layer: 0, scale: 1.4, dx:  1,  dy: -0.5 },
      // Midground layer — medium
      { x: 25, y: 40, layer: 1, scale: 1.2, dx: -1.4, dy: -0.7 },
      { x: 65, y: 35, layer: 1, scale: 1.3, dx:  1.2, dy: -0.8 },
      { x: 50, y: 70, layer: 1, scale: 1.1, dx: -0.8, dy: -1.0 },
      { x: 10, y: 68, layer: 1, scale: 1.0, dx: -1.6, dy: -0.6 },
      { x: 90, y: 48, layer: 1, scale: 1.2, dx:  1.5, dy: -0.9 },
      // Foreground layer — small, crisper, fast disperse
      { x: 20, y: 55, layer: 2, scale: 0.7, dx: -2.0, dy: -1.2 },
      { x: 75, y: 60, layer: 2, scale: 0.8, dx:  2.2, dy: -1.0 },
      { x: 40, y: 25, layer: 2, scale: 0.6, dx: -1.8, dy: -1.5 },
    ];

    // Layer config: parallax speed, base opacity, idle drift scale
    const LAYER = [
      { speed: 0.3, opacity: 0.55, drift: 0.6 },
      { speed: 0.55, opacity: 0.70, drift: 0.9 },
      { speed: 0.85, opacity: 0.85, drift: 1.2 },
    ];

    // ── Build cloud puffs from a radial-gradient element ──
    // Each cloud is made of several overlapping puff divs for volume
    const PUFF_TEMPLATES = [
      { w: 260, h: 160, ox: 0,    oy: 0   },
      { w: 200, h: 140, ox: 80,   oy: -30 },
      { w: 180, h: 130, ox: -70,  oy: -20 },
      { w: 150, h: 110, ox: 50,   oy: -60 },
      { w: 130, h: 100, ox: -40,  oy: -50 },
    ];

    // Create DOM cloud elements and store refs alongside their defs
    const clouds = CLOUD_DEFS.map((def) => {
      const el = document.createElement("div");
      el.className = `hero-cloud hero-cloud--l${def.layer}`;

      // Build puffs
      PUFF_TEMPLATES.forEach((p) => {
        const puff = document.createElement("div");
        puff.className = "hero-cloud-puff";
        const w = p.w * def.scale;
        const h = p.h * def.scale;
        puff.style.cssText = `
          width:${w}px; height:${h}px;
          left:${p.ox * def.scale}px; top:${p.oy * def.scale}px;
        `;
        el.appendChild(puff);
      });

      // Position in scene
      el.style.left = `${def.x}%`;
      el.style.top  = `${def.y}%`;

      scene.appendChild(el);
      return { el, def };
    });

    // ── Scroll progress: hero-relative, 0 when hero fills viewport, 1 when fully scrolled past ──
    let scrollP = 0;
    let targetP = 0;

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      // progress 0 = hero fully in view, 1 = hero fully scrolled past
      targetP = Math.max(0, Math.min(1, -rect.top / rect.height));
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Animation loop ──
    let rafId;
    let t = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      t += 0.012;

      // Smooth interpolation of scroll progress
      scrollP += (targetP - scrollP) * 0.06;

      clouds.forEach(({ el, def }) => {
        const lc = LAYER[def.layer];

        // Hero-relative scroll dispersion
        const p = scrollP * lc.speed;
        const dispX = def.dx * p * 120;  // px
        const dispY = def.dy * p * 80;
        const scaleD = 1 + p * 0.18;
        const opacityD = Math.max(0, lc.opacity - p * 1.2);

        // Idle sine/cosine drift (per-cloud phase offset from x position)
        const phase = def.x * 0.08;
        const idleX = Math.cos(t * 0.5 + phase) * 6 * lc.drift;
        const idleY = Math.sin(t * 0.35 + phase) * 4 * lc.drift;

        el.style.transform = `translate(${dispX + idleX}px, ${dispY + idleY}px) scale(${scaleD})`;
        el.style.opacity = opacityD;
      });
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      clouds.forEach(({ el }) => el.remove());
    };
  }, []);

  return (
    <>
      {/* ── Nav ── */}
      <nav id="nav" ref={navRef}>
        <a className="nav-logo" href="#">
          Re<span>v</span>ere
        </a>
        <ul className="nav-links">
          <li>
            <a href="#feature-1">Features</a>
          </li>
          <li>
            <a href="#dashboard">Caregivers</a>
          </li>
          <li>
            <a href="#stats">Impact</a>
          </li>
        </ul>
        <a className="btn-nav" href="https://revere-dashboard.vercel.app/">
          Caretaker Mode
        </a>
      </nav>

      {/* ── Hero ── */}
      <div className="hero" ref={heroRef}>
        {/* Cloud scene — sits behind all hero content, pointer-events none */}
        <div className="hero-cloud-scene" ref={cloudSceneRef} aria-hidden="true" />
        <div className="hero-eyebrow">AI-Powered Alzheimer's Care</div>
        <h1 className="hero-title">
          Remember<br />
          <em>every face.</em>
        </h1>
        <p className="hero-sub">
          Smart glasses that keep Alzheimer's patients oriented, connected, and
          safe — without a caregiver needing to intervene at every moment.
        </p>
        <div className="hero-actions">
          <a href="#feature-1" className="btn-ghost">
            See How It Works
          </a>
        </div>
        <div className="hero-video">
          <div className="vp-ring">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className="vp-label">Product Overview — Video Coming Soon</span>
        </div>
      </div>

      {/* ── Scroll-Scrubbed Video ── */}
      <div className="scroll-video-container" ref={scrollContainerRef}>
        <div className="scroll-video-sticky">

          <div className="scroll-video-glow" />
          <div className="scroll-video-wrapper">
            <video
              ref={scrollVideoRef}
              muted={true}
              playsInline={true}
              preload="auto"
              className="scroll-video-el"
            >
              <source src="/title_video.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Orbiting text ring around the video */}
          <div className="scroll-orbit-wrap" ref={orbitRef}>
            <svg
              viewBox="0 0 500 500"
              className="scroll-orbit-svg"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="orbit-path"
                  d="M 250,250 m -195,0 a 195,195 0 1,1 390,0 a 195,195 0 1,1 -390,0"
                />
              </defs>
              <text className="scroll-orbit-text">
                <textPath href="#orbit-path" textLength="1225" lengthAdjust="spacing">
                  REMEMBER MORE · WANDER LESS · LIVE BETTER · REMEMBER MORE · WANDER LESS · LIVE BETTER · REMEMBER MORE · WANDER LESS ·
                </textPath>
              </text>
            </svg>
          </div>

        </div>
      </div>

      {/* ── Glasses 3D Showcase ── */}
      <div className="glasses-runway" ref={glassesRunwayRef}>
        <div className="glasses-sticky">

          {/* z:1 — Outer title, dark text on white, pans behind model */}
          <div className="glasses-title-wrap glasses-title-wrap--outer">
            <div className="glasses-title-line" ref={titleLine1Ref}>revere</div>
            <div className="glasses-title-line glasses-title-line--right" ref={titleLine2Ref}>glasses</div>
          </div>

          {/* z:2 — Dark overlay, starts invisible (circle=0), expands on scroll */}
          <div className="glasses-dark-overlay" ref={glassesDarkOverlayRef}>
            {/* White title inside dark world — fades out before callouts appear */}
            <div className="glasses-title-wrap glasses-title-wrap--inner" ref={glassesInnerTitleRef} aria-hidden="true">
              <div className="glasses-title-line">revere</div>
              <div className="glasses-title-line glasses-title-line--right">glasses</div>
            </div>
          </div>

          {/* z:3 — Canvas above overlay so model is always visible */}
          <canvas className="glasses-canvas" ref={glassesCanvasRef} />

          {/* z:4 — Callouts, outside overlay so they render above everything */}
          <div className="glasses-callout glasses-callout--left" ref={callout1Ref}>
            <div className="callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div className="callout-line" />
            <h3 className="callout-title">face recognition</h3>
            <p className="callout-body">identifies family and friends instantly</p>
          </div>

          <div className="glasses-callout glasses-callout--right" ref={callout2Ref}>
            <div className="callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="7" width="20" height="11" rx="2"/><path d="M22 11V9a2 2 0 0 0-2-2h-1"/>
              </svg>
            </div>
            <div className="callout-line" />
            <h3 className="callout-title">all-day battery</h3>
            <p className="callout-body">4–6 hours of continuous wear</p>
          </div>

          <div className="glasses-callout glasses-callout--left" ref={callout3Ref}>
            <div className="callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s-8-4.5-8-11.8a8 8 0 0116 0C20 17.5 12 22 12 22z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="callout-line" />
            <h3 className="callout-title">location aware</h3>
            <p className="callout-body">wandering detection &amp; caregiver alerts</p>
          </div>

          {/* z:5 — Progress bar, always on top */}
          <div className="glasses-bottom-bar">
            <span className="glasses-tagline">purpose · care · memory</span>
            <span className="glasses-scroll-label">
              scroll down
              <span className="glasses-progress-track">
                <span className="glasses-progress-fill" ref={progressFillRef} />
              </span>
              <span className="glasses-progress-pct" ref={progressLabelRef}>0%</span>
            </span>
          </div>

        </div>{/* /glasses-sticky */}
      </div>{/* /glasses-runway */}

      <div className="divider"></div>

      {/* ── Feature 1: Facial Recognition ── */}
      <div id="feature-1">
        <div className="feature-section">
          <div className="feat-text">
            <span className="feat-num">01 &nbsp;/&nbsp; Recognition</span>
            <h2 className="feat-title">
              Facial Recognition &amp;<br />
              <em>Relationship Prompting</em>
            </h2>
            <p className="feat-body">
              The camera identifies family members, caregivers, and friends from a
              pre-loaded gallery. A gentle audio cue —{" "}
              <em>"This is your daughter, Sarah"</em> — plays through the
              embedded speaker before a greeting becomes a moment of distress.
            </p>
            <span className="feat-pill">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              MobileFaceNet — on-device, private
            </span>
          </div>
          <div className="feat-visual">
            <div className="feat-video-bare">
              <video autoPlay={true} muted={true} loop={true} playsInline={true} style={{ minHeight: "300px" }}>
                <source src="/face_recog_video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* ── Feature 2: Routine Coaching ── */}
      <div id="feature-2">
        <div className="feature-section feature-section--reversed">
          <div className="feat-visual">
            <div className="feat-video-bare">
              <video autoPlay={true} muted={true} loop={true} playsInline={true} style={{ minHeight: "300px" }}>
                <source src="/reminder_video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="feat-text">
            <span className="feat-num">02 &nbsp;/&nbsp; Coaching</span>
            <h2 className="feat-title">
              Routine Coaching &amp;<br />
              <em>Medication Reminders</em>
            </h2>
            <p className="feat-body">
              Caregivers configure a daily schedule through the companion
              dashboard. Time-based audio prompts keep the patient on track —{" "}
              <em>"It's 2 PM — time to take your blue pill"</em> — privately and
              without interruption.
            </p>
            <span className="feat-pill">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Caregiver-configurable via web dashboard
            </span>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* ── Feature 3: Wandering Detection ── */}
      <div id="feature-3">
        <div className="feature-section">
          <div className="feat-text">
            <span className="feat-num">03 &nbsp;/&nbsp; Safety</span>
            <h2 className="feat-title">
              Wandering Detection &amp;<br />
              <em>Location Awareness</em>
            </h2>
            <p className="feat-body">
              Passive environmental cues help Revere detect unfamiliar spaces.
              Caregivers receive a discreet alert while the patient receives a
              calming orientation prompt —{" "}
              <em>"You're at home. The kitchen is to your left."</em>
            </p>
            <span className="feat-pill">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s-8-4.5-8-11.8a8 8 0 0116 0C20 17.5 12 22 12 22z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Proactive, not reactive
            </span>
          </div>
          <div className="feat-visual">
            <div className="feat-video-bare">
              <video autoPlay={true} muted={true} loop={true} playsInline={true} style={{ minHeight: "300px" }}>
                <source src="/wander_video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* ── Caregiver Dashboard ── */}
      <section id="dashboard">
        <div className="feature-section">
          <div className="feat-visual">
            <div className="dash-mock">
              <div className="dash-topbar">
                <div className="dash-dot"></div>
                <div className="dash-dot"></div>
                <div className="dash-dot"></div>
              </div>
              <div className="dash-body">
                <div className="dash-row" style={{ width: "62%" }}></div>
                <div className="dash-row" style={{ width: "80%" }}></div>
                <div className="dash-row" style={{ width: "44%" }}></div>
              </div>
              <div className="dash-cards">
                <div className="dash-card">
                  <span className="dc-label">Reminders Today</span>
                  <span className="dc-val">6</span>
                  <div className="dc-bar-wrap">
                    <div className="dc-bar" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div className="dash-card">
                  <span className="dc-label">Faces Loaded</span>
                  <span className="dc-val">14</span>
                  <div className="dc-bar-wrap">
                    <div className="dc-bar" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
              <div className="dash-schedule">
                <div className="sched-item">
                  <div className="sched-dot on"></div>
                  <div className="sched-line"></div>
                  <span className="sched-time">08:00 — Breakfast</span>
                </div>
                <div className="sched-item">
                  <div className="sched-dot on"></div>
                  <div className="sched-line"></div>
                  <span className="sched-time">10:30 — Morning Walk</span>
                </div>
                <div className="sched-item">
                  <div className="sched-dot off"></div>
                  <div className="sched-line" style={{ opacity: 0.3 }}></div>
                  <span className="sched-time" style={{ opacity: 0.4 }}>
                    14:00 — Medication
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="feat-text">
            <span className="feat-num">Caregiver Dashboard</span>
            <h2 className="feat-title">
              Configure once.<br />
              <em>Run quietly.</em>
            </h2>
            <p className="feat-body">
              A simple web dashboard lets families and caregivers upload face
              galleries, schedule daily routines, and review device activity — no
              technical background required.
            </p>
            <ul className="dash-list">
              <li>
                <span>✦</span> Drag-and-drop face gallery management
              </li>
              <li>
                <span>✦</span> Visual daily schedule builder
              </li>
              <li>
                <span>✦</span> Activity log and event history
              </li>
              <li>
                <span>✦</span> Real-time caregiver alerts
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats">
        <div className="stats-inner">
          <div className="stats-heading">
            <span
              className="section-label reveal"
              style={{ textAlign: "center" }}
            >
              Why It Matters
            </span>
            <h2
              className="section-title reveal d1"
              style={{ textAlign: "center" }}
            >
              The numbers behind<br />
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
                the mission.
              </em>
            </h2>
          </div>
          <div className="stats-grid">
            <div className="stat-cell">
              <div className="stat-num" ref={statRef1}>6M+</div>
              <p className="stat-label">
                Americans currently living with Alzheimer's disease
              </p>
            </div>
            <div className="stat-cell">
              <div className="stat-num" ref={statRef2}>60%</div>
              <p className="stat-label">
                of patients will wander at some point — a leading cause of
                injury and death
              </p>
            </div>
            <div className="stat-cell">
              <div className="stat-num" ref={statRef3}>4–6h</div>
              <p className="stat-label">
                target battery window for supervised daily wear on a single
                charge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blur bridge — dreamy transition into video */}
      <div className="footer-blur-bridge" />

      {/* ── Cinematic Video Section ── */}
      <div className="footer-scene-runway" ref={footerRef}>
        <div className="footer-scene-sticky">
          {/* Canvas for scroll-scrubbed video frames */}
          <canvas
            ref={footerCanvasRef}
            className="footer-bg-canvas"
            aria-hidden="true"
          />

          {/* Dreamy corner vignette */}
          <div className="footer-vignette" />

          {/* Accent glow behind the brand text */}
          <div className="footer-glow" />

          {/* Brand overlay */}
          <div className="footer-content">
            <div className="footer-brand" ref={footerBrandRef}>
              <h2 className="footer-big-logo">Re<span>v</span>ere</h2>
              <p className="footer-tagline">Are you ready for a new perspective?</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Caretaker CTA ── */}
      <section id="cta">
        <div className="cta-glow" ref={ctaGlowRef} aria-hidden="true" />
        <div className="cta-inner">
          <span
            className="section-label reveal"
            style={{ textAlign: "center", display: "block", marginBottom: "1rem" }}
          >
            For Caregivers
          </span>
          <h2 className="cta-title reveal d1">
            You care for them.<br />
            <em>We care for you.</em>
          </h2>
          <p className="cta-sub reveal d2">
            The Revere caretaker dashboard lets you manage face galleries,
            set daily routines, and receive real-time alerts — all from one place.
          </p>
          <div className="cta-dashboard-action reveal d3">
            <a href="https://revere-dashboard.vercel.app/" className="btn-3d">
              <span className="btn-3d-face">
                Open Caretaker Mode
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer Info ── */}
      <footer className="footer-info">
        <div className="footer-info-inner">
          <div className="footer-info-logo">
            Re<span>v</span>ere
          </div>
          <ul className="footer-links">
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="#">Research</a></li>
            <li><a href="#">Press</a></li>
          </ul>
          <span className="footer-copy">© 2026 Revere. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}
