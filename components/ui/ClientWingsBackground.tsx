"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ClientWingsBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Setup scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = null // Make background transparent

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    cameraRef.current = camera
    camera.position.z = 5 // Move camera back a bit

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    rendererRef.current = renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0) // Make renderer background transparent
    containerRef.current.appendChild(renderer.domElement)

    // Add mesh
    const geometry = new THREE.BoxGeometry(2, 2, 2) // Make cube bigger
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 30,
      specular: 0x4444ff,
      transparent: false // Remove transparency
    })
    const mesh = new THREE.Mesh(geometry, material)
    meshRef.current = mesh
    scene.add(mesh)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Animation
    function animate() {
      if (
        !meshRef.current ||
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current
      )
        return

      requestAnimationFrame(animate)

      // Rotate cube
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01

      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }

    animate()

    // Handle resize
    function handleResize() {
      if (!cameraRef.current || !rendererRef.current) return

      const width = window.innerWidth
      const height = window.innerHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()

      rendererRef.current.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        if (meshRef.current.material instanceof THREE.Material) {
          meshRef.current.material.dispose()
        }
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        zIndex: 0,
        pointerEvents: "none"
      }}
    />
  )
}
