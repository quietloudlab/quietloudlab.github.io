/**
 * WebGL Text Distortion Effect
 * Applies shader-based distortion to text based on pointer proximity
 */

import vertexShaderSource from './shaders/vertex.glsl?raw';
import fragmentShaderSource from './shaders/fragment.glsl?raw';

class WebGLTextDistortion {
  constructor(targetElement, options = {}) {
    this.targetElement = targetElement;
    this.options = {
      distortRadius: options.distortRadius || 200,
      distortStrength: options.distortStrength || 50,
      rippleSpeed: options.rippleSpeed || 3,
      enableRipple: options.enableRipple !== false,
      enableSwirl: options.enableSwirl || false,
      enableChromatic: options.enableChromatic || false,
      brightnessBoost: options.brightnessBoost || 0.5,
      fontWeightBoost: options.fontWeightBoost || 300,
      ...options
    };
    
    this.mouse = { x: 0, y: 0 };
    this.time = 0;
    this.animationId = null;
    this.shaders = { vertex: null, fragment: null };
    this.baseFontWeight = null;
    this.currentFontWeight = null;
    
    this.init();
  }
  
  async init() {
    // Load shaders
    await this.loadShaders();
    
    // Create canvas overlay
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    `;
    
    // Make target element position relative if not already positioned
    const targetStyle = window.getComputedStyle(this.targetElement);
    if (targetStyle.position === 'static') {
      this.targetElement.style.position = 'relative';
    }
    
    this.targetElement.appendChild(this.canvas);
    
    // Get WebGL context
    this.gl = this.canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false
    });
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }
    
    // Setup WebGL
    this.setupWebGL();
    this.createTextTexture();
    this.resize();
    
    // Event listeners
    this.setupEventListeners();
    
    // Start animation
    this.animate();
  }
  
  async loadShaders() {
    try {
      // Shaders are now imported at the top of the file
      this.shaders.vertex = vertexShaderSource;
      this.shaders.fragment = fragmentShaderSource;
      
      console.log('Shaders loaded successfully');
    } catch (error) {
      console.error('Failed to load shaders:', error);
      throw error;
    }
  }
  
  setupWebGL() {
    const gl = this.gl;
    
    // Compile shaders
    const vertexShader = this.compileShader(gl.VERTEX_SHADER, this.shaders.vertex);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, this.shaders.fragment);
    
    // Create program
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(this.program));
      return;
    }
    
    gl.useProgram(this.program);
    
    // Get attribute and uniform locations
    this.locations = {
      position: gl.getAttribLocation(this.program, 'a_position'),
      texCoord: gl.getAttribLocation(this.program, 'a_texCoord'),
      texture: gl.getUniformLocation(this.program, 'u_texture'),
      resolution: gl.getUniformLocation(this.program, 'u_resolution'),
      mouse: gl.getUniformLocation(this.program, 'u_mouse'),
      time: gl.getUniformLocation(this.program, 'u_time'),
      distortRadius: gl.getUniformLocation(this.program, 'u_distortRadius'),
      distortStrength: gl.getUniformLocation(this.program, 'u_distortStrength'),
      enableRipple: gl.getUniformLocation(this.program, 'u_enableRipple'),
      enableSwirl: gl.getUniformLocation(this.program, 'u_enableSwirl'),
      enableChromatic: gl.getUniformLocation(this.program, 'u_enableChromatic'),
      brightnessBoost: gl.getUniformLocation(this.program, 'u_brightnessBoost')
    };
    
    // Create quad geometry
    const positions = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1, 1,   1, -1,   1, 1
    ]);
    
    const texCoords = new Float32Array([
      0, 1,  1, 1,  0, 0,
      0, 0,  1, 1,  1, 0
    ]);
    
    // Position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);
    
    // TexCoord buffer
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.locations.texCoord);
    gl.vertexAttribPointer(this.locations.texCoord, 2, gl.FLOAT, false, 0, 0);
    
    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
  
  compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  createTextTexture(fontWeight = null) {
    const gl = this.gl;
    
    // Create off-screen canvas for text if it doesn't exist
    if (!this.textCanvas) {
      this.textCanvas = document.createElement('canvas');
    }
    const ctx = this.textCanvas.getContext('2d');
    
    // Get computed styles and dimensions from target element
    const styles = window.getComputedStyle(this.targetElement);
    const text = this.targetElement.textContent;
    const rect = this.targetElement.getBoundingClientRect();
    
    // Store base font weight on first call
    if (this.baseFontWeight === null) {
      this.baseFontWeight = parseFloat(styles.fontWeight) || 400;
      this.currentFontWeight = this.baseFontWeight;
    }
    
    // Use provided font weight or current
    const activeFontWeight = fontWeight !== null ? fontWeight : this.currentFontWeight;
    
    // Use actual element dimensions for better scaling
    // Multiply by devicePixelRatio for sharp rendering on high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    this.textCanvas.width = rect.width * dpr;
    this.textCanvas.height = rect.height * dpr;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
    
    // Scale context to match device pixel ratio
    ctx.scale(dpr, dpr);
    
    // Apply text styles - extract font size from computed style
    const fontSize = parseFloat(styles.fontSize);
    const fontFamily = styles.fontFamily;
    
    ctx.font = `${activeFontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'white'; // Always use white for proper brightness control
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text at actual size
    ctx.fillText(text, rect.width / 2, rect.height / 2);
    
    // Create or update WebGL texture
    if (!this.texture) {
      this.texture = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    // Hide the original text content after capturing it (only on first call)
    if (fontWeight === null) {
      this.targetElement.style.color = 'transparent';
      const spans = this.targetElement.querySelectorAll('span');
      spans.forEach(span => span.style.visibility = 'hidden');
    }
  }
  
  setupEventListeners() {
    this.handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = rect.height - (e.clientY - rect.top); // Flip Y for WebGL
    };
    
    this.handleResize = () => {
      this.resize();
    };
    
    document.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);
  }
  
