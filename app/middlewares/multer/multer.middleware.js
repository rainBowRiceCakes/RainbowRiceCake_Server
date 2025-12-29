/**
 * @file app/middlewares/multer/multer.middleware.js
 * @description multer 미들웨어(업로더를 모아서 내보내기)
 * 251218 v1.0.0 wook init
 */

import orderDlvUploader from "./uploaders/order.dlv.uploader.js";
import partnerLogoUploader from "./uploaders/partner.logo.uploader.js";
import profileUploader from "./uploaders/profile.uploader.js";
import questionAttachmentUploader from "./uploaders/question.uploader.js";
import riderLicenseUploader from "./uploaders/rider.license.uploader.js";

export default {
  orderDlvUploader,
  profileUploader,
  questionAttachmentUploader,
  riderLicenseUploader,
  partnerLogoUploader,
}
