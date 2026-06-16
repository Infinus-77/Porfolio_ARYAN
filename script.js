// --- Nav Active State & Hamburger ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-center a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if(rect.top <= 200){
      current = sec.getAttribute('id');
    }
  });
  
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
    current = sections[sections.length - 1].getAttribute('id');
  }

  navLinks.forEach(a => {
    a.classList.remove('active');
    if(current && a.getAttribute('href') === '#' + current){
      a.classList.add('active');
    }
  });
});

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// --- Speed Lines ---
const speedLinesContainer = document.getElementById('speed-lines');
for(let i=0; i<20; i++){
  const line = document.createElement('div');
  line.className = 'speed-line';
  line.style.top = Math.random() * 100 + '%';
  line.style.width = Math.floor(Math.random() * 120 + 80) + 'px';
  line.style.height = Math.random() > 0.5 ? '2px' : '1px';
  line.style.animationDuration = (Math.random() * 2.5 + 1.5) + 's';
  line.style.animationDelay = (Math.random() * 3) + 's';
  speedLinesContainer.appendChild(line);
}

// --- Typewriter ---
const roles = ["Full Stack Developer", "Co-Founder @ Syntax Syndicate"];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
const twText = document.getElementById('typewriter-text');

function type(){
  const currentRole = roles[roleIdx];
  if(isDeleting){
    twText.textContent = currentRole.substring(0, charIdx - 1);
    charIdx--;
  } else {
    twText.textContent = currentRole.substring(0, charIdx + 1);
    charIdx++;
  }

  let speed = isDeleting ? 40 : 80;

  if(!isDeleting && charIdx === currentRole.length){
    speed = 2000;
    isDeleting = true;
  } else if(isDeleting && charIdx === 0){
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    speed = 500;
  }
  setTimeout(type, speed);
}
type();

// --- Three.js Badge ---
if(window.innerWidth > 768){
  const container = document.getElementById('hero-badge');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4;
  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize(200, 200);
  container.appendChild(renderer.domElement);

  // Create texture for card
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#111';
  ctx.fillRect(0,0,256,256);
  ctx.strokeStyle = '#FDD000';
  ctx.lineWidth = 4;
  ctx.strokeRect(4,4,248,248);
  ctx.fillStyle = '#FDD000';
  ctx.font = 'bold 80px "Yanone Kaffeesatz"';
  ctx.textAlign = 'center';
  ctx.fillText('#14', 128, 120);
  ctx.font = '30px "Yanone Kaffeesatz"';
  ctx.fillText('ALONSO', 128, 170);

  const texture = new THREE.CanvasTexture(canvas);
  const geometry = new THREE.BoxGeometry(2, 2.4, 0.15);
  const material = new THREE.MeshStandardMaterial({
    color: 0x111111,
    map: texture,
    roughness: 0.5,
    metalness: 0.8
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const light = new THREE.PointLight(0xFDD000, 1, 10);
  light.position.set(2, 3, 2);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x333333));

  function animate(){
    requestAnimationFrame(animate);
    cube.rotation.y += 0.008;
    renderer.render(scene, camera);
  }
  animate();
}

// --- Intersection Observer for Reveal, Skills, Tacho ---
const observerOptions = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      
      // Handle staggered items if it's a stagger container
      if(entry.target.classList.contains('stagger-container') || entry.target.querySelector('.stagger-container')) {
          const container = entry.target.classList.contains('stagger-container') ? entry.target : entry.target.querySelector('.stagger-container');
          const items = container.querySelectorAll('.stagger-item');
          items.forEach((item, idx) => {
              setTimeout(() => {
                  item.classList.add('visible');
              }, idx * 100);
          });
      }
      
      // Animate F1 Steering Wheel Dash
      if(entry.target.id === 'skills'){
        // --- Build RPM LEDs ---
        const strip = document.getElementById('rpm-strip');
        const totalLeds = 30;
        if(strip && strip.children.length === 0){
          for(let i = 0; i < totalLeds; i++){
            const led = document.createElement('div');
            led.className = 'rpm-led';
            strip.appendChild(led);
          }
        }
        // Light up LEDs sequentially
        const leds = strip.querySelectorAll('.rpm-led');
        leds.forEach((led, i) => {
          setTimeout(() => {
            if(i < 10) led.classList.add('lit-green');
            else if(i < 18) led.classList.add('lit-yellow');
            else if(i < 26) led.classList.add('lit-red');
            else led.classList.add('lit-blue');
          }, i * 50);
        });

        // --- Animate Gear Number (N -> 1 -> ... -> 8) ---
        const gearEl = document.getElementById('gear-num');
        const gears = ['N','1','2','3','4','5','6','7','8'];
        gears.forEach((g, i) => {
          setTimeout(() => { gearEl.textContent = g; }, i * 200);
        });

        // --- Animate Dash Cells ---
        const cells = document.querySelectorAll('.dash-cell');
        cells.forEach((cell, i) => {
          const val = parseInt(cell.getAttribute('data-val'));
          const pctEl = cell.querySelector('.cell-pct');
          const barEl = cell.querySelector('.cell-bar');
          // Build 10 segments
          if(barEl && barEl.children.length === 0){
            for(let s = 0; s < 10; s++){
              const seg = document.createElement('div');
              seg.className = 'cell-seg';
              barEl.appendChild(seg);
            }
          }
          setTimeout(() => {
            cell.classList.add('active');
            // Light up segments
            const segs = barEl.querySelectorAll('.cell-seg');
            const litCount = Math.round(val / 10);
            segs.forEach((seg, si) => {
              setTimeout(() => {
                if(si < litCount) seg.classList.add('on');
              }, si * 80);
            });
            // Animate percentage counter
            let cur = 0;
            const inc = val / 40;
            const timer = setInterval(() => {
              cur += inc;
              if(cur >= val){ cur = val; clearInterval(timer); }
              pctEl.textContent = Math.floor(cur) + '% THROTTLE';
            }, 25);
          }, i * 250);
        });

        observer.unobserve(entry.target);
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal, #skills, .stagger-container').forEach(el => {
  observer.observe(el);
});

// --- Custom F1 Cursor ---
// Removed cursor changing based on era to keep only one color