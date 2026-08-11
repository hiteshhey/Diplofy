import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../lib/supabase"

function Predictor() {
  const [percentage, setPercentage] = useState("")
  const [category, setCategory] = useState("")
  const [branches, setBranches] = useState([])

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasPredicted, setHasPredicted] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  const categoryRef = useRef(null)

  const branchOptions = [
    "Computer Engineering",
    "Information Technology",
    "Artificial Intelligence & ML",
    "Data Science",
    "Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ]

  const categoryOptions = [
    { value: "OPEN", label: "Open" },
    { value: "OBC", label: "OBC" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
    { value: "EWS", label: "EWS" },
    { value: "NT", label: "NT" },
    { value: "SBC", label: "SBC" },
  ]

  /*
   * Close category dropdown when clicking outside.
   */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setCategoryOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  /*
   * Toggle branch selection.
   */
  const toggleBranch = (branchName) => {
    setBranches((current) =>
      current.includes(branchName)
        ? current.filter((branch) => branch !== branchName)
        : [...current, branchName]
    )
  }

  /*
   * Category aliases used by the DSE cutoff data.
   */
  const categoryAliases = {
    OPEN: ["OPEN", "GOPEN", "LOPEN"],
    OBC: ["OBC", "GOBC", "LOBC"],
    SC: ["SC", "GSC", "LSC"],
    ST: ["ST", "GST", "LST"],
    EWS: ["EWS"],
    NT: [
      "NT",
      "GNTA",
      "GNTB",
      "GNTC",
      "GNTD",
      "LNTA",
      "LNTB",
      "LNTC",
      "LNTD",
    ],
    SBC: ["SBC", "GSBC", "LSBC"],
  }

  /*
   * Branch aliases used by the dataset.
   */
  const branchAliases = {
    "Computer Engineering": [
      "Computer Engineering",
      "Computer Science and Engineering",
    ],

    "Information Technology": [
      "Information Technology",
      "Information Technology Engineering",
    ],

    "Artificial Intelligence & ML": [
      "Artificial Intelligence & ML",
      "Artificial Intelligence and Machine Learning",
      "Artificial Intelligence & Machine Learning",
      "Artificial Intelligence",
    ],

    "Data Science": [
      "Data Science",
      "Artificial Intelligence and Data Science",
      "Artificial Intelligence & Data Science",
    ],

    "Electronics Engineering": [
      "Electronics Engineering",
      "Electronics and Telecommunication Engineering",
      "Electronics and Telecommunication Engg",
    ],

    "Mechanical Engineering": [
      "Mechanical Engineering",
    ],

    "Civil Engineering": [
      "Civil Engineering",
    ],
  }

  /*
   * Normalize database values before comparing them.
   */
  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")

  /*
   * Match category against database category/sub-category.
   */
  const matchesCategory = (row) => {
    const allowedCategories = categoryAliases[category] || []

    const rowCategory = normalize(row.category)
    const rowSubCategory = normalize(row.sub_category)

    return allowedCategories.some(
      (allowed) =>
        normalize(allowed) === rowCategory ||
        normalize(allowed) === rowSubCategory
    )
  }

  /*
   * Match selected branches against database branches.
   */
  const matchesBranch = (row) => {
    const rowBranch = normalize(row.branch)

    return branches.some((selectedBranch) => {
      const aliases =
        branchAliases[selectedBranch] || [selectedBranch]

      return aliases.some(
        (alias) => normalize(alias) === rowBranch
      )
    })
  }

  /*
   * Calculate admission chance.
   */
  const getChance = (percentageValue, cutoffValue) => {
    const difference = percentageValue - cutoffValue

    if (difference >= 3) {
      return {
        label: "Strong Chance",
        className:
          "bg-[#E5EFE6] text-[#55745B] border-[#C9DCCB]",
      }
    }

    if (difference >= 0) {
      return {
        label: "Good Chance",
        className:
          "bg-[#EAE4D8] text-[#776A57] border-[#D8CCB8]",
      }
    }

    if (difference >= -2) {
      return {
        label: "Borderline",
        className:
          "bg-[#F3EBDD] text-[#927A51] border-[#E2D2B5]",
      }
    }

    return {
      label: "Reach",
      className:
        "bg-[#ECE9E2] text-[#777168] border-[#D9D3C7]",
    }
  }

  /*
   * Reset the entire predictor.
   */
  const handleReset = () => {
    setPercentage("")
    setCategory("")
    setBranches([])
    setResults([])
    setError("")
    setHasPredicted(false)
    setLoading(false)
    setCategoryOpen(false)
  }

  /*
   * Handle custom category selection.
   */
  const handleCategorySelect = (value) => {
    setCategory(value)
    setCategoryOpen(false)
    setError("")
  }

  /*
   * Main predictor logic.
   */
  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setResults([])
    setHasPredicted(false)

    const score = Number(percentage)

    if (!score || score < 0 || score > 100) {
      setError("Please enter a valid diploma percentage.")
      return
    }

    if (!category) {
      setError("Please select your category.")
      return
    }

    if (branches.length === 0) {
      setError("Please select at least one branch.")
      return
    }

    setLoading(true)

    try {
      /*
       * Fetch 2025 cutoff data from Supabase.
       */
      const { data, error: supabaseError } = await supabase
        .from("college_cutoffs")
        .select(
          "id, year, city, college_name, branch, category, sub_category, cutoff_percentage"
        )
        .eq("year", 2025)
        .in("city", ["Mumbai", "Pune"])

      if (supabaseError) {
        console.error(
          "Supabase predictor error:",
          supabaseError
        )

        throw new Error(
          "Unable to load college cutoff data."
        )
      }

      /*
       * Filter and calculate results.
       */
      const filteredResults = (data || [])
        .filter((row) => matchesCategory(row))
        .filter((row) => matchesBranch(row))
        .map((row) => {
          const cutoff = Number(row.cutoff_percentage)
          const chance = getChance(score, cutoff)

          return {
            ...row,
            cutoff,
            chance,
          }
        })

        /*
         * Don't show extremely unrealistic colleges.
         */
        .filter((row) => score >= row.cutoff - 2)

        /*
         * Closest cutoff first.
         */
        .sort((a, b) => {
          const aDifference = Math.abs(
            score - a.cutoff
          )

          const bDifference = Math.abs(
            score - b.cutoff
          )

          return aDifference - bDifference
        })

      /*
       * Remove duplicate college + branch combinations.
       */
      const uniqueResults = []
      const seen = new Set()

      for (const row of filteredResults) {
        const key = `${row.college_name}-${row.branch}-${row.city}`

        if (!seen.has(key)) {
          seen.add(key)
          uniqueResults.push(row)
        }
      }

      setResults(uniqueResults.slice(0, 30))
      setHasPredicted(true)
    } catch (err) {
      console.error(err)

      setError(
        err.message ||
          "Something went wrong while predicting."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="predictor"
      className="relative overflow-hidden px-6 py-28"
    >
      {/* =====================================================
          SOFT AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D8CBB5]/20 blur-[150px]" />

      <div className="pointer-events-none absolute -right-32 top-20 -z-10 h-[300px] w-[300px] rounded-full bg-[#E8DDCA]/30 blur-[110px]" />

      <div className="mx-auto max-w-4xl">

        {/* =====================================================
            HEADING
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCCFB9] bg-[#F5F0E6]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#776A57] shadow-sm backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B8A98E]" />
            College Predictor
          </div>

          <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 md:text-5xl">
            Find colleges that
            <br />

            <span className="text-[#4F8EF7]">
              fit your profile.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
            Tell us about your diploma score, category, and
            preferred branches. We'll compare your profile
            with previous-year cutoff data.
          </p>
        </motion.div>

        {/* =====================================================
            MAIN PREDICTOR CARD
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
            scale: 0.98,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="relative overflow-visible rounded-[32px] border border-[#D8CBB5] bg-[#F5F0E6]/90 p-6 shadow-[0_30px_100px_rgba(91,75,51,0.10)] backdrop-blur-2xl md:p-10"
        >

          <form
            onSubmit={handleSubmit}
            className="relative space-y-8"
          >

            {/* =================================================
                TOP PROFILE HEADER
            ================================================== */}

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4F8EF7] text-xs font-semibold text-white shadow-[0_6px_18px_rgba(79,142,247,0.22)]">
                  01
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Your academic profile
                  </p>

                  <p className="text-xs text-[#9B8E79]">
                    Start with your diploma details
                  </p>
                </div>

              </div>

              {/* RESET BUTTON */}

              <motion.button
                type="button"
                onClick={handleReset}
                whileHover={{
                  y: -1,
                  backgroundColor: "#EEE5D6",
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="rounded-full border border-[#D8CBB5] bg-[#F7F2E9] px-5 py-2.5 text-xs font-medium text-[#776A57] shadow-sm transition-colors"
              >
                Reset
              </motion.button>

            </div>

            {/* =================================================
                PERCENTAGE + CATEGORY
            ================================================== */}

            <div className="grid gap-6 md:grid-cols-2">

              {/* PERCENTAGE */}

              <div>
                <label
                  htmlFor="percentage"
                  className="mb-2.5 block text-sm font-medium text-[#62594D]"
                >
                  Diploma Percentage
                </label>

                <div className="relative">

                  <input
                    id="percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="85.50"
                    value={percentage}
                    onChange={(event) =>
                      setPercentage(event.target.value)
                    }
                    className="w-full rounded-2xl border border-[#D8CBB5] bg-[#F8F4EC] px-4 py-3.5 pr-12 text-sm font-medium text-[#514A41] outline-none transition-all duration-200 placeholder:text-[#AA9C87] focus:border-[#C7B89F] focus:bg-[#FAF7F0] focus:ring-4 focus:ring-[#D8CBB5]/25"
                    required
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#A4947C]">
                    %
                  </span>

                </div>
              </div>

              {/* =================================================
                  CUSTOM CATEGORY DROPDOWN
                  NO NATIVE SELECT
              ================================================== */}

              <div
                ref={categoryRef}
                className="relative"
              >

                <label
                  htmlFor="category-button"
                  className="mb-2.5 block text-sm font-medium text-[#62594D]"
                >
                  Category
                </label>

                <button
                  id="category-button"
                  type="button"
                  onClick={() =>
                    setCategoryOpen((current) => !current)
                  }
                  aria-haspopup="listbox"
                  aria-expanded={categoryOpen}
                  className="flex w-full items-center justify-between rounded-2xl border border-[#D8CBB5] bg-[#F8F4EC] px-4 py-3.5 text-left text-sm font-medium text-[#514A41] outline-none transition-all duration-200 hover:bg-[#FAF7F0] focus:border-[#C7B89F] focus:ring-4 focus:ring-[#D8CBB5]/25"
                >

                  <span
                    className={
                      category
                        ? "text-[#514A41]"
                        : "text-[#A4947C]"
                    }
                  >
                    {category
                      ? categoryOptions.find(
                          (item) =>
                            item.value === category
                        )?.label
                      : "Select your category"}
                  </span>

                  <motion.span
                    animate={{
                      rotate: categoryOpen ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 text-xs text-[#927F65]"
                  >
                    ↓
                  </motion.span>

                </button>

                {/* CUSTOM DROPDOWN */}

                <AnimatePresence>
                  {categoryOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -6,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 4,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -4,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.16,
                        ease: "easeOut",
                      }}
                      className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-2xl border border-[#D8CBB5] bg-[#F7F1E6] p-1.5 shadow-[0_18px_50px_rgba(91,75,51,0.15)]"
                      role="listbox"
                    >

                      {/* PLACEHOLDER */}

                      <button
                        type="button"
                        disabled
                        className="w-full cursor-default rounded-xl px-3 py-2.5 text-left text-xs font-medium text-[#A4947C]"
                      >
                        Select your category
                      </button>

                      {categoryOptions.map((option) => {
                        const selected =
                          category === option.value

                        return (
                          <motion.button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onClick={() =>
                              handleCategorySelect(
                                option.value
                              )
                            }
                            whileHover={{
                              backgroundColor: "#EDE3D2",
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                              selected
                                ? "bg-[#E9DECC] font-semibold text-[#665B4B]"
                                : "text-[#62594D]"
                            }`}
                          >

                            <span>
                              {option.label}
                            </span>

                            {selected && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#CBB99A] text-[11px] font-bold text-[#FFFDF8]">
                                ✓
                              </span>
                            )}

                          </motion.button>
                        )
                      })}

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* =================================================
                BRANCHES
            ================================================== */}

            <div className="pt-2">

              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#20283A] text-xs font-semibold text-white">
                      02
                    </div>

                    <p className="text-sm font-semibold text-slate-800">
                      Choose your branches
                    </p>

                  </div>

                  <p className="mt-2 text-xs text-[#8F826D] sm:ml-12">
                    Select as many branches as you're interested in.
                  </p>

                </div>

                {branches.length > 0 && (
                  <span className="w-fit rounded-full border border-[#D8CBB5] bg-[#EEE5D6] px-3 py-1.5 text-xs font-semibold text-[#766954]">
                    {branches.length} selected
                  </span>
                )}

              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">

                {branchOptions.map((branchName) => {
                  const selected =
                    branches.includes(branchName)

                  return (
                    <motion.button
                      key={branchName}
                      type="button"
                      whileHover={{
                        y: -1,
                      }}
                      whileTap={{
                        scale: 0.985,
                      }}
                      onClick={() =>
                        toggleBranch(branchName)
                      }
                      className={`group relative overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                        selected
                          ? "border-[#CDBB9E] bg-[#EEE5D6] shadow-[0_8px_25px_rgba(91,75,51,0.07)]"
                          : "border-[#DED4C3] bg-[#F8F4EC] hover:border-[#CDBEA5] hover:bg-[#FAF7F0]"
                      }`}
                    >

                      {/* IMPORTANT:
                          NO BLUE LEFT BAR
                      */}

                      <div className="flex items-center justify-between gap-4">

                        <span
                          className={`text-sm font-medium ${
                            selected
                              ? "text-[#5F5548]"
                              : "text-[#62594D]"
                          }`}
                        >
                          {branchName}
                        </span>

                        {/* BEIGE CHECK */}

                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                            selected
                              ? "border-[#C4B18F] bg-[#C4B18F] text-white"
                              : "border-[#D9CDBB] bg-[#F9F5ED] text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                      </div>

                    </motion.button>
                  )
                })}

              </div>
            </div>

            {/* =================================================
                SELECTED BRANCHES
            ================================================== */}

            <AnimatePresence>
              {branches.length > 0 && (
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
                  className="overflow-hidden"
                >

                  <div className="rounded-2xl border border-[#D8CBB5] bg-[#EEE5D6] p-4">

                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9B8E79]">
                      Selected branches
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {branches.map((branch) => (
                        <span
                          key={branch}
                          className="rounded-full border border-[#D5C6AD] bg-[#F8F3E9] px-3 py-1.5 text-xs font-medium text-[#665B4B]"
                        >
                          {branch}
                        </span>
                      ))}

                    </div>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-2xl border border-[#D8B8A8] bg-[#F3E5DD] px-4 py-3 text-sm text-[#8B5E4D]"
              >
                {error}
              </motion.div>
            )}

            {/* =================================================
                SUBMIT
            ================================================== */}

            <div className="border-t border-[#D8CBB5] pt-7">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-medium text-[#62594D]">
                    Ready to discover your options?
                  </p>

                  <p className="mt-1 text-xs text-[#9B8E79]">
                    We'll compare your score with 2025 cutoff data.
                  </p>

                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="rounded-2xl bg-[#4F8EF7] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,142,247,0.23)] transition-shadow hover:shadow-[0_16px_40px_rgba(79,142,247,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading
                    ? "Finding Colleges..."
                    : "Predict My Colleges"}

                  {!loading && (
                    <span className="ml-2">
                      →
                    </span>
                  )}

                </motion.button>

              </div>

            </div>

          </form>
        </motion.div>

        {/* =====================================================
            RESULTS
        ====================================================== */}

        <AnimatePresence>
          {hasPredicted && (
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              transition={{
                duration: 0.5,
              }}
              className="mt-12"
            >

              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8F7F65]">
                    Prediction Results
                  </p>

                  <h3 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-slate-900">
                    Colleges matching your profile
                  </h3>

                  <p className="mt-2 text-sm text-[#8F826D]">
                    {percentage}% · {category} ·{" "}
                    {results.length} results
                  </p>

                </div>

              </div>

              {results.length === 0 ? (
                <div className="rounded-[28px] border border-[#D8CBB5] bg-[#F5F0E6] p-10 text-center shadow-[0_20px_70px_rgba(91,75,51,0.08)]">

                  <div className="text-3xl">
                    🔎
                  </div>

                  <h4 className="mt-4 text-lg font-semibold text-[#5F5548]">
                    No close matches found
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8F826D]">
                    Try selecting another branch or entering
                    a slightly higher percentage.
                  </p>

                </div>
              ) : (
                <div className="grid gap-4">

                  {results.map((college, index) => (
                    <motion.div
                      key={`${college.id}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.04,
                      }}
                      className="rounded-[24px] border border-[#D8CBB5] bg-[#F7F2E9] p-5 shadow-[0_15px_50px_rgba(91,75,51,0.06)] transition-all hover:bg-[#FAF7F0]"
                    >

                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full border border-[#D8CBB5] bg-[#EEE5D6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#776A57]">
                              {college.city}
                            </span>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                                college.chance.className
                              }`}
                            >
                              {college.chance.label}
                            </span>

                          </div>

                          <h4 className="mt-3 text-base font-semibold leading-6 text-[#514A41]">
                            {college.college_name}
                          </h4>

                          <p className="mt-1 text-sm text-[#8F826D]">
                            {college.branch}
                          </p>

                        </div>

                        <div className="shrink-0 md:text-right">

                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9B8E79]">
                            Previous Cutoff
                          </p>

                          <p className="mt-1 text-2xl font-semibold tracking-tight text-[#514A41]">
                            {college.cutoff.toFixed(2)}%
                          </p>

                          <p className="mt-1 text-xs text-[#A4947C]">
                            2025
                          </p>

                        </div>

                      </div>

                    </motion.div>
                  ))}

                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}

export default Predictor