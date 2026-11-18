// date formate 
export const formatDate = (dateString: string): string => {
  if (!dateString) return ""

  return new Date(dateString).toLocaleDateString("bn-BD", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

// Format day of week: সোমবার, মঙ্গলবার, etc.
export const formatDay = (dateString: string): string => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString("bn-BD", {
    weekday: "long",
  })
}

// Canonical slug for a category name. Use it both when building
// /category/<slug> links and when matching a slug back to a category.
export const categorySlug = (name: string): string =>
  (name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

// Format Number
export const formatNumber = (num: number): string => {
  return num
    .toString()
    .padStart(2, "0")
    .replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)])
}