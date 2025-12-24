/**
 * @file app/middlewares/validations/fields/notice.field.js
 * @description 공지 유효성 검사 필드
 * 251223 v1.0.0 wook init
 */

import { body } from "express-validator"

// 어드민 PK 필드
export const adminId = body('adminId')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt()
;

export const title = body('title')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z가-힣0-9!@#$ ]{2,30}$/)
  .withMessage('한글,영어대소문자·숫자·!·@·#·$ 2~30자 허용')
;

export const content = body('content')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
;

export const targetRole = body('targetRole')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
;

export const status = body('status')
  .optional({ checkFalsy: true })
  .trim()
  .isBoolean()
  .withMessage('boolean값만 허용')
;
