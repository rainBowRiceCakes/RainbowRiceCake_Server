/**
 * @file app/middlewares/multer/uploaders/order.dlv.uploader.js
 * @description when riders pick up the order and completed the order, 이미지 업로더
 * 251218 v1.0.0 wook init
 * 251224 v1.1.0 BSONG pickup + 배송 완료 사진 업로드 기능이 새로 추가
 */

import multer from 'multer';
import fs from 'fs';
import dayjs from 'dayjs';
import myError from '../../../errors/customs/my.error.js';
import { BAD_FILE_ERROR } from '../../../../configs/responseCode.config.js';
import pathUtil from '../../../utils/path/path.util.js';

/**
 * when riders pick up the order and completed the order, 이미지 업로더 처리 미들웨어
 * @param {import{"express"}.Request} req
 * @param {import{"express"}.Response} res
 * @param {import{"express"}.NextFunction} next
 */
export default function(req, res, next) {
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, callback) {
        const { orderId, status } = req.body;

        // 1️⃣ 필수 값 체크
        if (!orderId || !status) {
          return callback(new Error("orderId 또는 status 누락"));
        }

        // 2️⃣ status 화이트리스트
        if (!["pick", "com"].includes(status)) {
          return callback(new Error("유효하지 않은 status 값"));
        }

        const fullPath = pathUtil.getDeliveryPhotoPath();

        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, {
            recursive: true,
            mode: 0o755,
          });
        }

        callback(null, fullPath);
      },

      filename(req, file, callback) {
        const { orderId, status } = req.body;

        const ext = file.originalname.split(".").pop().toLowerCase();
        const timestamp = dayjs().format("YYYYMMDD_HHmmss");
        const uuid = crypto.randomUUID();

        // 3️⃣ 핵심: orderId + status 포함
        const filename = `order_${orderId}_${status}_${timestamp}_${uuid}.${ext}`;

        callback(null, filename);
      },
    }),

    fileFilter(req, file, callback) {
      if (!file.mimetype.startsWith("image/")) {
        return callback(myError("이미지 파일 아님", BAD_FILE_ERROR));
      }
      callback(null, true);
    },

    limits: {
      fileSize: Number(process.env.FILE_ORDER_DLV_IMAGE_SIZE),
    },
  }).single("orderDlvImage");

  upload(req, res, err => {
    if (err) {
      return next(myError(err.message, BAD_FILE_ERROR));
    }
    next();
  });
}
