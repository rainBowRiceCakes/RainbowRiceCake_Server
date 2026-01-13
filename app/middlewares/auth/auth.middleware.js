/**
 * @file /app/middlewares/auth/auth.middleware.js
 * @description 인증 및 인가 처리 미들웨어
 * 251218 v1.0.0 wook init
 */

import { FORBIDDEN_ERROR } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import jwtUtil from "../../utils/jwt/jwt.util.js";
import ROLE_PERMISSIONS from "./configs/role.permissions.js";

// ----------------
// private
// ----------------
/**
 * 토큰 검증 및 Request에 유저 정보 추가
 * @param {import("express").Request} req 
 */
function authenticate(req) {
  // 토큰 획득
  const token = jwtUtil.getBearerToken(req);
  // 토큰 검증 및 페이로드 획득
  const claims = jwtUtil.getClaimsWithVerifyToken(token);

  // Request 객체에 사용자 정보를 추가
  req.user = {
    id: parseInt(claims.sub),
    role: claims.role,
    email: claims.email // 💡 토큰에서 이메일 추출하여 서비스 레이어에 전달
  }
}

/**
 * 인증 및 권한 체크
 * @param {import("express").Request} req 
 */
function authorize(req) {
  // 요청에 맞는 권한 규칙 조회
  const matchRole = ROLE_PERMISSIONS[req.method].find(item => {
    // express는 경우에 따라 가장 마지막에 `/`를 붙이는 경우도 있어서, 그럴 경우 가장 마지막 `/`제거
    const path = req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;
    const testPath = `${req.baseUrl}${path}`;
    const isMatch = item.path.test(testPath);

    // 디버깅: 매칭 과정 상세 출력
    // console.log(`[Auth] Testing ${req.method} ${testPath} against ${item.path}: ${isMatch}`);

    return isMatch;
  });

  //일치하는 규칙이 있을 시, 인증 및 권한 체크를 실시
  if (matchRole) {
    console.log(`[Auth] Matched rule for ${req.method} ${req.baseUrl}${req.path}:`, matchRole.path);
    // 인증 체크 및 인증 정보를 Request 셋
    authenticate(req);
    // 권한 체크
    const userRole = req.user?.role;
    if (!userRole || !matchRole.roles.includes(userRole)) {
      console.warn(`[Auth] Role mismatch. User role: ${userRole}, Required roles: ${matchRole.roles}`);
      throw myError(`권한 부족`, FORBIDDEN_ERROR);
    }
  }
}

// ----------------
// public
// ----------------
export default function (req, res, next) {
  try {
    authorize(req);

    return next();
  } catch (error) {
    console.error(`[Auth] Authentication failed for ${req.method} ${req.path}:`, error.message);
    return next(error);
  }
}