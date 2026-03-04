export const formatDate = (dateString: string): string => {
  if (!dateString) return ""

  return new Date(dateString).toLocaleDateString("bn-BD", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}