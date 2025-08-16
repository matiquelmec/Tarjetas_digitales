import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptionsSafe } from "@/lib/auth-safe";
import { AccessService, PlanLimitService } from "@/lib/planLimits";

export async function GET() {
  try {
    console.log("GET /api/user/plan-limits - Starting request");
    const session = await getServerSession(authOptionsSafe);
    
    console.log("User access session data:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (!session?.user?.id) {
      console.log("User access - Authorization failed - no session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Obtener información de acceso del usuario
    const userAccess = await AccessService.getUserAccess(session.user.id);
    
    if (!userAccess) {
      console.log("User access - User not found:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // También mantener compatibilidad con planLimits para componentes existentes
    const planLimits = await PlanLimitService.getUserPlanLimits(session.user.id);

    console.log("User access retrieved successfully:", {
      userId: session.user.id,
      hasAccess: userAccess.hasAccess,
      isTrialUser: userAccess.isTrialUser,
      daysRemaining: userAccess.daysRemaining,
      status: userAccess.status
    });

    return NextResponse.json({
      ...userAccess,
      planLimits // Para compatibilidad temporal
    });
  } catch (error) {
    console.error("Error fetching user access:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
