/**
 * ============================================================================
 * LOCKET GOLD VĨNH VIỄN 2099 + QUAY VIDEO 30S/60S + KHUNG ẢNH TIỆN ÍCH (WIDGET)
 * Tác giả: Trần Hải Vip 307 (@TRANHAI_307) | Zalo: 0917921802
 * Kênh hỗ trợ: https://t.me/locketviptranhaibot
 * Kho GitHub: https://github.com/haitran196hhh-ship-it/modul-locketgold-30-60s-tranhai
 * ============================================================================
 * LƯU Ý QUAN TRỌNG KHI TẢI LÊN GITHUB:
 * Tuyệt đối TẮT tính năng "Dịch sang Tiếng Việt" của trình duyệt Cốc Cốc / Chrome
 * trước khi tải tệp này lên GitHub để tránh bị dịch từ khóa JavaScript (function -> chức năng).
 */

(function () {
  const url = $request.url || "";
  const isResponse = typeof $response !== "undefined";

  const DEFAULT_CFG = {
    videoSeconds: "30",
    enableCustomFrame: true,
    frameImageUrl: "https://locket-bot-cfwt.onrender.com/api/web/frame-template/gold_royal.png",
    bgTop: "#F59E0B",
    bgBottom: "#B45309",
    textColor: "#FFFFFF",
    badgePrefix: "👑",
    customFooter: ""
  };

  // 1. MỞ KHÓA LOCKET GOLD VĨNH VIỄN ĐẾN NĂM 2099 (REVENUECAT)
  if (isResponse && /revenuecat\.com|rc-backup\.com/i.test(url)) {
    try {
      let obj = JSON.parse($response.body || "{}");
      if (!obj.subscriber) obj.subscriber = {};
      if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};
      if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};

      const purchaseDate = "2024-01-01T00:00:00Z";
      const expiresDate = "2099-12-31T23:59:59Z";

      const goldSub = {
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

      const goldEnt = {
        grace_period_expires_date: null,
        purchase_date: purchaseDate,
        product_identifier: "locket_1600_1y",
        expires_date: expiresDate
      };

      obj.subscriber.subscriptions["locket_1600_1y"] = goldSub;
      obj.subscriber.subscriptions["locket_199_1m"] = goldSub;
      obj.subscriber.entitlements["Gold"] = goldEnt;
      obj.subscriber.entitlements["pro"] = goldEnt;

      $done({ body: JSON.stringify(obj) });
      return;
    } catch (e) {
      $done({});
      return;
    }
  }

  // 2. MỞ KHÓA QUAY VIDEO 30S/60S & BƠM KHUNG ẢNH TIỆN ÍCH (FIREBASE REMOTE CONFIG)
  if (isResponse && /firebaseremoteconfig\.googleapis\.com/i.test(url)) {
    try {
      let cfg = JSON.parse($response.body || "{}");
      if (!cfg.entries) cfg.entries = {};

      const durationKeys = [
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
      for (const k of durationKeys) {
        cfg.entries[k] = DEFAULT_CFG.videoSeconds;
      }

      const featureFlags = [
        "enable_video_recording",
        "enable_video_upload",
        "enable_gallery_upload",
        "enable_camera_roll_upload",
        "enable_custom_captions",
        "enable_overlays",
        "enable_custom_frames",
        "enable_decorative_frames",
        "enable_event_frames",
        "enable_widget_frames",
        "widget_frames_enabled",
        "custom_widget_frame_enabled",
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
      for (const f of featureFlags) {
        cfg.entries[f] = "true";
      }

      if (DEFAULT_CFG.frameImageUrl) {
        const frameUrlKeys = [
          "widget_frame_url",
          "custom_frame_url",
          "default_widget_frame_url",
          "gold_widget_frame_url",
          "event_frame_url",
          "active_frame_image_url",
          "widget_overlay_image_url"
        ];
        for (const fk of frameUrlKeys) {
          cfg.entries[fk] = DEFAULT_CFG.frameImageUrl;
        }
      }

      for (const existingKey of Object.keys(cfg.entries)) {
        const lk = existingKey.toLowerCase();
        if (lk.includes("duration") || lk.includes("video_length") || lk.includes("max_sec")) {
          cfg.entries[existingKey] = DEFAULT_CFG.videoSeconds;
        } else if (lk.includes("frame") || lk.includes("overlay") || lk.includes("widget") || lk.includes("caption") || lk.includes("gold")) {
          if (cfg.entries[existingKey] === "false" || cfg.entries[existingKey] === "0") {
            cfg.entries[existingKey] = "true";
          }
        }
      }

      cfg.state = "UPDATE";
      $done({ body: JSON.stringify(cfg) });
      return;
    } catch (e) {
      $done({});
      return;
    }
  }

  // 3. ĐỒNG BỘ KHUNG ẢNH TIỆN ÍCH NGOÀI MÀN HÌNH CHÍNH (WIDGET FETCH MOMENT)
  if (isResponse && /api\.locketcamera\.com\/(fetchLatestMomentV2|getLatestMoment|getMoment)/i.test(url)) {
    try {
      if (!$response.body) {
        $done({});
        return;
      }
      let data = JSON.parse($response.body);
      let targetMoment = data.result || data.data || data;
      if (targetMoment && typeof targetMoment === "object" && DEFAULT_CFG.frameImageUrl) {
        targetMoment.frame_url = DEFAULT_CFG.frameImageUrl;
        targetMoment.widget_frame_url = DEFAULT_CFG.frameImageUrl;
        targetMoment.custom_frame = DEFAULT_CFG.frameImageUrl;
      }
      $done({ body: JSON.stringify(data) });
      return;
    } catch (e) {
      $done({});
      return;
    }
  }

  // 4. ĐỔI MÀU KHUNG CAPTION GRADIENT KHI ĐĂNG ẢNH / VIDEO (POST MOMENT)
  if (!isResponse && /api\.locketcamera\.com\/(postMomentV2|createMoment)/i.test(url)) {
    try {
      if (!$request.body || !DEFAULT_CFG.enableCustomFrame) {
        $done({});
        return;
      }
      let payload = JSON.parse($request.body);
      if (DEFAULT_CFG.frameImageUrl) {
        payload.frame_url = DEFAULT_CFG.frameImageUrl;
        payload.widget_frame_url = DEFAULT_CFG.frameImageUrl;
      }
      if (Array.isArray(payload.overlays) && payload.overlays.length > 0) {
        payload.overlays = payload.overlays.map((ov) => {
          if (ov && ov.data) {
            if (!ov.data.background || !ov.data.background.colors || ov.data.background.colors.length === 0) {
              ov.data.text_color = DEFAULT_CFG.textColor;
              ov.data.background = {
                colors: [DEFAULT_CFG.bgTop, DEFAULT_CFG.bgBottom],
                material_blur: "ultra_thin"
              };
            }
          }
          return ov;
        });
      }
      $done({ body: JSON.stringify(payload) });
      return;
    } catch (e) {
      $done({});
      return;
    }
  }

  $done({});
})();