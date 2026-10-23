/**
 * ============================================================================
 * LOCKET GOLD VĨNH VIỄN + QUAY VIDEO 30S + MỞ KHÓA & ĐỔI KHUNG ẢNH (OVERLAYS)
 * Tác giả: Trần Hải Vip 307 (@TRANHAI_307)
 * Kênh hỗ trợ: https://t.me/locketviptranhaibot
 * ============================================================================
 * Script 3-trong-1 dùng cho Shadowrocket / Surge / Quantumult X / Loon:
 *   1. Xử lý `api.revenuecat.com`: Mở khóa Locket Gold đến năm 2099 + Huy hiệu Gold.
 *   2. Xử lý `firebaseremoteconfig.googleapis.com` (locket-4252a):
 *      - Tăng thời lượng quay video từ 3s lên 30s (`max_video_duration = 30`).
 *      - Mở khóa toàn bộ khung ảnh sự kiện (Frames / Overlays / Music Captions).
 *   3. Xử lý `api.locketcamera.com/postMomentV2`:
 *      - Cho phép tự động áp dụng khung màu / viền Gradient Gold hoặc giữ nguyên khung người dùng chọn.
 */

(function () {
  const url = $request.url || "";
  const isResponse = typeof $response !== "undefined";

  // ==========================================================================
  // PHẦN 1: MỞ KHÓA LOCKET GOLD VĨNH VIỄN (REVENUECAT RESPONSE)
  // ==========================================================================
  if (isResponse && /revenuecat\.com|rc-backup\.com/i.test(url)) {
    try {
      let obj = JSON.parse($response.body || "{}");
      if (!obj.subscriber) obj.subscriber = {};
      if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};
      if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};

      const purchaseDate = "2024-01-01T00:00:00Z";
      const expiresDate = "2099-12-31T23:59:59Z";

      const goldSubscription = {
        is_sandbox: false,
        ownership_type: "PURCHASED",
        billing_issues_detected_at: null,
        period_type: "normal",
        expires_date: expiresDate,
        grace_period_expires_date: null,
        unsubscribe_detected_at: null,
        original_purchase_date: purchaseDate,
        purchase_date: purchaseDate,
        store: "app_store"
      };

      const goldEntitlement = {
        grace_period_expires_date: null,
        purchase_date: purchaseDate,
        product_identifier: "locket_1600_1y",
        expires_date: expiresDate
      };

      obj.subscriber.subscriptions["locket_1600_1y"] = goldSubscription;
      obj.subscriber.subscriptions["locket_199_1m"] = goldSubscription;
      obj.subscriber.entitlements["Gold"] = goldEntitlement;
      obj.subscriber.entitlements["pro"] = goldEntitlement;

      $done({ body: JSON.stringify(obj) });
      return;
    } catch (err) {
      $done({});
      return;
    }
  }

  // ==========================================================================
  // PHẦN 2: MỞ KHÓA QUAY VIDEO 30S + TOÀN BỘ KHUNG ẢNH ẨN (FIREBASE REMOTE CONFIG)
  // ==========================================================================
  if (isResponse && /firebaseremoteconfig\.googleapis\.com/i.test(url)) {
    try {
      let cfg = JSON.parse($response.body || "{}");
      if (!cfg.entries) cfg.entries = {};

      // 1. Ghi đè toàn bộ khóa giới hạn thời gian quay & đăng video lên 30 giây
      const video30sKeys = [
        "max_video_duration",
        "video_max_duration",
        "video_recording_max_duration",
        "video_recording_max_duration_seconds",
        "moment_video_max_duration",
        "post_video_duration_limit",
        "gold_video_duration",
        "camera_video_max_seconds",
        "video_length_limit",
        "upload_video_max_duration"
      ];
      for (const k of video30sKeys) {
        cfg.entries[k] = "30";
      }

      // 2. Bật toàn bộ tính năng ẩn: Khung ảnh (Frames/Overlays), Caption nhạc, Thời tiết, Up ảnh/video từ thư viện
      const booleanTrueFlags = [
        "enable_video_recording",
        "enable_video_upload",
        "enable_gallery_upload",
        "enable_camera_roll_upload",
        "enable_custom_captions",
        "enable_overlays",
        "enable_custom_frames",
        "enable_decorative_frames",
        "enable_event_frames",
        "enable_music_overlay",
        "enable_weather_overlay",
        "enable_time_overlay",
        "enable_location_overlay",
        "enable_gold_frames",
        "gold_features_enabled",
        "is_gold_eligible",
        "show_all_overlays",
        "unlock_all_frames",
        "high_quality_video_enabled"
      ];
      for (const flag of booleanTrueFlags) {
        cfg.entries[flag] = "true";
      }

      // 3. Nếu có các thông số cấu hình sẵn trong entries liên quan đến duration hoặc frame, tự động nâng cấp
      for (const existingKey of Object.keys(cfg.entries)) {
        const lower = existingKey.toLowerCase();
        if (lower.includes("duration") || lower.includes("video_length") || lower.includes("max_sec")) {
          cfg.entries[existingKey] = "30";
        } else if (
          lower.includes("frame") ||
          lower.includes("overlay") ||
          lower.includes("caption") ||
          lower.includes("gold")
        ) {
          if (cfg.entries[existingKey] === "false" || cfg.entries[existingKey] === "0") {
            cfg.entries[existingKey] = "true";
          }
        }
      }

      cfg.state = "UPDATE";
      $done({ body: JSON.stringify(cfg) });
      return;
    } catch (err) {
      $done({});
      return;
    }
  }

  // ==========================================================================
  // PHẦN 3: TÙY BIẾN KHUNG ẢNH / CAPTION MÀU KHI ĐĂNG LÊN LOCKET (POST MOMENT)
  // ==========================================================================
  if (!isResponse && /api\.locketcamera\.com\/(postMomentV2|createMoment)/i.test(url)) {
    try {
      if (!$request.body) {
        $done({});
        return;
      }
      let payload = JSON.parse($request.body);

      // Đọc tham số truyền vào từ argument trong file .sgmodule / .conf
      let args = {
        enableCustomFrame: false,
        frameStyle: "gold_vip",
        textColor: "#FFFFFF",
        bgGradientTop: "#F59E0B",
        bgGradientBottom: "#B45309"
      };
      if (typeof $argument === "string" && $argument.trim().startsWith("{")) {
        try {
          args = Object.assign(args, JSON.parse($argument));
        } catch (e) {}
      }

      // Nếu người dùng có nhập caption trên Locket và bật chế độ đổi màu khung Caption VIP
      if (args.enableCustomFrame && Array.isArray(payload.overlays) && payload.overlays.length > 0) {
        payload.overlays = payload.overlays.map((ov) => {
          if (ov && ov.data && ov.data.text && (!ov.data.background || !ov.data.background.colors || ov.data.background.colors.length === 0)) {
            ov.data.text_color = args.textColor || "#FFFFFF";
            ov.data.background = {
              colors: [args.bgGradientTop || "#F59E0B", args.bgGradientBottom || "#B45309"],
              material_blur: "ultra_thin"
            };
          }
          return ov;
        });
      }

      $done({ body: JSON.stringify(payload) });
      return;
    } catch (err) {
      $done({});
      return;
    }
  }

  $done({});
})();