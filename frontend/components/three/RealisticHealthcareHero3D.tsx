'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function RealisticHealthcareHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- LIGHTING (Soft Medical & Healthcare Key Lighting) ---
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(15, 20, 15);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const tealFillLight = new THREE.PointLight(0x0d9488, 3.5, 30);
    tealFillLight.position.set(-10, -5, 10);
    scene.add(tealFillLight);

    const navyRimLight = new THREE.PointLight(0x0f2744, 2.5, 40);
    navyRimLight.position.set(0, -15, -10);
    scene.add(navyRimLight);

    // --- MASTER GROUP (FOR MOUSE PARALLAX) ---
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. HOSPITAL SUPPLY CONTAINERS (3D Box Geometries with Medical Cross)
    const boxesGroup = new THREE.Group();
    masterGroup.add(boxesGroup);

    // Box Materials
    const medicalWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.1,
    });

    const tealAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      roughness: 0.3,
      metalness: 0.2,
    });

    const navyAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0f2744,
      roughness: 0.3,
      metalness: 0.3,
    });

    // Main Surgical Supply Box
    const mainBoxGeo = new THREE.BoxGeometry(5.2, 3.4, 4.2);
    const mainBox = new THREE.Mesh(mainBoxGeo, medicalWhiteMat);
    mainBox.position.set(0, -0.5, 0);
    mainBox.castShadow = true;
    mainBox.receiveShadow = true;
    boxesGroup.add(mainBox);

    // Teal Lid / Seal
    const lidGeo = new THREE.BoxGeometry(5.25, 0.4, 4.25);
    const boxLid = new THREE.Mesh(lidGeo, tealAccentMat);
    boxLid.position.set(0, 1.3, 0);
    boxesGroup.add(boxLid);

    // Medical Cross Emblem on Front
    const crossVGeo = new THREE.BoxGeometry(0.35, 1.2, 0.05);
    const crossHGeo = new THREE.BoxGeometry(1.2, 0.35, 0.05);
    const crossV = new THREE.Mesh(crossVGeo, tealAccentMat);
    const crossH = new THREE.Mesh(crossHGeo, tealAccentMat);
    crossV.position.set(0, -0.4, 2.13);
    crossH.position.set(0, -0.4, 2.13);
    boxesGroup.add(crossV);
    boxesGroup.add(crossH);

    // Secondary Supply Container (Sterile PPE Pack - Stacked Left)
    const ppeBoxGeo = new THREE.BoxGeometry(3.6, 2.2, 3.2);
    const ppeBox = new THREE.Mesh(ppeBoxGeo, medicalWhiteMat);
    ppeBox.position.set(-4.5, -1.1, -1.5);
    ppeBox.rotation.y = Math.PI / 8;
    boxesGroup.add(ppeBox);

    const ppeLid = new THREE.Mesh(new THREE.BoxGeometry(3.65, 0.3, 3.25), navyAccentMat);
    ppeLid.position.set(-4.5, 0.1, -1.5);
    ppeLid.rotation.y = Math.PI / 8;
    boxesGroup.add(ppeLid);

    // Third Supply Container (IV Infusion Kits - Right)
    const ivBoxGeo = new THREE.BoxGeometry(3.2, 2.6, 2.8);
    const ivBox = new THREE.Mesh(ivBoxGeo, medicalWhiteMat);
    ivBox.position.set(4.6, -0.9, -1.0);
    ivBox.rotation.y = -Math.PI / 10;
    boxesGroup.add(ivBox);

    const ivLid = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.3, 2.85), tealAccentMat);
    ivLid.position.set(4.6, 0.5, -1.0);
    ivLid.rotation.y = -Math.PI / 10;
    boxesGroup.add(ivLid);

    // 2. ORBITING ALGORAND & x402 SETTLEMENT RINGS
    const orbitRingGroup = new THREE.Group();
    orbitRingGroup.rotation.x = Math.PI / 4;
    orbitRingGroup.rotation.y = Math.PI / 7;
    masterGroup.add(orbitRingGroup);

    const ringGeo = new THREE.TorusGeometry(8.2, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0d9488,
      transparent: true,
      opacity: 0.5,
    });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRingGroup.add(orbitRing);

    const innerRingGeo = new THREE.TorusGeometry(6.6, 0.03, 16, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.35,
    });
    const innerOrbitRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    orbitRingGroup.add(innerOrbitRing);

    // Floating Data Node Spheres
    const nodeSpheres: THREE.Mesh[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      emissive: 0x0d9488,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });

    for (let i = 0; i < 4; i++) {
      const node = new THREE.Mesh(sphereGeo, sphereMat);
      orbitRingGroup.add(node);
      nodeSpheres.push(node);
    }

    // 3. AMBIENT PARTICLES (Subtle Floating Medical Data Points)
    const particleCount = 40;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 14;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x0d9488,
      size: 0.12,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeometry, particleMat);
    masterGroup.add(particles);

    // --- MOUSE PARALLAX INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.4;
      targetY = -y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Parallax Interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      masterGroup.rotation.y = mouseX + Math.sin(elapsedTime * 0.3) * 0.08;
      masterGroup.rotation.x = mouseY + Math.cos(elapsedTime * 0.25) * 0.05;

      // Gentle floating box group motion
      boxesGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.25;
      boxesGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.06;

      // Orbit ring rotation
      orbitRingGroup.rotation.z = elapsedTime * 0.15;

      // Update Node Sphere Positions around the Ring
      nodeSpheres.forEach((sphere, index) => {
        const angle = elapsedTime * 0.6 + (index * Math.PI) / 2;
        sphere.position.x = Math.cos(angle) * 8.2;
        sphere.position.y = Math.sin(angle) * 8.2;
      });

      // Subtle particle float
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Telemetry Overlay Card: Shortage Deficit */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-6 bg-white/95 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xl shadow-slate-900/5 max-w-[210px] sm:max-w-[240px] transform hover:scale-105 transition-all duration-300 pointer-events-none">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Shortage Detected</span>
        </div>
        <p className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">Surgical Gloves</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm sm:text-base font-black text-rose-600">-1,650</span>
          <span className="text-[11px] font-medium text-slate-500">boxes deficit</span>
        </div>
        <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex justify-between text-[10px] text-slate-500">
          <span>Stockout in:</span>
          <span className="font-bold text-amber-600">2.8 Days</span>
        </div>
      </div>

      {/* Floating 3D Telemetry Overlay Card: Verified Supplier */}
      <div className="absolute bottom-6 right-4 sm:bottom-10 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xl shadow-slate-900/5 max-w-[220px] sm:max-w-[250px] transform hover:scale-105 transition-all duration-300 pointer-events-none">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
            x402 UNLOCKED
          </span>
          <span className="text-[10px] text-slate-400">Algorand TestNet</span>
        </div>
        <p className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">MediSupply Healthcare</p>
        <div className="grid grid-cols-2 gap-2 mt-1.5 text-[11px]">
          <div>
            <span className="text-slate-400 text-[10px]">Lead Time</span>
            <p className="font-bold text-slate-800">2 Days</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">AI Score</span>
            <p className="font-bold text-pink-700">94.6 / 100</p>
          </div>
        </div>
      </div>

      {/* Floating 3D Telemetry Badge: Algorand USDC Micropayment */}
      <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-8 bg-slate-900/90 text-white backdrop-blur-md rounded-lg px-3 py-1.5 border border-slate-700 shadow-lg flex items-center gap-2 text-[11px] pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
        <span className="font-medium text-slate-300">x402 Micropayment:</span>
        <span className="font-bold text-pink-300">0.02 USDC Settled</span>
      </div>
    </div>
  );
}
