/**
 * @file databases/seeders/20260113-seed-qna.js
 */

import db from '../../app/models/index.js';
const { Question } = db;

export default {
  async up(queryInterface, Sequelize) {

    const records = [
      {
        userId: 1,
        title: '1제목입니다',
        content: '질문 내용입니다1.',
      },
      {
        userId: 2,
        title: '2제목입니다',
        content: '질문 내용입니다2.',
      },
    ]

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Question.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    // await queryInterface.bulkDelete(tableName, null, {});
    await Question.destroy();
  }
};