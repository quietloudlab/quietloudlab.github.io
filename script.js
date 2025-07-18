/**
 * Interactive Text Distortion System
 * Production-ready version with performance optimizations
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Circular buffer for frame time tracking (reduces array operations)
 * - Object pooling for DOM rect caching (reduces garbage collection)
 * - Early returns in effect calculations (avoids unnecessary math)
 * - Visibility-based animation pausing (saves CPU when tab is hidden)
 * - Adaptive frame rate based on device capabilities
 * - Frame skipping during inactivity (reduces CPU usage)
 * - Optimized distance calculations (avoids sqrt when possible)
 * - Reduced DOM queries through aggressive caching
 * - Quality-based effect complexity reduction
 * - Activity tracking to pause animations when not needed
 */

// Configuration
const CONFIG = {
  // Mouse interaction
  MOUSE_RANGE: 400,
  MOUSE_FALLOFF: 400,
  
  // Font variable ranges
  WEIGHT: {
    MIN: 60,
    MAX: 140,
    BASELINE: 60
  },
  DISTORTION: {
    MIN: 0,
    MAX: 60,
    BASELINE: 0
  },
  
  // Tilt sensitivity
  TILT_SENSITIVITY: 60,
  
  // Effect decay rates
  DECAY: {
    CLICK: 0.95,
    KEYBOARD: 0.92,
    ORIENTATION: 0.98,
    TAP: 0.92
  },
  
  // Speed thresholds
  SPEED: {
    TYPING_RESET: 1000,
    TAP_RESET: 1000,
    DECAY_DELAY: 500
  },
  
  // Fixed letters (don't animate)
  FIXED_LETTERS: 3,
  
  // Performance optimizations
  THROTTLE: {
    MOUSE: 32, // ~30fps (was 16 for 60fps)
    SCROLL: 32,
    ORIENTATION: 64 // ~15fps (was 32 for 30fps)
  },
  
  // Caching
  CACHE: {
    RECT_DURATION: 100, // Cache rect for 100ms
    MAX_CACHE_SIZE: 50
  },
  
  // Performance monitoring
  PERFORMANCE: {
    TARGET_FPS: 30,
    FRAME_TIME_THRESHOLD: 33.33, // 30fps = 33.33ms per frame
    ADAPTIVE_QUALITY: true,
    FRAME_SKIP_THRESHOLD: 0.1, // Skip frames when effects are minimal
    INACTIVITY_TIMEOUT: 2000 // Pause animation after 2s of inactivity
  },
  
  // Glass grid configuration
  GLASS_GRID: {
    PANE_SIZE: 70,
    GAP: 0,
    REFRACTION_RADIUS: 120,
    EMITTER_SIZE: 140,
    MOBILE: {
      PANE_SIZE: 60,
      GAP: 0,
      REFRACTION_RADIUS: 100,
      EMITTER_SIZE: 120
    },
    SMALL_MOBILE: {
      PANE_SIZE: 50,
      GAP: 0,
      REFRACTION_RADIUS: 80,
      EMITTER_SIZE: 100
    }
  }
};

// Optimized performance monitoring with circular buffer
class PerformanceMonitor {
  constructor() {
    this.frameTimes = new Array(60).fill(0);
    this.frameIndex = 0;
    this.lastFrameTime = 0;
    this.qualityLevel = 1.0;
    this.frameCount = 0;
  }
  
  startFrame() {
    this.lastFrameTime = performance.now();
  }
  
  endFrame() {
    const frameTime = performance.now() - this.lastFrameTime;
    this.frameTimes[this.frameIndex] = frameTime;
    this.frameIndex = (this.frameIndex + 1) % 60;
    this.frameCount = Math.min(this.frameCount + 1, 60);
    
    // Adjust quality based on performance (only after collecting enough samples)
    if (CONFIG.PERFORMANCE.ADAPTIVE_QUALITY && this.frameCount >= 30) {
      const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameCount;
      
      if (avgFrameTime > CONFIG.PERFORMANCE.FRAME_TIME_THRESHOLD * 1.2) {
        this.qualityLevel = Math.max(0.3, this.qualityLevel * 0.95);
      } else if (avgFrameTime < CONFIG.PERFORMANCE.FRAME_TIME_THRESHOLD * 0.8) {
        this.qualityLevel = Math.min(1.0, this.qualityLevel * 1.02);
      }
    }
  }
  
  getQualityLevel() {
    return this.qualityLevel;
  }
  
  getAverageFrameTime() {
    if (this.frameCount === 0) return 0;
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameCount;
  }
}

// Optimized DOM cache with object pooling
class DOMCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.rectPool = []; // Object pool for rect objects
    this.poolSize = 20;
  }
  
  getRect(element) {
    const now = performance.now();
    const key = element;
    
    // Check if we have a cached value that's still valid
    if (this.cache.has(key)) {
      const timestamp = this.timestamps.get(key);
      if (now - timestamp < CONFIG.CACHE.RECT_DURATION) {
        return this.cache.get(key);
      }
    }
    
    // Get fresh measurement
    const rect = element.getBoundingClientRect();
    
    // Reuse object from pool or create new one
    let cachedRect = this.rectPool.pop();
    if (!cachedRect) {
      cachedRect = {};
    }
    
    // Update rect properties
    cachedRect.left = rect.left;
    cachedRect.top = rect.top;
    cachedRect.width = rect.width;
    cachedRect.height = rect.height;
    cachedRect.centerX = rect.left + rect.width / 2;
    cachedRect.centerY = rect.top + rect.height / 2;
    
    // Cache the result
    this.cache.set(key, cachedRect);
    this.timestamps.set(key, now);
    
    // Clean up old cache entries
    this.cleanup();
    
    return cachedRect;
  }
  
  cleanup() {
    if (this.cache.size > CONFIG.CACHE.MAX_CACHE_SIZE) {
      const now = performance.now();
      const toDelete = [];
      
      for (const [key, timestamp] of this.timestamps) {
        if (now - timestamp > CONFIG.CACHE.RECT_DURATION * 2) {
          toDelete.push(key);
        }
      }
      
      toDelete.forEach(key => {
        const rect = this.cache.get(key);
        if (rect && this.rectPool.length < this.poolSize) {
          this.rectPool.push(rect);
        }
        this.cache.delete(key);
        this.timestamps.delete(key);
      });
    }
  }
  
  clear() {
    // Return all cached rects to pool
    for (const rect of this.cache.values()) {
      if (this.rectPool.length < this.poolSize) {
        this.rectPool.push(rect);
      }
    }
    this.cache.clear();
    this.timestamps.clear();
  }
}

