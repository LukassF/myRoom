uniform float time;
uniform vec3 color;
uniform float intensity;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Neon color
    vec3 neonColor = color;

    // Intensity glow based on normal direction
    float glow = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), intensity);

    // Add pulse effect
    float pulse = 0.5 + 0.5 * sin(time * 5.0);
    glow *= pulse;

    // Final color
    gl_FragColor = vec4(neonColor * glow, 1.0);
}