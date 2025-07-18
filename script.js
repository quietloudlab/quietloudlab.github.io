/**
 * Simple Interactive Text Distortion
 * Clean, efficient version focusing on core functionality
 */

// Simple configuration
const CONFIG = {
  MOUSE_RANGE: 300,
  WEIGHT_MIN: 60,
  WEIGHT_MAX: 180,
  WEIGHT_BASELINE: 60,
  DISTORTION_MIN: 0,
  DISTORTION_MAX: 80,
  DISTORTION_BASELINE: 0,
  DECAY_RATE: 0.85
};

// Simple state management
let state = {
  mouseX: 0,
  mouseY: 0,
  clickEffect: 0,
  keyboardEffect: 0,
  lastKeyTime: 0
};

// Cache DOM elements
const allLetters = document.querySelectorAll('#splash span');
const letters = Array.from(allLetters).slice(0, -3); // Exclude last 3 letters (l, a, b)
const descriptions = document.querySelectorAll('.description');
const modal = document.getElementById('contactModal');
const floatingBtn = document.getElementById('floatingInfoBtn');

// Simple mouse effect calculation
function calculateMouseEffect(mouseX, mouseY, letterRect, index, time) {
  const dx = mouseX - (letterRect.left + letterRect.width / 2);
  const dy = mouseY - (letterRect.top + letterRect.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > CONFIG.MOUSE_RANGE) {
    return { weight: 0, distortion: 0 };
  }
  
  const falloff = Math.max(0, 1 - (distance / CONFIG.MOUSE_RANGE));
  const wave = Math.sin(time + index * 0.5) * 15 * falloff;
  
  return {
    weight: CONFIG.WEIGHT_BASELINE + wave * 30,
    distortion: CONFIG.DISTORTION_BASELINE + wave * 25
  };
}

// Simple baseline effects
function calculateBaselineEffects(index, time) {
  const clickWave = Math.sin(time * 15 + index * 0.3) * 25 * state.clickEffect;
  const keyboardWave = Math.sin(time * 20 + index * 0.4) * 30 * state.keyboardEffect;
  
  return {
    weight: CONFIG.WEIGHT_BASELINE + clickWave + keyboardWave,
    distortion: CONFIG.DISTORTION_BASELINE + clickWave + keyboardWave
  };
}

// Update letter styles
function updateLetter(letter, weight, distortion) {
  const supportsVariation = CSS.supports('font-variation-settings', '"wght" 100');
  
  if (supportsVariation) {
    letter.style.fontVariationSettings = `"wght" ${weight.toFixed(1)}, "DIST" ${distortion.toFixed(1)}`;
  } else {
    letter.style.fontWeight = Math.round(weight);
    letter.style.transform = `scaleX(${1 + distortion / 100})`;
  }
}

// Main animation loop
function animate(timestamp) {
  const time = timestamp * 0.001;
  
  // Decay effects
  state.clickEffect *= CONFIG.DECAY_RATE;
  state.keyboardEffect *= CONFIG.DECAY_RATE;
  
  // Update letters
  letters.forEach((letter, index) => {
    const rect = letter.getBoundingClientRect();
    
    // Calculate effects
    const mouseEffect = calculateMouseEffect(state.mouseX, state.mouseY, rect, index, time);
    const baselineEffect = calculateBaselineEffects(index, time);
    
    // Combine effects
    const finalWeight = Math.max(CONFIG.WEIGHT_MIN, Math.min(CONFIG.WEIGHT_MAX, 
      baselineEffect.weight + mouseEffect.weight));
    const finalDistortion = Math.max(CONFIG.DISTORTION_MIN, Math.min(CONFIG.DISTORTION_MAX, 
      baselineEffect.distortion + mouseEffect.distortion));
    
    updateLetter(letter, finalWeight, finalDistortion);
  });
  
  requestAnimationFrame(animate);
}

// Event handlers
function handleMouseMove(e) {
  state.mouseX = e.clientX;
  state.mouseY = e.clientY;
}

function handleClick() {
  state.clickEffect = 1.0;
}

