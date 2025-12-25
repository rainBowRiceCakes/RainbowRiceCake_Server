/**
 * @file app/utils/path/path.util.js
 * @description path 유틸리티
 * 251218 v1.0.0 wook init
 */

import path from 'path';

function getViewDirPath() {
  const __dirname = process.env.APP_MODE !== 'dev' ? process.env.APP_DIST_PATH : path.resolve(process.env.APP_DIST_PATH);

  return path.join(__dirname, 'index.html');
}

function getOrdersImagePath() {
  return process.env.APP_MODE !== 'dev' ? process.env.FILE_ORDER_DLV_IMAGE_PATH : path.resolve(process.env.FILE_ORDER_DLV_IMAGE_PATH);
}

function getQuestionsImagePath() {
  return process.env.APP_MODE !== 'dev' ? process.env.FILE_QUESTION_IMAGE_PATH : path.resolve(process.env.FILE_QUESTION_IMAGE_PATH);
}

function getProfilesImagePath() {
  return process.env.APP_MODE !== 'dev' ? process.env.FILE_USER_PROFILE_PATH : path.resolve(process.env.FILE_USER_PROFILE_PATH);
}

function getLicensesImagePath() {
  return process.env.APP_MODE !== 'dev' ? process.env.FILE_RIDER_LICENSE_IMAGE_PATH : path.resolve(process.env.FILE_RIDER_LICENSE_IMAGE_PATH);
}

function getLogosImagePath() {
  return process.env.APP_MODE !== 'dev' ? process.env.FILE_RIDER_LICENSE_IMAGE_PATH : path.resolve(process.env.FILE_RIDER_LICENSE_IMAGE_PATH);
}

export default {
  getViewDirPath,
  getQuestionsImagePath,
  getOrdersImagePath,
  getProfilesImagePath,
  getLicensesImagePath,
  getLogosImagePath,
}
