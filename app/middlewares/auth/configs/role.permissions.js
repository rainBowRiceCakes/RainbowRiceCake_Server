/**
 * @file app/middlewares/auth/configs/role.permissions.js
 * @description 요청 별 접근 권한 설정
 * 251222 v1.0.0 wook init
 */
// role.permissions에 추가하지 않고, 인증절차를 거쳐 사용하려고 하면, ID가 undifined라고 나온다.

import ROLE from "./role.enum.js";
const { ADM, COM, DLV, PTN } = ROLE

// 인증 및 인가가 필요한 요청만 정의
const ROLE_PERMISSIONS = {
  GET: [
    // { path: 정규식, roles: [권한 확인] }
    // /api/posts/:id 를 검증하는 정규식
    // ex) { path: /^\/api\/posts\/[0-9]+$/, roles: [NORMAL, SUPER] },
    { path: /^\/api\/profiles$/, roles: [COM, PTN, DLV, ADM] },
    { path: /^\/api\/notices$/, roles: [PTN, DLV, ADM] },
    { path: /^\/api\/orders$/, roles: [COM, PTN, DLV, ADM] },
    { path: /^\/api\/orders\/[0-9]+$/, roles: [COM, PTN, DLV, ADM] },
    { path: /^\/api\/orders\/[0-9]+\/match$/, roles: [DLV, ADM] },
    { path: /^\/api\/partners$/, roles: [COM, ADM] },
  ],
  POST: [
    // ex) { path: /^\/api\/auth\/logout$/, roles: [NORMAL, SUPER] },
    { path: /^\/api\/auth\/logout$/, roles: [COM, DLV, PTN, ADM] },
    { path: /^\/api\/auth\/reissue$/, roles: [COM, DLV, PTN, ADM] },
    { path: /^\/api\/auth\/user\/logout$/, roles: [COM, DLV, PTN, ADM] },
    { path: /^\/api\/admins\/hotel$/, roles: [ADM] },
    { path: /^\/api\/admins\/partner$/, roles: [ADM] },
    { path: /^\/api\/admins\/rider$/, roles: [ADM] },
    { path: /^\/api\/admins\/notice$/, roles: [ADM] },
    { path: /^\/api\/notices$/, roles: [ADM] },
    { path: /^\/api\/orders$/, roles: [PTN, ADM] },
    { path: /^\/api\/orders\/[0-9]+$/, roles: [DLV, ADM] },
    { path: /^\/api\/riders$/, roles: [COM, ADM] },
    { path: /^\/api\/partners$/, roles: [COM, ADM] },
    { path: /^\/api\/users$/, roles: [COM, ADM] },
    { path: /^\/api\/users\/rider\/form$/, roles: [COM, ADM] },
    { path: /^\/api\/users\/partner\/form$/, roles: [COM, ADM] },
    { path: /^\/api\/orders\/[0-9]+\/pickup-photo$/, roles: [DLV] },
    { path: /^\/api\/orders\/[0-9]+\/complete-photo$/, roles: [DLV] },
    { path: /^\/api\/questions$/, roles: [COM, DLV, PTN, ADM] }, // issue reports 나 질문하기, 신고하기 전용
  ],
  PUT: [
    { path: /^\/api\/admins\/order$/, roles: [ADM] },
    { path: /^\/api\/admins\/rider$/, roles: [ADM] },
    { path: /^\/api\/admins\/partner$/, roles: [ADM] },
    { path: /^\/api\/admins\/notice$/, roles: [ADM] },
    { path: /^\/api\/orders$/, roles: [DLV, ADM] },
    { path: /^\/api\/riders$/, roles: [COM, DLV, ADM] },
    { path: /^\/api\/partners$/, roles: [COM, PTN, ADM] },
    { path: /^\/api\/profiles$/, roles: [COM, PTN, DLV, ADM] },
  ],
  DELETE: [
    { path: /^\/api\/admins\/order\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/rider\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/partner\/[0-9]+$/, roles: [ADM] },
    { path: /^\/api\/admins\/notice\/[0-9]+$/, roles: [ADM] },
  ]
}
Object.freeze(ROLE_PERMISSIONS);

export default ROLE_PERMISSIONS;