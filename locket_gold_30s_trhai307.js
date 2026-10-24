/**
 * ============================================================================
 * LOCKET GOLD VĨNH VIỄN + QUAY VIDEO 30S/60S + KHUNG ẢNH TIỆN ÍCH (WIDGET) & CAPTION VIP
 * Chính chủ: Trần Hải Vip 307 (@TRANHAI_307) | Zalo: 0917921802
 * Kênh & Bot hỗ trợ: https://t.me/locketviptranhaibot
 * Kho GitHub: https://github.com/haitran196hhh-ship-it/modul-locketgold-30-60s-tranhai
 * ============================================================================
 * Hướng dẫn lên Khung Ảnh Tiện Ích (Widget) & Quay 30s/60s:
 *   1. Cài Module & Cấu hình của Trần Hải Vip 307 vào Shadowrocket.
 *   2. Bật Giải mã HTTPS (MITM) và Tin cậy chứng chỉ CA trong Cài đặt iPhone.
 *   3. Bật VPN Shadowrocket -> Xóa app Locket cũ -> Tải lại Locket từ App Store.
 *   4. Đăng nhập Locket rồi ra màn hình chính thêm Tiện ích (Widget) Khung ảnh Locket để xem trực tiếp!
 */

(function () {
  const url = $request.url || "";
  const isResponse = typeof $response !== "undefined";

  // Đọc tham số cấu hình từ argument trong .sgmodule / .conf
  let args = {
    videoSeconds: "30",
    enableCustomFrame: true,
    frameImageUrl: "",
    textColor: "#FFFFFF",
    bgGradientTop: "#F59E0B",
    bgGradientBottom: "#B45309",
    badgePrefix: "👑",
    customFooter: ""
  };

  if (typeof $argument === "string" && $argument.trim() !== "") {
    try {
      if ($argument.trim().startsWith("{")) {
        args = Object.assign(args, JSON.parse($argument));
      }
    } catch (e) {}
  }

  const targetSecStr = String(args.videoSeconds || "30");

  // ==========================================================================
  // PHẦN 1: MỞ KHÓA LOCKET GOLD VĨNH VIỄN ĐẾN NĂM 2099 (REVENUECAT)
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
  // PHẦN 2: MỞ KHÓA VIDEO 30S/60S & BƠM KHUNG ẢNH TIỆN ÍCH (FIREBASE REMOTE CONFIG)
  // Khi xóa Locket tải lại lúc đang bật VPN Shadowrocket, Locket gọi API này đầu tiên!
  // ==========================================================================
  if (isResponse && /firebaseremoteconfig\.googleapis\.com/i.test(url)) {
    try {
      let cfg = JSON.parse($response.body || "{}");
      if (!cfg.entries) cfg.entries = {};

      // 1. Mở giới hạn quay & tải video 30s hoặc 60s
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
        cfg.entries[k] = targetSecStr;
      }

      // 2. Mở khóa toàn bộ tính năng Khung ảnh Tiện ích (Widget Frames) & Overlays
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
      for (const flag of featureFlags) {
        cfg.entries[flag] = "true";
      }

      // 3. Nếu có ảnh Khung Tiện Ích (frameImageUrl), tiêm trực tiếp vào cấu hình Khung của Locket
      if (args.frameImageUrl && args.frameImageUrl.startsWith("http")) {
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
          cfg.entries[fk] = args.frameImageUrl;
        }
        cfg.entries["widget_frames_config"] = JSON.stringify({
          enabled: true,
          default_frame: args.frameImageUrl,
          frames: [
            {
              id: "trhai307_vip_frame",
              name: "Khung VIP Trần Hải 307",
              image_url: args.frameImageUrl,
              is_gold: false,
              unlocked: true
            }
          ]
        });
      }

      // 4. Quét các khóa sẵn có trong entries của Locket để đồng bộ thời lượng và khung ảnh
      for (const existingKey of Object.keys(cfg.entries)) {
        const low = existingKey.toLowerCase();
        if (low.includes("duration") || low.includes("video_length") || low.includes("max_sec")) {
          cfg.entries[existingKey] = targetSecStr;
        } else if (low.includes("frame") || low.includes("overlay") || low.includes("widget") || low.includes("caption") || low.includes("gold")) {
          if (cfg.entries[existingKey] === "false" || cfg.entries[existingKey] === "0") {
            cfg.entries[existingKey] = "true";
          } else if (
            args.frameImageUrl &&
            typeof cfg.entries[existingKey] === "string" &&
            /^https?:\/\/.+\.(png|webp|jpg|jpeg)/i.test(cfg.entries[existingKey])
          ) {
            cfg.entries[existingKey] = args.frameImageUrl;
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
  // PHẦN 3: BƠM KHUNG ẢNH TIỆN ÍCH TRỰC TIẾP KHI WIDGET CẬP NHẬT (FETCH MOMENT)
  // ==========================================================================
  if (isResponse && /api\.locketcamera\.com\/(fetchLatestMomentV2|getLatestMoment|getMoment)/i.test(url)) {
    try {
      if (!$response.body) {
        $done({});
        return;
      }
      let data = JSON.parse($response.body);
      let targetMoment = data.result || data.data || data;
      if (targetMoment && typeof targetMoment === "object") {
        if (args.frameImageUrl && args.frameImageUrl.startsWith("http")) {
          targetMoment.frame_url = args.frameImageUrl;
          targetMoment.widget_frame_url = args.frameImageUrl;
          targetMoment.custom_frame = args.frameImageUrl;
        }
        if (args.enableCustomFrame && Array.isArray(targetMoment.overlays)) {
          targetMoment.overlays = targetMoment.overlays.map((ov) => {
            if (ov && ov.data) {
              ov.data.text_color = args.textColor || "#FFFFFF";
              ov.data.background = {
                colors: [args.bgGradientTop || "#F59E0B", args.bgGradientBottom || "#B45309"],
                material_blur: "ultra_thin"
              };
            }
            return ov;
          });
        }
      }
      $done({ body: JSON.stringify(data) });
      return;
    } catch (err) {
      $done({});
      return;
    }
  }

  // ==========================================================================
  // PHẦN 4: ĐỔI MÀU KHUNG CAPTION & ĐÍNH KÈM KHUNG ẢNH KHI ĐĂNG BÀI (POST MOMENT)
  // ==========================================================================
  if (!isResponse && /api\.locketcamera\.com\/(postMomentV2|createMoment)/i.test(url)) {
    try {
      if (!$request.body || !args.enableCustomFrame) {
        $done({});
        return;
      }
      let payload = JSON.parse($request.body);

      if (args.frameImageUrl && args.frameImageUrl.startsWith("http")) {
        payload.frame_url = args.frameImageUrl;
        payload.widget_frame_url = args.frameImageUrl;
      }

      if (Array.isArray(payload.overlays) && payload.overlays.length > 0) {
        payload.overlays = payload.overlays.map((ov) => {
          if (ov && ov.data) {
            if (typeof ov.data.text === "string" && ov.data.text.trim() !== "") {
              let t = ov.data.text.trim();
              if (args.badgePrefix && !t.startsWith(args.badgePrefix)) {
                t = args.badgePrefix + " " + t;
              }
              if (args.customFooter && !t.endsWith(args.customFooter)) {
                t = t + " · " + args.customFooter;
              }
              ov.data.text = t;
            }
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