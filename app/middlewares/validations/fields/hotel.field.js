/**
 * @file app/middlewares/validations/fields/hotel.field.js
 * @description 호텔 정보 유효성 검사 필드
 * 251222 v1.0.0 wook init
 */

import { body } from "express-validator";

const krName = body('hotelKrName')
  .trim()
  .notEmpty()
  .withMessage('한글 이름은 필수 항목입니다.')
  .bail()
  .matches(/^[가-힣0-9 ]{2,50}$/)
  .withMessage('한글, 숫자로 2~50자 허용')
;

const enName = body('hotelEnName')
  .trim()
  .notEmpty()
  .withMessage('영어 이름은 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9 ]{2,50}$/)
  .withMessage('영어대소문자, 숫자로 2~50자 허용')
;

const manager = body('manager')
  .trim()
  .notEmpty()
  .withMessage('담당자 이름은 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9가-힣 ]{2,50}$/)
  .withMessage('한글, 영어대소문자, 숫자로 2~50자 허용')
;

const phone = body('phone')
  .optional({ checkFalsy: true })
  .trim()
  .matches(/^(01[016789]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/)
  .withMessage('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678, 02-123-4567)')
;

const address = body('address')
  .trim()
  .notEmpty()
  .withMessage('주소는 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9가-힣 -]{2,50}$/)
  .withMessage('한글, 영어대소문자·숫자·- 으로 2~50자 허용')
;

const lat = body('lat')
  .trim()
  .notEmpty()
  .matches(/^(3[3-9])\.\d{1,6}$/)
  .withMessage('위도(lat)는 33~39 사이의 소수값이어야 합니다.')
;

const lng = body('lng')
  .trim()
  .notEmpty()
  .matches(/^(12[4-9]|13[0-2])\.\d{1,6}$/)
  .withMessage('경도(lng)는 124~132 사이의 소수값이어야 합니다.')
;

export default {
  enName,
  krName,
  manager,
  phone,
  address,
  lat,
  lng,
}