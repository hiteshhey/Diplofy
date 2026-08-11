import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../lib/supabase"

function CutoffExplorer() {
  const [year, setYear] = useState(2025)
  const [city, setCity] = useState("All")
  const [search, setSearch] = useState("")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")
  const [visibleCount, setVisibleCount] = useState(5)

  const cityOptions = [
    "All",
    "Dombivali",
    "Mumbai",
    "Navi Mumbai",
    "Panvel",
    "Pune",
    "Thane",
  ]

  const yearOptions = [2025, 2024]

  useEffect(() => {
    fetchCutoffs()
  }, [year])

  useEffect(() => {
    setVisibleCount(5)
  }, [year, city, search])

  const fetchCutoffs = async () => {
    setLoading(true)
    setError("")

    try {
      const { data: cutoffData, error: supabaseError } =
        await supabase
          .from("college_cutoffs")
          .select(
            "id, year, city, college_name, branch, category, sub_category, cutoff_percentage"
          )
          .eq("year", year)
          .order("cutoff_percentage", {
            ascending: false,
          })

      if (supabaseError) {
        console.error(
          "Cutoff Explorer error:",
          supabaseError
        )

        throw new Error(
          "Unable to load cutoff data."
        )
      }

      setData(cutoffData || [])
    } catch (err) {
      console.error(err)
      setError(
        err.message ||
          "Something went wrong while loading cutoff data."
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredData = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase()

    return data.filter((item) => {
      const matchesCity =
        city === "All" ||
        String(item.city || "").toLowerCase() ===
          city.toLowerCase()

      const matchesSearch =
        !normalizedSearch ||
        String(item.college_name || "")
          .toLowerCase()
          .includes(normalizedSearch)

      return matchesCity && matchesSearch
    })
  }, [data, city, search])

  const visibleResults = filteredData.slice(
    0,
    visibleCount
  )

  const hasMore =
    visibleCount < filteredData.length

  const handleLoadMore = () => {
    setLoadingMore(true)

    setTimeout(() => {
      setVisibleCount((current) => current + 5)
      setLoadingMore(false)
    }, 250)
  }

  const formatCutoff = (value) => {
    const number = Number(value)

    if (Number.isNaN(number)) {
      return "—"
    }

    return `${number.toFixed(2)}%`
  }

  return (
    <section
      id="cutoffs"
      className="relative overflow-hidden bg-[#F5F0E6] px-6 py-24"
    >
      {/* =====================================================
          SOFT BEIGE ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#E8DDC9]/45 blur-[120px]" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#E9DFC9]/40 blur-[120px]" />

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <motion.div
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
          amount: 0.15,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-[#DCCFB8]/70 bg-[#F8F3E9] shadow-[0_25px_80px_rgba(100,82,55,0.08)]"
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="px-7 pb-8 pt-8 md:px-8 md:pt-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            {/* Heading */}

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8D9DB8]">
                Previous-year data
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#172036] md:text-[32px]">
                Engineering cutoffs
              </h2>

              <p className="mt-2 text-sm text-[#68758A]">
                Compare cutoff information across 2024
                and 2025.
              </p>
            </div>

            {/* =================================================
                YEAR + CITY CONTROLS
            ================================================== */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Year */}

              <div className="flex items-center rounded-2xl border border-[#E1D6C3] bg-[#F1E9DB] p-1">
                {yearOptions.map((option) => {
                  const active = year === option

                  return (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => setYear(option)}
                      whileHover={{
                        y: -1,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-[#4F8EF7] text-white shadow-[0_7px_18px_rgba(79,142,247,0.20)]"
                          : "text-[#6F7D92] hover:bg-[#F8F3E9] hover:text-[#4A566B]"
                      }`}
                    >
                      {option}
                    </motion.button>
                  )
                })}
              </div>

              {/* City */}

              <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-[#E1D6C3] bg-[#EEE6D8] p-1">
                {cityOptions.map((option) => {
                  const active = city === option

                  return (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => setCity(option)}
                      whileTap={{
                        scale: 0.97,
                      }}
                      className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-[#172036] text-[#F8F3E9] shadow-[0_6px_18px_rgba(23,32,54,0.12)]"
                          : "text-[#6F7D92] hover:bg-[#F8F3E9] hover:text-[#4A566B]"
                      }`}
                    >
                      {option}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* =================================================
              SEARCH
          ================================================== */}

          <div className="mt-7 max-w-xl">
            <div className="group relative">
              {/* Search icon */}

              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A2AFC2] transition-colors duration-200 group-focus-within:text-[#8E9CB0]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search for a specific college..."
                className="w-full rounded-2xl border border-[#E3D9C9] bg-[#FBF8F2] px-11 py-3.5 text-sm text-[#172036] outline-none transition-all duration-200 placeholder:text-[#9AA7BA] focus:border-[#CFC1A8] focus:bg-[#FCFAF6] focus:ring-4 focus:ring-[#DCCFB8]/20"
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            FILTER SUMMARY
        ====================================================== */}

        <div className="border-y border-[#E4DACA] bg-[#F3ECDF]/55 px-7 py-4 md:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#8A98AD]">
                Showing:
              </span>

              <span className="rounded-full border border-[#D9CDB9] bg-[#F8F3E9] px-3 py-1 text-[11px] font-semibold text-[#4F8EF7]">
                {year}
              </span>

              <span className="rounded-full border border-[#D9CDB9] bg-[#F8F3E9] px-3 py-1 text-[11px] font-semibold text-[#667389]">
                {city}
              </span>
            </div>

            <span className="text-xs text-[#8A98AD]">
              {filteredData.length} results
            </span>
          </div>
        </div>

        {/* =====================================================
            TABLE HEADER
        ====================================================== */}

        <div className="hidden border-b border-[#E4DACA] px-8 py-5 md:grid md:grid-cols-[minmax(0,2.7fr)_0.55fr_1.2fr_0.65fr_0.55fr] md:gap-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8D9DB8]">
            College
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8D9DB8]">
            Location
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8D9DB8]">
            Branch
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8D9DB8]">
            Category
          </p>

          <p className="text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8D9DB8]">
            Cutoff
          </p>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="border-b border-[#E8DECE] px-7 py-7 md:px-8"
              >
                <div className="animate-pulse">
                  <div className="h-4 w-2/3 rounded-full bg-[#E5DAC8]" />

                  <div className="mt-4 h-3 w-1/3 rounded-full bg-[#EAE0D1]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {!loading && error && (
          <div className="px-7 py-16 text-center md:px-8">
            <div className="mx-auto max-w-md rounded-[24px] border border-[#DECDB8] bg-[#F2E8D8] p-8">
              <p className="text-sm font-medium text-[#8A6552]">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchCutoffs}
                className="mt-5 rounded-xl bg-[#172036] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {!loading &&
          !error &&
          filteredData.length === 0 && (
            <div className="px-7 py-20 text-center md:px-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DCCFB8] bg-[#F1E8D8] text-lg">
                🔎
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#172036]">
                No colleges found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#718096]">
                Try changing your search or selecting
                another location.
              </p>
            </div>
          )}

        {/* =====================================================
            RESULTS
        ====================================================== */}

        {!loading &&
          !error &&
          visibleResults.length > 0 && (
            <div>
              <AnimatePresence initial={false}>
                {visibleResults.map(
                  (college, index) => (
                    <motion.div
                      key={`${college.id}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.35,
                        delay:
                          index < 5
                            ? index * 0.035
                            : 0,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        backgroundColor:
                          "rgba(239, 231, 216, 0.42)",
                      }}
                      className="group border-b border-[#E8DECE] px-7 py-6 transition-colors duration-300 md:px-8"
                    >
                      {/* Desktop */}

                      <div className="hidden items-center gap-5 md:grid md:grid-cols-[minmax(0,2.7fr)_0.55fr_1.2fr_0.65fr_0.55fr]">
                        {/* College */}

                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DCCFB8] bg-[#F0E8DA] text-xs font-semibold text-[#4F8EF7] transition-transform duration-300 group-hover:-translate-y-0.5">
                            {index + 1}
                          </span>

                          <p className="min-w-0 text-sm font-semibold leading-6 text-[#243047]">
                            {college.college_name}
                          </p>
                        </div>

                        {/* Location */}

                        <p className="text-sm text-[#66758C]">
                          {college.city}
                        </p>

                        {/* Branch */}

                        <p className="text-sm leading-5 text-[#66758C]">
                          {college.branch}
                        </p>

                        {/* Category */}

                        <div>
                          <span className="inline-flex rounded-full border border-[#DED4C5] bg-[#EFE9DE] px-3 py-1 text-[10px] font-semibold text-[#5F6B7E]">
                            {college.sub_category ||
                              college.category ||
                              "—"}
                          </span>
                        </div>

                        {/* Cutoff */}

                        <div className="text-right">
                          <span className="inline-flex rounded-full border border-[#D8D1C6] bg-[#E9EEF5] px-3 py-1.5 text-xs font-semibold text-[#3E78DD]">
                            {formatCutoff(
                              college.cutoff_percentage
                            )}
                          </span>
                        </div>
                      </div>

                      {/* =================================================
                          MOBILE
                      ================================================== */}

                      <div className="md:hidden">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DCCFB8] bg-[#F0E8DA] text-xs font-semibold text-[#4F8EF7]">
                            {index + 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold leading-6 text-[#243047]">
                              {college.college_name}
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full border border-[#DED4C5] bg-[#EFE9DE] px-2.5 py-1 text-[10px] font-semibold text-[#5F6B7E]">
                                {college.city}
                              </span>

                              <span className="rounded-full border border-[#DED4C5] bg-[#EFE9DE] px-2.5 py-1 text-[10px] font-semibold text-[#5F6B7E]">
                                {college.sub_category ||
                                  college.category ||
                                  "—"}
                              </span>

                              <span className="rounded-full border border-[#D8D1C6] bg-[#E9EEF5] px-2.5 py-1 text-[10px] font-semibold text-[#3E78DD]">
                                {formatCutoff(
                                  college.cutoff_percentage
                                )}
                              </span>
                            </div>

                            <p className="mt-3 text-xs leading-5 text-[#748197]">
                              {college.branch}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          )}

        {/* =====================================================
            LOAD MORE
        ====================================================== */}

        {!loading &&
          !error &&
          filteredData.length > 0 && (
            <div className="flex justify-center px-7 py-7 md:px-8">
              {hasMore ? (
                <motion.button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  whileHover={{
                    y: -3,
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="rounded-2xl bg-[#172036] px-7 py-3.5 text-sm font-semibold text-[#F8F3E9] shadow-[0_12px_30px_rgba(23,32,54,0.12)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(23,32,54,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMore
                    ? "Loading..."
                    : "Load More ↓"}
                </motion.button>
              ) : (
                <p className="py-2 text-xs font-medium text-[#9AA5B5]">
                  Showing all {filteredData.length}{" "}
                  results
                </p>
              )}
            </div>
          )}
      </motion.div>
    </section>
  )
}

export default CutoffExplorer