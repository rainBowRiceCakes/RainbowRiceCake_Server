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
 * @param {string} photoType - 'pick' 또는 'com'
 */
export default function (photoType) {
  // photoType 검증
  if (!['pick', 'com'].includes(photoType)) {
    throw new Error('Invalid photoType. Must be "pick" or "com"');
  }

  return function (req, res, next) {
    const upload = multer({
      storage: multer.diskStorage({
        destination(req, file, callback) {
          const fullPath = pathUtil.getOrdersImagePath();

          if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {
              recursive: true,
              mode: 0o755,
            });
          }

          callback(null, fullPath);
        },

        filename(req, file, callback) {
          // URL 파라미터에서 orderId 가져오기
          const orderCode = req.params.orderCode;

          if (!orderCode || orderCode === 'undefined') {
            return callback(myError("orderCode 누락", BAD_FILE_ERROR));
          }

          const ext = file.originalname.split(".").pop().toLowerCase();

          // 화이트리스트 확장자 체크
          const allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
          if (!allowedExts.includes(ext)) {
            return callback(myError("허용되지 않은 파일 확장자입니다! 다시 업로드 해주세요. ", BAD_FILE_ERROR));
          }

          const timestamp = dayjs().format("YYYYMMDD_HHmmss");
          const uuid = crypto.randomUUID();

          // photoType은 미들웨어 생성 시 고정된 값 사용
          // 사진파일 이름끝에 status + orderId 를 모두 등록해야 후처리가 용이할거같아요!
          const filename = `order_${orderCode}_${photoType}_${timestamp}_${uuid}.${ext}`;

          callback(null, filename);
        },
      }),

      fileFilter(req, file, callback) {
        // MIME 타입 체크
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowedMimes.includes(file.mimetype)) {
          return callback(myError("이미지 파일만 업로드 가능합니다 (jpg, png, gif)", BAD_FILE_ERROR));
        }

        callback(null, true);
      },

      limits: {
        fileSize: Number(process.env.FILE_ORDER_DLV_IMAGE_SIZE) || 5 * 1024 * 1024, // 기본 5MB
        files: 1, // 파일 1개만
      },
    }).single("image");

    upload(req, res, err => {
      if (err instanceof multer.MulterError) {
        // Multer 특정 에러 처리
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(myError('파일 크기가 너무 큽니다', BAD_FILE_ERROR));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(myError('예상치 못한 파일 필드입니다', BAD_FILE_ERROR));
        }
        return next(myError(err.message, BAD_FILE_ERROR));
      }

      if (err) {
        return next(err);
      }

      // 파일이 업로드되지 않은 경우 체크
      if (!req.file) {
        return next(myError('사진 파일이 필요합니다', BAD_FILE_ERROR));
      }

      next();
    });
  };
}

