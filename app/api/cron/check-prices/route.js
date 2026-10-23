
import { NextResponse } from "next/server";

// Automatic price checks are currently disabled.
// This route no longer imports Firecrawl, Supabase, or Resend.

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Automatic price checks are currently disabled.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Automatic price checks are disabled. You can still add and manage products manually.",
    },
    { status: 503 }
  );
}
