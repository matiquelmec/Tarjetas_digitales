import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptionsSafe } from "@/lib/auth-safe";
import { PlanLimitService } from "@/lib/planLimits";

export async function GET() {
  try {
    console.log("GET /api/user/plan-limits - Starting request");
    const session = await getServerSession(authOptionsSafe);
    
    console.log("Plan limits session data:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (!session?.user?.id) {
      console.log("Plan limits - Authorization failed - no session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planLimits = await PlanLimitService.getUserPlanLimits(session.user.id);
    
    if (!planLimits) {
      console.log("Plan limits - User not found:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Plan limits retrieved successfully:", {
      userId: session.user.id,
      maxCards: planLimits.maxCards,
      hasWatermark: planLimits.hasWatermark
    });

    return NextResponse.json(planLimits);
  } catch (error) {
    console.error("Error fetching plan limits:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
