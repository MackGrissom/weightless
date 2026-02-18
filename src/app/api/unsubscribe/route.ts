import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return new NextResponse(unsubPage("Missing email parameter.", false), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ is_active: false })
    .eq("email", email);

  // Also deactivate any job alerts
  await supabase
    .from("job_alerts")
    .update({ is_active: false })
    .eq("email", email);

  if (error) {
    return new NextResponse(unsubPage("Something went wrong. Please try again.", false), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  return new NextResponse(unsubPage(email, true), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

function unsubPage(detail: string, success: boolean): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${success ? "Unsubscribed" : "Error"} — Weightless</title>
  <style>
    body { background: #0a0a0a; color: #ededed; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
    .container { max-width: 400px; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.75rem; }
    p { color: #a0a0a0; line-height: 1.6; }
    a { display: inline-block; margin-top: 1.5rem; background: #c8ff00; color: #0a0a0a; padding: 0.75rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; }
    a:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    ${success
      ? `<h1>You've been unsubscribed</h1><p><strong>${detail}</strong> has been removed from our mailing list. You won't receive any more emails from us.</p>`
      : `<h1>Oops</h1><p>${detail}</p>`
    }
    <a href="${siteUrl}">Back to Weightless</a>
  </div>
</body>
</html>`;
}