function handleKeyDown() {
  const now = Date.now();
  const timeSinceLastKey = now - state.lastKeyTime;
  
  if (timeSinceLastKey < 1000) {
    state.keyboardEffect = Math.min(1.0, state.keyboardEffect + 0.3);
  } else {
    state.keyboardEffect = 0.5;
  }
  
  state.lastKeyTime = now;
}

function handleScroll() {
  const windowHeight = window.innerHeight;
  const triggerOffset = windowHeight * 0.8;
  
  descriptions.forEach(description => {
    if (description.classList.contains('revealed')) return;
    
    const rect = description.getBoundingClientRect();
    if (rect.top < triggerOffset && rect.bottom > 0) {
      description.classList.add('revealed');
    }
  });
}

// Modal management
function toggleModal() {
  if (modal.classList.contains('active')) {
    closeModal();
  } else {
    openModal();
  }
}

function openModal() {
  modal.classList.add('active');
  floatingBtn.classList.add('modal-active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  floatingBtn.classList.remove('modal-active');
  document.body.style.overflow = '';
}

// Simple glass grid
function createGlassGrid() {
  const gridContainer = document.getElementById('glassPaneGrid');
  if (!gridContainer) return;
  
  const containerRect = gridContainer.getBoundingClientRect();
  const paneSize = window.innerWidth <= 768 ? 100 : 150;
  const cols = Math.ceil(containerRect.width / paneSize);
  const rows = Math.ceil(containerRect.height / paneSize);
  
  gridContainer.innerHTML = '';
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gridContainer.style.gap = '0';
  
  for (let i = 0; i < rows * cols; i++) {
    const pane = document.createElement('div');
    pane.className = 'glass-pane';
    pane.style.opacity = 0.7 + Math.random() * 0.3;
    gridContainer.appendChild(pane);
  }
}

// Form handling
function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = 'Sending...';
  submitButton.disabled = true;
  
  // Simple form submission
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  data._redirect = false;
  
  fetch(form.action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      showMessage(form, 'Thank you! Your message has been sent successfully.', 'success');
      form.reset();
    } else {
      throw new Error('Network response was not ok');
    }
  })
  .catch(() => {
    showMessage(form, 'Sorry, there was an error. Please try again or contact us directly.', 'error');
  })
  .finally(() => {
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  });
}

function showMessage(form, message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.innerHTML = `
    <div style="
      background: ${type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
      border: 1px solid ${type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
      color: ${type === 'success' ? '#4CAF50' : '#F44336'};
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
    ">
      ${message}
    </div>
  `;
  
  form.parentNode.insertBefore(messageDiv, form.nextSibling);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Video loading
function initVideo() {
  const video = document.querySelector('.background-video');
  if (!video) return;
  
  // Force video to load and play
  video.load();
  
  // Handle video loading events
  video.addEventListener('loadeddata', () => {
    video.play().catch(e => {
      console.log('Video autoplay failed:', e);
      // Fallback: try to play on user interaction
      document.addEventListener('click', () => {
        video.play().catch(console.log);
      }, { once: true });
    });
  });
  
  // Handle video errors
  video.addEventListener('error', (e) => {
    console.log('Video error:', e);
  });
  
  // Ensure video plays when it can
  if (video.readyState >= 2) {
    video.play().catch(console.log);
  }
}

// Initialize everything
function init() {
  // Initialize video
  initVideo();
  
  // Create glass grid
  createGlassGrid();
  
  // Setup event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('scroll', handleScroll);
  
  // Modal events
  if (floatingBtn) {
    floatingBtn.addEventListener('click', toggleModal);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }
  
  // Form events
  const emailForm = document.querySelector('.signup-form');
  const contactForm = document.querySelector('.contact-form-inner');
  
  if (emailForm) {
    emailForm.addEventListener('submit', handleFormSubmit);
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    setTimeout(createGlassGrid, 150);
  });
  
  // Start animation
  requestAnimationFrame(animate);
  
  // Initial scroll check
  setTimeout(handleScroll, 100);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