// Optimized throttling utility
class Throttler {
  constructor(delay) {
    this.delay = delay;
    this.lastCall = 0;
    this.pendingCall = null;
  }
  
  throttle(func) {
    return (...args) => {
      const now = performance.now();
      
      if (now - this.lastCall >= this.delay) {
        this.lastCall = now;
        func(...args);
      } else {
        // Schedule the call for later
        if (this.pendingCall) {
          clearTimeout(this.pendingCall);
        }
        this.pendingCall = setTimeout(() => {
          this.lastCall = performance.now();
          func(...args);
        }, this.delay - (now - this.lastCall));
      }
    };
  }
}

// Modal management
class ModalManager {
  constructor() {
    this.modal = document.getElementById('contactModal');
    this.floatingBtn = document.getElementById('floatingInfoBtn');
    this.isOpen = false;
    this.lastScrollY = 0;
    this.scrollThreshold = 50; // Minimum scroll distance to trigger close
    this.scrollTimeout = null;
    this.scrollStartTime = 0;
    this.scrollStartY = 0;
    
    this.initialize();
  }
  
  initialize() {
    if (this.floatingBtn) {
      this.floatingBtn.addEventListener('click', () => {
        if (this.isOpen) {
          this.closeModal();
        } else {
          this.openModal();
        }
      });
    }
    
    if (this.modal) {
      // Close modal when clicking overlay
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
      
      // Close modal with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeModal();
        }
      });
    }
    
    // Initialize scroll tracking
    this.lastScrollY = window.scrollY;
    this.setupScrollDetection();
  }
  
  setupScrollDetection() {
    let scrollTimeout;
    let isScrolling = false;
    
    const handleScroll = () => {
      if (!this.isOpen) return;
      
      const currentScrollY = window.scrollY;
      const scrollDelta = this.lastScrollY - currentScrollY; // Positive = scrolling up
      
      // Only trigger on upward scroll
      if (scrollDelta > 0) {
        // Clear any existing timeout
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
        
        // If this is the start of a scroll, record the position
        if (!isScrolling) {
          this.scrollStartY = currentScrollY;
          this.scrollStartTime = Date.now();
          isScrolling = true;
        }
        
        // Check if we've scrolled enough distance or time has passed
        const scrollDistance = this.scrollStartY - currentScrollY;
        const scrollDuration = Date.now() - this.scrollStartTime;
        
        if (scrollDistance >= this.scrollThreshold || scrollDuration >= 500) {
          this.closeModal();
          isScrolling = false;
        } else {
          // Set a timeout to close if user stops scrolling
          this.scrollTimeout = setTimeout(() => {
            if (this.isOpen && scrollDistance >= this.scrollThreshold / 2) {
              this.closeModal();
            }
            isScrolling = false;
          }, 300);
        }
      } else {
        // Reset scroll tracking on downward scroll
        isScrolling = false;
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = null;
        }
      }
      
      this.lastScrollY = currentScrollY;
    };
    
    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
  }
  
  openModal() {
    if (!this.modal || this.isOpen) return;
    
    this.isOpen = true;
    this.modal.classList.add('active');
    this.floatingBtn.classList.add('modal-active');
    
    // Reset scroll tracking
    this.lastScrollY = window.scrollY;
    this.scrollStartY = window.scrollY;
    this.scrollStartTime = Date.now();
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add click effect to the button
    this.floatingBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.floatingBtn.style.transform = '';
    }, 150);
  }
  
  closeModal() {
    if (!this.modal || !this.isOpen) return;
    
    this.isOpen = false;
    this.modal.classList.remove('active');
    this.floatingBtn.classList.remove('modal-active');
    
    // Clear any pending scroll timeouts
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Add click effect to the button
    this.floatingBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.floatingBtn.style.transform = '';
    }, 150);
  }
  
  destroy() {
    // Clean up event listeners if needed
    document.body.style.overflow = '';
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}

// State management
class InteractiveState {
  constructor() {
    // Mouse state
    this.mouseActive = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseVelocity = 0;
    
    // Click effects
    this.clickEffect = 0;
    
    // Keyboard effects
    this.keyboardEffect = 0;
    this.lastKeyTime = 0;
    this.keyCount = 0;
    this.typingSpeed = 0;
    this.maxTypingSpeed = 0;
    
    // Mobile orientation
    this.deviceOrientation = { alpha: 0, beta: 0, gamma: 0 };
    this.orientationEffect = 0;
    this.verticalTilt = 0;
    this.horizontalTilt = 0;
    
    // Mobile tap effects
    this.tapEffect = 0;
    this.lastTapTime = 0;
    this.tapCount = 0;
    this.tapSpeed = 0;
  }
  
