/**
 * @file app/middlewares/validations/fields/question.field.js
 * @description questions 정보 유효성 검사 필드
 * 251223 v1.0.0 BSONG init
 */

import path from 'path';
import fs from 'fs';
import * as pathUtil from '../../../utils/path/path.util.js';
import { body, param, query } from "express-validator";

export const page = query('page')
  .optional()
  .trim()
  .isInt({ min: 1 }) // isNumeric보다 명확
  .withMessage('1 이상의 정수만 허용합니다.')
  .toInt()
;

export const id = param('id')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isInt({ min: 1 })
  .withMessage('숫자만 허용합니다.')
  .toInt()
;

export const title = body('title')
  .trim()
  .notEmpty()
  .withMessage('제목은 필수 항목입니다.')
  .bail()
  .matches(/^[가-힣0-9\s]{2,30}$/) // \s 사용 권장
  .withMessage('한글, 숫자로 2~30자 허용')
  .bail()
  .custom(val => !/\s{2,}/.test(val)) // 연속 공백 방지
  .withMessage('연속된 공백은 허용되지 않습니다.')
;

export const content = body('content')
  .trim()
  .notEmpty()
  .withMessage('내용은 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9가-힣\s-]{2,250}$/)
  .withMessage('한글, 영어, 숫자, 하이픈으로 2~250자 허용')
;

export const qnaImg = body('qna_img')
  .optional({ checkFalsy: true }) // 빈 문자열도 허용
  .trim()
  .bail()
  .custom(val => {
    if (!val) return true; // optional이므로

    const allowedPrefix = `${process.env.APP_URL}${process.env.ACCESS_QUESTION_IMAGE_PATH}`;
    return val.startsWith(allowedPrefix);
  })
  .withMessage('허용하지 않는 이미지 경로입니다.')
  .bail()
  .custom(val => {
    if (!val) return true;
    
    const filename = val.split('/').pop();
    
    // 파일명에 위험한 문자 차단
    if (/[<>:"|?*]/.test(filename)) {
      return false;
    }
    
    // 확장자 검증
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExt = validExtensions.some(ext => 
      filename.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExt) {
      return false;
    }
    
    const fullPath = path.join(pathUtil.getQuestionsImagePath(), filename);
    return fs.existsSync(fullPath);
  })
  .withMessage('유효하지 않은 이미지 파일입니다.')
;

export const status = body('status')
  .notEmpty()
  .withMessage('상태는 필수 항목입니다')
  .bail()
  .isBoolean()
  .withMessage('상태는 true 또는 false만 허용합니다')
  .toBoolean();

export const res = body('res')
  .optional({ nullable: true, checkFalsy: true })  
  .trim()
  .isLength({ min: 2, max: 500 })
  .withMessage('답변은 2~500자여야 합니다')
  .bail()
  .matches(/^[a-zA-Z0-9가-힣\s\!\@\#\$\-\.\,\?\(\)]+$/)
  .withMessage('허용되지 않는 특수문자가 포함되어 있습니다');
