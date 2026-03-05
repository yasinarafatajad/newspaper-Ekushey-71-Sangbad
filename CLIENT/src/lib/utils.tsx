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