  // Update decay rates
  updateDecay() {
    this.clickEffect *= CONFIG.DECAY.CLICK;
    this.keyboardEffect *= CONFIG.DECAY.KEYBOARD;
    this.orientationEffect *= CONFIG.DECAY.ORIENTATION;
    this.tapEffect *= CONFIG.DECAY.TAP;
    
    // Decay typing speed
    if (Date.now() - this.lastKeyTime > CONFIG.SPEED.TYPING_RESET) {
      this.typingSpeed *= 0.98;
      this.keyCount = Math.max(0, this.keyCount - 0.1);
    }
    
    // Decay tap speed
    if (Date.now() - this.lastTapTime > CONFIG.SPEED.TAP_RESET) {
      this.tapSpeed *= 0.98;
      this.tapCount = Math.max(0, this.tapCount - 0.1);
    }
  }
}

// Optimized effect calculations with early returns and reduced math operations
class EffectCalculator {
  static calculateMouseEffects(mouseX, mouseY, letterRect, index, time, state, qualityLevel = 1.0) {
    const dx = mouseX - letterRect.centerX;
    const dy = mouseY - letterRect.centerY;
    const distSquared = dx * dx + dy * dy;
    
    // Early return for out-of-range letters (avoid sqrt)
    if (distSquared >= CONFIG.MOUSE_RANGE * CONFIG.MOUSE_RANGE) {
      return { weight: 0, distortion: 0 };
    }
    
    const dist = Math.sqrt(distSquared);
    const falloffFactor = Math.max(0, 1 - (dist / CONFIG.MOUSE_FALLOFF));
    
    // Early return if effect is too small
    if (falloffFactor < CONFIG.PERFORMANCE.FRAME_SKIP_THRESHOLD) {
      return { weight: 0, distortion: 0 };
    }
    
    const qualityMultiplier = Math.max(0.5, qualityLevel);
    
    // Pre-calculate common values
    const timeIndex = time + index * 0.5;
    const timeIndex3 = time * 3 + index * 0.3;
    
    // Wave effects (reduced complexity at lower quality)
    const waveFrequency = qualityLevel > 0.7 ? 2 : 1;
    const waveOffset = Math.sin(timeIndex * waveFrequency) * 15 * falloffFactor * qualityMultiplier;
    const bounceOffset = Math.sin(timeIndex3) * 8 * falloffFactor * qualityMultiplier;
    
    // Velocity effects
    const velocityEffect = Math.min(20, state.mouseVelocity * 0.1) * falloffFactor;
    const velocityWave = qualityLevel > 0.5 ? 
      Math.sin(time * 8 + index * 0.8) * velocityEffect * qualityMultiplier : 0;
    
    // Base calculations with optimized math
    const distRatio = dist / 8;
    const baseDistortion = Math.max(0, CONFIG.DISTORTION.MAX - distRatio) * falloffFactor;
    const baseWeight = Math.max(CONFIG.WEIGHT.MIN, CONFIG.WEIGHT.MAX - dist / 15) * falloffFactor;
    
    return {
      weight: Math.max(CONFIG.WEIGHT.MIN, Math.min(CONFIG.WEIGHT.MAX, baseWeight + bounceOffset + velocityEffect)),
      distortion: Math.max(0, Math.min(CONFIG.DISTORTION.MAX, baseDistortion + waveOffset + velocityWave))
    };
  }
  
  static calculateBaselineEffects(index, time, state, qualityLevel = 1.0) {
    // Early return if no effects are active
    const totalEffect = state.clickEffect + state.keyboardEffect + state.tapEffect + 
                       Math.abs(state.verticalTilt) + Math.abs(state.horizontalTilt);
    
    if (totalEffect < CONFIG.PERFORMANCE.FRAME_SKIP_THRESHOLD) {
      return {
        weight: CONFIG.WEIGHT.BASELINE,
        distortion: CONFIG.DISTORTION.BASELINE
      };
    }
    
    const baselineWeight = CONFIG.WEIGHT.BASELINE;
    const baselineDistortion = CONFIG.DISTORTION.BASELINE;
    const qualityMultiplier = Math.max(0.5, qualityLevel);
    
    // Pre-calculate common values
    const timeIndex = time + index * 0.4;
    const timeIndex6 = time * 6 + index * 0.6;
    
    // Click effects
    const clickWave = Math.sin(time * 12 + timeIndex) * 15 * state.clickEffect * qualityMultiplier;
    const clickBounce = Math.sin(timeIndex6) * 10 * state.clickEffect * qualityMultiplier;
    
    // Keyboard effects (reduced complexity at lower quality)
    const chaosFactor = Math.min(2, state.typingSpeed / 3);
    const keyboardWave = Math.sin(time * (20 + chaosFactor * 10) + index * 0.3) * 25 * state.keyboardEffect * qualityMultiplier;
    const keyboardBounce = Math.sin(time * (8 + chaosFactor * 5) + index * 0.7) * 15 * state.keyboardEffect * qualityMultiplier;
    
    // Only calculate chaos waves at higher quality levels
    const chaosWave1 = qualityLevel > 0.6 ? Math.sin(time * 30 + index * 0.9) * 10 * state.keyboardEffect * chaosFactor * qualityMultiplier : 0;
    const chaosWave2 = qualityLevel > 0.6 ? Math.cos(time * 25 + index * 0.2) * 8 * state.keyboardEffect * chaosFactor * qualityMultiplier : 0;
    
    // Tap effects
    const tapChaosFactor = Math.min(2, state.tapSpeed / 3);
    const tapWave = Math.sin(time * (18 + tapChaosFactor * 8) + index * 0.4) * 20 * state.tapEffect * qualityMultiplier;
    const tapBounce = Math.sin(time * (6 + tapChaosFactor * 4) + index * 0.8) * 12 * state.tapEffect * qualityMultiplier;
    
    // Only calculate tap chaos waves at higher quality levels
    const tapChaosWave1 = qualityLevel > 0.6 ? Math.sin(time * 28 + index * 0.7) * 8 * state.tapEffect * tapChaosFactor * qualityMultiplier : 0;
    const tapChaosWave2 = qualityLevel > 0.6 ? Math.cos(time * 22 + index * 0.3) * 6 * state.tapEffect * tapChaosFactor * qualityMultiplier : 0;
    
    // Orientation effects
    const orientationDistortion = state.verticalTilt * 60;
    const orientationWeight = state.horizontalTilt * 80;
    
    return {
      weight: baselineWeight + clickBounce + keyboardBounce + tapBounce + orientationWeight,
      distortion: baselineDistortion + clickWave + keyboardWave + chaosWave1 + chaosWave2 + 
                 tapWave + tapChaosWave1 + tapChaosWave2 + orientationDistortion
    };
  }
}

