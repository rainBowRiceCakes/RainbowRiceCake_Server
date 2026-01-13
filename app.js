/**
 * @file app.js
 * @description Entry Point
 * 251210 v1.0.0 wook 최초 생성
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import './configs/env.config.js';

const app = express();
app.use(express.json()); // JSON 요청 파싱 처리
app.use(cookieParser()); // 쿠키파서

// ---------------------
// 해당 Port로 express 실행
// ---------------------
app.listen(parseInt(process.env.APP_PORT), () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`);
});