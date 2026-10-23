/**
 * Xóa ETag Header của RevenueCat để luôn nhận phản hồi 200 OK mới nhất
 * Tác giả: Trần Hải Vip 307 (@TRANHAI_307)
 */
const headers = Object.assign({}, $request.headers || {});
delete headers["X-RevenueCat-ETag"];
delete headers["x-revenuecat-etag"];
delete headers["If-None-Match"];
delete headers["if-none-match"];
$done({ headers });