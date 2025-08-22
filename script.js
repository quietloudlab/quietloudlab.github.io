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
let mouseMoved = false;

// Cache DOM elements
const letters = Array.from(document.querySelectorAll('#splash span')).slice(0, -3);
const descriptions = document.querySelectorAll('.description');
const logo = document.querySelector('.logo');
const modal = document.getElementById('contactModal');
const floatingBtn = document.getElementById('floatingInfoBtn');
const video = document.querySelector('.background-video');
const glassPanes = [];

// Canvas pixelation system
let pixelationCanvas;
let pixelationCtx;
let sourceCanvas;
let sourceCtx;

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

// Initialize canvas pixelation system
function initPixelationSystem() {
  // Create source canvas to capture video frames
  sourceCanvas = document.createElement('canvas');
  sourceCtx = sourceCanvas.getContext('2d');
  sourceCanvas.width = window.innerWidth;
  sourceCanvas.height = window.innerHeight;
  
  // Create pixelation canvas
  pixelationCanvas = document.createElement('canvas');
  pixelationCtx = pixelationCanvas.getContext('2d');
}

// Create pixelated effect for a glass pane
function createPixelatedCanvas(pane, index) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Get pane position and size
  const rect = pane.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  
  // Determine pixelation level based on nth-child pattern - MORE INTENSE
  let pixelSize;
  if (index % 7 === 0) pixelSize = 3; // Light pixelation
  else if (index % 5 === 1) pixelSize = 8; // Medium pixelation
  else if (index % 11 === 2) pixelSize = 12; // Heavy pixelation
  else if (index % 13 === 3) pixelSize = 6; // Medium-light
  else if (index % 8 === 4) pixelSize = 15; // Very heavy pixelation
  else if (index % 17 === 5) pixelSize = 4; // Light-medium
  else pixelSize = 20; // Extremely chunky
  
  // Store canvas and pixelation settings on pane
  pane.canvas = canvas;
  pane.canvasCtx = ctx;
  pane.pixelSize = pixelSize;
  pane.appendChild(canvas);
  
  return canvas;
}

// Update pixelated content for a glass pane
function updatePixelatedPane(pane) {
  if (!pane.canvas || !video.videoWidth) return;
  
  const rect = pane.getBoundingClientRect();
  const ctx = pane.canvasCtx;
  const pixelSize = pane.pixelSize;
  
  // Clear canvas
  ctx.clearRect(0, 0, pane.canvas.width, pane.canvas.height);
  
  try {
    // Draw the background video section that's behind this pane
    const scaleX = video.videoWidth / window.innerWidth;
    const scaleY = video.videoHeight / window.innerHeight;
    
    const sourceX = rect.left * scaleX;
    const sourceY = rect.top * scaleY;
    const sourceWidth = rect.width * scaleX;
    const sourceHeight = rect.height * scaleY;
    
    // Draw video section to temporary small canvas for pixelation
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const pixelatedWidth = Math.max(1, Math.floor(rect.width / pixelSize));
    const pixelatedHeight = Math.max(1, Math.floor(rect.height / pixelSize));
    
    tempCanvas.width = pixelatedWidth;
    tempCanvas.height = pixelatedHeight;
    
    // Draw downscaled version
    tempCtx.drawImage(
      video,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, pixelatedWidth, pixelatedHeight
    );
    
    // Disable image smoothing for pixelated effect
    ctx.imageSmoothingEnabled = false;
    
    // Draw upscaled to create pixelated effect
    ctx.drawImage(
      tempCanvas,
      0, 0, pixelatedWidth, pixelatedHeight,
      0, 0, rect.width, rect.height
    );
    
  } catch (error) {
    // Fallback if video isn't ready
    ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
    ctx.fillRect(0, 0, pane.canvas.width, pane.canvas.height);
  }
}

// Update glass panes with hover intensification
function updateGlassPanes() {
  if (!mouseMoved) return;
  
  glassPanes.forEach((pane, index) => {
    const rect = pane.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
    const effect = Math.max(0, 1 - distance / 300) * CONFIG.GLASS_REACTIVITY;
    
    if (effect > 0.05) {
      pane.classList.add('refracting');
      
      // Intensify the pixelated effect on hover
      if (pane.canvas) {
        // Create more intense pixelation by reducing pixel size
        const originalPixelSize = pane.pixelSize;
        pane.pixelSize = Math.max(1, Math.floor(originalPixelSize * 0.5)); // Make pixels finer
        updatePixelatedPane(pane);
        pane.pixelSize = originalPixelSize; // Reset for next update
      }
      
    } else {
      pane.classList.remove('refracting');
    }
  });
  
  mouseMoved = false;
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

// Scroll handler (simplified - no visibility logic)
function handleScroll() {
  const currentScrollY = window.scrollY;
  scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
  lastScrollY = currentScrollY;
}

// Event handlers
function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseMoved = true;
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
let lastFocusedElement = null;
function trapFocusInModal(e) {
  if (!modal.classList.contains('active')) return;
  const focusable = modal.querySelectorAll('input, textarea, button, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}
function toggleModal() {
  if (modal.classList.contains('active')) {
    modal.classList.remove('active');
    floatingBtn.classList.remove('modal-active');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
    document.removeEventListener('keydown', trapFocusInModal);
  } else {
    lastFocusedElement = document.activeElement;
    modal.classList.add('active');
    floatingBtn.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
    // Move focus to first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input, textarea, button');
      if (firstInput) firstInput.focus();
    }, 50);
    document.addEventListener('keydown', trapFocusInModal);
  }
}

function closeModal() {
  modal.classList.remove('active');
  floatingBtn.classList.remove('modal-active');
  document.body.style.overflow = '';
  if (lastFocusedElement) lastFocusedElement.focus();
  document.removeEventListener('keydown', trapFocusInModal);
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
    
    // Create pixelated canvas for each pane immediately
    createPixelatedCanvas(pane, i);
  }
  
  // Initial render of all pixelated panes
  setTimeout(() => {
    glassPanes.forEach(pane => updatePixelatedPane(pane));
  }, 100);
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
  // Update ARIA live region if present
  const feedbackLive = form.parentNode.querySelector('#contactFormFeedback');
  if (feedbackLive) feedbackLive.textContent = message;
  setTimeout(() => {
    div.remove();
    if (feedbackLive) feedbackLive.textContent = '';
  }, 5000);
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
  initPixelationSystem();
  createGlassGrid();
  
  // Periodic update of pixelated content to keep video in sync
  setInterval(() => {
    if (video && video.videoWidth) {
      glassPanes.forEach(pane => {
        if (pane.canvas && !pane.classList.contains('refracting')) {
          updatePixelatedPane(pane);
        }
      });
    }
  }, 100); // Update every 100ms for smooth video sync
  
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
  
  // Add event listener for 'say hi' link to open modal
  const sayHiLink = document.getElementById('sayHiLink');
  if (sayHiLink) {
    sayHiLink.addEventListener('click', function(e) {
      e.preventDefault();
      toggleModal();
    });
  }
  
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
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
