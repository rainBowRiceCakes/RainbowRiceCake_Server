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
  .isInt({ min: 1, max: 1000 })
  .withMessage('페이지는 1 이상 1000 이하의 정수여야 합니다.')
  .toInt()
;

export const limit = query('limit')
  .optional()
  .trim()
  .isInt({ min: 1, max: 100 })
  .withMessage('limit은 1 이상 100 이하의 정수여야 합니다.')
  .toInt()
;

export const id = param('id')
  .trim()
  .notEmpty()
  .withMessage('ID는 필수 항목입니다.')
  .bail()
  .isInt({ min: 1 })
  .withMessage('ID는 양수만 허용합니다.')
  .toInt()
;

export const title = body('title')
  .trim()
  .notEmpty()
  .withMessage('제목은 필수 항목입니다.')
  .bail()
  .isLength({ min: 2, max: 200 })
  .withMessage('제목은 2~200자로 입력해주세요.')
  .bail()
  .custom(val => !/\s{2,}/.test(val))
  .withMessage('연속된 공백은 허용되지 않습니다.')
;

export const content = body('content')
  .trim()
  .notEmpty()
  .withMessage('내용은 필수 항목입니다.')
  .bail()
  .isLength({ min: 10, max: 5000 })
  .withMessage('내용은 10~5000자로 입력해주세요.')
  .bail()
  .custom(val => {
    // XSS 방지: script 태그 차단
    if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(val)) {
      return false;
    }
    return true;
  })
  .withMessage('허용되지 않는 태그가 포함되어 있습니다.')
;

export const qnaImg = body('qna_img')
  .optional({ checkFalsy: true })
  .trim()
  .bail()
  .isURL({ protocols: ['http', 'https'], require_protocol: true })
  .withMessage('올바른 URL 형식이 아닙니다.')
  .bail()
  .custom(val => {
    if (!val) return true;

    const allowedPrefix = `${process.env.APP_URL}${process.env.ACCESS_QUESTION_IMAGE_PATH}`;
    return val.startsWith(allowedPrefix);
  })
  .withMessage('허용되지 않은 이미지 경로입니다.')
  .bail()
  .custom(val => {
    if (!val) return true;

    const filename = path.basename(val);

    // 파일명 보안 검증
    if (/[<>:"|?*\x00-\x1f]/.test(filename)) {
      return false;
    }

    // Path traversal 공격 방지
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return false;
    }

    // 확장자 화이트리스트
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExt = validExtensions.some(ext =>
      filename.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt) {
      return false;
    }

    // 파일 존재 여부 확인
    const fullPath = path.join(pathUtil.getQuestionsImagePath(), filename);
    return fs.existsSync(fullPath);
  })
  .withMessage('유효하지 않은 이미지 파일입니다.')
;

export const images = body('images')
  .optional()
  .isArray({ max: 5 })
  .withMessage('이미지는 최대 5개까지 첨부 가능합니다.')
  .bail()
  .custom((arr) => {
    if (!Array.isArray(arr)) return true;
    return arr.every(url => typeof url === 'string' && url.length < 500);
  })
  .withMessage('각 이미지 URL은 500자 이내여야 합니다.')
;

export const status = body('status')
  .optional()
  .trim()
  .isIn(['pending', 'in_progress', 'resolved', 'closed', 'reopened'])
  .withMessage('상태는 pending, in_progress, resolved, closed, reopened 중 하나여야 합니다.')
;

export const answer = body('answer')
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ min: 10, max: 10000 })
  .withMessage('답변은 10~10000자로 입력해주세요.')
  .bail()
  .custom(val => {
    if (!val) return true;
    // XSS 방지
    if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(val)) {
      return false;
    }
    return true;
  })
  .withMessage('허용되지 않는 태그가 포함되어 있습니다.')
;

export const answeredBy = body('answered_by')
  .optional()
  .trim()
  .isInt({ min: 1 })
  .withMessage('응답자 ID는 양수여야 합니다.')
  .toInt()
;

export const email = body('email')
  .optional()
  .trim()
  .isEmail()
  .withMessage('올바른 이메일 형식이 아닙니다.')
  .normalizeEmail()
  .isLength({ max: 255 })
  .withMessage('이메일은 255자 이내여야 합니다.')
;
