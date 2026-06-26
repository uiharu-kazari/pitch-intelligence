import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// OrbitControls plus animated camera presets. `view` ('default' | 'top') triggers a smooth
// tween of camera position and orbit target; orbiting is disabled during the tween.

const PRESETS = {
  default: { pos: [2, 52, 92], target: [0, 0, 0] },
  top: { pos: [0, 118, 1.5], target: [0, 0, 0] },
}

export default function CameraRig({ view = 'default', viewNonce = 0 }) {
  const { camera } = useThree()
  const controls = useRef()
  const tween = useRef(null)

  useEffect(() => {
    const preset = PRESETS[view] || PRESETS.default
    tween.current = {
      fromPos: camera.position.clone(),
      toPos: new THREE.Vector3(...preset.pos),
      fromTarget: controls.current ? controls.current.target.clone() : new THREE.Vector3(),
      toTarget: new THREE.Vector3(...preset.target),
      t: 0,
      dur: 0.8,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, viewNonce])

  useFrame((_, delta) => {
    const tw = tween.current
    if (!tw || !controls.current) return
    tw.t = Math.min(1, tw.t + delta / tw.dur)
    const e = 1 - Math.pow(1 - tw.t, 3) // ease-out cubic
    camera.position.lerpVectors(tw.fromPos, tw.toPos, e)
    controls.current.target.lerpVectors(tw.fromTarget, tw.toTarget, e)
    controls.current.update()
    if (tw.t >= 1) tween.current = null
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={30}
      maxDistance={180}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 0, 0]}
    />
  )
}
