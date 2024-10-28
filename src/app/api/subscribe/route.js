import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase.from("Subscriber").insert({ email });
    if (error)
      return new Response(error.message ?? "Failed to subscribe", {
        status: 500,
      });
    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (err) {
    return new Response(err.message ?? "Failed to subscribe", {
      status: 500,
    });
  }
}
