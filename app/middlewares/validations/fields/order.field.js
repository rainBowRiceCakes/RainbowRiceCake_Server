/**
 * @file app/middlewares/validations/fields/order.field.js
 * @description orders 정보 유효성 검사 필드
 * 251223 v1.0.0 BSONG init
 */

import { body } from "express-validator";

const page = query('page')
  .trim()
  .optional()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt()
;

const id = param('id')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt()
;

const email = body('email')
  .trim()
  .notEmpty() // 이메일이 비어있는지 체크
  .withMessage('이메일은 필수 항목입니다.')
  .bail()
  .isEmail() // 이메일 양식대로 작성했는지 체크
  .withMessage('유효한 이메일을 입력해주세요.')
;

const name = body('name')
  .trim()
  .notEmpty()
  .withMessage('이름은 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z\s]{2,50}$/)
  .withMessage('영어 대소문자, 2~50자 허용')
;

export default {
  page,
  id,
  email,
  name,
}
