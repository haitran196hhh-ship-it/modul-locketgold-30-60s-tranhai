/***********************************************
> deleteHeader by TranHai307 (@trh_ltg)
> LƯU Ý: Tắt dịch tiếng Việt trên Cốc Cốc khi tải file này!
***********************************************/
const version = 'V1.0.2';
function setHeaderValue(e,a,d){var r=a.toLowerCase();r in e?e[r]=d:e[a]=d}
var modifiedHeaders=$request.headers;
setHeaderValue(modifiedHeaders,"X-RevenueCat-ETag","");
delete modifiedHeaders["If-None-Match"];
delete modifiedHeaders["if-none-match"];
$done({headers:modifiedHeaders});