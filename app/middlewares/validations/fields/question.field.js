/**
 * @file app/middlewares/validations/fields/question.field.js
 * @description questions 정보 유효성 검사 필드
 * 251223 v1.0.0 BSONG init
 */

import { body } from "express-validator";

const page = query('page')
  .trim()
  .optional()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();

const id = param('id')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();

const title = body('title')
  .trim()
  .notEmpty()
  .withMessage('제목 필수 항목입니다.')
  .bail()
  .matches(/^[가-힣0-9 ]{2,30}$/)
  .withMessage('한글, 숫자로 2~30자 허용')
;

const content = body('content')
  .trim()
  .notEmpty()
  .withMessage('내용는 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9가-힣 -]{2,250}$/)
  .withMessage('한글, 영어대소문자·숫자·- 으로 2~250자 허용')
;

const qna_img = body('qna_img')
  .trim()
  .bail()
  .custom(val => {
    // 우리 앱의 게시글 이미지에 접근하는 `도메인 + path`가 맞는지 확인
    if(!val.startsWith(`${process.env.APP_URL}${process.env.ACCESS_FILE_USER_PROFILE_PATH}`)) {
      return false;
    }
    return true;
  })
  .withMessage('허용하지 않는 이미지 경로입니다.')
  .bail()
  .custom(val => {
    // 실제 이미지 파일이 있는지 검증 처리
    const splitPath = val.split('/');
    const fullPath = path.join(pathUtil.getProfilesImagePath(), splitPath[splitPath.length - 1]);

    if(!fs.existsSync(fullPath)) {
      return false;
    }

    return true;
  })
  .withMessage('존재하지 않는 이미지 경로입니다.');
;

const res = body('res')
  .trim()
  .notEmpty()
  .withMessage('답변 내용은 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9가-힣-]{2,500}$/)
  .withMessage('한글, 영어대소문자·숫자·- 으로 2~500자 허용')
;

export default {
  page,
  id,
  title,
  content,
  qna_img,
  res
}
