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
    new THREE.BoxGeometry(4, 2.5, 4), // width, height, depth
    new THREE.MeshStandardMaterial({ color: '#ac8e82' })
)
walls.position.y = 1.25 // Move the walls up so they sit on the floor
house.add(walls)

/**
 * Roof (Pyramid shape made from a cone)
 */
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4), // radius, height, sides (4 sides make it a pyramid)
    new THREE.MeshStandardMaterial({ color: 'red' })
)
roof.rotation.y = Math.PI * 0.25 // Rotate the roof to align with the walls
roof.position.y = 2.5 + 0.5 // Place the roof above the walls
house.add(roof)

/**
 * Door
 */
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5), // width, height of the door
    new THREE.MeshStandardMaterial({ color: '#aa7b7b' }) // Door color
)
door.position.y = 1 // Center the door at the bottom of the walls
door.position.z = 2 + 0.01 // Place door slightly in front to avoid z-fighting
house.add(door)

/**
 * Floor (already added)
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20), // Large floor area
    new THREE.MeshStandardMaterial({ color: '#a9c388' }) // Grass color for floor
)
floor.rotation.x = - Math.PI * 0.5 // Rotate to lay flat
floor.position.y = 0 // Position on the ground level
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
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