// Mobile sensor management
class MobileSensorManager {
  constructor(state) {
    this.state = state;
    this.isInitialized = false;
    this.permissionButton = null;
    this.orientationThrottler = new Throttler(CONFIG.THROTTLE.ORIENTATION);
  }
  
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        // Check if user has already granted permission
        const hasPermission = this.checkStoredPermission();
        if (hasPermission) {
          // User previously granted permission, try to setup listener
          this.setupOrientationListener();
        } else {
          // iOS requires user gesture - show button
          this.showPermissionButton();
        }
      } else {
        // Other devices can auto-initialize
        this.setupOrientationListener();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Mobile sensor initialization failed:', error);
    }
  }
  
  checkStoredPermission() {
    try {
      return localStorage.getItem('motionEffectsEnabled') === 'true';
    } catch (error) {
      // If localStorage is not available, return false
      return false;
    }
  }
  
  storePermission(granted) {
    try {
      localStorage.setItem('motionEffectsEnabled', granted.toString());
    } catch (error) {
      // If localStorage is not available, silently fail
      console.warn('Could not store permission preference:', error);
    }
  }
  
  clearStoredPermission() {
    try {
      localStorage.removeItem('motionEffectsEnabled');
    } catch (error) {
      console.warn('Could not clear permission preference:', error);
    }
  }
  
  showPermissionButton() {
    // Only show if not already present
    if (this.permissionContainer) return;
    
    // Create container for button and dismiss button
    this.permissionContainer = document.createElement('div');
    this.permissionContainer.className = 'permission-container';
    
    // Create main permission button
    this.permissionButton = document.createElement('button');
    this.permissionButton.textContent = 'Enable Motion-Sensitive Logo';
    this.permissionButton.className = 'permission-button';
    
    this.permissionButton.addEventListener('click', async () => {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          this.setupOrientationListener();
          this.hidePermissionButton();
          this.storePermission(true);
        } else {
          // User denied permission, store that preference too
          this.storePermission(false);
        }
      } catch (error) {
        console.error('Permission request failed:', error);
        // Store false on error to prevent repeated failed attempts
        this.storePermission(false);
      }
    });
    
    // Create dismiss button
    this.dismissButton = document.createElement('button');
    this.dismissButton.innerHTML = '&times;';
    this.dismissButton.className = 'dismiss-button';
    this.dismissButton.setAttribute('aria-label', 'Dismiss');
    
    this.dismissButton.addEventListener('click', () => {
      this.hidePermissionButton();
      this.storePermission(false);
    });
    
    // Add both buttons to container
    this.permissionContainer.appendChild(this.permissionButton);
    this.permissionContainer.appendChild(this.dismissButton);
    
    // Insert the container within the hero section after the subtitle
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
      const subtitleElement = document.querySelector('.subtitle');
      if (subtitleElement) {
        subtitleElement.parentNode.insertBefore(this.permissionContainer, subtitleElement.nextSibling);
      } else {
        // Fallback to after splash if subtitle not found
        const splashElement = document.querySelector('#splash');
        if (splashElement) {
          splashElement.parentNode.insertBefore(this.permissionContainer, splashElement.nextSibling);
        } else {
          heroElement.appendChild(this.permissionContainer);
        }
      }
    } else {
      // Fallback if hero section not found
      const subtitleElement = document.querySelector('.subtitle');
      if (subtitleElement && subtitleElement.parentNode) {
        subtitleElement.parentNode.insertBefore(this.permissionContainer, subtitleElement.nextSibling);
      } else {
        document.body.appendChild(this.permissionContainer);
      }
    }
  }
  
  hidePermissionButton() {
    if (this.permissionContainer && this.permissionContainer.parentNode) {
      this.permissionContainer.parentNode.removeChild(this.permissionContainer);
      this.permissionContainer = null;
      this.permissionButton = null;
      this.dismissButton = null;
    }
  }
  
  setupOrientationListener() {
    const throttledHandler = this.orientationThrottler.throttle((e) => {
      this.state.deviceOrientation.alpha = e.alpha || 0;
      this.state.deviceOrientation.beta = e.beta || 0;
      this.state.deviceOrientation.gamma = e.gamma || 0;
      
      // Calculate tilt effects
      this.state.verticalTilt = Math.abs(this.state.deviceOrientation.beta - 90) / CONFIG.TILT_SENSITIVITY;
      this.state.horizontalTilt = Math.abs(this.state.deviceOrientation.gamma) / CONFIG.TILT_SENSITIVITY;
      this.state.orientationEffect = Math.min(1, (this.state.verticalTilt + this.state.horizontalTilt) / 2);
    });
    
    window.addEventListener('deviceorientation', throttledHandler);
  }
}

