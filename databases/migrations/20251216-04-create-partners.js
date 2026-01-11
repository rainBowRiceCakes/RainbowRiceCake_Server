/**
 * @file databases/migrations/20251216-04-create-partners.js
 * @description partners migration file
 * 251216 v1.0.0 jun 초기 생성
 */

import { DataTypes } from 'sequelize';

// 테이블명
const tableName = 'partners';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '업체 PK',
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '유저 PK'
  },
  businessNum: {
    field: 'business_num',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '사업자 번호'
  },
  krName: {
    field: 'kr_name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '가계 한글이름'
  },
  enName: {
    field: 'en_name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '가계 영어이름'
  },
  manager: {
    field: 'manager',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '담당자명'
  },
  phone: {
    field: 'phone',
    type: DataTypes.STRING(13),
    allowNull: true,
    comment: '휴대폰번호'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(3),
    allowNull: false,
    comment: '상태(REQ, RES, REJ)',
    defaultValue: 'REQ'
  },
  billingKey: {
    field: 'billing_key',
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '포트원 발급 빌링키'
  },
  cardName: {
    field: 'card_name',
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '등록된 카드사 명 (신한, 현대 등)'
  },
  isAutoPay: {
    field: 'is_auto_pay',
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '자동 결제 여부'
  },
  logoImg: {
    field: 'logo_img',
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: '가게 로고'
  },
  address: {
    field: 'address',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '가게 주소'
  },
  lat: {
    field: 'lat',
    type: DataTypes.DOUBLE,
    allowNull: false,
    comment: '위도'
  },
  lng: {
    field: 'lng',
    type: DataTypes.DOUBLE,
    allowNull: false,
    comment: '경도'
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
