import { revalidatePath } from "next/cache";

// Called by the admin app after a post is created, updated or deleted, so the
// public site drops its cached pages immediately instead of waiting for ISR.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json(
      { revalidated: false, message: "Invalid or missing revalidation secret" },
      { status: 401 },
    );
  }

  // Invalidates every route rendered under the root layout.
  revalidatePath("/", "layout");

  return Response.json({ revalidated: true, now: Date.now() });
}