// Glass Grid Manager
class GlassGridManager {
  constructor() {
    this.gridContainer = document.getElementById('glassPaneGrid');
    this.panes = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.isInitialized = false;
    this.isMoving = false;
    this.movementThreshold = 5; // Minimum movement to trigger spreading
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    this.initialize();
  }
  
  initialize() {
    if (!this.gridContainer) {
      console.warn('Glass grid container not found');
      return;
    }
    
    // Only create glass panes if the container is visible
    if (this.gridContainer.offsetParent !== null) {
      this.createGlassPanes();
    }
    // this.setupMouseTracking(); // DISABLED - removes mouse-following objects
    this.isInitialized = true;
  }
  
  createGlassPanes() {
    const containerRect = this.gridContainer.getBoundingClientRect();
    const settings = this.getResponsiveSettings();
    const paneSize = settings.PANE_SIZE;
    const gap = settings.GAP;
    
    // Calculate grid dimensions
    const cols = Math.ceil(containerRect.width / (paneSize + gap));
    const rows = Math.ceil(containerRect.height / (paneSize + gap));
    
    // Clear existing panes
    this.gridContainer.innerHTML = '';
    this.panes = [];
    
    // Create glass panes
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const pane = document.createElement('div');
        pane.className = 'glass-pane';
        pane.style.width = `${paneSize}px`;
        pane.style.height = `${paneSize}px`;
        
        // Add subtle random variation for organic feel
        const randomOpacity = 0.85 + Math.random() * 0.15;
        pane.style.opacity = randomOpacity;
        
        this.gridContainer.appendChild(pane);
        this.panes.push(pane);
      }
    }
  }
  
  getResponsiveSettings() {
    const width = window.innerWidth;
    if (width <= 480) {
      return CONFIG.GLASS_GRID.SMALL_MOBILE;
    } else if (width <= 768) {
      return CONFIG.GLASS_GRID.MOBILE;
    } else {
      return {
        PANE_SIZE: CONFIG.GLASS_GRID.PANE_SIZE,
        GAP: CONFIG.GLASS_GRID.GAP,
        REFRACTION_RADIUS: CONFIG.GLASS_GRID.REFRACTION_RADIUS,
        EMITTER_SIZE: CONFIG.GLASS_GRID.EMITTER_SIZE
      };
    }
  }
  
  setupMouseTracking() {
    let animationId;
    
    const updateEmitter = (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      // Check if mouse is moving enough to trigger spreading
      const movement = Math.sqrt(
        Math.pow(this.mouseX - this.lastMouseX, 2) + 
        Math.pow(this.mouseY - this.lastMouseY, 2)
      );
      
      this.isMoving = movement > this.movementThreshold;
      
      const settings = this.getResponsiveSettings();
      
      // Update main emitter position
      this.gradientEmitter.style.left = `${this.mouseX - settings.EMITTER_SIZE / 2}px`;
      this.gradientEmitter.style.top = `${this.mouseY - settings.EMITTER_SIZE / 2}px`;
      
      // Update circle positions with lag
      this.updateCirclePositions();
      
      // Update refraction effects on glass panes
      this.updateRefractionEffects();
      
      // Store current position for next frame
      this.lastMouseX = this.mouseX;
      this.lastMouseY = this.mouseY;
      
      // Cancel previous animation frame
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      // Schedule next update
      animationId = requestAnimationFrame(() => {
        this.updateRefractionEffects();
      });
    };
    
    // Throttled mouse move handler
    let lastUpdate = 0;
    const throttledUpdate = (e) => {
      const now = performance.now();
      if (now - lastUpdate >= CONFIG.THROTTLE.MOUSE) {
        lastUpdate = now;
        updateEmitter(e);
      }
    };
    
    document.addEventListener('mousemove', throttledUpdate);
    
    // Handle window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.createGlassPanes();
      }, 100);
    });
  }
  
  updateCirclePositions() {
    const settings = this.getResponsiveSettings();
    const emitterSize = settings.EMITTER_SIZE;
    
    if (this.isMoving) {
      // Update positions with lag effect when moving
      this.circlePositions[0] = { x: this.mouseX, y: this.mouseY };
      
      // Circle 1 follows main emitter with lag
      this.circlePositions[1].x += (this.circlePositions[0].x - this.circlePositions[1].x) * 0.3;
      this.circlePositions[1].y += (this.circlePositions[0].y - this.circlePositions[1].y) * 0.3;
      
      // Circle 2 follows circle 1 with lag
      this.circlePositions[2].x += (this.circlePositions[1].x - this.circlePositions[2].x) * 0.25;
      this.circlePositions[2].y += (this.circlePositions[1].y - this.circlePositions[2].y) * 0.25;
      
      // Circle 3 follows circle 2 with lag
      this.circlePositions[3].x += (this.circlePositions[2].x - this.circlePositions[3].x) * 0.2;
      this.circlePositions[3].y += (this.circlePositions[2].y - this.circlePositions[3].y) * 0.2;
    } else {
      // Resting state - all circles stack on top of each other
      this.circlePositions[0] = { x: this.mouseX, y: this.mouseY };
      this.circlePositions[1] = { x: this.mouseX, y: this.mouseY };
      this.circlePositions[2] = { x: this.mouseX, y: this.mouseY };
      this.circlePositions[3] = { x: this.mouseX, y: this.mouseY };
    }
    
    // Update circle positions
    const circles = this.circleCluster.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
      const pos = this.circlePositions[index + 1];
      circle.style.left = `${pos.x - emitterSize / 2}px`;
      circle.style.top = `${pos.y - emitterSize / 2}px`;
    });
  }
  
  updateRefractionEffects() {
    const settings = this.getResponsiveSettings();
    const refractionRadius = settings.REFRACTION_RADIUS;
    
    this.panes.forEach((pane, index) => {
      const rect = pane.getBoundingClientRect();
      const paneCenterX = rect.left + rect.width / 2;
      const paneCenterY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse to pane center
      const distance = Math.sqrt(
        Math.pow(this.mouseX - paneCenterX, 2) + 
        Math.pow(this.mouseY - paneCenterY, 2)
      );
      
      // Apply refraction effect based on distance
      if (distance < refractionRadius) {
        const intensity = 1 - (distance / refractionRadius);
        const refractionStrength = Math.pow(intensity, 1.5);
        
        // Calculate relative mouse position within the pane for CSS gradient
        const relativeX = ((this.mouseX - rect.left) / rect.width) * 100;
        const relativeY = ((this.mouseY - rect.top) / rect.height) * 100;
        
        // Calculate warping based on distance from center
        const centerDistance = Math.sqrt(
          Math.pow(relativeX - 50, 2) + Math.pow(relativeY - 50, 2)
        ) / 50; // Normalize to 0-1
        
        // Add refraction class and custom properties
        pane.classList.add('refracting');
        pane.style.setProperty('--refraction-intensity', refractionStrength);
        pane.style.setProperty('--mouse-x', `${relativeX}%`);
        pane.style.setProperty('--mouse-y', `${relativeY}%`);
        pane.style.setProperty('--warp-intensity', centerDistance);
        
        // Add subtle transform for warping effect
        const angleX = (this.mouseX - paneCenterX) / refractionRadius * 3;
        const angleY = (this.mouseY - paneCenterY) / refractionRadius * 3;
        const scale = 1 + refractionStrength * 0.03;
        const transform = `perspective(800px) rotateX(${angleY}deg) rotateY(${angleX}deg) scale(${scale})`;
        pane.style.transform = transform;
        
      } else {
        // Remove refraction effects
        pane.classList.remove('refracting');
        pane.style.removeProperty('--refraction-intensity');
        pane.style.removeProperty('--mouse-x');
        pane.style.removeProperty('--mouse-y');
        pane.style.removeProperty('--warp-intensity');
        pane.style.transform = '';
      }
    });
  }
  
  destroy() {
    // Clean up event listeners if needed
    this.panes = [];
    this.isInitialized = false;
  }
}

