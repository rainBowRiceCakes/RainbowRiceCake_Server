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
  .matches(/^[a-zA-Z\s ]{2,50}$/)
  .withMessage('영어 대소문자, 2~50자 허용')
;

// delivery photo
const image = body('image')
  .trim()
  .notEmpty()
  .withMessage('사진은 필수 항목입니다.')
  .bail()
  .custom(val => {
    if(!val.startsWith(`${process.env.APP_URL}${process.env.ACCESS_FILE_ORDER_DLV_IMAGE_PATH}`)) {
      return false;
    }

    return true;
  })
  .withMessage('허용하지 않는 이미지 경로입니다.')
  .bail()
  .custom(val => {
    // 실제 이미지 파일이 있는지 검증 처리
    const splitPath = val.split('/');
    const fullPath = path.join(pathUtil.getPostsImagePath(), splitPath[splitPath.length - 1]);

    if(!fs.existsSync(fullPath)) {
      return false;
    }

    return true;
  })
  .withMessage('존재하지 않는 이미지 경로입니다.');

export default {
  page,
  id,
  email,
  name,
  image,
}
