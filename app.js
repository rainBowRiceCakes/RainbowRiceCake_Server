/**
 * @file app.js
 * @description Entry Point
 * 251210 v1.0.0 wook 최초 생성
 */

import express from 'express';
import './configs/env.config.js';
import cookieParser from 'cookie-parser';
import errorHandler from './app/errors/errorHandler.js';
import notFoundRouter from './routes/notFound.router.js';
import pathUtil from './app/utils/path/path.util.js';
import authRouter from './routes/auth.router.js';
import hotelRouter from './routes/hotel.router.js';


const app = express();
app.use(express.json()); // JSON 요청 파싱 처리
app.use(cookieParser()); // 쿠키파서

// ---------------------
// 라우터 정의
// ---------------------
app.use('/api/auth', authRouter);
app.use('/api/hotels', hotelRouter)

// ---------------------
// 404 처리
// ---------------------
app.use(notFoundRouter);

// ---------------------
// 뷰 반환 처리
// ---------------------
// 퍼블릭 정적파일 제공 활성화
app.use('/', express.static(process.env.APP_DIST_PATH));
// React 뷰 반환
app.get(/^(?!\/files\/.*).*/, (req, res) => {
  return res.sendFile(pathUtil.getViewDirPath());
})

// ---------------------
// 에러 핸들러 등록
// ---------------------
app.use(errorHandler);

// ---------------------
// 해당 Port로 express 실행
// ---------------------
app.listen(parseInt(process.env.APP_PORT));