/**
 * Simplified Interactive Text Distortion
 * Clean, efficient implementation with all core features
 */

// Configuration
const CONFIG = {
  MOUSE_RANGE: 250,
  WEIGHT_MIN: 60,
  WEIGHT_MAX: 200,
  DECAY_RATE: 0.99,
  HOVER_INTENSITY: 3,
  GLASS_REACTIVITY: 1,
  RAINBOW_INTENSITY: 2
};

// Simple state
let mouseX = 0, mouseY = 0;
let clickEffect = 0, keyboardEffect = 0;
let isHovering = false, hoverIntensity = 0;
let animationId = null;
let lastScrollY = 0;
let scrollDirection = 'down';

// Cache DOM elements
const letters = Array.from(document.querySelectorAll('#splash span')).slice(0, -3);
const descriptions = document.querySelectorAll('.description');
const logo = document.querySelector('.logo');
const modal = document.getElementById('contactModal');
const floatingBtn = document.getElementById('floatingInfoBtn');
const video = document.querySelector('.background-video');
const glassPanes = [];

// Simple effect calculation
function calculateEffect(letter, index, time) {
  const rect = letter.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
  const proximity = Math.max(0, 1 - distance / CONFIG.MOUSE_RANGE);
  
  const hoverEffect = isHovering ? hoverIntensity * CONFIG.HOVER_INTENSITY : 0;
  const totalEffect = proximity * 35 + hoverEffect * 25;
  
  const clickPulse = clickEffect * 25;
  const keyboardRipple = Math.sin(time * 15 + index * 0.5) * 20 * keyboardEffect;
  
  return {
    weight: Math.max(CONFIG.WEIGHT_MIN, Math.min(CONFIG.WEIGHT_MAX, 
      60 + totalEffect + clickPulse + keyboardRipple)),
    distortion: Math.max(0, Math.min(90, totalEffect * 0.8 + clickPulse * 0.6 + keyboardRipple * 0.8)),
    intensity: proximity
  };
}

// Update letter appearance
function updateLetter(letter, weight, distortion, intensity) {
  const supportsVariation = CSS.supports('font-variation-settings', '"wght" 100');
  
  if (supportsVariation) {
    letter.style.fontVariationSettings = `"wght" ${weight.toFixed(1)}, "DIST" ${distortion.toFixed(1)}`;
  } else {
    letter.style.fontWeight = Math.round(weight);
    letter.style.transform = `scaleX(${1 + distortion / 100})`;
  }
  
  // Rainbow/glow effect
  if (distortion > 5) {
    const rainbow = Math.min(1, (distortion - 5) / 20) * CONFIG.RAINBOW_INTENSITY;
    const red = Math.sin(distortion * 0.1) * 2 * rainbow;
    const blue = Math.cos(distortion * 0.1) * 2 * rainbow;
    
    letter.style.textShadow = `
      ${red}px 0 4px rgba(255, 100, 100, ${0.3 * rainbow}),
      ${blue}px 0 4px rgba(100, 100, 255, ${0.3 * rainbow}),
      0 0 ${4 + rainbow * 8}px rgba(255, 255, 255, ${0.2 + rainbow * 0.3})
    `;
  } else if (intensity > 0.02) {
    const glow = Math.min(1, intensity * 2);
    letter.style.textShadow = `0 0 ${4 + glow * 8}px rgba(255, 255, 255, ${0.2 + glow * 0.3})`;
  } else {
    letter.style.textShadow = '';
  }
}

// Update glass panes
function updateGlassPanes() {
  glassPanes.forEach(pane => {
    const rect = pane.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
    const effect = Math.max(0, 1 - distance / 300) * CONFIG.GLASS_REACTIVITY;
    
    if (effect > 0.05) {
      pane.classList.add('refracting');
      pane.style.opacity = Math.min(1, 0.8 + effect * 0.3);
    } else {
      pane.classList.remove('refracting');
      pane.style.opacity = '';
    }
  });
}