// Main application class with visibility detection and adaptive frame rate
class InteractiveTextApp {
  constructor() {
    this.letters = document.querySelectorAll('#splash span');
    this.state = new InteractiveState();
    this.mobileSensors = new MobileSensorManager(this.state);
    this.performanceMonitor = new PerformanceMonitor();
    this.domCache = new DOMCache();
    this.mouseThrottler = new Throttler(CONFIG.THROTTLE.MOUSE);
    this.scrollThrottler = new Throttler(CONFIG.THROTTLE.SCROLL);
    this.modalManager = new ModalManager();
    this.glassGridManager = new GlassGridManager();
    this.animationId = null;
    
    // Visibility and performance tracking
    this.isVisible = true;
    this.isActive = true;
    this.lastActivityTime = Date.now();
    this.frameSkipCounter = 0;
    this.targetFrameRate = this.detectOptimalFrameRate();
    
    // Pre-calculate letter data for optimization
    this.letterData = this.precalculateLetterData();
    
    this.initialize();
  }
  
  detectOptimalFrameRate() {
    // Detect device capabilities and set appropriate frame rate
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    if (isMobile || isLowEnd) {
      return 20; // 20fps for mobile/low-end devices
    }
    return 30; // 30fps for desktop
  }
  
  precalculateLetterData() {
    const data = [];
    for (let i = 0; i < this.letters.length; i++) {
      data.push({
        element: this.letters[i],
        index: i,
        isFixed: i >= this.letters.length - CONFIG.FIXED_LETTERS,
        lastWeight: null,
        lastDistortion: null,
        lastColor: null
      });
    }
    return data;
  }
  
  initialize() {
    this.setupEventListeners();
    this.setupMobileSensors();
    this.startAnimation();
  }
  
  setupEventListeners() {
    // Mouse events with throttling
    const throttledMouseMove = this.mouseThrottler.throttle(this.handleMouseMove.bind(this));
    document.addEventListener('mousemove', throttledMouseMove);
    
    // Click events
    document.addEventListener('click', () => {
      this.state.clickEffect = 1.0;
      this.updateActivity();
    });
    
    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Touch events
    document.addEventListener('touchstart', this.handleTouchStart.bind(this));
    
    // Scroll events for paragraph reveal with throttling
    const throttledScroll = this.scrollThrottler.throttle(this.handleScroll.bind(this));
    document.addEventListener('scroll', throttledScroll);
    
    // Visibility change detection
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Window focus/blur detection
    window.addEventListener('focus', this.handleWindowFocus.bind(this));
    window.addEventListener('blur', this.handleWindowBlur.bind(this));
    
    // Initial check for elements in view
    this.checkScrollReveal();
  }
  
  handleVisibilityChange() {
    this.isVisible = !document.hidden;
    this.updateActivity();
  }
  
  handleWindowFocus() {
    this.isActive = true;
    this.updateActivity();
  }
  
  handleWindowBlur() {
    this.isActive = false;
  }
  
  updateActivity() {
    this.lastActivityTime = Date.now();
  }
  
  setupMobileSensors() {
    this.mobileSensors.initialize();
  }
  
