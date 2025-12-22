/**
 * @file app/middlewares/auth/configs/role.permissions.js
 * @description 요청 별 접근 권한 설정
 * 251222 v1.0.0 wook init
 */
// role.permissions에 추가하지 않고, 인증절차를 거쳐 사용하려고 하면, ID가 undifined라고 나온다.

import ROLE from "./role.enum.js";
const { ADMIN, NORMAL, DLV, PTN } = ROLE

// 인증 및 인가가 필요한 요청만 정의
const ROLE_PERMISSIONS = {
  GET: [
    // { path: 정규식, roles: [권한 확인] }
    // /api/posts/:id 를 검증하는 정규식
    // ex) { path: /^\/api\/posts\/[0-9]+$/, roles: [NORMAL, SUPER] },

  ],
  POST: [
    // ex) { path: /^\/api\/auth\/logout$/, roles: [NORMAL, SUPER] },
  ],
  PUT: [

  ],
  DELETE: [

    
  ]
}
Object.freeze(ROLE_PERMISSIONS);

export default ROLE_PERMISSIONS;