  resize() {
    const rect = this.targetElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size with device pixel ratio for sharp rendering
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    // Keep CSS size at actual element size
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    
    // Recreate texture with new dimensions to match resized text
    this.createTextTexture();
  }
  
  render() {
    const gl = this.gl;
    const dpr = window.devicePixelRatio || 1;
    
    // Scale mouse coordinates by device pixel ratio
    const mouseX = this.mouse.x * dpr;
    const mouseY = this.mouse.y * dpr;
    
    // Calculate distance from mouse to center of canvas for font weight
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const distToCenter = Math.sqrt(
      Math.pow(mouseX - centerX, 2) +
      Math.pow(mouseY - centerY, 2)
    );
    
    // Calculate influence (0 to 1, where 1 is closest)
    const influence = Math.max(0, 1 - (distToCenter / (this.options.distortRadius * dpr)));
    
    // Update font weight based on proximity
    const targetFontWeight = this.baseFontWeight + (influence * this.options.fontWeightBoost);
    
    // Smooth transition (lerp)
    this.currentFontWeight = this.currentFontWeight * 0.9 + targetFontWeight * 0.1;
    
    // Only update texture if font weight changed significantly (optimization)
    if (Math.abs(this.currentFontWeight - this.lastRenderedWeight) > 5) {
      this.createTextTexture(this.currentFontWeight);
      this.lastRenderedWeight = this.currentFontWeight;
    }
    
    // Clear
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Update uniforms with scaled values
    gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.locations.mouse, mouseX, mouseY);
    gl.uniform1f(this.locations.time, this.time);
    gl.uniform1f(this.locations.distortRadius, this.options.distortRadius * dpr);
    gl.uniform1f(this.locations.distortStrength, this.options.distortStrength * dpr);
    gl.uniform1i(this.locations.enableRipple, this.options.enableRipple ? 1 : 0);
    gl.uniform1i(this.locations.enableSwirl, this.options.enableSwirl ? 1 : 0);
    gl.uniform1i(this.locations.enableChromatic, this.options.enableChromatic ? 1 : 0);
    gl.uniform1f(this.locations.brightnessBoost, this.options.brightnessBoost);
    
    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.locations.texture, 0);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  
  animate = (timestamp = 0) => {
    this.time = timestamp * 0.001;
    this.render();
    this.animationId = requestAnimationFrame(this.animate);
  }
  
  updateOptions(newOptions) {
    Object.assign(this.options, newOptions);
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    document.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    // Clean up WebGL resources
    const gl = this.gl;
    if (gl) {
      gl.deleteTexture(this.texture);
      gl.deleteProgram(this.program);
    }
  }
}

// Export for use in other scripts
export default WebGLTextDistortion;

// Made with Bob