  handleMouseMove(e) {
    const time = Date.now() * 0.001;
    
    // Calculate mouse velocity
    const dx = e.clientX - this.state.lastMouseX;
    const dy = e.clientY - this.state.lastMouseY;
    this.state.mouseVelocity = Math.sqrt(dx * dx + dy * dy);
    this.state.lastMouseX = e.clientX;
    this.state.lastMouseY = e.clientY;
    
    // Update activity tracking
    this.updateActivity();
    
    let anyLetterAffected = false;
    const qualityLevel = this.performanceMonitor.getQualityLevel();
    
    // Pre-calculate mouse position for efficiency
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    this.letterData.forEach((letterData) => {
      if (letterData.isFixed) {
        this.updateFixedLetter(letterData);
        return;
      }
      
      const rect = this.domCache.getRect(letterData.element);
      const effects = EffectCalculator.calculateMouseEffects(
        mouseX, mouseY, rect, letterData.index, time, this.state, qualityLevel
      );
      
      if (effects.weight > 0 || effects.distortion > 0) {
        anyLetterAffected = true;
        this.updateLetterStyles(letterData, effects.weight, effects.distortion);
      }
    });
    
    this.state.mouseActive = anyLetterAffected;
  }
  
  handleKeyDown(e) {
    const now = Date.now();
    const timeSinceLastKey = now - this.state.lastKeyTime;
    
    if (timeSinceLastKey < CONFIG.SPEED.TYPING_RESET) {
      this.state.keyCount++;
      this.state.typingSpeed = this.state.keyCount / (timeSinceLastKey / 1000);
      this.state.maxTypingSpeed = Math.max(this.state.maxTypingSpeed, this.state.typingSpeed);
    } else {
      this.state.keyCount = 1;
      this.state.typingSpeed = 1;
    }
    
    this.state.lastKeyTime = now;
    const speedMultiplier = Math.min(3, this.state.typingSpeed / 2);
    this.state.keyboardEffect = 1.0 * speedMultiplier;
  }
  
  handleTouchStart(e) {
    const now = Date.now();
    const timeSinceLastTap = now - this.state.lastTapTime;
    
    if (timeSinceLastTap < CONFIG.SPEED.TAP_RESET) {
      this.state.tapCount++;
      this.state.tapSpeed = this.state.tapCount / (timeSinceLastTap / 1000);
    } else {
      this.state.tapCount = 1;
      this.state.tapSpeed = 1;
    }
    
    this.state.lastTapTime = now;
    const speedMultiplier = Math.min(3, this.state.tapSpeed / 2);
    this.state.tapEffect = 1.0 * speedMultiplier;
  }
  
  handleScroll() {
    this.checkScrollReveal();
  }
  
  checkScrollReveal() {
    const descriptions = document.querySelectorAll('.description');
    const windowHeight = window.innerHeight;
    const triggerOffset = windowHeight * 0.8; // Trigger when 80% of element is visible
    
    descriptions.forEach((description, index) => {
      if (description.classList.contains('revealed')) return;
      
      const rect = this.domCache.getRect(description);
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Check if element is in viewport
      if (elementTop < triggerOffset && elementTop + elementHeight > 0) {
        // Add staggered delay based on index
        setTimeout(() => {
          description.classList.add('revealed');
        }, index * 200); // 200ms delay between each paragraph
      }
    });
  }
  
  updateFixedLetter(letterData) {
    const weight = CONFIG.WEIGHT.BASELINE;
    const distortion = CONFIG.DISTORTION.BASELINE;
    const color = '#FFFFFF';
    
    this.updateLetterStyles(letterData, weight, distortion, color);
  }
  
  updateLetterStyles(letterData, weight, distortion, color = null) {
    // Only update if values have changed
    if (letterData.lastWeight !== weight || letterData.lastDistortion !== distortion) {
      letterData.element.style.fontVariationSettings = 
        `"wght" ${weight.toFixed(1)}, "DIST" ${distortion.toFixed(1)}`;
      letterData.lastWeight = weight;
      letterData.lastDistortion = distortion;
    }
    
    // Only update color if specified and different
    if (color && letterData.lastColor !== color) {
      letterData.element.style.color = color;
      letterData.lastColor = color;
    }
  }
  
  updateLetters(time) {
    const qualityLevel = this.performanceMonitor.getQualityLevel();
    
    // Check if any effects are active to avoid unnecessary calculations
    const hasActiveEffects = this.state.clickEffect > 0.01 || 
                           this.state.keyboardEffect > 0.01 || 
                           this.state.tapEffect > 0.01 ||
                           Math.abs(this.state.verticalTilt) > 0.01 ||
                           Math.abs(this.state.horizontalTilt) > 0.01;
    
    this.letterData.forEach((letterData) => {
      if (letterData.isFixed) {
        this.updateFixedLetter(letterData);
        return;
      }
      
      let finalWeight = CONFIG.WEIGHT.BASELINE;
      let finalDistortion = CONFIG.DISTORTION.BASELINE;
      
      // Only calculate baseline effects if there are active effects
      if (hasActiveEffects) {
        const baselineEffects = EffectCalculator.calculateBaselineEffects(
          letterData.index, time, this.state, qualityLevel
        );
        finalWeight = baselineEffects.weight;
        finalDistortion = baselineEffects.distortion;
      }
      
      // If mouse is active, layer mouse effects on top of baseline effects
      if (this.state.mouseActive) {
        const rect = this.domCache.getRect(letterData.element);
        const mouseEffects = EffectCalculator.calculateMouseEffects(
          this.state.lastMouseX, this.state.lastMouseY, rect, letterData.index, time, this.state, qualityLevel
        );
        
        // Combine effects: baseline + mouse effects
        finalWeight = Math.max(CONFIG.WEIGHT.MIN, Math.min(CONFIG.WEIGHT.MAX, finalWeight + mouseEffects.weight));
        finalDistortion = Math.max(0, Math.min(CONFIG.DISTORTION.MAX, finalDistortion + mouseEffects.distortion));
      }
      
      this.updateLetterStyles(letterData, finalWeight, finalDistortion);
    });
  }
  
