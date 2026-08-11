import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import logo from "../assets/diplofy-logo-transparent.png"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }

    setMenuOpen(false)
  }

  const navItems = [
    {
      label: "Home",
      id: "home",
    },
    {
      label: "Predictor",
      id: "predictor",
    },
    {
      label: "Cutoffs",
      id: "cutoffs",
    },
    {
      label: "Compare",
      id: "comparison",
    },
  ]

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <nav className="mx-auto max-w-7xl rounded-2xl border border-white/70 bg-white/55 px-4 py-3 shadow-[0_12px_40px_rgba(39,82,150,0.08)] backdrop-blur-2xl md:px-5">

        <div className="flex items-center justify-between">

          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="group flex items-center"
          >
            <img
              src={logo}
              alt="Diplofy"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">

            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-white/65 hover:text-slate-900"
              >
                {item.label}
              </button>
            ))}

          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <motion.button
              type="button"
              onClick={() => scrollToSection("predictor")}
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="rounded-xl bg-[#4F8EF7] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(79,142,247,0.22)] transition-shadow duration-200 hover:shadow-[0_10px_30px_rgba(79,142,247,0.3)]"
            >
              Predict My College
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-slate-700 transition-colors hover:bg-white/80 md:hidden"
          >
            <div className="flex w-5 flex-col gap-1.5">

              <motion.span
                animate={{
                  rotate: menuOpen ? 45 : 0,
                  y: menuOpen ? 5 : 0,
                }}
                className="block h-0.5 w-full rounded-full bg-current"
              />

              <motion.span
                animate={{
                  opacity: menuOpen ? 0 : 1,
                }}
                className="block h-0.5 w-full rounded-full bg-current"
              />

              <motion.span
                animate={{
                  rotate: menuOpen ? -45 : 0,
                  y: menuOpen ? -5 : 0,
                }}
                className="block h-0.5 w-full rounded-full bg-current"
              />

            </div>
          </button>

        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="overflow-hidden md:hidden"
            >

              <div className="mt-3 border-t border-slate-900/5 pt-3">

                <div className="space-y-1">

                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-white/65 hover:text-slate-900"
                    >
                      {item.label}
                    </button>
                  ))}

                </div>

                <motion.button
                  type="button"
                  onClick={() => scrollToSection("predictor")}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="mt-2 w-full rounded-xl bg-[#4F8EF7] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(79,142,247,0.2)]"
                >
                  Predict My College
                </motion.button>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </header>
  )
}

export default Navbar