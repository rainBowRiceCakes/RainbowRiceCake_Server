/**
 * @file databases/migrations/20251217-07-create-images.js
 * @description images migration file
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';

// 테이블명
const tableName = 'images';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '이미지 PK',
  },
  dlvId: {
    field: 'dlv_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '배송PK'
  },
  img: {
    field: 'img',
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: '픽업/도착 사진'
  },
  type: {
    field: 'type',
    type: DataTypes.STRING(15),
    allowNull: false,
    comment: '사진 type',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '작성일',
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '수정일',
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '삭제일',
  },
};

// 옵션 설정
const options = {
  charset: 'utf8mb4', // 테이블 문자셋 설정(이모지 지원)
  collate: 'utf8mb4_bin', // 정렬 방식 설정(영어 대소문자 구분 정렬)
  engine: 'InnoDB', // 사용 엔진 설정
};

/** @type {import('sequelize-cli').Migration} */
export default {
  // 마이그레이션 실행 시 호출되는 메소드(스키마 생성, 수정)
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, attributes, options);
  },

  // 마이그레이션을 롤백 시 호출되는 메소드(스키마 제거, 수정)
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};
