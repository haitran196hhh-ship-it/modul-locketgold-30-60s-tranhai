// ========= ID ========= //
// Locket: Gold Vĩnh Viễn (9999)
// Thương hiệu: TranHai307 (Trần Hải) | TikTok: @trh_ltg
// ========= Phần cố định ========= //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"],
    obj = JSON.parse($response.body);

obj.Attention = "Chúc mừng bạn! Đã kích hoạt Locket Gold vĩnh viễn bởi TranHai307 (@trh_ltg)!";

var FAR_FUTURE = "9999-05-03T10:10:14Z";
var PAST = "2006-05-03T10:10:14Z";

function makeSub(productId, priceAmount, priceCurrency) {
    return {
        auto_resume_date: null,
        display_name: productId,
        is_sandbox: true,
        ownership_type: "PURCHASED",
        billing_issues_detected_at: null,
        management_url: "https://apps.apple.com/account/subscriptions",
        period_type: "normal",
        price: {
            amount: priceAmount,
            currency: priceCurrency
        },
        expires_date: FAR_FUTURE,
        grace_period_expires_date: null,
        refunded_at: null,
        unsubscribe_detected_at: null,
        original_purchase_date: PAST,
        purchase_date: PAST,
        store: "app_store",
        store_transaction_id: "2000001108724193"
    };
}

function makeEnt(productId) {
    return {
        grace_period_expires_date: null,
        purchase_date: PAST,
        product_identifier: productId,
        expires_date: FAR_FUTURE
    };
}

obj.subscriber = obj.subscriber || {};
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};

// ========== UNLOCK GOLD ==========
var goldProduct = "locket_1600_1y";
obj.subscriber.subscriptions[goldProduct] = makeSub(goldProduct, 399000.0, "VND");
obj.subscriber.entitlements["Gold"] = makeEnt(goldProduct);

$done({
    body: JSON.stringify(obj)
});