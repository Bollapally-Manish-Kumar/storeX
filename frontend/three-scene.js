// Three.js 3D Scene for StoreX
// Creates floating geometric shapes in the background

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('threejs-canvas'),
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera position
camera.position.z = 30;

// Arrays to hold our 3D objects
const shapes = [];
const particles = [];

// Colors for our shapes - Purple theme
const colors = [
  0xa855f7, // Primary purple
  0xc084fc, // Light purple
  0x7c3aed, // Violet
  0xe879f9, // Pink accent
  0x8b5cf6  // Medium purple
];

// Create floating cubes
function createCube(size, x, y, z, color) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: 0.7,
    shininess: 100,
    emissive: color,
    emissiveIntensity: 0.3
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);
  cube.userData = {
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    },
    floatSpeed: Math.random() * 0.01 + 0.005,
    floatOffset: Math.random() * Math.PI * 2,
    originalY: y
  };
  return cube;
}

// Create floating octahedrons
function createOctahedron(size, x, y, z, color) {
  const geometry = new THREE.OctahedronGeometry(size);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: 0.6,
    shininess: 150,
    emissive: color,
    emissiveIntensity: 0.2,
    wireframe: Math.random() > 0.5
  });
  const octa = new THREE.Mesh(geometry, material);
  octa.position.set(x, y, z);
  octa.userData = {
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.015,
      y: (Math.random() - 0.5) * 0.015,
      z: (Math.random() - 0.5) * 0.015
    },
    floatSpeed: Math.random() * 0.008 + 0.003,
    floatOffset: Math.random() * Math.PI * 2,
    originalY: y
  };
  return octa;
}

// Create floating icosahedrons (like gemstones)
function createIcosahedron(size, x, y, z, color) {
  const geometry = new THREE.IcosahedronGeometry(size);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    shininess: 200,
    emissive: color,
    emissiveIntensity: 0.25
  });
  const ico = new THREE.Mesh(geometry, material);
  ico.position.set(x, y, z);
  ico.userData = {
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01
    },
    floatSpeed: Math.random() * 0.006 + 0.002,
    floatOffset: Math.random() * Math.PI * 2,
    originalY: y
  };
  return ico;
}

// Create torus (ring shapes)
function createTorus(radius, tube, x, y, z, color) {
  const geometry = new THREE.TorusGeometry(radius, tube, 16, 50);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: 0.4,
    shininess: 100,
    emissive: color,
    emissiveIntensity: 0.2
  });
  const torus = new THREE.Mesh(geometry, material);
  torus.position.set(x, y, z);
  torus.userData = {
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.012,
      z: 0
    },
    floatSpeed: Math.random() * 0.005 + 0.002,
    floatOffset: Math.random() * Math.PI * 2,
    originalY: y
  };
  return torus;
}

// Create particle field
function createParticles() {
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 50;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x8b5cf6,
    size: 0.4,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });

  return new THREE.Points(geometry, material);
}

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x8b5cf6, 1.2, 100);
pointLight1.position.set(20, 20, 20);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xa78bfa, 1, 100);
pointLight2.position.set(-20, -20, 10);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0x6d28d9, 0.8, 100);
pointLight3.position.set(0, 30, -20);
scene.add(pointLight3);

// Generate random shapes
function generateShapes() {
  // Create cubes
  for (let i = 0; i < 6; i++) {
    const size = Math.random() * 2 + 1;
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 20 - 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const cube = createCube(size, x, y, z, color);
    shapes.push(cube);
    scene.add(cube);
  }

  // Create octahedrons
  for (let i = 0; i < 5; i++) {
    const size = Math.random() * 1.5 + 0.8;
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 20 - 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const octa = createOctahedron(size, x, y, z, color);
    shapes.push(octa);
    scene.add(octa);
  }

  // Create icosahedrons
  for (let i = 0; i < 4; i++) {
    const size = Math.random() * 1.2 + 0.5;
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 20 - 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const ico = createIcosahedron(size, x, y, z, color);
    shapes.push(ico);
    scene.add(ico);
  }

  // Create torus rings
  for (let i = 0; i < 3; i++) {
    const radius = Math.random() * 2 + 1.5;
    const tube = Math.random() * 0.3 + 0.1;
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 20 - 15;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const torus = createTorus(radius, tube, x, y, z, color);
    shapes.push(torus);
    scene.add(torus);
  }

  // Add particle field
  const particleField = createParticles();
  scene.add(particleField);
  particles.push(particleField);
}

generateShapes();

// Mouse movement for parallax
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

document.addEventListener('mousemove', (event) => {
  targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// Animation loop
let time = 0;

function animate() {
  requestAnimationFrame(animate);

  time += 0.01;

  // Smooth mouse following
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  // Camera subtle movement based on mouse
  camera.position.x = mouseX * 5;
  camera.position.y = -mouseY * 3;
  camera.lookAt(0, 0, 0);

  // Animate shapes
  shapes.forEach((shape) => {
    // Rotation
    shape.rotation.x += shape.userData.rotationSpeed.x;
    shape.rotation.y += shape.userData.rotationSpeed.y;
    shape.rotation.z += shape.userData.rotationSpeed.z;

    // Floating motion
    shape.position.y = shape.userData.originalY +
      Math.sin(time * shape.userData.floatSpeed * 100 + shape.userData.floatOffset) * 2;
  });

  // Animate particles
  particles.forEach((particleSystem) => {
    particleSystem.rotation.y += 0.0003;
    particleSystem.rotation.x += 0.0001;
  });

  // Animate lights
  pointLight1.position.x = Math.sin(time) * 25;
  pointLight1.position.y = Math.cos(time * 0.5) * 25;

  pointLight2.position.x = Math.cos(time * 0.7) * 25;
  pointLight2.position.y = Math.sin(time * 0.8) * 25;

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add scroll-based animation
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = scrollY / maxScroll;

  // Move camera deeper as user scrolls
  camera.position.z = 30 + scrollPercent * 20;

  // Rotate all shapes slightly based on scroll
  shapes.forEach((shape, index) => {
    shape.rotation.y += scrollPercent * 0.001 * (index % 2 === 0 ? 1 : -1);
  });
});

console.log('✨ Three.js 3D scene initialized for StoreX');
