import { NextResponse } from "next/server";
import { DEMO_SCHOLARSHIP, DEMO_REIMBURSEMENT, DEMO_ADMISSION } from "@/lib/ai/demo-documents";
import { DEMO_PROFILE } from "@/lib/ai/demo-profile";

export async function GET() {
  return NextResponse.json({
    documents: [DEMO_SCHOLARSHIP, DEMO_REIMBURSEMENT, DEMO_ADMISSION],
    profile: DEMO_PROFILE,
  });
}
