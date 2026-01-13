/**
 * @file configs/env.config.js
 * @description 환경에 따른 env 설정 파일
 * 260113 v1.0.0 BSONG init
 */

import fs from 'fs';
import dotenv from 'dotenv';

// env 심화버전. 내가 가져와서 자동으로 ㄱ

const envFiles = [
  '.env.production',
  '.env.test',
  '.env'
];

let filePath = ''; // constance variable issue 가 생길 수 있어서 꼭 let으로 하기.

// 정확하게 하려면 절대경로를 써주는데 지금은 그냥 넘어간다.
// `envFiles` 루프: 해당 파일이 있으면 파일 경로 저장
// 예1) `.env.test`와 `.env`가 있을 경우 최종적으로 `.env`를 세팅
// 예2) `.env.test`만 있을 경우 최종적으로 `.en.test`를 세팅
// 예3) `.env.production`, `.env.test`, `.env`가 있을 경우 최종적으로 `.env`를 세팅
for (const file of envFiles) {
  if (fs.existsSync(file)) {
    filePath = file;
  }
}

// 이를 통해 env들을 다 설정하고 난 뒤에 적절하게 상황에 맞는 env를 가져오게 된다.

dotenv.config({
  path: filePath,
  debug: filePath === '.env' ? true : false
});
console.log(`Loaded env: ${filePath}`); // 첫 번째 발견된 env 파일만 로드