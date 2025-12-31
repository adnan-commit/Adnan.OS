import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/fetcher";

export async function GET() {
  const data = await getPortfolioData();
  // Set cache control headers to revalidate every 60 seconds
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
