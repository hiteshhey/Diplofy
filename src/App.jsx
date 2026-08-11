import Navbar from "./components/Navbar"
import Predictor from "./components/Predictor"
import ProductHighlights from "./components/ProductHighlights"
import CutoffExplorer from "./components/CutoffExplorer"
import CollegeComparison from "./components/CollegeComparison"
import Footer from "./components/Footer"
import { motion } from "framer-motion"

function App() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Subtle ambient particles
  const particles = Array.from({ length: 24 }, (_, index) => ({
    id: index,
    size: index % 4 === 0 ? 4 : 2,
    left: `${(index * 37) % 100}%`,
    top: `${(index * 61) % 100}%`,
    duration: 8 + (index % 6) * 2,
    delay: -(index % 7) * 1.5,
    drift: index % 2 === 0 ? 18 : -18,
  }))

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F0E6]">

      {/* ================= FLOATING PARTICLES ================= */}

      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
            }}
            animate={{
              x: [0, particle.drift, 0],
              y: [0, -28, 0],
              opacity: [0, 0.14, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-[#4F8EF7]"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: particle.left,
              top: particle.top,
            }}
          />
        ))}
      </div>

      {/* ================= WEBSITE CONTENT ================= */}

      <div className="relative z-10">

        <Navbar />

        <main>

          {/* ================= HERO ================= */}

          <section
            id="home"
            className="
              relative
              flex
              min-h-[calc(100vh-80px)]
              items-center
              overflow-hidden
              bg-[#F5F0E6]
              px-6
              py-24
            "
          >

            {/* Soft beige ambient glow */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

              <div
                className="
                  absolute
                  -left-32
                  top-20
                  h-72
                  w-72
                  rounded-full
                  bg-[#E8DDC8]/35
                  blur-[110px]
                "
              />

              <div
                className="
                  absolute
                  -right-32
                  bottom-10
                  h-80
                  w-80
                  rounded-full
                  bg-[#E8DDC8]/30
                  blur-[120px]
                "
              />

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-64
                  w-64
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#4F8EF7]/[0.025]
                  blur-[100px]
                "
              />

            </div>

            <div className="relative mx-auto w-full max-w-7xl">

              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="
                  mx-auto
                  max-w-5xl
                  text-center
                "
              >

                {/* ================= EYEBROW ================= */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                  }}
                  className="mb-7 flex justify-center"
                >
                  <div
                    className="
                      rounded-full
                      border
                      border-[#DCCEB5]
                      bg-[#F2EBDD]/80
                      px-5
                      py-2
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-[#8F8069]
                      shadow-[0_8px_30px_rgba(91,74,48,0.05)]
                      backdrop-blur-md
                      sm:text-xs
                    "
                  >
                    College Discovery for Diploma Students
                  </div>
                </motion.div>

                {/* ================= MAIN HEADING ================= */}

                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                  }}
                  className="
                    text-5xl
                    font-semibold
                    leading-[0.98]
                    tracking-[-0.055em]
                    text-[#24324A]
                    sm:text-6xl
                    md:text-7xl
                    lg:text-[88px]
                  "
                >
                  Find the college
                  <br />

                  {/* NORMAL DIPLOFY BLUE */}

                  <span className="text-[#4F8EF7]">
                    that's right for you.
                  </span>
                </motion.h1>

                {/* ================= DESCRIPTION ================= */}

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.25,
                  }}
                  className="
                    mx-auto
                    mt-8
                    max-w-2xl
                    text-base
                    leading-7
                    text-[#71809A]
                    md:text-lg
                  "
                >
                  Discover engineering colleges using your diploma
                  percentage, category, preferred branches, and
                  previous-year cutoff data.
                </motion.p>

                {/* ================= CTA BUTTONS ================= */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.35,
                  }}
                  className="
                    mt-9
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-3
                    sm:flex-row
                  "
                >

                  {/* PREDICT MY COLLEGE */}

                  <motion.button
                    type="button"
                    onClick={() => scrollToSection("predictor")}
                    whileHover={{
                      y: -3,
                      scale: 1.015,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="
                      rounded-2xl
                      bg-[#4F8EF7]
                      px-7
                      py-3.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-[0_12px_35px_rgba(79,142,247,0.20)]
                      transition-all
                      duration-300
                      hover:shadow-[0_16px_45px_rgba(79,142,247,0.28)]
                    "
                  >
                    Predict My College

                    <span className="ml-2">
                      →
                    </span>
                  </motion.button>

                  {/* EXPLORE CUTOFFS */}

                  <motion.button
                    type="button"
                    onClick={() => scrollToSection("cutoffs")}
                    whileHover={{
                      y: -3,
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="
                      rounded-2xl
                      border
                      border-[#DCCEB5]
                      bg-[#F2EBDD]/80
                      px-7
                      py-3.5
                      text-sm
                      font-semibold
                      text-[#536681]
                      shadow-[0_8px_30px_rgba(91,74,48,0.06)]
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:border-[#CDBD9F]
                      hover:bg-[#EDE3D2]
                      hover:shadow-[0_12px_35px_rgba(91,74,48,0.09)]
                    "
                  >
                    Explore Cutoffs
                  </motion.button>

                </motion.div>

              </motion.div>

              {/* ================= BOTTOM VISUAL HINT ================= */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 1,
                }}
                className="mt-20 flex justify-center"
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    text-xs
                    font-medium
                    tracking-wide
                    text-[#A49378]
                  "
                >
                  <span className="h-px w-8 bg-[#DCCEB5]" />

                  Explore your possibilities

                  <span className="h-px w-8 bg-[#DCCEB5]" />
                </div>
              </motion.div>

            </div>
          </section>

          {/* ================= PREDICTOR ================= */}

          <div id="predictor">
            <Predictor />
          </div>

          {/* ================= PRODUCT HIGHLIGHTS ================= */}

          <ProductHighlights />

          {/* ================= CUTOFFS ================= */}

          <div id="cutoffs">
            <CutoffExplorer />
          </div>

          {/* ================= COLLEGE COMPARISON ================= */}

          <div id="comparison">
            <CollegeComparison />
          </div>

        </main>

        {/* ================= FOOTER ================= */}

        <Footer />

      </div>
    </div>
  )
}

export default App