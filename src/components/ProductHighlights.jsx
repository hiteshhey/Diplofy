import { motion } from "framer-motion"

function ProductHighlights() {
  const highlights = [
    {
      number: "01",
      eyebrow: "FIND YOUR POSSIBILITIES",
      title: "Predict",
      description:
        "Enter your diploma percentage, category, and preferred branches to discover colleges that match your profile.",
    },
    {
      number: "02",
      eyebrow: "UNDERSTAND THE DATA",
      title: "Explore Cutoffs",
      description:
        "View previous-year cutoff information by college, branch, category, and sub-category.",
    },
    {
      number: "03",
      eyebrow: "MAKE A BETTER CHOICE",
      title: "Compare",
      description:
        "Compare colleges side by side and understand how their historical cutoff patterns differ.",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-[#F5F0E6] px-6 py-20 md:py-24">
      {/* Soft ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8DDC9]/40 blur-[130px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {highlights.map((item, index) => (
          <motion.div
            key={item.number}
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.65,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -14,
              scale: 1.035,
              rotateX: 2,
              rotateY: index === 0 ? -1.5 : index === 2 ? 1.5 : 0,
            }}
            whileTap={{
              scale: 0.985,
            }}
            style={{
              transformPerspective: 1000,
            }}
            className="group relative min-h-[320px] cursor-default overflow-hidden rounded-[30px] border border-[#DCCFB8]/70 bg-[#F8F3E9] p-7 shadow-[0_18px_50px_rgba(100,82,55,0.06)] transition-shadow duration-500 hover:border-[#D6C7AD] hover:bg-[#FAF6EE] hover:shadow-[0_30px_80px_rgba(100,82,55,0.16)] md:p-8"
          >
            {/* Soft hover glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#E9DFC9]/70 opacity-0 blur-[65px] transition-opacity duration-500 group-hover:opacity-100" />

            {/* Subtle bottom glow */}
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-[#E5D8C0]/50 opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100" />

            {/* Number */}
            <div className="relative flex items-start justify-between">
              <span className="text-sm font-medium tracking-wide text-[#4F8EF7]">
                {item.number}
              </span>

              {/* Small indicator */}
              <motion.span
                className="mt-1.5 h-2 w-2 rounded-full bg-[#AFC8F7]"
                animate={{
                  opacity: [0.45, 1, 0.45],
                  scale: [0.9, 1.15, 0.9],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4,
                }}
              />
            </div>

            {/* Content */}
            <div className="relative mt-24">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8D9DB8]">
                {item.eyebrow}
              </p>

              <h3 className="text-2xl font-semibold tracking-[-0.035em] text-[#172036]">
                {item.title}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-[#53627A]">
                {item.description}
              </p>
            </div>

            {/* Hover border highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-transparent transition-colors duration-500 group-hover:border-[#CFC1A8]/70" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ProductHighlights