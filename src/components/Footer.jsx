import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import diplofyLogo from "../assets/diplofy-logo-transparent.png"

function scrollToSection(id) {
  const element = document.getElementById(id)

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

function Footer() {
  const [activeModal, setActiveModal] = useState(null)
  const [copied, setCopied] = useState("")

  const primaryUpi = "8446605044@upi"
  const secondaryUpi = "hiteshkapure0444@okicici"
  const email = "hiteshbuilds@gmail.com"

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveModal(null)
      }
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const openModal = (modal) => {
    setActiveModal(modal)
  }

  const closeModal = () => {
    setActiveModal(null)
    setCopied("")
  }

  const copyUpi = async (upi) => {
    try {
      await navigator.clipboard.writeText(upi)
      setCopied(upi)

      setTimeout(() => {
        setCopied("")
      }, 1800)
    } catch (error) {
      console.error("Could not copy UPI ID:", error)
    }
  }

  const exploreLinks = [
    {
      label: "Home",
      target: "home",
    },
    {
      label: "College Predictor",
      target: "predictor",
    },
    {
      label: "Cutoffs",
      target: "cutoffs",
    },
    {
      label: "Compare Colleges",
      target: "compare",
    },
  ]

  const diplofyLinks = [
    {
      label: "About",
      action: () => openModal("about"),
    },
    {
      label: "How it works",
      action: () => openModal("how"),
    },
    {
      label: "Contact",
      action: () => openModal("contact"),
    },
    {
      label: "Support Diplofy",
      action: () => openModal("support"),
    },
  ]

  const FooterLink = ({ label, target, action }) => {
    return (
      <motion.button
        type="button"
        onClick={() => {
          if (action) {
            action()
          } else if (target) {
            scrollToSection(target)
          }
        }}
        whileHover={{ x: 3 }}
        transition={{ duration: 0.18 }}
        className="
          text-left
          text-sm
          text-[#536681]
          transition-colors
          duration-200
          hover:text-[#8A765A]
        "
      >
        {label}
      </motion.button>
    )
  }

  return (
    <>
      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative px-6 pb-8 pt-12">
        {/* Ambient background */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-72 overflow-hidden">
          <div
            className="
              absolute
              bottom-0
              left-1/4
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
              bottom-0
              right-1/4
              h-64
              w-64
              rounded-full
              bg-[#E8DDC8]/30
              blur-[100px]
            "
          />
        </div>

        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.65,
              ease: "easeOut",
            }}
            className="
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-[#DCCEB5]/70
              bg-[#F7F2E8]/85
              px-7
              py-10
              shadow-[0_20px_70px_rgba(91,74,48,0.08)]
              backdrop-blur-xl
              md:px-10
              md:py-11
            "
          >
            {/* Decorative glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-28
                -top-28
                h-64
                w-64
                rounded-full
                bg-[#E8DDC8]/35
                blur-[90px]
              "
            />

            <div className="relative">

              {/* =================================================
                  MAIN FOOTER
              ================================================== */}

              <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">

                {/* BRAND */}

                <div>
                  <motion.button
                    type="button"
                    onClick={() => scrollToSection("home")}
                    whileHover={{
                      y: -2,
                      scale: 1.01,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="
                      block
                      outline-none
                    "
                    aria-label="Go to home"
                  >
                    <img
                      src={diplofyLogo}
                      alt="Diplofy"
                      className="
                        h-auto
                        w-[145px]
                        object-contain
                        object-left
                      "
                    />
                  </motion.button>

                  <p className="mt-5 max-w-sm text-sm leading-6 text-[#61728F]">
                    A smarter way for diploma students to discover,
                    explore, and compare engineering colleges.
                  </p>
                </div>

                {/* EXPLORE */}

                <div>
                  <p
                    className="
                      mb-5
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#A49378]
                    "
                  >
                    Explore
                  </p>

                  <nav className="flex flex-col items-start gap-3">
                    {exploreLinks.map((link) => (
                      <FooterLink
                        key={link.label}
                        label={link.label}
                        target={link.target}
                      />
                    ))}
                  </nav>
                </div>

                {/* DIPLOFY */}

                <div>
                  <p
                    className="
                      mb-5
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#A49378]
                    "
                  >
                    Diplofy
                  </p>

                  <nav className="flex flex-col items-start gap-3">
                    {diplofyLinks.map((link) => (
                      <FooterLink
                        key={link.label}
                        label={link.label}
                        target={link.target}
                        action={link.action}
                      />
                    ))}
                  </nav>
                </div>
              </div>

              {/* DIVIDER */}

              <div className="my-9 h-px bg-[#DCCEB5]/55" />

              {/* BOTTOM */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#8A9BB4]">
                  © 2026 Diplofy. Built for diploma students.
                </p>

                <motion.button
                  type="button"
                  onClick={() => scrollToSection("home")}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.18 }}
                  className="
                    group
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-[#8A9BB4]
                    transition-colors
                    duration-200
                    hover:text-[#8A765A]
                  "
                >
                  Discover your possibilities.

                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* =====================================================
          ALL MODALS
      ====================================================== */}

      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-[#5C513F]/20
              px-5
              py-8
              backdrop-blur-[7px]
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 18,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 18,
              }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                max-h-[90vh]
                w-full
                max-w-2xl
                overflow-y-auto
                rounded-[30px]
                border
                border-[#DCCEB5]
                bg-[#F7F2E8]
                p-7
                shadow-[0_30px_100px_rgba(72,59,40,0.18)]
                md:p-10
              "
            >

              {/* Modal glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-24
                  -top-24
                  h-52
                  w-52
                  rounded-full
                  bg-[#E8DDC8]/35
                  blur-[80px]
                "
              />

              <div className="relative">

                {/* CLOSE BUTTON */}

                <motion.button
                  type="button"
                  onClick={closeModal}
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="
                    absolute
                    right-0
                    top-0
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#DCCEB5]
                    bg-[#F2EBDD]
                    text-lg
                    leading-none
                    text-[#756A59]
                    transition-colors
                    duration-200
                    hover:bg-[#EAE0CE]
                    hover:text-[#8A765A]
                  "
                  aria-label="Close"
                >
                  ×
                </motion.button>

                {/* =================================================
                    ABOUT
                ================================================== */}

                {activeModal === "about" && (
                  <>
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A49378]">
                      About Diplofy
                    </p>

                    <h2 className="max-w-xl pr-10 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#24324A] md:text-[38px]">
                      Built for the students who were missing a choice.
                    </h2>

                    <div className="my-7 h-px bg-[#DCCEB5]/70" />

                    <div className="space-y-5 text-[15px] leading-7 text-[#61728F]">
                      <p>
                        Students preparing through{" "}
                        <span className="font-medium text-[#4F5F78]">
                          MHT-CET
                        </span>{" "}
                        and{" "}
                        <span className="font-medium text-[#4F5F78]">
                          JEE
                        </span>{" "}
                        have platforms to explore and predict colleges.
                        But for diploma students looking for{" "}
                        <span className="font-medium text-[#4F5F78]">
                          Direct Second Year (DSE)
                        </span>{" "}
                        admissions, finding the right college can be much
                        harder.
                      </p>

                      <p>
                        <span className="font-semibold text-[#4F5F78]">
                          Diplofy was built to change that.
                        </span>{" "}
                        A simple platform made specifically for diploma
                        students to predict, explore, and compare
                        engineering colleges.
                      </p>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#CBBFA8]" />

                      <p className="text-xs text-[#A49378]">
                        Made for diploma students.
                      </p>
                    </div>
                  </>
                )}

                {/* =================================================
                    HOW IT WORKS
                ================================================== */}

                {activeModal === "how" && (
                  <>
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A49378]">
                      How Diplofy works
                    </p>

                    <h2 className="max-w-xl pr-10 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#24324A] md:text-[38px]">
                      From your marks to your possibilities.
                    </h2>

                    <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#61728F]">
                      Diplofy keeps the process simple so you can spend
                      less time searching and more time understanding your
                      options.
                    </p>

                    <div className="my-7 h-px bg-[#DCCEB5]/70" />

                    <div className="space-y-4">
                      {[
                        {
                          number: "01",
                          title: "Tell us your profile",
                          text: "Enter your diploma percentage, category, and preferred engineering branches.",
                        },
                        {
                          number: "02",
                          title: "We compare the data",
                          text: "Diplofy compares your profile with previous-year Direct Second Year cutoff data.",
                        },
                        {
                          number: "03",
                          title: "Explore your options",
                          text: "Discover matching colleges, explore cutoff trends, and compare colleges side by side.",
                        },
                      ].map((step) => (
                        <div
                          key={step.number}
                          className="
                            rounded-[22px]
                            border
                            border-[#DCCEB5]
                            bg-[#F2EBDD]/60
                            p-5
                          "
                        >
                          <div className="flex gap-4">
                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#E7DDCA]
                                text-xs
                                font-semibold
                                text-[#756A59]
                              "
                            >
                              {step.number}
                            </div>

                            <div>
                              <h3 className="font-semibold text-[#34445E]">
                                {step.title}
                              </h3>

                              <p className="mt-1.5 text-sm leading-6 text-[#71829B]">
                                {step.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* =================================================
                    CONTACT
                ================================================== */}

                {activeModal === "contact" && (
                  <>
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A49378]">
                      Contact Diplofy
                    </p>

                    <h2 className="max-w-xl pr-10 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#24324A] md:text-[38px]">
                      Have something to tell us?
                    </h2>

                    <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#61728F]">
                      Found incorrect cutoff data, have a suggestion,
                      or simply want to say hello? We'd love to hear
                      from you.
                    </p>

                    <div className="my-7 h-px bg-[#DCCEB5]/70" />

                    <div
                      className="
                        rounded-[22px]
                        border
                        border-[#DCCEB5]
                        bg-[#F2EBDD]/60
                        p-5
                      "
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A49378]">
                        Email
                      </p>

                      <p className="mt-2 break-all text-sm text-[#536681]">
                        {email}
                      </p>

                      <motion.a
                        href={`mailto:${email}`}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="
                          mt-4
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-[#DCCEB5]
                          bg-[#EAE0CE]
                          px-5
                          py-2.5
                          text-sm
                          font-medium
                          text-[#536681]
                          transition-colors
                          duration-200
                          hover:bg-[#E1D4BD]
                        "
                      >
                        Email Diplofy
                        <span>→</span>
                      </motion.a>
                    </div>
                  </>
                )}

                {/* =================================================
                    SUPPORT DIPLOFY
                ================================================== */}

                {activeModal === "support" && (
                  <>
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A49378]">
                      Support Diplofy
                    </p>

                    <h2 className="max-w-xl pr-10 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#24324A] md:text-[38px]">
                      Help keep Diplofy growing.
                    </h2>

                    <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#61728F]">
                      Diplofy is an independent project built to make
                      the college-search process easier for diploma
                      students. If you've found it useful and would
                      like to support future improvements, you can
                      contribute through UPI.
                    </p>

                    <div className="my-7 h-px bg-[#DCCEB5]/70" />

                    <div className="grid gap-6 md:grid-cols-[220px_1fr]">

                      {/* QR CODE */}

                      <div
                        className="
                          flex
                          items-center
                          justify-center
                          rounded-[24px]
                          border
                          border-[#DCCEB5]
                          bg-[#F2EBDD]
                          p-4
                        "
                      >
                        <div className="overflow-hidden rounded-[16px] bg-white p-2 shadow-[0_8px_30px_rgba(91,74,48,0.08)]">
                          <img
                            src="/upi-qr.png"
                            alt="UPI QR Code"
                            className="
                              h-[180px]
                              w-[180px]
                              object-contain
                              rounded-[10px]
                            "
                          />
                        </div>
                      </div>

                      {/* UPI DETAILS */}

                      <div className="flex flex-col justify-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A49378]">
                          UPI IDs
                        </p>

                        {/* UPI 1 */}

                        <div
                          className="
                            mt-4
                            rounded-[18px]
                            border
                            border-[#DCCEB5]
                            bg-[#F2EBDD]/60
                            p-4
                          "
                        >
                          <p className="break-all text-sm text-[#536681]">
                            {primaryUpi}
                          </p>

                          <motion.button
                            type="button"
                            onClick={() => copyUpi(primaryUpi)}
                            whileTap={{ scale: 0.97 }}
                            className="
                              mt-3
                              rounded-full
                              border
                              border-[#DCCEB5]
                              bg-[#EAE0CE]
                              px-4
                              py-2
                              text-xs
                              font-medium
                              text-[#536681]
                              transition-colors
                              duration-200
                              hover:bg-[#E1D4BD]
                            "
                          >
                            {copied === primaryUpi
                              ? "Copied ✓"
                              : "Copy UPI ID"}
                          </motion.button>
                        </div>

                        {/* UPI 2 */}

                        <div
                          className="
                            mt-3
                            rounded-[18px]
                            border
                            border-[#DCCEB5]
                            bg-[#F2EBDD]/60
                            p-4
                          "
                        >
                          <p className="break-all text-sm text-[#536681]">
                            {secondaryUpi}
                          </p>

                          <motion.button
                            type="button"
                            onClick={() => copyUpi(secondaryUpi)}
                            whileTap={{ scale: 0.97 }}
                            className="
                              mt-3
                              rounded-full
                              border
                              border-[#DCCEB5]
                              bg-[#EAE0CE]
                              px-4
                              py-2
                              text-xs
                              font-medium
                              text-[#536681]
                              transition-colors
                              duration-200
                              hover:bg-[#E1D4BD]
                            "
                          >
                            {copied === secondaryUpi
                              ? "Copied ✓"
                              : "Copy UPI ID"}
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-6 text-xs leading-5 text-[#A49378]">
                      Every contribution helps improve the platform
                      and keep the project growing.
                    </p>
                  </>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Footer