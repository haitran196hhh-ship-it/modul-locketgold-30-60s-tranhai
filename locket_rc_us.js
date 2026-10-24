/**
 * ============================================================================
 * Locket Remote Config – Force US Region (REQUEST)
 * Endpoint: firebaseremoteconfig.googleapis.com/.../firebase:fetch
 * Thương hiệu: TranHai307 (Trần Hải) | TikTok: @trh_ltg
 * ============================================================================
 */
if ($request.method === "POST" && $request.body) {
  try {
    var body = typeof $request.body === "string" ? JSON.parse($request.body) : $request.body;
    if (body && typeof body === "object") {
      body.country_code = "us";
      body.time_zone = "America/New_York";
      $done({ body: JSON.stringify(body) });
    } else {
      $done({});
    }
  } catch (e) {
    $done({});
  }
} else {
  $done({});
}