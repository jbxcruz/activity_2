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

/**
 * House Container
 */
const house = new THREE.Group()
scene.add(house)

/**
 * Walls
 */
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 4, 4), // width, height, depth
    new THREE.MeshStandardMaterial({ color: '#ac8e82' })
)
walls.position.y = 1 // Move the walls up so they sit on the floor
house.add(walls)

/**
 * Roof (Pyramid shape made from a cone)
 */
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4), // radius, height, sides (4 sides make it a pyramid)
    new THREE.MeshStandardMaterial({ color: '#F5F5DC' })
)
roof.rotation.y = Math.PI * 0.25 // Rotate the roof to align with the walls
roof.position.y = 3.0 + 0.5 // Place the roof above the walls
house.add(roof)

/**
 * Door
 */
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 2), // width, height of the door
    new THREE.MeshStandardMaterial({ color: '#aa7b7b' }) // Door color
)
door.position.y = 0 // Center the door at the bottom of the walls
door.position.z = 2 + 0.01 // Place door slightly in front to avoid z-fighting
house.add(door)


// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 10); // intensity and distance
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
bush1.position.set(0.8, -0.5, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

// Add all the bushes to the house
house.add(bush1, bush2, bush3, bush4)






/**
 * Floor (already added)
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20), // Large floor area
    new THREE.MeshStandardMaterial({ color: '#a9c388' }) // Grass color for floor
)
floor.rotation.x = - Math.PI * 0.5 // Rotate to lay flat
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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls for smooth camera movement
    controls.update()

    // Render the scene with the camera
    renderer.render(scene, camera)

    // Call the next frame
    window.requestAnimationFrame(tick)
}

tick()
