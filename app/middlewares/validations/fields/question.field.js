/**
 * @file app/middlewares/validations/fields/question.field.js
 * @description questions 정보 유효성 검사 필드
 * 251223 v1.0.0 BSONG init
 */

import { body, query } from "express-validator";

export const page = query('page')
  .trim()
  .optional()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();

export const title = body('title')
  .trim()
  .notEmpty()
  .withMessage('제목 필수 항목입니다.')
  .bail()
  .isLength({ min: 2, max: 30 })
  .withMessage('제목은 2~30자여야 합니다')
  .bail()
  .matches(/^[가-힣0-9\s]+$/)
  .withMessage('제목은 한글과 숫자만 허용합니다');
;

export const content = body('content')
  .trim()
  .notEmpty()
  .withMessage('내용는 필수 항목입니다.')
  .bail()
  .isLength({ min: 2, max: 250 })
  .withMessage('내용은 2~250자여야 합니다')
  .bail()
  .matches(/^[a-zA-Z0-9가-힣\s\.\,\!\?\-\(\)]+$/)  // 자주 쓰는 특수문자 추가
  .withMessage('허용되지 않는 특수문자가 포함되어 있습니다');
;

export const qnaImg = body('qnaImg')
  .optional({ nullable: true, checkFalsy: true })  // NULL 허용
  .trim()
  .bail()
  .custom(val => {
    // 우리 앱의 게시글 이미지에 접근하는 `도메인 + path`가 맞는지 확인
    if(!val.startsWith(`${process.env.APP_URL}${process.env.ACCESS_QUESTION_IMAGE_PATH}`)) {
      return false;
    }
    return true;
  })
  .withMessage('허용하지 않는 이미지 경로입니다.')
  .bail()
  .custom(val => {
    // 실제 이미지 파일이 있는지 검증 처리
    const splitPath = val.split('/');
    const fullPath = path.join(pathUtil.getQuestionsImagePath(), splitPath[splitPath.length - 1]);

    if(!fs.existsSync(fullPath)) {
      return false;
    }

    return true;
  })
  .withMessage('존재하지 않는 이미지 경로입니다.');
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
