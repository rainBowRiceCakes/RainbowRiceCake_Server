/**
 * @file app/controllers/auth.controller.js
 * @description 인증 관련 컨트롤러
 * 251222 v1.0.0 jun 초기 생성
 */

import { REISSUE_ERROR, SUCCESS } from "../../configs/responseCode.config.js";
import myError from "../errors/customs/my.error.js";
import PROVIDER from "../middlewares/auth/configs/role.enum.js";
import authService from "../services/auth.service.js";
import cookieUtil from "../utils/cookie/cookie.util.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";
import socialKakaoUtil from "../utils/social/social.kakao.util.js";


// ------------------------
// public
// ------------------------
/**
 * 어드민 로그인 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @returns
 */
async function adminLogin(req, res, next) {
  try {
    const body = req.body; // 파라미터 획득

    // 로그인 서비스 호출
    const { accessToken, refreshToken, admin } = await authService.adminLogin(body);
    const name = admin.name;

    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, name}));
  }
  catch (error) {
    next(error);
  }
}

/**
 * 유저 로그인 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @returns
 */
async function login(req, res, next) {
  try {
    const body = req.body; // 파라미터 획득

    // 로그인 서비스 호출
    const { accessToken, refreshToken, user } = await authService.login(body);

    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, user}));
  }
  catch (error) {
    next(error);
  }
}

/**
 * 로그아웃 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @returns
 */
async function adminLogout(req, res, next) {
  try {
    const id = req.user.id;

    // 로그아웃 서비스 호출
    await authService.adminLogout(id);
    
    // cookie에 refreshToken 만료
    cookieUtil.clearCookieRefreshToken(res);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  }
  catch (error) {
    next(error);
  }
}

/**
 * 로그아웃 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @returns
 */
async function logout(req, res, next) {
  try {
    const id = req.user.id;

    // 로그아웃 서비스 호출
    await authService.logout(id);
    
    // cookie에 refreshToken 만료
    cookieUtil.clearCookieRefreshToken(res);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  }
  catch (error) {
    next(error);
  }
}

/**
 * 어드민 토큰 재발급 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @returns
 */
async function adminReissue(req, res, next) {
  try {
    const token = cookieUtil.getCookieRefreshToken(req);

    // 토큰 존재 여부 확인
    if(!token) {
      throw myError('리프래시 토큰 없음', REISSUE_ERROR);
    }

    // 토큰 재발급 처리
    const { accessToken, refreshToken, admin } = await authService.adminReissue(token);

    // 쿠키에 리프래시 토큰 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { accessToken, admin }))
  }
  catch(error) {
    next(error);
  }
}

/**
 * 토큰 재발급 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @returns
 */
async function reissue(req, res, next) {
  try {
    const token = cookieUtil.getCookieRefreshToken(req);

    // 토큰 존재 여부 확인
    if(!token) {
      throw myError('리프래시 토큰 없음', REISSUE_ERROR);
    }

    // 토큰 재발급 처리
    const { accessToken, refreshToken, user } = await authService.reissue(token);

    // 쿠키에 리프래시 토큰 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { accessToken, user }))
  }
  catch(error) {
    next(error);
  }
}

/**
 * 소셜 로그인 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @returns
 */
async function social(req, res, next) {
  try {
    let url = '';

    url = socialKakaoUtil.getAuthorizeURL();

    return res.redirect(url);
  }
  catch(error) {
    next(error);
  }
}

/**
 * 소셜 로그인 콜백 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @returns
 */
async function socialCallback(req, res, next) {
  try {
    const code = req.query?.code;
    const refreshToken = await authService.socialKakao(code);

    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.redirect(process.env.SOCIAL_CLIENT_CALLBACK_URL);
  }
  catch(error) {
    console.log(error);
    next(error);
  }
}

// ------------------------
// export
// ------------------------
export default {
  adminLogin,
  login,
  adminLogout,
  logout,
  adminReissue,
  reissue,
  social,
  socialCallback,
};