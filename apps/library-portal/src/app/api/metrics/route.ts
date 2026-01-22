import { NextRequest, NextResponse } from "next/server";
import client from "prom-client";

// Create a Registry to register compliance metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "library-portal",
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

export async function GET(req: NextRequest) {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      headers: {
        "Content-Type": register.contentType,
      },
    });
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
