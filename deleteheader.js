/**
 * ============================================================================
 * Xóa ETag Header của RevenueCat để luôn nhận phản hồi 200 OK mới nhất
 * Thương hiệu: TranHai307 (Trần Hải)
 * TikTok: https://www.tiktok.com/@trh_ltg (@trh_ltg)
 * Kênh & Bot hỗ trợ: https://t.me/locketviptranhaibot
 * Kho GitHub: https://github.com/haitran196hhh-ship-it/modul-locketgold-30-60s-tranhai
 * ============================================================================
 */
const headers = Object.assign({}, $request.headers || {});
delete headers["X-RevenueCat-ETag"];
delete headers["x-revenuecat-etag"];
delete headers["If-None-Match"];
delete headers["if-none-match"];
$done({ headers });