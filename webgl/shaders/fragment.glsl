precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_distortRadius;
uniform float u_distortStrength;
uniform bool u_enableRipple;
uniform bool u_enableSwirl;
uniform bool u_enableChromatic;
uniform float u_brightnessBoost;

varying vec2 v_texCoord;

void main() {
  vec2 pixelCoord = v_texCoord * u_resolution;
  float dist = distance(pixelCoord, u_mouse);
  
  // Smooth falloff
  float influence = smoothstep(u_distortRadius, 0.0, dist);
  
  vec2 direction = normalize(pixelCoord - u_mouse);
  vec2 distortion = vec2(0.0);
  
  // Base distortion (push away from mouse)
  distortion = direction * influence * u_distortStrength;
  
  // Ripple effect
  if (u_enableRipple && dist < u_distortRadius) {
    float ripple = sin(dist * 0.1 - u_time * 3.0) * 0.5 + 0.5;
    distortion *= ripple;
  }
  
  // Swirl effect
  if (u_enableSwirl && influence > 0.0) {
    float angle = influence * u_distortStrength * 0.02;
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 centered = pixelCoord - u_mouse;
    vec2 rotated = rotation * centered;
    pixelCoord = rotated + u_mouse;
    distortion = vec2(0.0);
  }
  
  vec2 distortedCoord = v_texCoord + (distortion / u_resolution);
  
  // Chromatic aberration
  vec4 color;
  if (u_enableChromatic && influence > 0.1) {
    float offset = influence * u_distortStrength * 0.0005;
    float r = texture2D(u_texture, distortedCoord + vec2(offset, 0.0)).r;
    float g = texture2D(u_texture, distortedCoord).g;
    float b = texture2D(u_texture, distortedCoord - vec2(offset, 0.0)).b;
    float a = texture2D(u_texture, distortedCoord).a;
    color = vec4(r, g, b, a);
  } else {
    color = texture2D(u_texture, distortedCoord);
  }
  
  // Apply brightness boost based on proximity to cursor
  float brightness = 1.0 + (influence * u_brightnessBoost);
  color.rgb *= brightness;
  
  gl_FragColor = color;
}