// Main animation loop
function animate(timestamp) {
  const time = timestamp * 0.001;
  
  // Decay effects
  clickEffect *= CONFIG.DECAY_RATE;
  keyboardEffect *= CONFIG.DECAY_RATE;
  
  // Update hover intensity
  if (isHovering) {
    hoverIntensity = Math.min(1, hoverIntensity + 0.4);
  } else {
    hoverIntensity *= 0.6;
  }
  
  // Update letters
  letters.forEach((letter, index) => {
    const effect = calculateEffect(letter, index, time);
    updateLetter(letter, effect.weight, effect.distortion, effect.intensity);
  });
  
  // Update glass panes
  updateGlassPanes();
  
  animationId = requestAnimationFrame(animate);
}

// Scroll reveal with direction awareness
function handleScroll() {
  const currentScrollY = window.scrollY;
  scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
  lastScrollY = currentScrollY;
  
  const triggerY = window.innerHeight * 0.7;
  const exitY = window.innerHeight * 0.3;
  
  descriptions.forEach((desc, index) => {
    // Skip the final line as it has its own animation
    if (desc.classList.contains('final-line')) return;
    
    const rect = desc.getBoundingClientRect();
    const isInView = rect.top < triggerY && rect.bottom > exitY;
    const wasInView = desc.classList.contains('revealed');
    
    if (isInView && !wasInView) {
      // Fade in with staggered delay
      setTimeout(() => {
        desc.classList.add('revealed');
        desc.classList.remove('exiting');
      }, index * 60);
    } else if (!isInView && wasInView) {
      // Fade out when scrolling away (faster for scroll up)
      const delay = scrollDirection === 'up' ? 0 : index * 30;
      setTimeout(() => {
        desc.classList.remove('revealed');
        desc.classList.add('exiting');
      }, delay);
    }
  });
  
  // Final line and logo coordinated animation
  const finalLine = document.querySelector('.final-line');
  if (logo && finalLine) {
    const logoRect = logo.getBoundingClientRect();
    const finalLineRect = finalLine.getBoundingClientRect();
    const triggerY = window.innerHeight * 0.8;
    
    const logoIsInView = logoRect.top < triggerY && logoRect.bottom > 0;
    const finalLineIsInView = finalLineRect.top < triggerY && finalLineRect.bottom > 0;
    
    const logoWasInView = logo.classList.contains('revealed');
    const finalLineWasInView = finalLine.classList.contains('revealed');
    
    if (logoIsInView && finalLineIsInView && !logoWasInView && !finalLineWasInView) {
      // Both appear together with a slight delay for closeout effect
      setTimeout(() => {
        finalLine.classList.add('revealed');
        finalLine.classList.remove('exiting');
        logo.classList.add('revealed');
      }, 200);
    } else if ((!logoIsInView || !finalLineIsInView) && (logoWasInView || finalLineWasInView)) {
      // Both fade out when scrolling away
      finalLine.classList.remove('revealed');
      finalLine.classList.add('exiting');
      logo.classList.remove('revealed');
    }
  }
}

// Event handlers
function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function handleMouseEnter() {
  isHovering = true;
  if (video) video.classList.add('hover-active');
}

function handleMouseLeave() {
  isHovering = false;
  if (video) video.classList.remove('hover-active');
}

function handleClick() {
  clickEffect = 1.0;
}

function handleKeyDown() {
  const now = Date.now();
  const timeSinceLastKey = now - (handleKeyDown.lastTime || 0);
  
  if (timeSinceLastKey < 500) {
    keyboardEffect = Math.min(1.0, keyboardEffect + 0.3);
  } else if (timeSinceLastKey < 2000) {
    keyboardEffect = Math.min(1.0, keyboardEffect + 0.15);
  } else {
    keyboardEffect = 0.6;
  }
  
  handleKeyDown.lastTime = now;
}

