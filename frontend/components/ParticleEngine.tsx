import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useLocation, useNavigate } from 'react-router-dom';

// Safely initialize intro state inside a function to avoid top-level sandbox errors
const getInitialIntroState = () => {
  try {
    return typeof window !== 'undefined' && sessionStorage.getItem('renderdrops_intro') === 'true';
  } catch (e) {
    return false;
  }
};

declare global {
  interface Window {
    rdEngine: {
      setPhase: (phase: number) => void;
      triggerIntro: () => void;
      setCameraZ: (z: number) => void;
      handleClick: (x: number, y: number, callback: () => void) => void;
      isReady: boolean;
    };
  }
}

const ParticleEngine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const initialized = useRef(false);

  // Safely check intro state inside the component to prevent sandbox ReferenceErrors
  const hasPlayedIntroRef = useRef(false);
  useEffect(() => {
    try {
      hasPlayedIntroRef.current = sessionStorage.getItem('renderdrops_intro') === 'true';
    } catch (e) {
      console.warn('sessionStorage access denied');
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || initialized.current) return;
    initialized.current = true;

    let isMobile = window.innerWidth < 768;
    let CAMERA_BASE_Z = isMobile ? 110 : 80;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#010101', 0.008);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = hasPlayedIntroRef.current ? CAMERA_BASE_Z : CAMERA_BASE_Z + 150;

    // High-performance renderer (Native Additive Blending for iPhone smoothness)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // MASSIVE PARTICLE COUNT FOR HIGH DENSITY AND COMPLEXITY
    let MAX_PARTICLES = 80000; 
    let particleGeo: THREE.BufferGeometry;
    let particleSystem: THREE.Points;
    
    let posArray: Float32Array;
    let colorArray: Float32Array;
    let basePositions: Float32Array;
    let sourcePositions: Float32Array;
    let targetPositions: Float32Array;
    let sourceColors: Float32Array;
    let targetColors: Float32Array;
    let randomScatter: Float32Array;

    const shapesRef = { current: [] as { points: THREE.Vector3[], colors: THREE.Color[] }[] };
    let currentPhase = -1;
    let currentTween: gsap.core.Tween | null = null;
    const morphControl = { progress: 0 };

    // Extracts pixels and maps brightness to 3D Z-Depth for complex volume
    const extractFromCanvas = (drawCallback: (ctx: CanvasRenderingContext2D, size: number) => void, size = 500) => {
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return { points: [], colors: [] };

      ctx.fillStyle = '#000'; ctx.fillRect(0,0,size,size);
      drawCallback(ctx, size);

      const imgData = ctx.getImageData(0, 0, size, size).data;
      const points = [];
      const colors = [];

      // Step by 1 or 2 to hit ~80k particles
      const step = 2; 

      for(let y=0; y<size; y+=step) {
        for(let x=0; x<size; x+=step) {
          const i = (y*size+x)*4;
          const r = imgData[i], g = imgData[i+1], b = imgData[i+2];
          
          if(r > 15 || g > 15 || b > 15) {
            // Calculate brightness to extrude into 3D space
            const brightness = (r + g + b) / (255 * 3);
            const zDepth = (brightness * 15) - 7.5 + (Math.random() - 0.5) * 2; // 3D Volume extrusion
            
            points.push(new THREE.Vector3((x - size/2) * 0.14, -(y - size/2) * 0.14, zDepth));
            
            // EXACT NORMAL COLORS (No dimming, exact RGB from image)
            colors.push(new THREE.Color(r/255, g/255, b/255));
          }
        }
      }
      return { points, colors };
    };

    // Highly accurate fallback drawing of the requested RD Logo
    const drawFallbackRD = (ctx: CanvasRenderingContext2D, size: number) => {
      const cx = size / 2;
      const cy = size / 2 - 30;

      ctx.fillStyle = '#E60000'; // Deep Red
      ctx.font = 'italic 900 200px "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('RD', cx, cy);

      // Sharp brush strokes
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = 18;
      ctx.lineCap = 'square';
      
      ctx.beginPath(); ctx.moveTo(cx - 110, cy + 70); ctx.lineTo(cx - 170, cy + 150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 100, cy - 100); ctx.lineTo(cx + 160, cy - 180); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 100, cy - 80); ctx.lineTo(cx - 150, cy - 30); ctx.stroke();
      
      ctx.globalCompositeOperation = 'source-over';

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 36px "Arial", sans-serif';
      ctx.letterSpacing = '8px';
      ctx.fillText('RENDER DROPS', cx, cy + 130);
    };

    const loadData = () => {
      const imgRD = new Image(); 
      imgRD.crossOrigin = "Anonymous"; 
      imgRD.src = './logo.jpg'; 
      
      imgRD.onload = () => {
        try {
          const data = extractFromCanvas((ctx, size) => {
            const scale = (size * 0.85) / Math.max(imgRD.width, imgRD.height);
            const w = imgRD.width * scale; const h = imgRD.height * scale;
            ctx.drawImage(imgRD, (size - w)/2, (size - h)/2, w, h);
          });
          shapesRef.current[0] = data.points.length > 1000 ? data : extractFromCanvas(drawFallbackRD);
        } catch(e) { 
          shapesRef.current[0] = extractFromCanvas(drawFallbackRD); 
        }
        finalizeLoad();
      };
      
      imgRD.onerror = () => { 
        shapesRef.current[0] = extractFromCanvas(drawFallbackRD); 
        finalizeLoad(); 
      };
    };

    const finalizeLoad = () => {
      // 1: Teams (Nodes)
      shapesRef.current[1] = extractFromCanvas((ctx, size) => { 
        ctx.fillStyle = '#E60000'; ctx.beginPath(); ctx.arc(250, 150, 50, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(250, 320, 80, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(100, 180, 35, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(100, 340, 55, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.arc(400, 180, 35, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(400, 340, 55, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = '#FFF'; ctx.lineWidth = 10;
        ctx.beginPath(); ctx.moveTo(250,150); ctx.lineTo(100,180); ctx.lineTo(100,340); ctx.lineTo(250,320); ctx.lineTo(400,340); ctx.lineTo(400,180); ctx.closePath(); ctx.stroke();
      }, 500);

      // 2: X (Twitter)
      shapesRef.current[2] = extractFromCanvas((ctx, size) => { 
        ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 320px Arial'; 
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('𝕏', size/2, size/2);
      }, 500);

      // 3: Instagram
      shapesRef.current[3] = extractFromCanvas((ctx, size) => { 
        const centerX = size/2; const centerY = size/2;
        const grad = ctx.createLinearGradient(centerX-120, centerY+120, centerX+120, centerY-120);
        grad.addColorStop(0, '#FFB300'); grad.addColorStop(0.5, '#FF0055'); grad.addColorStop(1, '#B000FF'); 
        
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(centerX-120, centerY-120, 240, 240, 55); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.roundRect(centerX-85, centerY-85, 170, 170, 30); ctx.fill();
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(centerX, centerY, 55, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(centerX, centerY, 30, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(centerX+60, centerY-60, 15, 0, Math.PI*2); ctx.fill();
      }, 500);

      // 4: Contact (Envelope)
      shapesRef.current[4] = extractFromCanvas((ctx, size) => { 
        const centerX = size/2; const centerY = size/2;
        ctx.strokeStyle = '#FFF'; ctx.lineWidth = 24; ctx.lineJoin = 'round';
        ctx.strokeRect(centerX-150, centerY-100, 300, 200);
        ctx.beginPath(); ctx.moveTo(centerX-150, centerY-100); ctx.lineTo(centerX, centerY+30); ctx.lineTo(centerX+150, centerY-100); ctx.stroke();
      }, 500);

      // Ensure we don't exceed the max points found in the logo
      MAX_PARTICLES = Math.min(shapesRef.current[0].points.length, 80000);
      
      posArray = new Float32Array(MAX_PARTICLES * 3);
      colorArray = new Float32Array(MAX_PARTICLES * 3);
      basePositions = new Float32Array(MAX_PARTICLES * 3);
      sourcePositions = new Float32Array(MAX_PARTICLES * 3);
      targetPositions = new Float32Array(MAX_PARTICLES * 3);
      sourceColors = new Float32Array(MAX_PARTICLES * 3);
      targetColors = new Float32Array(MAX_PARTICLES * 3);
      randomScatter = new Float32Array(MAX_PARTICLES * 3);

      // Intro Vortex state: A complex 3D spiral galaxy
      for(let i=0; i<MAX_PARTICLES; i++) {
        const arm = i % 3; 
        const angle = (i / MAX_PARTICLES) * Math.PI * 20 + (arm * Math.PI * 2 / 3);
        const radius = 10 + Math.random() * 100 + (i / MAX_PARTICLES) * 50;
        
        const rx = Math.cos(angle) * radius;
        const rz = Math.sin(angle) * radius;
        const ry = (Math.random() - 0.5) * 100 * (1 - i/MAX_PARTICLES); // Tapered Y

        posArray[i*3] = basePositions[i*3] = sourcePositions[i*3] = targetPositions[i*3] = rx;
        posArray[i*3+1] = basePositions[i*3+1] = sourcePositions[i*3+1] = targetPositions[i*3+1] = ry;
        posArray[i*3+2] = basePositions[i*3+2] = sourcePositions[i*3+2] = targetPositions[i*3+2] = rz;

        // Bright red for the intro vortex
        colorArray[i*3] = sourceColors[i*3] = targetColors[i*3] = 1.0; 
        colorArray[i*3+1] = sourceColors[i*3+1] = targetColors[i*3+1] = 0.0; 
        colorArray[i*3+2] = sourceColors[i*3+2] = targetColors[i*3+2] = 0.2; 

        // Pre-calculate random scatter for explosive morphs
        randomScatter[i*3] = (Math.random() - 0.5) * 150;
        randomScatter[i*3+1] = (Math.random() - 0.5) * 150;
        randomScatter[i*3+2] = (Math.random() - 0.5) * 200;
      }

      initScene();
    };

    const initScene = () => {
      particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

      // Solid, bright circular texture for vibrant colors
      const glowTex = () => {
        const c = document.createElement('canvas'); c.width=64; c.height=64; const ctx=c.getContext('2d');
        if(!ctx) return null;
        const g = ctx.createRadialGradient(32,32,0,32,32,32);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.4, 'rgba(255,255,255,0.9)'); // Solid core
        g.addColorStop(1, 'rgba(255,255,255,0)'); // Sharp fade
        ctx.fillStyle=g; ctx.fillRect(0,0,64,64); return new THREE.CanvasTexture(c);
      };

      const particleMat = new THREE.PointsMaterial({
        size: 0.4, // Smaller size for higher density looks more professional
        map: glowTex(), 
        vertexColors: true,
        transparent: true, 
        opacity: 1.0, 
        depthWrite: false, 
        blending: THREE.NormalBlending // Normal blending ensures colors look exactly like the image (not washed out/dim)
      });

      particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      window.rdEngine.isReady = true;
      
      if (hasPlayedIntroRef.current) {
        window.rdEngine.setPhase(0);
        morphControl.progress = 1;
      }
    };

    // Global API
    window.rdEngine = {
      isReady: false,
      setPhase: (phaseIndex: number) => {
        if (phaseIndex === currentPhase || !shapesRef.current[phaseIndex]) return;
        currentPhase = phaseIndex;
        const targetShape = shapesRef.current[phaseIndex];

        if (currentTween) currentTween.kill();

        for(let i=0; i<MAX_PARTICLES; i++) {
          sourcePositions[i*3] = basePositions[i*3];
          sourcePositions[i*3+1] = basePositions[i*3+1];
          sourcePositions[i*3+2] = basePositions[i*3+2];
          
          sourceColors[i*3] = colorArray[i*3];
          sourceColors[i*3+1] = colorArray[i*3+1];
          sourceColors[i*3+2] = colorArray[i*3+2];

          const pt = targetShape.points[i % targetShape.points.length];
          const col = targetShape.colors[i % targetShape.colors.length];
          
          targetPositions[i*3] = pt.x;
          targetPositions[i*3+1] = pt.y;
          targetPositions[i*3+2] = pt.z;
          
          targetColors[i*3] = col.r;
          targetColors[i*3+1] = col.g;
          targetColors[i*3+2] = col.b;
        }

        morphControl.progress = 0;
        // Ultra-smooth iPhone-like easing
        currentTween = gsap.to(morphControl, { progress: 1, duration: 2.5, ease: "power3.inOut" });
      },
      triggerIntro: () => {
        try { sessionStorage.setItem('renderdrops_intro', 'true'); } catch(e) {}
        currentPhase = 0;
        const targetShape = shapesRef.current[0];
        
        for(let i=0; i<MAX_PARTICLES; i++) {
          sourcePositions[i*3] = basePositions[i*3];
          sourcePositions[i*3+1] = basePositions[i*3+1];
          sourcePositions[i*3+2] = basePositions[i*3+2];

          const pt = targetShape.points[i % targetShape.points.length];
          const col = targetShape.colors[i % targetShape.colors.length];
          targetPositions[i*3] = pt.x;
          targetPositions[i*3+1] = pt.y;
          targetPositions[i*3+2] = pt.z;
          targetColors[i*3] = col.r;
          targetColors[i*3+1] = col.g;
          targetColors[i*3+2] = col.b;
        }

        gsap.to(camera.position, { z: CAMERA_BASE_Z - 20, duration: 1.0, ease: "power2.in" });
        
        // Suck into center
        const suckControl = { progress: 0 };
        gsap.to(suckControl, {
          progress: 1,
          duration: 1.0,
          ease: "power2.in",
          onUpdate: () => {
            const p = suckControl.progress;
            for(let i=0; i<MAX_PARTICLES; i++) {
              const i3 = i*3;
              basePositions[i3] = sourcePositions[i3] * (1 - p);
              basePositions[i3+1] = sourcePositions[i3+1] * (1 - p);
              basePositions[i3+2] = sourcePositions[i3+2] * (1 - p);
            }
          }
        });

        setTimeout(() => {
          // Reset source positions to center for the burst
          for(let i=0; i<MAX_PARTICLES; i++) {
            const i3 = i*3;
            sourcePositions[i3] = 0;
            sourcePositions[i3+1] = 0;
            sourcePositions[i3+2] = 0;
          }
          morphControl.progress = 0;
          currentTween = gsap.to(morphControl, { progress: 1, duration: 3.0, ease: "expo.out" });
          gsap.to(camera.position, { z: CAMERA_BASE_Z, duration: 3.0, ease: "expo.out" });
        }, 1000);
      },
      setCameraZ: (zOffset: number) => {
        gsap.to(camera.position, { z: CAMERA_BASE_Z + zOffset, duration: 1.0, ease: "power2.out" });
      },
      handleClick: (clientX: number, clientY: number, callback: () => void) => {
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, intersectPoint);

        // If clicked near the center object
        if (intersectPoint.length() < 50) {
          // Cinematic zoom in
          gsap.to(camera.position, {
            z: camera.position.z - 40,
            duration: 0.8,
            ease: "power3.in",
            onComplete: () => {
              callback();
              // Reset camera for next page
              gsap.to(camera.position, { z: CAMERA_BASE_Z, duration: 1.5, delay: 0.2, ease: "power2.out" });
            }
          });
        }
      }
    };

    loadData();

    // Mouse Interaction
    const mouse = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if(!particleSystem) return;

      const time = clock.getElapsedTime();
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, intersectPoint);

      const p = morphControl.progress;
      
      // Complex 3D Twist during morphing
      const morphScatter = Math.sin(p * Math.PI); 
      const twistAngle = morphScatter * Math.PI * 0.5; // 90 degree twist
      const cosT = Math.cos(twistAngle);
      const sinT = Math.sin(twistAngle);

      for(let i=0; i<MAX_PARTICLES; i++) {
        const i3 = i * 3;
        
        // Apply twist to target positions
        const tx = targetPositions[i3];
        const tz = targetPositions[i3+2];
        const twistedX = tx * cosT - tz * sinT;
        const twistedZ = tx * sinT + tz * cosT;
        
        // Clean Morph Math with Twist
        let bx = sourcePositions[i3] + (twistedX - sourcePositions[i3]) * p;
        let by = sourcePositions[i3+1] + (targetPositions[i3+1] - sourcePositions[i3+1]) * p;
        let bz = sourcePositions[i3+2] + (twistedZ - sourcePositions[i3+2]) * p;

        // Add 3D depth expansion during transition
        bx += randomScatter[i3] * morphScatter * 1.5;
        by += randomScatter[i3+1] * morphScatter * 1.5;
        bz += randomScatter[i3+2] * morphScatter * 1.5;

        basePositions[i3] = bx;
        basePositions[i3+1] = by;
        basePositions[i3+2] = bz;

        colorArray[i3] = sourceColors[i3] + (targetColors[i3] - sourceColors[i3]) * p;
        colorArray[i3+1] = sourceColors[i3+1] + (targetColors[i3+1] - sourceColors[i3+1]) * p;
        colorArray[i3+2] = sourceColors[i3+2] + (targetColors[i3+2] - sourceColors[i3+2]) * p;

        // Magnetic Mouse Physics
        const dx = bx - intersectPoint.x;
        const dy = by - intersectPoint.y;
        const distSq = dx*dx + dy*dy; // Avoid Math.sqrt for performance
        
        let repelX = 0, repelY = 0, repelZ = 0;
        if(distSq < 64) { // 8 squared
          const dist = Math.sqrt(distSq);
          const force = (8 - dist) / 8;
          repelX = (dx / dist) * force * 2.5;
          repelY = (dy / dist) * force * 2.5;
          repelZ = force * 5.0; 
        }

        // Complex Float & LERP (Breathing effect)
        const floatOffsetX = Math.sin(time * 2 + i * 0.1) * 0.2;
        const floatOffsetY = Math.cos(time * 2.5 + i * 0.1) * 0.2;
        const floatOffsetZ = Math.sin(time * 1.5 + i * 0.1) * 0.2;
        
        posArray[i3] += ((bx + repelX + floatOffsetX) - posArray[i3]) * 0.12;
        posArray[i3+1] += ((by + repelY + floatOffsetY) - posArray[i3+1]) * 0.12;
        posArray[i3+2] += ((bz + repelZ + floatOffsetZ) - posArray[i3+2]) * 0.12;
      }
      
      particleGeo.attributes.position.needsUpdate = true;
      particleGeo.attributes.color.needsUpdate = true;

      // Swirl while idle
      if (currentPhase === -1) {
        particleSystem.rotation.y += 0.02;
        particleSystem.rotation.x += 0.01;
      } else {
        particleSystem.rotation.y = Math.sin(time * 0.2) * 0.1;
        particleSystem.rotation.x = Math.cos(time * 0.15) * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      isMobile = window.innerWidth < 768;
      CAMERA_BASE_Z = isMobile ? 100 : 70;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      initialized.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentTween) currentTween.kill();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (particleGeo) particleGeo.dispose();
    };
  }, []);

  // Route-based morphing synchronization
  useEffect(() => {
    if (!window.rdEngine || !window.rdEngine.isReady) return;

    if (location.pathname === '/teams') {
      window.rdEngine.setPhase(1); // Teams shape
    } else if (location.pathname === '/about') {
      window.rdEngine.setPhase(0); // Logo
    } else if (location.pathname === '/contact') {
      window.rdEngine.setPhase(4); // Mail shape
    } else if (location.pathname === '/') {
      window.rdEngine.setPhase(0); // Handled by scroll, but reset to 0 initially
    }
  }, [location.pathname]);

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen z-0 outline-none pointer-events-none" />
  );
};

export default ParticleEngine;
