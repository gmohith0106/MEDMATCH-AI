'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Medical3DSceneProps {
  activePresetKey?: string;
  isProcessingPayment?: boolean;
  statusText?: string;
}

export function Medical3DScene({
  activePresetKey = 'n95',
  isProcessingPayment = false,
  statusText = 'Autonomous Agent Online',
}: Medical3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState<number>(60);
  const [nodeCount, setNodeCount] = useState<number>(4);
  const [networkPing, setNetworkPing] = useState<number>(18);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    const pinkLight = new THREE.PointLight(0xe3577c, 4, 50);
    pinkLight.position.set(10, 10, 10);
    scene.add(pinkLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 4, 50);
    cyanLight.position.set(-10, -10, 8);
    scene.add(cyanLight);

    const centerGlow = new THREE.PointLight(0xffffff, 2, 20);
    centerGlow.position.set(0, 0, 0);
    scene.add(centerGlow);

    // --- MASTER GROUP (FOR MOUSE PARALLAX) ---
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. NEURAL MEDICAL CORE (ICOSAHEDRON + INNER NUCLEUS)
    const coreGroup = new THREE.Group();
    masterGroup.add(coreGroup);

    // Outer Wireframe Lattice
    const icoGeometry = new THREE.IcosahedronGeometry(4.2, 1);
    const icoWireMaterial = new THREE.MeshStandardMaterial({
      color: 0xe3577c,
      wireframe: true,
      emissive: 0xe3577c,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const icoWireMesh = new THREE.Mesh(icoGeometry, icoWireMaterial);
    coreGroup.add(icoWireMesh);

    // Inner Glowing Nucleus Sphere
    const innerGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.7,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerSphere);

    // Dynamic Lattice Vertices
    const vertexGeometry = new THREE.BufferGeometry();
    const icoPos = icoGeometry.attributes.position;
    const vertexPoints: number[] = [];
    for (let i = 0; i < icoPos.count; i++) {
      vertexPoints.push(icoPos.getX(i), icoPos.getY(i), icoPos.getZ(i));
    }
    vertexGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertexPoints, 3));
    const vertexMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.25,
      transparent: true,
      opacity: 0.9,
    });
    const vertexMesh = new THREE.Points(vertexGeometry, vertexMat);
    coreGroup.add(vertexMesh);

    // 2. ALGORAND BLOCKCHAIN ORBIT RINGS WITH LEDGER NODES
    const ringGroup = new THREE.Group();
    ringGroup.rotation.x = Math.PI / 3.5;
    ringGroup.rotation.y = Math.PI / 6;
    masterGroup.add(ringGroup);

    const ringGeo = new THREE.TorusGeometry(7.5, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(9.0, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xe3577c,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 4;
    ringGroup.add(ringMesh2);

    // Orbiting Blockchain Ledger Blocks
    const ledgerBlockCount = 8;
    const ledgerBlocks: THREE.Mesh[] = [];
    const blockGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });

    for (let i = 0; i < ledgerBlockCount; i++) {
      const block = new THREE.Mesh(blockGeo, blockMat.clone());
      ringGroup.add(block);
      ledgerBlocks.push(block);
    }

    // 3. 3D MEDICAL SUPPLY CHAIN NODES (HOSPITAL, AI AGENT, X402 ESCROW, SUPPLIERS)
    const nodesGroup = new THREE.Group();
    masterGroup.add(nodesGroup);

    const nodeData = [
      { name: 'Hospital ERP (CityCare)', color: 0x38bdf8, pos: new THREE.Vector3(-8, 3.5, 2), icon: '🏥' },
      { name: 'Autonomous AI Agent', color: 0xe3577c, pos: new THREE.Vector3(0, 6, -1), icon: '🤖' },
      { name: 'Algorand x402 Escrow', color: 0xf59e0b, pos: new THREE.Vector3(8, 2.5, 3), icon: '⚡' },
      { name: 'Verified Tier-1 Suppliers', color: 0x10b981, pos: new THREE.Vector3(0, -6, 2), icon: '📦' },
    ];

    const supplyNodes: THREE.Group[] = [];
    nodeData.forEach((item) => {
      const singleNodeGroup = new THREE.Group();
      singleNodeGroup.position.copy(item.pos);

      // Node Sphere
      const nSphereGeo = new THREE.SphereGeometry(0.9, 24, 24);
      const nSphereMat = new THREE.MeshStandardMaterial({
        color: item.color,
        emissive: item.color,
        emissiveIntensity: 0.7,
        roughness: 0.3,
        metalness: 0.7,
      });
      const nMesh = new THREE.Mesh(nSphereGeo, nSphereMat);
      singleNodeGroup.add(nMesh);

      // Node Halo Ring
      const haloGeo = new THREE.RingGeometry(1.2, 1.35, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: item.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      singleNodeGroup.add(haloMesh);

      nodesGroup.add(singleNodeGroup);
      supplyNodes.push(singleNodeGroup);
    });

    // 4. ANIMATED LASER DATA CONDUITS CONNECTING NODES
    const lineMatPink = new THREE.LineBasicMaterial({
      color: 0xe3577c,
      transparent: true,
      opacity: 0.45,
      linewidth: 2,
    });
    const lineMatCyan = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      linewidth: 2,
    });

    // Connect Hospital -> Agent -> Escrow -> Suppliers -> Hospital
    const connectionPairs = [
      [nodeData[0].pos, nodeData[1].pos, lineMatCyan],
      [nodeData[1].pos, nodeData[2].pos, lineMatPink],
      [nodeData[2].pos, nodeData[3].pos, lineMatPink],
      [nodeData[3].pos, nodeData[0].pos, lineMatCyan],
      [nodeData[1].pos, new THREE.Vector3(0, 0, 0), lineMatPink],
      [nodeData[2].pos, new THREE.Vector3(0, 0, 0), lineMatCyan],
    ];

    connectionPairs.forEach(([p1, p2, mat]) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1 as THREE.Vector3, p2 as THREE.Vector3]);
      const line = new THREE.Line(lineGeo, mat as THREE.LineBasicMaterial);
      nodesGroup.add(line);
    });

    // 5. AMBIENT 3D CYBER-MEDICAL PARTICLE FIELD
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cPink = new THREE.Color(0xe3577c);
    const cCyan = new THREE.Color(0x38bdf8);
    const cEmerald = new THREE.Color(0x10b981);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const pick = Math.random();
      const col = pick < 0.4 ? cPink : pick < 0.8 ? cCyan : cEmerald;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleSystem);

    // --- MOUSE PARALLAX SMOOTHING ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotationY = x * 0.6;
      targetRotationX = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- WINDOW RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    let clock = new THREE.Clock();
    let frameId: number;
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Measure real FPS
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      // Smooth camera / master parallax
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;
      masterGroup.rotation.x = currentRotationX;
      masterGroup.rotation.y = currentRotationY;

      // 1. Core rotation & pulsation
      const speedMult = isProcessingPayment ? 2.5 : 1.0;
      coreGroup.rotation.y = elapsedTime * 0.25 * speedMult;
      coreGroup.rotation.x = elapsedTime * 0.15 * speedMult;
      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
      innerSphere.scale.set(pulse, pulse, pulse);

      // 2. Blockchain ring rotation
      ringGroup.rotation.z = -elapsedTime * 0.3 * speedMult;

      // Animate Orbiting Blocks around Ring
      ledgerBlocks.forEach((block, idx) => {
        const angle = (idx / ledgerBlockCount) * Math.PI * 2 + elapsedTime * 0.5 * speedMult;
        const radius = 7.5;
        block.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 2) * 0.5);
        block.rotation.x = elapsedTime * 2;
        block.rotation.y = elapsedTime * 2;
      });

      // 3. Floating Node movements
      supplyNodes.forEach((node, idx) => {
        const offset = idx * 1.5;
        node.position.y += Math.sin(elapsedTime * 1.5 + offset) * 0.005;
        node.children[1].rotation.z = elapsedTime * (idx % 2 === 0 ? 1 : -1);
      });

      // 4. Floating particles drift
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icoGeometry.dispose();
      icoWireMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringGeo2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [isProcessingPayment]);

  return (
    <div className="relative w-full h-[540px] lg:h-[640px] overflow-hidden rounded-3xl border border-white/10 glass-panel shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />

      {/* Floating 3D Telemetry Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#e3577c]/40 text-xs font-mono text-[#f8fafc] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <span className="font-semibold text-[#e3577c]">x402 ORACLE ENGINE</span>
          <span className="text-white/40">|</span>
          <span className="text-slate-400">ONLINE</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#38bdf8]/40 text-xs font-mono text-[#38bdf8] shadow-lg">
          <span>ALGORAND TESTNET</span>
          <span className="text-white/40">|</span>
          <span className="text-white font-bold">{fps} FPS</span>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-gray-300">
          <span>Latency:</span>
          <span className="text-slate-400 font-bold">{networkPing}ms</span>
          <span className="text-white/20">•</span>
          <span>Nodes:</span>
          <span className="text-[#38bdf8] font-bold">{nodeCount} Live</span>
        </div>
      </div>

      {/* Bottom Status Bar with 3D Holographic Label */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-[#e3577c]/20 border border-[#e3577c]/50 text-[#e3577c] text-sm font-bold">
            3D
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Neural Mesh Telemetry &bull; Interactive WebGL
            </p>
            <p className="text-sm font-semibold text-white truncate max-w-[280px] sm:max-w-md">
              {statusText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 self-end sm:self-auto">
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-pink-300">
            Rotate: Mouse Orbit
          </span>
          <span className="hidden md:inline px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-300">
            Parallax: 3D Depth
          </span>
        </div>
      </div>
    </div>
  );
}
