import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { supabase } from "../lib/supabase"

function CompareColleges() {
  const [colleges, setColleges] = useState([])
  const [firstCollege, setFirstCollege] = useState("")
  const [secondCollege, setSecondCollege] = useState("")

  const [firstOpen, setFirstOpen] = useState(false)
  const [secondOpen, setSecondOpen] = useState(false)

  const [firstSearch, setFirstSearch] = useState("")
  const [secondSearch, setSecondSearch] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [comparisonData, setComparisonData] = useState({
    first: [],
    second: [],
  })

  /*
  |--------------------------------------------------------------------------
  | Load college list
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadColleges = async () => {
      setLoading(true)
      setError("")

      try {
        const { data, error: supabaseError } = await supabase
          .from("college_cutoffs")
          .select("college_name, city")
          .in("year", [2024, 2025])
          .order("college_name", { ascending: true })

        if (supabaseError) {
          throw supabaseError
        }

        /*
         * Remove duplicate college + city combinations.
         */

        const uniqueColleges = []
        const seen = new Set()

        for (const college of data || []) {
          const name = String(college.college_name || "").trim()
          const city = String(college.city || "").trim()

          if (!name) continue

          const key = `${name}-${city}`

          if (!seen.has(key)) {
            seen.add(key)

            uniqueColleges.push({
              college_name: name,
              city,
            })
          }
        }

        setColleges(uniqueColleges)
      } catch (err) {
        console.error("Compare colleges error:", err)

        setError(
          "Unable to load colleges right now. Please try again."
        )
      } finally {
        setLoading(false)
      }
    }

    loadColleges()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | Fetch comparison data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadComparison = async () => {
      if (!firstCollege && !secondCollege) {
        setComparisonData({
          first: [],
          second: [],
        })

        return
      }

      try {
        const selectedColleges = [
          firstCollege,
          secondCollege,
        ].filter(Boolean)

        const { data, error: supabaseError } = await supabase
          .from("college_cutoffs")
          .select(
            `
              id,
              year,
              city,
              college_name,
              branch,
              category,
              sub_category,
              cutoff_percentage
            `
          )
          .in("year", [2024, 2025])
          .in("college_name", selectedColleges)

        if (supabaseError) {
          throw supabaseError
        }

        const firstData = (data || []).filter(
          (row) => row.college_name === firstCollege
        )

        const secondData = (data || []).filter(
          (row) => row.college_name === secondCollege
        )

        setComparisonData({
          first: firstData,
          second: secondData,
        })
      } catch (err) {
        console.error("Comparison data error:", err)

        setComparisonData({
          first: [],
          second: [],
        })
      }
    }

    loadComparison()
  }, [firstCollege, secondCollege])

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  */

  const handleReset = () => {
    setFirstCollege("")
    setSecondCollege("")

    setFirstOpen(false)
    setSecondOpen(false)

    setFirstSearch("")
    setSecondSearch("")

    setComparisonData({
      first: [],
      second: [],
    })
  }

  /*
  |--------------------------------------------------------------------------
  | Filter dropdown options
  |--------------------------------------------------------------------------
  */

  const filteredFirstColleges = useMemo(() => {
    const search = firstSearch.trim().toLowerCase()

    if (!search) {
      return colleges.slice(0, 100)
    }

    return colleges
      .filter((college) => {
        return (
          college.college_name.toLowerCase().includes(search) ||
          college.city.toLowerCase().includes(search)
        )
      })
      .slice(0, 100)
  }, [colleges, firstSearch])

  const filteredSecondColleges = useMemo(() => {
    const search = secondSearch.trim().toLowerCase()

    if (!search) {
      return colleges.slice(0, 100)
    }

    return colleges
      .filter((college) => {
        return (
          college.college_name.toLowerCase().includes(search) ||
          college.city.toLowerCase().includes(search)
        )
      })
      .slice(0, 100)
  }, [colleges, secondSearch])

  /*
  |--------------------------------------------------------------------------
  | Selected college information
  |--------------------------------------------------------------------------
  */

  const selectedFirst = colleges.find(
    (college) => college.college_name === firstCollege
  )

  const selectedSecond = colleges.find(
    (college) => college.college_name === secondCollege
  )

  /*
  |--------------------------------------------------------------------------
  | Comparison helper
  |--------------------------------------------------------------------------
  */

  const getBranches = (data) => {
    const branchMap = new Map()

    for (const row of data) {
      const branch = row.branch

      if (!branch) continue

      if (!branchMap.has(branch)) {
        branchMap.set(branch, {
          branch,
          2024: null,
          2025: null,
        })
      }

      const current = branchMap.get(branch)

      if (row.year === 2024) {
        current[2024] = Number(row.cutoff_percentage)
      }

      if (row.year === 2025) {
        current[2025] = Number(row.cutoff_percentage)
      }
    }

    return Array.from(branchMap.values())
  }

  const firstBranches = useMemo(
    () => getBranches(comparisonData.first),
    [comparisonData.first]
  )

  const secondBranches = useMemo(
    () => getBranches(comparisonData.second),
    [comparisonData.second]
  )

  /*
  |--------------------------------------------------------------------------
  | Dropdown component
  |--------------------------------------------------------------------------
  */

  const CollegeDropdown = ({
    label,
    value,
    selectedCollege,
    isOpen,
    setIsOpen,
    search,
    setSearch,
    filteredColleges,
    onSelect,
  }) => {
    return (
      <div className="relative">
        <label className="mb-2 block text-xs font-medium text-[#5F574B]">
          {label}
        </label>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className={`
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            border
            px-4
            py-3.5
            text-left
            text-sm
            transition-all
            duration-200
            ${
              isOpen
                ? "border-[#CDBB9D] bg-[#F8F1E5] shadow-[0_6px_20px_rgba(120,95,55,0.06)]"
                : "border-[#E0D2BB] bg-[#FBF8F1] hover:border-[#D4C3A5] hover:bg-[#F9F4EA]"
            }
          `}
        >
          <span
            className={
              value
                ? "truncate font-medium text-[#37445A]"
                : "text-[#7D8796]"
            }
          >
            {selectedCollege
              ? selectedCollege.college_name
              : "Select a college"}
          </span>

          <motion.span
            animate={{
              rotate: isOpen ? 180 : 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="ml-3 shrink-0 text-[#8D806C]"
          >
            ↓
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: 8,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 8,
                scale: 0.98,
              }}
              transition={{
                duration: 0.18,
              }}
              className="
                absolute
                left-0
                right-0
                top-[calc(100%+8px)]
                z-50
                overflow-hidden
                rounded-2xl
                border
                border-[#DCCDB5]
                bg-[#FBF8F1]
                shadow-[0_18px_50px_rgba(83,67,43,0.14)]
              "
            >
              {/* Search */}

              <div className="border-b border-[#E8DDCC] p-2.5">
                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search college..."
                  autoFocus
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#E2D6C3]
                    bg-[#F7F1E6]
                    px-3
                    py-2.5
                    text-xs
                    text-[#3F4654]
                    outline-none
                    placeholder:text-[#9B9284]
                    focus:border-[#CDBB9D]
                    focus:ring-4
                    focus:ring-[#D8C7A8]/20
                  "
                />
              </div>

              {/* Options */}

              <div className="max-h-72 overflow-y-auto p-1.5">
                {loading ? (
                  <div className="px-4 py-6 text-center text-xs text-[#928878]">
                    Loading colleges...
                  </div>
                ) : filteredColleges.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-[#928878]">
                    No colleges found.
                  </div>
                ) : (
                  filteredColleges.map((college, index) => {
                    const selected =
                      college.college_name === value

                    return (
                      <motion.button
                        key={`${college.college_name}-${college.city}-${index}`}
                        type="button"
                        whileHover={{
                          x: 2,
                        }}
                        onClick={() => {
                          onSelect(college.college_name)
                          setIsOpen(false)
                          setSearch("")
                        }}
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between
                          gap-4
                          rounded-xl
                          px-3
                          py-2.5
                          text-left
                          transition-all
                          duration-150
                          ${
                            selected
                              ? "bg-[#EEE3D0] text-[#5E503D]"
                              : "text-[#4E5D73] hover:bg-[#F3EBDD]"
                          }
                        `}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">
                            {college.college_name}
                          </p>

                          {college.city && (
                            <p className="mt-0.5 text-[10px] text-[#9A8E7C]">
                              {college.city}
                            </p>
                          )}
                        </div>

                        {selected && (
                          <span className="shrink-0 text-xs text-[#8E7A5C]">
                            ✓
                          </span>
                        )}
                      </motion.button>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Empty comparison card
  |--------------------------------------------------------------------------
  */

  const EmptyCollegeCard = ({ side }) => {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          flex
          min-h-[300px]
          flex-col
          items-center
          justify-center
          rounded-[24px]
          border
          border-dashed
          border-[#DCCFBF]
          bg-[#FBF8F1]/70
          px-6
          text-center
          transition-all
          duration-300
          hover:border-[#CDBB9D]
          hover:bg-[#F8F1E6]
        "
      >
        <div className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          border
          border-[#E0D3C0]
          bg-[#F4EDE1]
          text-xl
          text-[#9A886D]
        ">
          +
        </div>

        <h4 className="mt-4 text-sm font-semibold text-[#3E4B61]">
          Select {side} college
        </h4>

        <p className="mt-1.5 max-w-xs text-xs leading-5 text-[#8D98A8]">
          Choose a college above to compare its cutoff
          history.
        </p>
      </motion.div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | College comparison card
  |--------------------------------------------------------------------------
  */

  const CollegeComparisonCard = ({
    college,
    branches,
    side,
  }) => {
    return (
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
          duration: 0.35,
        }}
        className="
          overflow-hidden
          rounded-[24px]
          border
          border-[#DCCFBF]
          bg-[#FBF8F1]/80
          shadow-[0_12px_40px_rgba(83,67,43,0.05)]
        "
      >
        <div className="border-b border-[#E8DDCC] bg-[#F4EBDD]/70 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9A8B73]">
                {side} college
              </p>

              <h4 className="mt-2 text-base font-semibold leading-6 text-[#26354C]">
                {college?.college_name}
              </h4>

              {college?.city && (
                <p className="mt-1 text-xs text-[#8B8A82]">
                  {college.city}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-5">
          {branches.length === 0 ? (
            <div className="rounded-2xl border border-[#E5DACA] bg-[#F8F3EA] px-4 py-5 text-center">
              <p className="text-xs text-[#8E877B]">
                No cutoff data available.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {branches.map((item, index) => (
                <motion.div
                  key={`${item.branch}-${index}`}
                  initial={{
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.025,
                  }}
                  className="
                    rounded-2xl
                    border
                    border-[#E6DACA]
                    bg-[#FCF9F3]
                    px-4
                    py-3
                    transition-all
                    duration-200
                    hover:border-[#D7C5A7]
                    hover:bg-[#F8F1E6]
                  "
                >
                  <p className="text-xs font-medium leading-5 text-[#506078]">
                    {item.branch}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-[#F3EBDD] px-3 py-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-[#A09380]">
                        2024
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#39465B]">
                        {item[2024] !== null
                          ? `${item[2024].toFixed(2)}%`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F3EBDD] px-3 py-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-[#A09380]">
                        2025
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#39465B]">
                        {item[2025] !== null
                          ? `${item[2025].toFixed(2)}%`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="compare"
      className="relative overflow-hidden px-6 py-24"
    >
      {/* Soft background atmosphere */}

      <div className="
        pointer-events-none
        absolute
        left-1/2
        top-1/2
        -z-10
        h-[600px]
        w-[600px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-[#E9DDC8]/30
        blur-[140px]
      " />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
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
            duration: 0.55,
          }}
          className="
            overflow-visible
            rounded-[32px]
            border
            border-[#DCCEB9]
            bg-[#F8F3E9]/90
            p-6
            shadow-[0_20px_70px_rgba(83,67,43,0.07)]
            backdrop-blur-xl
            md:p-8
          "
        >
          {/* Header */}

          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#9A8B73]
              ">
                Compare Colleges
              </p>

              <h2 className="
                mt-2
                text-3xl
                font-semibold
                tracking-[-0.04em]
                text-[#24334B]
                md:text-4xl
              ">
                Which college fits you better?
              </h2>

              <p className="mt-2 text-sm text-[#75839A]">
                Compare real historical cutoff data from
                2024 and 2025 side by side.
              </p>
            </div>

            {/* RESET BUTTON */}

            <motion.button
              type="button"
              onClick={handleReset}
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="
                shrink-0
                rounded-full
                border
                border-[#D8C9AE]
                bg-[#F5EEDF]
                px-5
                py-2.5
                text-sm
                font-medium
                text-[#756A59]
                shadow-[0_4px_14px_rgba(120,95,55,0.06)]
                transition-all
                duration-200
                hover:border-[#CBB895]
                hover:bg-[#EFE4D1]
                hover:text-[#5F5547]
              "
            >
              Reset
            </motion.button>
          </div>

          {/* College selectors */}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <CollegeDropdown
              label="First college"
              value={firstCollege}
              selectedCollege={selectedFirst}
              isOpen={firstOpen}
              setIsOpen={setFirstOpen}
              search={firstSearch}
              setSearch={setFirstSearch}
              filteredColleges={filteredFirstColleges}
              onSelect={setFirstCollege}
            />

            <CollegeDropdown
              label="Second college"
              value={secondCollege}
              selectedCollege={selectedSecond}
              isOpen={secondOpen}
              setIsOpen={setSecondOpen}
              search={secondSearch}
              setSearch={setSecondSearch}
              filteredColleges={filteredSecondColleges}
              onSelect={setSecondCollege}
            />
          </div>

          {/* VS divider */}

          <div className="relative my-8 flex items-center">
            <div className="h-px flex-1 bg-[#E4D9C9]" />

            <div className="
              mx-4
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#E1D5C4]
              bg-[#F5EEE2]
              text-[10px]
              font-semibold
              text-[#8D806D]
              shadow-sm
            ">
              VS
            </div>

            <div className="h-px flex-1 bg-[#E4D9C9]" />
          </div>

          {/* Error */}

          {error && (
            <div className="
              mb-5
              rounded-2xl
              border
              border-red-200
              bg-red-50/70
              px-4
              py-3
              text-sm
              text-red-500
            ">
              {error}
            </div>
          )}

          {/* Comparison */}

          <div className="grid gap-5 md:grid-cols-2">
            {firstCollege ? (
              <CollegeComparisonCard
                college={selectedFirst}
                branches={firstBranches}
                side="First"
              />
            ) : (
              <EmptyCollegeCard side="first" />
            )}

            {secondCollege ? (
              <CollegeComparisonCard
                college={selectedSecond}
                branches={secondBranches}
                side="Second"
              />
            ) : (
              <EmptyCollegeCard side="second" />
            )}
          </div>

          {/* Bottom information */}

          <div className="
            mt-6
            flex
            flex-col
            gap-3
            rounded-2xl
            border
            border-[#DED3C4]
            bg-[#F1EADF]/65
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          ">
            <div>
              <p className="text-xs font-semibold text-[#536078]">
                Compare using real historical data
              </p>

              <p className="mt-1 text-xs text-[#8A96A8]">
                Diplofy uses your 2024 and 2025 cutoff
                database for comparison.
              </p>
            </div>

            <span className="
              w-fit
              rounded-full
              border
              border-[#E0D4C2]
              bg-[#FAF7F0]
              px-3
              py-1.5
              text-[10px]
              font-semibold
              text-[#7B8AA0]
            ">
              2024 + 2025
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CompareColleges