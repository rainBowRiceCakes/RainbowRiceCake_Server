/**
 * @file app/middlewares/multer/rider.license.uploader.js
 * @description 매장 제휴 신청 시, 로고 이미지 업로더
 * 251226 v1.0.0 WOOK init
 */

import multer from 'multer';
import fs from 'fs';
import dayjs from 'dayjs';
import myError from '../../../errors/customs/my.error.js';
import { BAD_FILE_ERROR } from '../../../../configs/responseCode.config.js';
import pathUtil from '../../../utils/path/path.util.js';

/**
 * 라이센스 이미지 업로더 처리 미들웨어
 * @param {import{"express"}.Request} req
 * @param {import{"express"}.Response} res
 * @param {import{"express"}.NextFunction} next
 */
export default function(req, res, next) {
  // multer 객체 인스턴스
  const upload = multer({
    // storage: 파일을 저장할 위치를 상세하게 제어하는 프로퍼티
    storage: multer.diskStorage({
      // 파일 저장 경로 설정
      destination(req, file, callback) {
        const fullPath = pathUtil.getLogosImagePath();

        // 저장 디렉토리 설정
        if(!fs.existsSync(fullPath)) {
          // 해당 디렉토리 없으면 생성 처리
          fs.mkdirSync(
            fullPath,
            {
              recursive: true, // 중간 디렉토리까지 모두 생성
              mode: 0o755 // 권한 설정 rwxr-xr-x(3개씩 생성자/그룹/기타)
            }
          );
        }

        callback(null, fullPath);
      },
      // 파일명 설정
      filename(req, file, callback) {
        // 저장할 파일명 생성
        const uniqueFileName = `${dayjs().format('YYYYMMDD')}_${crypto.randomUUID()}`;
        const fileNameParts = file.originalname.split('.');
        const ext = fileNameParts[fileNameParts.length - 1].toLowerCase();

        callback(null, `${uniqueFileName}.${ext}`);
      }
    }),
    // fileFileter: 파일 필터링 처리를 제어하는 프로퍼티
    fileFilter: (req, file, callback) => {
      if(!file.mimetype.startsWith('image/')) {
        return callback(myError('이미지 파일 아님', BAD_FILE_ERROR));
      }
      callback(null, true);
    },
    // limits: 파일 사이즈 제한, 파일 개수 제한
    limits: {
      fileSize: parseInt(process.env.FILE_USER_PROFILE_SIZE),
    }
  }).single('logoImg');

  // 예외 처리
  upload(req, res, err => {
    if(err) {
      if(err instanceof multer.MulterError || err) {
        next(myError(err.message, BAD_FILE_ERROR));
      }
    }
    next();
  });
}
