import { NextResponse } from "next/server";

const CITIES = [
  { id: "24281", name: "Kingman" },
  { id: "6295", name: "Bullhead City" },
  { id: "18350", name: "Golden Valley" },
  { id: "16601", name: "Fort Mohave" },
];

export async function GET() {
  return NextResponse.json({ cities: CITIES });
}
