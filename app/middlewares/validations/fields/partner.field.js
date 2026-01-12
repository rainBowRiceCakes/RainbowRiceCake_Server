/**
 * @file app/middlewares/validations/fields/partner.field.js
 * @description 매장 정보 유효성 검사 필드
 * 251222 v1.0.0 wook init
 */

import { body, param, query } from "express-validator"
import pathUtil from "../../../utils/path/path.util.js";
import path from 'path';
import fs from 'fs';

// 유저 PK 필드
const page = query('page')
  .trim()
  .optional()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();

const partnerId = param('id')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt()
  ;

const businessNum = body('businessNum')
  .trim()
  .notEmpty()
  .withMessage('사업자 번호는 필수 항목입니다')
  .bail()
  .matches(/^\d{10}$/)  // 10자리 숫자만
  .withMessage('사업자번호는 10자리 숫자여야 합니다')
  ;

const krName = body('krName')
  .trim()
  .notEmpty().withMessage('한글 이름은 필수 항목입니다.')
  .bail()
  .isLength({ min: 2, max: 100 }).withMessage('이름은 2~100자 사이여야 합니다.'); // 정규식 대신 길이 검사 권장

const enName = body('enName')
  .trim()
  .notEmpty().withMessage('영어 이름은 필수 항목입니다.')
  .bail()
  .isLength({ min: 2, max: 100 }).withMessage('영어 이름은 2~100자 사이여야 합니다.');

const manager = body('manager')
  .trim()
  .notEmpty()
  .withMessage('담당자 이름은 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9가-힣 ]{2,50}$/)
  .withMessage('한글, 영어대소문자, 숫자로 2~50자 허용')
  ;

const phone = body('phone')
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .matches(/^(01[016789]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/)
  .withMessage('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678, 02-123-4567)')
  ;

const status = body('status')
  .trim()
  .notEmpty()
  .withMessage('상태는 필수 항목입니다')
  .bail()
  .isIn(['REQ', 'RES', 'REJ'])
  .withMessage('상태는 REQ, RES, REJ 중 하나여야 합니다')
  ;

const logoImg = body('logoImg')
  .trim()
  .notEmpty()
  .withMessage('내용은 필수 항목입니다.')
  .bail()
  .custom(val => {
    // 우리 앱의 게시글 이미지에 접근하는 도메인 + path가 맞는지 확인
    if (!val.startsWith(`${process.env.APP_URL}${process.env.ACCESS_FILE_PARTNER_LOGO_IMAGE_PATH}`)) {
      return false;
    }
    return true;
  })
  .withMessage('허용하지 않는 이미지 경로입니다.')
  .bail()
  .custom(val => {
    // 실제 이미지 파일이 있는지 검증 처리
    const splitPath = val.split('/');
    const fullPath = path.join(pathUtil.getLogosImagePath(), splitPath[splitPath.length - 1]);
    if (!fs.existsSync(fullPath)) {
      return false;
    }
    return true;
  })
  .withMessage('존재하지 않는 이미지 경로입니다.');

const address = body('address')
  .trim()
  .notEmpty().withMessage('주소는 필수 항목입니다.')
  .bail()
  .isLength({ min: 2, max: 200 }).withMessage('주소는 2~200자 사이여야 합니다.');

// 위경도: matches 대신 isFloat(숫자 검사) 사용
const lat = body('lat')
  .notEmpty().withMessage('위도는 필수 항목입니다.')
  .bail()
  .isFloat({ min: 33, max: 39 }).withMessage('위도(lat)는 33~39 사이의 소수값이어야 합니다.');

const lng = body('lng')
  .notEmpty().withMessage('경도는 필수 항목입니다.')
  .bail()
  .isFloat({ min: 124, max: 132 }).withMessage('경도(lng)는 124~132 사이의 소수값이어야 합니다.');
;

const billingKey = body('billingKey')
  .trim()
  .notEmpty().withMessage('빌링키는 필수 항목입니다.')
  .bail()
  .isString().withMessage('빌링키 형식이 올바르지 않습니다.')
  .bail()
  .isLength({ min: 5 }).withMessage('유효하지 않은 빌링키 형식입니다.'); // 최소 길이 검사 추가

const cardName = body('cardName')
  .trim()
  .notEmpty().withMessage('카드사 정보는 필수 항목입니다.')
  .bail()
  .isString().withMessage('카드사 이름 형식이 올바르지 않습니다.');

export default {
  page,
  partnerId,
  businessNum,
  krName,
  enName,
  manager,
  phone,
  status,
  logoImg,
  address,
  lat,
  lng,
  billingKey,
  cardName
}