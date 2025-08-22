// ===== THREE.JS PLANET SCENE =====
class PlanetScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.planet = null;
        this.rings = null;
        this.stars = [];
        this.animationId = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        
        this.setupScene();
        this.setupCamera();
        this.setupRenderer(canvas);
        this.createPlanet();
        this.createRings();
        this.createStarfield();
        this.setupLighting();
        this.animate();
        this.handleResize();
        
        this.isInitialized = true;
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 50, 200);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);
    }
    
    setupRenderer(canvas) {
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    createPlanet() {
        // Create planet geometry
        const planetGeometry = new THREE.SphereGeometry(2, 64, 64);
        
        // Create planet material with custom shader for Jupiter-like appearance
        const planetMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
                
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                // Noise function
                float noise(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
                }
                
                // FBM (Fractal Brownian Motion)
                float fbm(vec3 p) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    float frequency = 1.0;
                    
                    for(int i = 0; i < 5; i++) {
                        value += amplitude * noise(p * frequency);
                        amplitude *= 0.5;
                        frequency *= 2.0;
                    }
                    
                    return value;
                }
                
                void main() {
                    vec3 normal = normalize(vNormal);
                    vec3 light = normalize(vec3(1.0, 1.0, 1.0));
                    
                    // Create Jupiter-like bands
                    float latitude = acos(normal.y);
                    float longitude = atan(normal.z, normal.x);
                    
                    // Multiple band layers
                    float band1 = sin(latitude * 8.0 + time * 0.1) * 0.5 + 0.5;
                    float band2 = sin(latitude * 12.0 - time * 0.15) * 0.3 + 0.7;
                    float band3 = sin(latitude * 6.0 + time * 0.05) * 0.4 + 0.6;
                    
                    // Combine bands
                    float bands = (band1 * 0.4 + band2 * 0.4 + band3 * 0.2);
                    
                    // Add atmospheric turbulence
                    float turbulence = fbm(vPosition * 2.0 + time * 0.1);
                    
                    // Color variations
                    vec3 color1 = vec3(0.8, 0.6, 0.4); // Orange-brown
                    vec3 color2 = vec3(0.6, 0.4, 0.2); // Darker brown
                    vec3 color3 = vec3(0.9, 0.7, 0.5); // Lighter orange
                    
                    vec3 baseColor = mix(color1, color2, bands);
                    baseColor = mix(baseColor, color3, turbulence * 0.3);
                    
                    // Add atmospheric glow
                    float atmosphere = pow(1.0 - abs(dot(normal, light)), 2.0);
                    baseColor += vec3(0.1, 0.05, 0.0) * atmosphere;
                    
                    // Add specular highlight
                    float specular = pow(max(dot(reflect(-light, normal), normalize(vPosition)), 0.0), 32.0);
                    baseColor += vec3(0.2) * specular;
                    
                    gl_FragColor = vec4(baseColor, 1.0);
                }
            `
        });
        
        this.planet = new THREE.Mesh(planetGeometry, planetMaterial);
        this.planet.castShadow = true;
        this.planet.receiveShadow = true;
        this.scene.add(this.planet);
    }
    
    createRings() {
        // Create ring geometry
        const ringGeometry = new THREE.RingGeometry(3, 4.5, 64);
        
        // Create ring material
        const ringMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                float noise(vec2 p) {
                    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                }
                
                float fbm(vec2 p) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    float frequency = 1.0;
                    
                    for(int i = 0; i < 4; i++) {
                        value += amplitude * noise(p * frequency);
                        amplitude *= 0.5;
                        frequency *= 2.0;
                    }
                    
                    return value;
                }
                
                void main() {
                    vec2 uv = vUv;
                    
                    // Create ring structure
                    float ring = fbm(uv * 10.0 + time * 0.1);
                    float radial = sin(uv.x * 50.0 + time * 0.2) * 0.5 + 0.5;
                    
                    // Combine patterns
                    float alpha = ring * radial * 0.8;
                    
                    // Add some transparency variation
                    alpha *= 0.7 + 0.3 * sin(uv.x * 20.0 + time * 0.3);
                    
                    // Color variation
                    vec3 color = mix(
                        vec3(0.8, 0.7, 0.6), // Light brown
                        vec3(0.6, 0.5, 0.4), // Darker brown
                        ring
                    );
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        this.rings = new THREE.Mesh(ringGeometry, ringMaterial);
        this.rings.rotation.x = Math.PI / 2;
        this.rings.position.y = 0;
        this.scene.add(this.rings);
    }
    
    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Random positions in a sphere
            const radius = 50 + Math.random() * 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Random colors (white to blue)
            const color = new THREE.Color();
            color.setHSL(0.6 + Math.random() * 0.1, 0.5, 0.8 + Math.random() * 0.2);
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starField);
        this.stars.push(starField);
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Secondary light for atmosphere
        const secondaryLight = new THREE.DirectionalLight(0xffa500, 0.2);
        secondaryLight.position.set(-5, 3, -5);
        this.scene.add(secondaryLight);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotate planet
        if (this.planet) {
            this.planet.rotation.y += 0.005;
            this.planet.material.uniforms.time.value = time;
        }
        
        // Rotate rings
        if (this.rings) {
            this.rings.rotation.z += 0.002;
            this.rings.material.uniforms.time.value = time;
        }
        
        // Animate stars
        this.stars.forEach((starField, index) => {
            starField.rotation.y += 0.001 * (index + 1);
        });
        
        // Camera movement
        if (this.camera) {
            this.camera.position.x = Math.sin(time * 0.2) * 0.5;
            this.camera.position.y = Math.sin(time * 0.1) * 0.3;
            this.camera.lookAt(0, 0, 0);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            if (!this.isInitialized) return;
            
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(width, height);
            
            // Update shader uniforms
            if (this.planet && this.planet.material.uniforms.resolution) {
                this.planet.material.uniforms.resolution.value.set(width, height);
            }
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Dispose of geometries and materials
        if (this.planet) {
            this.planet.geometry.dispose();
            this.planet.material.dispose();
        }
        
        if (this.rings) {
            this.rings.geometry.dispose();
            this.rings.material.dispose();
        }
        
        this.stars.forEach(starField => {
            starField.geometry.dispose();
            starField.material.dispose();
        });
    }
}

// ===== PLANET SCENE INITIALIZATION =====
let planetScene;

// Initialize planet scene when Three.js is loaded
function initPlanetScene() {
    if (typeof THREE !== 'undefined') {
        planetScene = new PlanetScene();
    } else {
        // Wait for Three.js to load
        setTimeout(initPlanetScene, 100);
    }
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is already loaded
    if (typeof THREE !== 'undefined') {
        initPlanetScene();
    } else {
        // Wait for Three.js script to load
        const checkThreeJS = setInterval(() => {
            if (typeof THREE !== 'undefined') {
                clearInterval(checkThreeJS);
                initPlanetScene();
            }
        }, 100);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (planetScene) {
        planetScene.destroy();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlanetScene;
}
