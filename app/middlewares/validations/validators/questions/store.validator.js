/**
 * @file app/middlewares/validations/validators/questions/create.validation.js
 * @description issue 게시물 등록 정보 검사 핸들러
 * 251223 v1.0.0 BSONG init
 */

import { title, content, qnaImg } from '../../../validations/fields/question.field.js';

export default [
  title,
  content,
  qnaImg,
]


