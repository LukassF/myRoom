import * as THREE from "three";
// import * as fragmentShader from "../shaders/neon/fragmentShader.glsl";
// import * as vertexShader from "../shaders/neon/vertexShader.glsl";

export const neonShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color(0x00ffcc) }, // Base neon color
    intensity: { value: 1.5 }, // Glow intensity
  },
  vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
  fragmentShader: `
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
            float pulse = 0.5 + 0.5 * sin(90.);
            glow *= pulse;

            // Final color
            gl_FragColor = vec4(neonColor * glow, 1.0);
        }
    `,
  transparent: true,
  side: THREE.DoubleSide, // Ensure the glow is visible from all sides
});
