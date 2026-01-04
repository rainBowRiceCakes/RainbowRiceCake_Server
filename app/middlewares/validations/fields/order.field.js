/**
 * @file app/middlewares/validations/fields/order.field.js
 * @description orders 정보 유효성 검사 필드
 * 이 파일은 주문(Order) 관련 API 요청의 유효성 검사를 위한 필드 정의를 포함합니다.
 * Express Validator를 사용하여 쿼리 파라미터, URL 파라미터, 바디 파라미터의 검증 규칙을 설정합니다.
 * 251223 v1.0.0 BSONG init
 * 251225 v1.1.0 BSONG update 빠진 부분 검사 필드들 추가함. 
 */

import { body, param, query } from "express-validator";

// === Query Parameters ===
export const page = query('page')
  .trim()
  .optional()
  .isInt({ min: 1 })
  .withMessage('페이지는 1 이상의 숫자여야 합니다.')
  .toInt();
;

export const statusQuery = query('status')
  .optional()
  .trim()
  .isIn(['req', 'mat', 'pick', 'com'])
  .withMessage('유효하지 않은 status 값입니다.');

export const tab = query('tab')
  .optional()
  .trim()
  .isIn(['waiting', 'inprogress', 'completed'])
  .withMessage('유효하지 않은 tab 값입니다. (waiting, inprogress, completed)');

export const limit = query('limit')
  .optional()
  .trim()
  .isInt({ min: 1, max: 100 })
  .withMessage('limit는 1~100 사이의 숫자여야 합니다.')
  .toInt();

export const from = query('from')
  .optional()
  .trim()
  .isISO8601()
  .withMessage('유효한 날짜 형식이 아닙니다. (YYYY-MM-DD)');

export const to = query('to')
  .optional()
  .trim()
  .isISO8601()
  .withMessage('유효한 날짜 형식이 아닙니다. (YYYY-MM-DD)');

// === Param Parameters ===
export const orderId = param('orderId')  // 👈 'id' → 'orderId'로 변경 (라우터와 일치)
  .trim()
  .notEmpty()
  .withMessage('주문 ID는 필수입니다.')
  .bail()
  .isInt({ min: 1 })
  .withMessage('유효한 주문 ID가 아닙니다.')
  .toInt();

// === Body Parameters ===
export const email = body('email')
  .trim()
  .notEmpty()
  .withMessage('이메일은 필수입니다.')
  .bail()
  .isEmail()
  .withMessage('올바른 이메일 형식이 아닙니다.')
  .normalizeEmail();

export const firstName = body('firstName')
  .trim()
  .notEmpty()
  .withMessage('First Name is required')
  .bail()
  .isLength({ min: 1, max: 25 })
  .withMessage('First name must be under 25 characters')
  .matches(/^[가-힣A-Za-z\s]+$/)
  .withMessage('First name may only include Korean or English characters.');

export const lastName = body('lastName')
  .trim()
  .notEmpty()
  .withMessage('Last Name is required')
  .bail()
  .isLength({ min: 1, max: 25 })
  .withMessage('Last name must be under 25 characters')
  .matches(/^[가-힣A-Za-z\s]+$/)
  .withMessage('Last name may only include Korean or English characters.');

export const name = body('name')
  .trim()
  .notEmpty()
  .withMessage('이름은 필수입니다. Name is required')
  .bail()
  .matches(/^[가-힣A-Za-z\s]{2,50}$/)
  .withMessage('이름은 2~50자의 한글,영문자만 허용됩니다.');

export const hotelId = body('hotelId')
  .trim()
  .notEmpty()
  .withMessage('호텔 ID는 필수입니다.')
  .bail()
  .isInt({ min: 1 })
  .withMessage('유효한 호텔 ID가 아닙니다.')
  .toInt();

export const partnerId = body('partnerId')
  .trim()
  .notEmpty()
  .withMessage('매장 ID는 필수입니다.')
  .bail()
  .isInt({ min: 1 })
  .withMessage('유효한 매장 ID가 아닙니다.')
  .toInt();

export const price = body('price')
  .trim()
  .notEmpty()
  .withMessage('배송 요금은 필수입니다.')
  .bail()
  .isInt({ min: 0 })
  .withMessage('배송 요금은 0 이상의 숫자여야 합니다.')
  .toInt();

export const plans = body('plans')
  .isArray({ min: 1 })
  .withMessage('최소 하나 이상의 플랜을 선택하세요.');

export const cntS = body('cntS')  // 👈 camelCase로 통일
  .optional()
  .trim()
  .isInt({ min: 0, max: 999 })
  .withMessage('소형 짐 개수는 0~999 사이여야 합니다.')
  .toInt();

export const cntM = body('cntM')
  .optional()
  .trim()
  .isInt({ min: 0, max: 999 })
  .withMessage('중형 짐 개수는 0~999 사이여야 합니다.')
  .toInt();

export const cntL = body('cntL')
  .optional()
  .trim()
  .isInt({ min: 0, max: 999 })
  .withMessage('대형 짐 개수는 0~999 사이여야 합니다.')
  .toInt();

export const orderCode = body('orderCode')
  .trim()
  .notEmpty()
  .withMessage('주문코드는 필수입니다.')

export default {
  // Query
  page,
  statusQuery,
  tab,
  limit,
  from,
  to,

  // Param
  orderId,

  // Body
  email,
  firstName,
  lastName,
  name,
  hotelId,
  partnerId,
  price,
  plans,
  cntS,
  cntM,
  cntL,
};