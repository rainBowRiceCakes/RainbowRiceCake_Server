/**
 * @file app/middlewares/validations/fields/rider.field.js
 * @description 기사 정보 유효성 검사 필드
 * 251222 v1.0.0 wook init
 */

import { body } from "express-validator";

// 유저 PK 필드
export const userId = body('userId')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt()
;

const licenseImg = body('licenseImg')
  .trim()
  .notEmpty()
  .withMessage('내용은 필수 항목입니다.')
  // TODO: test용으로 코멘트아웃 (추후 multer지정 후 수정예정)
  // .bail()
  // .custom(val => {
  //   // 우리 앱의 게시글 이미지에 접근하는 도메인 + path가 맞는지 확인
  //   if(!val.startsWith(`${process.env.APP_URL}${process.env.ACCESS_FILE_POST_IMAGE_PATH}`)) {
  //     return false;
  //   }
  //   return true;
  // })
  // .withMessage('허용하지 않는 이미지 경로입니다.')
  // .bail()
  // .custom(val => {
  //   // 실제 이미지 파일이 있는지 검증 처리
  //   const splitPath = val.split('/');
  //   const fullPath = path.join(pathUtil.getPostsImagePath(), splitPath[splitPath.length - 1]);
  //   if(!fs.existsSync(fullPath)) {
  //     return false;
  //   }
  //   return true;
  // })
  // .withMessage('존재하지 않는 이미지 경로입니다.');

const bank = body('bank')
  .optional({ checkFalsy: true })
  .trim()
  .matches(/^[a-zA-Z가-힣]{2,10}$/)
;

const bankNum = body('bankNum')
  .optional({ checkFalsy: true })
  .trim()
  .isNumeric()
  .withMessage('숫자만 입력해주세요')
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
  .optional({ checkFalsy: true })
  .trim()
  .matches(/^(3[3-9])\.\d{1,6}$/)
  .withMessage('위도(lat)는 33~39 사이의 소수값이어야 합니다.')
;

const lng = body('lng')
  .optional({ checkFalsy: true })
  .trim()
  .matches(/^(12[4-9]|13[0-2])\.\d{1,6}$/)
  .withMessage('경도(lng)는 124~132 사이의 소수값이어야 합니다.')
;

export default {
  licenseImg,
  bank,
  bankNum,
  phone,
  address,
  lat,
  lng,
}