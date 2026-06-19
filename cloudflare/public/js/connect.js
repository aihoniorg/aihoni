/* aihoni — hero "connection network" animation
   A 3D web of nodes (people) linked by lines, with bright pulses that
   travel along the links — a visual metaphor for messages & connection.
   Subtle, brand-blue, and respects prefers-reduced-motion. */
import * as THREE from 'three';

const canvas = document.getElementById('connect-canvas');
if (canvas && window.WebGLRenderingContext) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ACCENT = 0x3b76ef;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 28;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new THREE.Group();
  scene.add(group);

  // ----- nodes (people) -----
  const NODE_COUNT = 38;
  const R = 14;
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const v = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).multiplyScalar(R * (0.45 + Math.random() * 0.55));
    nodes.push(v);
  }

  const nodeGeo = new THREE.BufferGeometry();
  const nodePos = new Float32Array(NODE_COUNT * 3);
  nodes.forEach((n, i) => { nodePos[i * 3] = n.x; nodePos[i * 3 + 1] = n.y; nodePos[i * 3 + 2] = n.z; });
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  group.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({
    color: ACCENT, size: 0.5, transparent: true, opacity: 0.9, sizeAttenuation: true
  })));

  // ----- links (connections) between nearby nodes -----
  const edges = [];
  const linePositions = [];
  const MAX_DIST = 9.5;
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (nodes[i].distanceTo(nodes[j]) < MAX_DIST) {
        edges.push([i, j]);
        linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  group.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    color: ACCENT, transparent: true, opacity: 0.22
  })));

  // ----- message pulses travelling along links -----
  const PULSE_COUNT = reduce ? 0 : 16;
  const pulsePos = new Float32Array(Math.max(PULSE_COUNT, 1) * 3);
  const pulseGeo = new THREE.BufferGeometry();
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
  group.add(new THREE.Points(pulseGeo, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.7, transparent: true, opacity: 0.95, sizeAttenuation: true
  })));

  const spawn = () => ({
    edge: edges[Math.floor(Math.random() * edges.length)] || [0, 1],
    t: Math.random(),
    speed: 0.004 + Math.random() * 0.011
  });
  const pulses = Array.from({ length: PULSE_COUNT }, spawn);

  // ----- interaction & sizing -----
  let mx = 0;
  window.addEventListener('pointermove', (e) => { mx = e.clientX / window.innerWidth - 0.5; }, { passive: true });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w && h && (canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio()))) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  function frame() {
    resize();
    group.rotation.y += 0.0016 + mx * 0.0009;
    group.rotation.x = Math.sin(Date.now() * 0.0001) * 0.12;
    for (let i = 0; i < PULSE_COUNT; i++) {
      const p = pulses[i];
      p.t += p.speed;
      if (p.t >= 1) { pulses[i] = spawn(); continue; }
      const a = nodes[p.edge[0]], b = nodes[p.edge[1]];
      pulsePos[i * 3] = a.x + (b.x - a.x) * p.t;
      pulsePos[i * 3 + 1] = a.y + (b.y - a.y) * p.t;
      pulsePos[i * 3 + 2] = a.z + (b.z - a.z) * p.t;
    }
    pulseGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }

  if (reduce) { resize(); group.rotation.set(0.1, 0.5, 0); renderer.render(scene, camera); }
  else requestAnimationFrame(frame);
}
