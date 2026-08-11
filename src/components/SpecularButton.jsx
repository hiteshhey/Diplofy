import { useEffect, useRef, useState } from "react"

function SpecularButton({
  children,
  onClick,
  className = "",
  size = "md",
  radius = 18,
  baseColor = "#525252",
  textColor = "#f5f5f5",
  lineColor = "#ffffff",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
}) {
  const buttonRef = useRef(null)
  const animationRef = useRef(null)

  const [mouse, setMouse] = useState({
    x: 50,
    y: 50,
    active: false,
  })

  useEffect(() => {
    if (!followMouse) return

    const handleMouseMove = (event) => {
      const button = buttonRef.current

      if (!button) return

      const rect = button.getBoundingClientRect()

      const mouseX = event.clientX
      const mouseY = event.clientY

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distance = Math.sqrt(
        Math.pow(mouseX - centerX, 2) +
        Math.pow(mouseY - centerY, 2)
      )

      if (distance > proximity) {
        setMouse((prev) => ({
          ...prev,
          active: false,
        }))
        return
      }

      const x = ((mouseX - rect.left) / rect.width) * 100
      const y = ((mouseY - rect.top) / rect.height) * 100

      setMouse({
        x,
        y,
        active: true,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [followMouse, proximity])

  useEffect(() => {
    if (!autoAnimate) return

    let startTime = null

    const animate = (time) => {
      if (!startTime) startTime = time

      const elapsed = (time - startTime) / 1000

      const x =
        50 +
        Math.sin(elapsed * speed) * 35

      const y =
        50 +
        Math.cos(elapsed * speed * 0.8) * 20

      setMouse({
        x,
        y,
        active: true,
      })

      animationRef.current =
        requestAnimationFrame(animate)
    }

    animationRef.current =
      requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [autoAnimate, speed])

  const sizeClasses = {
    sm: "px-4 py-2.5 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-7 py-3.5 text-sm",
  }

  const shineOpacity = mouse.active ? intensity : 0

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative isolate overflow-hidden font-semibold transition-transform duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${className}`}
      style={{
        borderRadius: `${radius}px`,
        color: textColor,
        backgroundColor: baseColor,
        border: `${thickness}px solid ${lineColor}22`,
        boxShadow: `
          0 12px 35px rgba(15, 23, 42, 0.14),
          inset 0 1px 0 rgba(255, 255, 255, 0.08)
        `,
      }}
    >
      {/* Specular shine */}

      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: shineOpacity,
          background: `
            radial-gradient(
              ${shineSize * 8}px circle at ${mouse.x}% ${mouse.y}%,
              rgba(255,255,255,0.28),
              rgba(255,255,255,0.08) ${shineFade}%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Inner highlight */}

      <span
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: `${radius}px`,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -1px 0 rgba(0,0,0,0.12)
          `,
        }}
      />

      {/* Button content */}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  )
}

export default SpecularButton