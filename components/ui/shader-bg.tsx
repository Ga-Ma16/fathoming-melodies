"use client";

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

const ShaderGradientComp = ShaderGradient as any

export default function ShaderBg() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      pixelDensity={1}
      fov={45}
    >
      <ShaderGradientComp
        animate="on"
        axesHelper="off"
        bgColor1="#000000"
        bgColor2="#000000"
        brightness={1.2}
        cAzimuthAngle={170}
        cDistance={4.4}
        cPolarAngle={70}
        cameraZoom={1}
        color1="#345CB5"
        color2="#121519"
        color3="#34B2D7"
        envPreset="city"
        lightType="3d"
        pixelDensity={1}
        positionX={0}
        positionY={0.9}
        positionZ={-0.3}
        type="waterPlane"
        uDensity={1.2}
        uSpeed={0.2}
        uStrength={3.4}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  )
}
