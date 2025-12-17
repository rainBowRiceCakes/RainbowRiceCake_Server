/**
 * @file databases/configs/sequelize-cli.config.js
 * @description sequelize-cli 설정 파일
 * 251217 v1.0.0 wook 최초 생성
 */

import '../../configs/env.config.js';

export default {
  // 개발환경, 테스트환경, 배포환경 구별
  development: {
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DB_NAME,
    host: process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    dialect: process.env.DB_MYSQL_DIALECT,
    timezone: process.env.DB_MYSQL_TIMEZONE
  },
  test: {
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DB_NAME,
    host: process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    dialect: process.env.DB_MYSQL_DIALECT,
    timezone: process.env.DB_MYSQL_TIMEZONE
  },
  production: {
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DB_NAME,
    host: process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    dialect: process.env.DB_MYSQL_DIALECT,
    timezone: process.env.DB_MYSQL_TIMEZONE
  }
}