const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Fullscreen canvas
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Binary characters
const binary = '01';
const chars = binary.split('');

// Font size and number of columns
const fontSize = 14;
const columns = canvas.width / fontSize;

// Drops for each column
const drops = Array(Math.floor(columns)).fill(1);

// Draw function
function draw() {
  // Semi-transparent background to create trailing effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0F0'; // Matrix green
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Send drop back to top randomly
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

// Draw every 33ms (~30 frames per second)
setInterval(draw, 33);

// Handle screen resize
window.addEventListener('resize', () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
