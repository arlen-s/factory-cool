import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function TwinCanvas({ zones, tick }) {
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const width = host.clientWidth;
    const height = host.clientHeight;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFallback(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(8, 7, 9);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x88d7ff, 2.2));
    const light = new THREE.DirectionalLight(0x3df4ff, 3);
    light.position.set(4, 8, 5);
    scene.add(light);

    const group = new THREE.Group();
    const layout = [
      [-2.8, 1.2, 2.5, 1.8],
      [0.1, 1.25, 2.5, 1.7],
      [-2.8, -0.85, 2.8, 2],
      [0.5, -0.65, 2.2, 1.55],
      [-2.9, -2.55, 2.3, 1.2],
      [0.15, -2.45, 2.5, 1.3]
    ];

    layout.forEach(([x, z, w, d], index) => {
      const zone = zones[index];
      const color = zone?.level === 'critical' ? 0xff3d2e : zone?.level === 'warning' ? 0xffc928 : 0x1ee7ff;
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.16, d),
        new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.42, emissive: color, emissiveIntensity: 0.22 })
      );
      base.position.set(x, 0, z);
      group.add(base);

      const frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(w, 0.22, d)),
        new THREE.LineBasicMaterial({ color: 0x6deaff, transparent: true, opacity: 0.9 })
      );
      frame.position.set(x, 0.04, z);
      group.add(frame);

      for (let i = 0; i < 7; i += 1) {
        const machine = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.24 + (i % 3) * 0.08, 0.22),
          new THREE.MeshStandardMaterial({ color: 0xa7f6ff, emissive: 0x00b7ff, emissiveIntensity: 0.35 })
        );
        machine.position.set(x - w / 2 + 0.45 + (i % 4) * 0.45, 0.22, z - d / 2 + 0.4 + Math.floor(i / 4) * 0.55);
        group.add(machine);
      }
    });

    group.rotation.y = -0.7;
    group.rotation.x = 0.08;
    scene.add(group);
    sceneRef.current = { renderer, scene, camera, group };

    let frameId = 0;
    const render = () => {
      group.rotation.y = -0.7 + Math.sin(Date.now() / 2500) * 0.035;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [zones]);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.group.position.y = Math.sin(tick / 4) * 0.04;
  }, [tick]);

  return (
    <div className={fallback ? 'twin-canvas twin-fallback' : 'twin-canvas'} ref={hostRef}>
      {fallback ? (
        <div className="fallback-layout" style={{ '--pulse': tick % 2 }}>
          {zones.map((zone, index) => (
            <div className={`fallback-zone fallback-zone-${index + 1} ${zone.level}`} key={zone.id}>
              <span>{zone.name}</span>
              <strong>{zone.temperature}°C</strong>
            </div>
          ))}
          <div className="fallback-pipe pipe-a" />
          <div className="fallback-pipe pipe-b" />
          <div className="fallback-pipe pipe-c" />
        </div>
      ) : null}
    </div>
  );
}