// Modal functions
function toggleModal() {
  if (modal.classList.contains('active')) {
    modal.classList.remove('active');
    floatingBtn.classList.remove('modal-active');
    document.body.style.overflow = '';
  } else {
    modal.classList.add('active');
    floatingBtn.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  modal.classList.remove('active');
  floatingBtn.classList.remove('modal-active');
  document.body.style.overflow = '';
}

// Effect controls UI
function createEffectControls() {
  const existing = document.getElementById('effectControls');
  if (existing) existing.remove();

  const ui = document.createElement('div');
  ui.id = 'effectControls';
  ui.style.cssText = `
    position: fixed; top: 20px; left: 20px; z-index: 10000;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.2); border-radius: 12px;
    padding: 20px; color: white; font-family: Arial, sans-serif; font-size: 12px;
    min-width: 280px; max-height: 80vh; overflow-y: auto;
  `;

  const controls = [
    { key: 'MOUSE_RANGE', label: 'Mouse Range', min: 100, max: 500, step: 10 },
    { key: 'WEIGHT_MAX', label: 'Max Weight', min: 60, max: 200, step: 5 },
    { key: 'DECAY_RATE', label: 'Decay Rate', min: 0.1, max: 0.99, step: 0.01 },
    { key: 'HOVER_INTENSITY', label: 'Hover Intensity', min: 0.5, max: 3, step: 0.1 },
    { key: 'GLASS_REACTIVITY', label: 'Glass Reactivity', min: 0, max: 1, step: 0.05 },
    { key: 'RAINBOW_INTENSITY', label: 'Rainbow Intensity', min: 0, max: 2, step: 0.1 }
  ];

  ui.innerHTML = `
    <div style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px;">
      <h3 style="margin: 0 0 10px 0; font-size: 14px;">Effect Controls</h3>
      <p style="margin: 0; opacity: 0.8; font-size: 11px;">Adjust sliders to find your perfect combination</p>
    </div>
    ${controls.map(c => `
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">
          ${c.label}: <span id="${c.key}Value">${CONFIG[c.key]}</span>
        </label>
        <input type="range" id="${c.key}Slider" min="${c.min}" max="${c.max}" step="${c.step}" 
               value="${CONFIG[c.key]}" style="width: 100%; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.2); outline: none;">
      </div>
    `).join('')}
    <div style="margin-top: 20px; display: flex; gap: 10px;">
      <button id="resetBtn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 11px;">Reset</button>
      <button id="copyBtn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 11px;">Copy Config</button>
      <button id="closeBtn" style="background: rgba(255,100,100,0.2); border: 1px solid rgba(255,100,100,0.4); color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 11px;">Close</button>
    </div>
  `;

  document.body.appendChild(ui);

  // Event listeners
  controls.forEach(c => {
    const slider = document.getElementById(`${c.key}Slider`);
    const value = document.getElementById(`${c.key}Value`);
    
    slider.addEventListener('input', e => {
      CONFIG[c.key] = parseFloat(e.target.value);
      value.textContent = CONFIG[c.key].toFixed(c.step < 0.1 ? 2 : 1);
    });
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    Object.assign(CONFIG, {
      MOUSE_RANGE: 250, WEIGHT_MAX: 200, DECAY_RATE: 0.99,
      HOVER_INTENSITY: 3, GLASS_REACTIVITY: 1, RAINBOW_INTENSITY: 2
    });
    controls.forEach(c => {
      document.getElementById(`${c.key}Slider`).value = CONFIG[c.key];
      document.getElementById(`${c.key}Value`).textContent = CONFIG[c.key].toFixed(c.step < 0.1 ? 2 : 1);
    });
  });

  document.getElementById('copyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(CONFIG, null, 2));
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'Copied!';
    btn.style.background = 'rgba(100,255,100,0.2)';
    setTimeout(() => {
      btn.textContent = 'Copy Config';
      btn.style.background = 'rgba(255,255,255,0.1)';
    }, 2000);
  });

  document.getElementById('closeBtn').addEventListener('click', () => ui.remove());
}

