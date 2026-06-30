<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  shape: {
    type: String,
    required: true
  }
})

const container = ref(null)
let scene, camera, renderer, mesh, animationId
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

function createTriangularPrismGeometry() {
  const triangle = new THREE.Shape()
  triangle.moveTo(0, 1.15)
  triangle.lineTo(-1.15, -0.85)
  triangle.lineTo(1.15, -0.85)
  triangle.lineTo(0, 1.15)

  const geometry = new THREE.ExtrudeGeometry(triangle, {
    depth: 1.9,
    bevelEnabled: false
  })

  geometry.center()
  return geometry
}

function createShape(shapeType) {
  let geometry
  
  switch (shapeType) {
    case 'cube':
      geometry = new THREE.BoxGeometry(2, 2, 2)
      break
    case 'cuboid':
    case 'rectangular_prism':
      geometry = new THREE.BoxGeometry(2.8, 1.5, 1.8)
      break
    case 'sphere':
      geometry = new THREE.SphereGeometry(1.2, 32, 32)
      break
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(1, 1, 2, 32)
      break
    case 'cone':
      geometry = new THREE.ConeGeometry(1, 2, 32)
      break
    case 'pyramid':
    case 'square_pyramid':
      geometry = new THREE.ConeGeometry(1.35, 2.1, 4)
      break
    case 'triangular_prism':
      geometry = createTriangularPrismGeometry()
      break
    case 'pentagonal_prism':
      geometry = new THREE.CylinderGeometry(1.15, 1.15, 2, 5)
      break
    case 'hexagonal_prism':
      geometry = new THREE.CylinderGeometry(1.15, 1.15, 2, 6)
      break
    case 'octahedron':
      geometry = new THREE.OctahedronGeometry(1.45)
      break
    case 'tetrahedron':
      geometry = new THREE.TetrahedronGeometry(1.55)
      break
    case 'dodecahedron':
      geometry = new THREE.DodecahedronGeometry(1.25)
      break
    case 'icosahedron':
      geometry = new THREE.IcosahedronGeometry(1.25)
      break
    case 'torus':
      geometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
      break
    default:
      geometry = new THREE.BoxGeometry(2, 2, 2)
  }
  
  return geometry
}

function init() {
  if (!container.value) return
  
  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 5
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)
  
  // Create shape
  const geometry = createShape(props.shape)
  const material = new THREE.MeshPhongMaterial({
    color: 0xffd700,
    shininess: 100,
    specular: 0x444444
  })
  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  
  // Add edges for better visibility
  const edges = new THREE.EdgesGeometry(geometry)
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
  const wireframe = new THREE.LineSegments(edges, lineMaterial)
  mesh.add(wireframe)
  
  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)
  
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
  directionalLight2.position.set(-5, -5, -5)
  scene.add(directionalLight2)
  
  // Mouse events
  renderer.domElement.addEventListener('mousedown', onMouseDown)
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('mouseup', onMouseUp)
  renderer.domElement.addEventListener('mouseleave', onMouseUp)
  
  // Touch events for mobile
  renderer.domElement.addEventListener('touchstart', onTouchStart)
  renderer.domElement.addEventListener('touchmove', onTouchMove)
  renderer.domElement.addEventListener('touchend', onTouchEnd)
  
  animate()
}

function onMouseDown(e) {
  isDragging = true
  previousMousePosition = { x: e.clientX, y: e.clientY }
}

function onMouseMove(e) {
  if (!isDragging || !mesh) return
  
  const deltaX = e.clientX - previousMousePosition.x
  const deltaY = e.clientY - previousMousePosition.y
  
  mesh.rotation.y += deltaX * 0.01
  mesh.rotation.x += deltaY * 0.01
  
  previousMousePosition = { x: e.clientX, y: e.clientY }
}

function onMouseUp() {
  isDragging = false
}

function onTouchStart(e) {
  if (e.touches.length === 1) {
    isDragging = true
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
}

function onTouchMove(e) {
  if (!isDragging || !mesh || e.touches.length !== 1) return
  
  e.preventDefault()
  const deltaX = e.touches[0].clientX - previousMousePosition.x
  const deltaY = e.touches[0].clientY - previousMousePosition.y
  
  mesh.rotation.y += deltaX * 0.01
  mesh.rotation.x += deltaY * 0.01
  
  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
}

function onTouchEnd() {
  isDragging = false
}

function animate() {
  animationId = requestAnimationFrame(animate)
  
  // Gentle auto-rotation when not dragging
  if (!isDragging && mesh) {
    mesh.rotation.y += 0.005
    mesh.rotation.x += 0.002
  }
  
  renderer.render(scene, camera)
}

function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (renderer) {
    renderer.domElement.removeEventListener('mousedown', onMouseDown)
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('mouseup', onMouseUp)
    renderer.domElement.removeEventListener('mouseleave', onMouseUp)
    renderer.domElement.removeEventListener('touchstart', onTouchStart)
    renderer.domElement.removeEventListener('touchmove', onTouchMove)
    renderer.domElement.removeEventListener('touchend', onTouchEnd)
    
    if (container.value && renderer.domElement) {
      container.value.removeChild(renderer.domElement)
    }
    renderer.dispose()
  }
  
  if (mesh) {
    mesh.traverse((child) => {
      if (child.geometry) child.geometry.dispose()
      if (child.material) child.material.dispose()
    })
  }
}

watch(() => props.shape, () => {
  cleanup()
  init()
})

onMounted(() => {
  init()
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div class="relative">
    <div 
      ref="container" 
      class="w-full h-64 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing border-2 border-hp-gold/30"
      style="touch-action: none;"
    />
    <div class="text-center mt-2 text-hp-gold/70 text-sm">
      🖱️ Drag to rotate • Touch and move on mobile
    </div>
  </div>
</template>

<style scoped>
</style>
