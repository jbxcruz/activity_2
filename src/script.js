import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
* Fog
*/
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog





/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()


// Load wall textures
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

/**
 * House Container
 */
const house = new THREE.Group()
scene.add(house)


/**
 * Walls - Updated with Brick Textures
 */
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 4, 4), // width, height, depth
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)

// Add UV2 mapping for ambient occlusion
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

walls.position.y = 1 // Adjust to ensure the walls sit on the floor
house.add(walls)



/**
 * Roof (Pyramid shape made from a cone)
 */
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4), // radius, height, sides (4 sides make it a pyramid)
    new THREE.MeshStandardMaterial({ color: '#9D6055' })
)
roof.rotation.y = Math.PI * 0.25 // Rotate the roof to align with the walls
roof.position.y = 3.0 + 0.5 // Place the roof above the walls
house.add(roof)






/**
 * Snowman
 */

// Snowman body - Three white spheres stacked on top of each other
const snowmanGeometry = new THREE.SphereGeometry(1, 16, 16) // Shared geometry for all snowman parts
const snowmanMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff' }) // Shared material for all snowman parts

// Bottom sphere (largest)
const snowmanBottom = new THREE.Mesh(snowmanGeometry, snowmanMaterial)
snowmanBottom.scale.set(0.6, 0.6, 0.6) // Make the bottom part larger
snowmanBottom.position.set(2, 1, 5) // Position on the ground

// Middle sphere (smaller)
const snowmanMiddle = new THREE.Mesh(snowmanGeometry, snowmanMaterial)
snowmanMiddle.scale.set(0.3, 0.3, 0.3) // Smaller than the bottom
snowmanMiddle.position.set(2, 3.2, 5) // Positioned above the bottom sphere

// Head sphere (smallest)
const snowmanHead = new THREE.Mesh(snowmanGeometry, snowmanMaterial)
snowmanHead.scale.set(0.10, 0.10, 0.10) // Smallest size for the head
snowmanHead.position.set(2, 4.7, 5) // Positioned above the middle sphere

// Snowman face (eyes and smile)
const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8) // Small sphere for eyes
const eyeMaterial = new THREE.MeshStandardMaterial({ color: '#000000' }) // Black material for eyes

// Left and right eyes
const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
leftEye.position.set(1.7, 5.2, 5.5)

const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
rightEye.position.set(2.3, 5.2, 5.5)

// Smile (using small black spheres)
const smile = []
const smileRadius = 0.1

smile.push(new THREE.Mesh(new THREE.SphereGeometry(smileRadius, 8, 8), eyeMaterial))
smile.push(new THREE.Mesh(new THREE.SphereGeometry(smileRadius, 8, 8), eyeMaterial))
smile.push(new THREE.Mesh(new THREE.SphereGeometry(smileRadius, 8, 8), eyeMaterial))

// Position smile
smile[0].position.set(1.8, 4.9, 5.5) // First smile point
smile[1].position.set(2.0, 4.8, 5.5) // Second smile point
smile[2].position.set(2.2, 4.9, 5.5) // Third smile point

// Group all parts into one group
const snowman = new THREE.Group()
snowman.add(snowmanBottom, snowmanMiddle, snowmanHead, leftEye, rightEye, ...smile)

// Position snowman
snowman.position.set(0, -1, -1) // You can adjust this position to move the snowman around

// Add snowman to the house
house.add(snowman)













/**
 * Chimney
 */

// Create the stack of the chimney (slightly narrower and taller)
const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 2, 0.6), // width, height, depth (smaller dimensions for the stack)
    // Slightly lighter gray for the stack


        new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })


    
)


chimney.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(chimney.geometry.attributes.uv.array, 2)
)

chimney.position.set(1.30, 3.50, -1.0) // Place it above the chimney base
house.add(chimney)








/**
 * Door - Updated with Textures
 */

// Loading textures for the door
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Creating the door with textures
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100), // Increased size for a larger door
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)

// Add UV2 for proper ambient occlusion mapping
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))

// Position the door and add it to the house
door.position.y = 0 // Adjust as needed for the door height
door.position.z = 2 + 0.01 // Position the door slightly in front to avoid z-fighting
house.add(door)

// Door light
const doorLight = new THREE.PointLight('#b4d4cf', 1, 10); // intensity and distance
doorLight.position.set(0, 3.2, 2.7); // Position above the door

// Create a target for the light (point it downwards)
const lightTarget = new THREE.Object3D();
lightTarget.position.set(0, 1, 2.7); // Positioning the target directly below the light

// Set the target
doorLight.target = lightTarget;

house.add(doorLight);
house.add(lightTarget); // Optionally add the target to the scene for debugging

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16) // Shared geometry for all bushes
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' }) // Shared material for all bushes

// Create individual bush meshes
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, -1, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.4, 0.4, 0.4)
bush2.position.set(-0.8, -1, 2.2)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.15, 0.15, 0.15)
bush3.position.set(-1, -1, 2.6)

// Add all the bushes to the house
house.add(bush1, bush2, bush3)





/**
 * Floor - Updated with Grass Textures
 */
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

// Repeat and wrap textures for tiling effect
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 1, 1), // Plane geometry with 1 segment
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)

// Add UV2 mapping for ambient occlusion
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

floor.rotation.x = -Math.PI * 0.5 // Rotate to lay flat
floor.position.y = -1 // Position on the ground level
scene.add(floor)






// Lights
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)  // Dim and blue-ish light
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)  // Dim and blue-ish light
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera and renderer to match new size
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor('#262837')





/**
 * Rain
 */
const rainGeometry = new THREE.BufferGeometry();
const rainCount = 1000; // Number of raindrops

// Create random positions for the raindrops
const rainPositions = new Float32Array(rainCount * 3);
for (let i = 0; i < rainCount * 3; i++) {
    rainPositions[i] = (Math.random() - 0.5) * 20; // Spread raindrops across a 20x20x20 area
}

rainGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(rainPositions, 3)
);

// Material for the raindrops
const rainMaterial = new THREE.PointsMaterial({
    color: '#D5D9E0',
    size: 0.05, // Small raindrops
    transparent: true,
    opacity: 0.8,
});

// Create the Points object
const rain = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rain);















/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Animate raindrops
    const positions = rain.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.02; // Move raindrops downwards

        // Reset raindrop to the top if it falls below the floor
        if (positions[i + 1] < -1) {
            positions[i + 1] = Math.random() * 10; // Reset to a random height
        }
    }
    rain.geometry.attributes.position.needsUpdate = true;

    // Update controls for smooth camera movement
    controls.update();

    // Render the scene with the camera
    renderer.render(scene, camera);

    // Call the next frame
    window.requestAnimationFrame(tick);
};



tick()