// Create glass grid
function createGlassGrid() {
  const container = document.getElementById('glassPaneGrid');
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  const paneSize = window.innerWidth <= 480 ? 120 : window.innerWidth <= 768 ? 100 : 150;
  const cols = Math.ceil(rect.width / paneSize);
  const rows = Math.ceil(rect.height / paneSize);
  
  container.innerHTML = '';
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  container.style.gap = '0';
  
  glassPanes.length = 0;
  
  for (let i = 0; i < rows * cols; i++) {
    const pane = document.createElement('div');
    pane.className = 'glass-pane';
    pane.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(pane);
    glassPanes.push(pane);
  }
}

// Form handling
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  const mobileButton = document.querySelector('.submit-btn-mobile');
  
  // Handle both desktop and mobile buttons
  const buttons = [button, mobileButton].filter(Boolean);
  const originalTexts = buttons.map(btn => btn.innerHTML);
  
  buttons.forEach(btn => {
    btn.innerHTML = 'Sending...';
    btn.disabled = true;
  });
  
  try {
    // Check if Botpoison is loaded
    if (typeof Botpoison === 'undefined') {
      throw new Error('Botpoison library not loaded');
    }
    
    // Get Botpoison instance for this form
    const botpoisonElement = form.querySelector('.botpoison');
    if (!botpoisonElement) {
      throw new Error('Botpoison element not found');
    }
    
    const botpoison = new Botpoison({
      publicKey: botpoisonElement.dataset.publicKey
    });
    
    // Solve the challenge
    const { solution } = await botpoison.challenge();
    
    // Prepare form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data._redirect = false;
    
    // Add Botpoison solution to the data
    data._botpoison = solution;
    
    // Submit the form
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      showMessage(form, 'Thank you! Your message has been sent successfully.', 'success');
      form.reset();
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showMessage(form, 'Sorry, there was an error. Please try again or contact us directly.', 'error');
  } finally {
    buttons.forEach((btn, index) => {
      btn.innerHTML = originalTexts[index];
      btn.disabled = false;
    });
  }
}

function showMessage(form, message, type) {
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="
      background: ${type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
      border: 1px solid ${type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
      color: ${type === 'success' ? '#4CAF50' : '#F44336'};
      padding: 1rem; border-radius: 8px; margin: 1rem 0;
    ">${message}</div>
  `;
  
  form.parentNode.insertBefore(div, form.nextSibling);
  setTimeout(() => div.remove(), 5000);
}

// Initialize video
function initVideo() {
  if (!video) return;
  
  video.load();
  video.addEventListener('loadeddata', () => {
    video.play().catch(() => {
      document.addEventListener('click', () => video.play().catch(console.log), { once: true });
    });
  });
  
  if (video.readyState >= 2) {
    video.play().catch(console.log);
  }
}

// Initialize everything
function init() {
  initVideo();
  createGlassGrid();
  
  // Event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('scroll', handleScroll, { passive: true });
  
  const splashTitle = document.getElementById('splash');
  if (splashTitle) {
    splashTitle.addEventListener('mouseenter', handleMouseEnter);
    splashTitle.addEventListener('mouseleave', handleMouseLeave);
  }
  
  if (floatingBtn) floatingBtn.addEventListener('click', toggleModal);
  
  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }
  
  const emailForm = document.querySelector('.signup-form');
  const contactForm = document.querySelector('.contact-form-inner');
  
  if (emailForm) emailForm.addEventListener('submit', handleFormSubmit);
  if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
  
  // Resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createGlassGrid();
    }, 150);
  });
  
  // Keyboard shortcut for controls
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      createEffectControls();
    }
  });
  
  // Start animation
  animationId = requestAnimationFrame(animate);
  
  // Initial scroll check
  setTimeout(handleScroll, 100);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
