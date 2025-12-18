/**
 * @file app/middlewares/multer/multer.middleware.js
 * @description multer 미들웨어(업로더를 모아서 내보내기)
 * 251218 v1.0.0 wook init
 */

import postUploader from "./uploaders/post.uploader.js";
import profileUploader from "./uploaders/profile.uploader.js";

export default {
  postUploader,
  profileUploader
}