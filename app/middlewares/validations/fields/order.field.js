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
const page = query('page')
  .trim()
  .optional()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt()
;

const scope = query('scope')
  .optional()
  .trim()
  .isIn(['history', 'today'])
  .withMessage('scope는 history 또는 today만 허용됩니다.')
;

const statusQuery = query('status')
  .optional()
  .trim()
  .isIn(['req', 'match', 'pick', 'com'])
  .withMessage('유효하지 않은 status 값입니다.')
;

const orderId = param('orderId')
  .trim()
  .notEmpty()
  .withMessage('주문 ID는 필수입니다.')
  .bail()
  .isInt({ min: 1 })
  .withMessage('유효한 주문 ID가 아닙니다.')
  .toInt()
;

// === Body Parameters ===
const email = body('email')
  .trim()
  .notEmpty() 
  .withMessage('Email is required.')
  .bail()
  .isEmail() 
  .withMessage('Please enter a valid email address.')
  .normalizeEmail() // 이메일 정규화
;

const name = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required.')
  .bail()
  .matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/)
  .withMessage('Name must be between 2 and 50 characters, using English letters (uppercase and lowercase)')
;

const hotelId = body('hotelId')
  .trim()
  .notEmpty()
  .withMessage('호텔 ID는 필수입니다.')
  .bail()
  .isInt({ min: 1 })
  .withMessage('유효한 호텔 ID가 아닙니다.')
  .toInt()
;

const price = body('price')
  .trim()
  .notEmpty()
  .withMessage('배송 요금은 필수입니다.')
  .bail()
  .isInt({ min: 0 })
  .withMessage('배송 요금은 0 이상의 숫자여야 합니다.')
  .toInt()
;

// 짐 개수 (optional이지만 있으면 검증)
const cntS = body('cnt_s')
  .optional()
  .trim()
  .isInt({ min: 0, max: 999 })
  .withMessage('소형 짐 개수는 0~999 사이여야 합니다.')
  .toInt()
;

const cntM = body('cnt_m')
  .optional()
  .trim()
  .isInt({ min: 0, max: 999 })
  .withMessage('중형 짐 개수는 0~999 사이여야 합니다.')
  .toInt()
;

const cntL = body('cnt_l')
  .optional()
  .trim()
  .isInt({ min: 0, max: 999 })
  .withMessage('대형 짐 개수는 0~999 사이여야 합니다.')
  .toInt()
;

const status = body('status')
  .optional()
  .trim()
  .isIn(['req', 'match', 'pick', 'com'])
  .withMessage('유효하지 않은 status 값입니다. (req, match, pick, com만 허용)')
;


export default {
  // Query 파라미터 검증 필드들
  page,
  scope,
  statusQuery,
  
  // URL 파라미터 검증 필드들
  orderId,
  
  // Body 파라미터 - 주문 생성 시 필요한 필드들
  email,
  name,
  hotelId,
  price,
  cntS,
  cntM,
  cntL,
  
  // Body 파라미터 - 상태 관리 필드들
  status,
}