import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";

export async function DELETE() {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL env vars.");
      return NextResponse.json(
        { error: "Server is not configured to delete accounts." },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(url, serviceKey);

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteAuthError) {
      console.error("Error deleting auth user:", deleteAuthError);
      return NextResponse.json(
        { error: "Unable to delete account right now." },
        { status: 500 }
      );
    }

    const { error: deleteRowError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", user.id);

    if (deleteRowError) {
      console.error("Error deleting user row from users table:", deleteRowError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error while deleting account:", error);
    return NextResponse.json(
      { error: "Unexpected error while deleting account." },
      { status: 500 }
    );
  }
}
