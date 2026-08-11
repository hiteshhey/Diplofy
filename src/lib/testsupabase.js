import { supabase } from "./supabase"

export async function testSupabaseConnection() {
  console.log("🧪 Testing Supabase connection...")

  const { data, error } = await supabase
    .from("college_cutoffs")
    .select("*")
    .limit(1)

  if (error) {
    console.error("❌ Supabase connection failed:", error)
    return
  }

  console.log("✅ SUPABASE CONNECTED!")
  console.log("📦 Data:", data)
}