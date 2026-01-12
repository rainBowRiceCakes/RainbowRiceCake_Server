/**
 * @file app/middlewares/auth/configs/role.permissions.js
 * @description 요청 별 접근 권한 설정
 * 251222 v1.0.0 wook init
 * 260105 v2.0.0 Gemini-CLI auto-generates
 */

import ROLE from "./role.enum.js";
const { ADM, COM, DLV, PTN } = ROLE;

// 인증 및 인가가 필요한 요청만 정의
const ROLE_PERMISSIONS = {
  GET: [
    // admins
    { path: /^\/api\/admins\/dashboard\/stats$/, roles: [ADM] },
    { path: /^\/api\/admins\/orderindex$/, roles: [ADM] },
    { path: /^\/api\/admins\/notice$/, roles: [ADM] },
    { path: /^\/api\/admins\/notice\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/qna$/, roles: [ADM] },
    { path: /^\/api\/admins\/qna\/[0-9]+$/, roles: [ADM] },
    // hotels
    { path: /^\/api\/hotels$/, roles: [ADM, PTN, DLV] }, // 파트너도 볼 수 있도록 추가
    { path: /^\/api\/hotels\/[0-9]+$/, roles: [ADM, PTN, DLV] }, // 파트너도 볼 수 있도록 추가
    // notices
    { path: /^\/api\/notices$/, roles: [PTN, DLV, ADM] },
    // orders
    { path: /^\/api\/orders$/, roles: [COM, PTN, DLV, ADM] },
    { path: /^\/api\/orders\/[0-9]+$/, roles: [COM, PTN, DLV, ADM] },
    { path: /^\/api\/orders\/stats\/hourly$/, roles: [PTN, ADM] },
    // partners
    { path: /^\/api\/partners$/, roles: [ADM] },
    { path: /^\/api\/partners\/[0-9]+$/, roles: [ADM] },
    // profiles
    { path: /^\/api\/profiles$/, roles: [COM, PTN, DLV, ADM] },
    // questions
    { path: /^\/api\/questions$/, roles: [COM, DLV, PTN, ADM] },
    // riders
    { path: /^\/api\/riders$/, roles: [ADM] },
    { path: /^\/api\/riders\/[0-9]+$/, roles: [ADM] },
    // settlements
    { path: /^\/api\/settlements$/, roles: [DLV, PTN, ADM] },
    // users
    { path: /^\/api\/users\/show$/, roles: [ADM] },
    { path: /^\/api\/users\/show\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/orders\/[0-9]+\/match$/, roles: [DLV, ADM] },
    { path: /^\/api\/partners$/, roles: [COM, ADM] },
    { path: /^\/api\/orders\/stats\/hourly$/, roles: [COM] },
    { path: /^\/api\/users\/orders\/history$/, roles: [COM] },
    { path: /^\/api\/riders\/settlement$/, roles: [DLV, ADM] },
    { path: /^\/api\/riders\/settlement\/[0-9]+$/, roles: [DLV, ADM] },
  ],
  POST: [
    // auth
    { path: /^\/api\/auth\/logout$/, roles: [COM, DLV, PTN, ADM] },
    { path: /^\/api\/auth\/user\/logout$/, roles: [COM, DLV, PTN, ADM] },
    // admins
    { path: /^\/api\/admins\/partner$/, roles: [ADM] },
    { path: /^\/api\/admins\/order$/, roles: [ADM] },
    { path: /^\/api\/admins\/hotel$/, roles: [ADM] },
    // files
    { path: /^\/api\/files\/licenses$/, roles: [COM, DLV, ADM] },
    { path: /^\/api\/files\/logos$/, roles: [COM, PTN, ADM] },
    { path: /^\/api\/files\/attachments$/, roles: [COM, DLV, PTN, ADM] },
    // hotels
    { path: /^\/api\/hotels$/, roles: [ADM] },
    // invoices
    { path: /^\/api\/invoices\/send$/, roles: [ADM] },
    // notices
    { path: /^\/api\/notices$/, roles: [ADM] },
    // orders
    { path: /^\/api\/orders$/, roles: [PTN, ADM] },
    { path: /^\/api\/orders\/[0-9]+$/, roles: [DLV, ADM] },
    { path: /^\/api\/orders\/[0-9]+\/pickup-photo$/, roles: [DLV, ADM] },
    { path: /^\/api\/orders\/[0-9]+\/complete-photo$/, roles: [DLV, ADM] },
    // partners
    { path: /^\/api\/partners$/, roles: [COM, ADM] },
    // questions
    { path: /^\/api\/questions$/, roles: [COM, DLV, PTN, ADM] },
    // riders
    { path: /^\/api\/riders$/, roles: [COM, ADM] },
    // users
    { path: /^\/api\/users\/rider\/form$/, roles: [COM] },
    { path: /^\/api\/users\/partner\/form$/, roles: [COM] },
    { path: /^\/api\/users\/store$/, roles: [ADM] },
    { path: /^\/api\/partners\/billing-key$/, roles: [PTN, ADM] },
    { path: /^\/api\/settlements\/[0-9]+\/autopay$/, roles: [PTN, ADM] },
    { path: /^\/api\/settlements\/[0-9]+\/cancel$/, roles: [PTN, ADM] }
  ],
  PUT: [
    // orders
    { path: /^\/api\/orders\/[a-zA-Z0-9-]+$/, roles: [DLV, ADM] },
    // admins
    { path: /^\/api\/admins\/rider$/, roles: [ADM] },
    { path: /^\/api\/admins\/partner$/, roles: [ADM] },
    { path: /^\/api\/admins\/order$/, roles: [ADM] },
    { path: /^\/api\/admins\/notice$/, roles: [ADM] },
    { path: /^\/api\/admins\/qna$/, roles: [ADM] },
    // profiles
    { path: /^\/api\/profiles$/, roles: [COM, PTN, DLV, ADM] },
    // users
    { path: /^\/api\/users\/update$/, roles: [ADM] },
    { path: /^\/api\/riders\/updateWorkStatus$/, roles: [DLV, ADM] },
  ],
  DELETE: [
    // admins
    { path: /^\/api\/admins\/user\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/rider\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/partner\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/order\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/hotel\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/notice\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/qna\/[0-9]+$/, roles: [ADM] },
  ],
};
Object.freeze(ROLE_PERMISSIONS);

export default ROLE_PERMISSIONS;