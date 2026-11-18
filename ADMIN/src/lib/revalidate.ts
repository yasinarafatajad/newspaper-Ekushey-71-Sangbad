// Ask the public site to drop its cached pages after a mutation.
// Best effort: a failure must never break the admin action itself.
const clientUrl = (import.meta.env.VITE_CLIENT_URL as string | undefined)?.replace(
  /\/+$/,
  "",
);
const secret = import.meta.env.VITE_REVALIDATE_SECRET as string | undefined;

export const revalidateClient = async (): Promise<void> => {
  if (!clientUrl || !secret) return;

  try {
    await fetch(`${clientUrl}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
    });
  } catch (error) {
    console.warn("CLIENT revalidation failed:", error);
  }
};