  startAnimation() {
    const animate = (timestamp) => {
      this.performanceMonitor.startFrame();
      
      // Check if we should skip this frame
      if (!this.shouldAnimate()) {
        this.animationId = requestAnimationFrame(animate);
        return;
      }
      
      const time = timestamp * 0.001;
      
      this.state.updateDecay();
      this.updateLetters(time);
      
      this.performanceMonitor.endFrame();
      
      // Adaptive frame rate based on performance
      const frameTime = this.performanceMonitor.getAverageFrameTime();
      const targetFrameTime = 1000 / this.targetFrameRate;
      
      if (frameTime > targetFrameTime * 1.5) {
        // Performance is poor, reduce frame rate
        setTimeout(() => {
          this.animationId = requestAnimationFrame(animate);
        }, Math.max(0, targetFrameTime - frameTime));
      } else {
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }
  
  shouldAnimate() {
    // Don't animate if page is not visible
    if (!this.isVisible) {
      return false;
    }
    
    // Don't animate if window is not focused
    if (!this.isActive) {
      return false;
    }
    
    // Check for inactivity timeout
    const timeSinceActivity = Date.now() - this.lastActivityTime;
    if (timeSinceActivity > CONFIG.PERFORMANCE.INACTIVITY_TIMEOUT) {
      // Only animate occasionally during inactivity
      this.frameSkipCounter++;
      if (this.frameSkipCounter < 10) {
        return false;
      }
      this.frameSkipCounter = 0;
    } else {
      this.frameSkipCounter = 0;
    }
    
    return true;
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.scrollThrottler.pendingCall) {
      clearTimeout(this.scrollThrottler.pendingCall);
    }
    if (this.mouseThrottler.pendingCall) {
      clearTimeout(this.mouseThrottler.pendingCall);
    }
    this.domCache.clear();
    this.modalManager.destroy();
    this.glassGridManager.destroy(); // Destroy GlassGridManager
  }
}

// Form handling for Formspark
document.addEventListener('DOMContentLoaded', function() {
  // Handle email signup form with AJAX
  const emailForm = document.querySelector('.signup-form');
  if (emailForm) {
    emailForm.addEventListener('submit', handleFormSubmit);
  }

  // Handle contact form with AJAX
  const contactForm = document.querySelector('.contact-form-inner');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  
  // Show loading state
  submitButton.innerHTML = 'Sending...';
  submitButton.disabled = true;
  
  try {
    // Get form data
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      // Handle multiple values for checkboxes
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    // Log form data for debugging
    console.log('Form data being sent:', data);
    console.log('Form action:', form.action);
    
    // Submit to Formspark using form data (not JSON)
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      // Check if it's a redirect (Formspark success)
      if (response.redirected || response.url.includes('submitted.formspark.io')) {
        showSuccessMessage(form, 'Thank you! Your message has been sent successfully.');
      } else {
        const responseText = await response.text();
        console.log('Response text:', responseText);
        showSuccessMessage(form, 'Thank you! Your message has been sent.');
      }
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showErrorMessage(form, 'Sorry, there was an error sending your message. Please try again or contact us directly at brandon@quietloudlab.com');
  } finally {
    // Reset button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

function showSuccessMessage(form, message) {
  // Remove any existing messages
  const existingMessages = form.parentNode.querySelectorAll('.form-message');
  existingMessages.forEach(msg => msg.remove());
  
  // Create success message
  const successDiv = document.createElement('div');
  successDiv.className = 'form-message success';
  successDiv.innerHTML = `
    <div style="
      background: rgba(76, 175, 80, 0.1); 
      border: 1px solid rgba(76, 175, 80, 0.3); 
      padding: 1.5rem; 
      border-radius: 12px; 
      margin: 1.5rem 0; 
      color: #4CAF50;
      font-size: 1rem;
      line-height: 1.5;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(76, 175, 80, 0.1);
    ">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22,4 12,14.01 9,11.01"></polyline>
        </svg>
        <strong>Success!</strong>
      </div>
      <div style="margin-top: 0.5rem;">${message}</div>
    </div>
  `;
  
  // Insert after form
  form.parentNode.insertBefore(successDiv, form.nextSibling);
  
  // Clear form
  form.reset();
  
  // Scroll to message
  successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Remove message after 8 seconds
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.style.opacity = '0';
      successDiv.style.transform = 'translateY(-10px)';
      successDiv.style.transition = 'all 0.3s ease';
      setTimeout(() => successDiv.remove(), 300);
    }
  }, 8000);
}

function showErrorMessage(form, message) {
  // Remove any existing messages
  const existingMessages = form.parentNode.querySelectorAll('.form-message');
  existingMessages.forEach(msg => msg.remove());
  
  // Create error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-message error';
  errorDiv.innerHTML = `
    <div style="
      background: rgba(244, 67, 54, 0.1); 
      border: 1px solid rgba(244, 67, 54, 0.3); 
      padding: 1.5rem; 
      border-radius: 12px; 
      margin: 1.5rem 0; 
      color: #F44336;
      font-size: 1rem;
      line-height: 1.5;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(244, 67, 54, 0.1);
    ">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <strong>Error:</strong>
      </div>
      <div style="margin-top: 0.5rem;">${message}</div>
    </div>
  `;
  
  // Insert after form
  form.parentNode.insertBefore(errorDiv, form.nextSibling);
  
  // Scroll to message
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Remove message after 10 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.style.opacity = '0';
      errorDiv.style.transform = 'translateY(-10px)';
      errorDiv.style.transition = 'all 0.3s ease';
      setTimeout(() => errorDiv.remove(), 300);
    }
  }, 10000);
}

// Initialize the application
const app = new InteractiveTextApp();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  app.destroy();
});
