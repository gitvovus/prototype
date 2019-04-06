import * as THREE from 'three';

const terrainVS =
`
attribute float height;

varying vec3 vDir;
varying vec3 vNormal;
varying float vHeight;

void main() {
  vHeight = height + 0.5;
  vNormal = normalize(normal);
  vDir = -normalize(cameraPosition - position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const terrainFS =
`
varying vec3 vDir;
varying vec3 vNormal;
varying float vHeight;

void main() {
  float height = clamp(vHeight, 0.0, 1.0);
  float cosVN = abs(dot(vDir, vNormal));
  float diffuse = 0.2 + 0.8 * cosVN;
  vec3 hColor = (1.0 - height) * vec3(0.0, height, height) + height * vec3(height, height, 0.0);
  gl_FragColor = vec4(hColor * diffuse, 1);
}
`;

export function terrain(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({ vertexShader: terrainVS, fragmentShader: terrainFS, side: THREE.DoubleSide });
}
