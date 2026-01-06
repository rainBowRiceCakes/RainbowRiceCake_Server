/**
 * @file databases/seeders/08dummy-images.seeder.js
 * @description images dummy data create
 * 260107 v1.0.0 sara init
 */

import db from '../../app/models/index.js';

const { Image } = db; 

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 사용자가 지정한 'pick'과 'com' 타입을 적용한 레코드
    const records = [
      {
        dlvId: 1, 
        img: 'https://cdn.example.com/uploads/pick_01.jpg',
        type: 'pick', // 픽업 사진
      },
      {
        dlvId: 1,
        img: 'https://cdn.example.com/uploads/com_01.jpg',
        type: 'com',  // 완료 사진
      },
      {
        dlvId: 2,
        img: 'https://cdn.example.com/uploads/pick_02.jpg',
        type: 'pick',
      },
      {
        dlvId: 3,
        img: 'https://cdn.example.com/uploads/com_03.jpg',
        type: 'com',
      },
      {
        dlvId: 4,
        img: 'https://cdn.example.com/uploads/pick_04.jpg',
        type: 'pick',
      }
    ];

    /**
     * Image 모델은 timestamps: true 설정이 되어 있으므로 
     * bulkCreate 사용 시 createdAt, updatedAt가 자동 생성됩니다.
     */
    await Image.bulkCreate(records);
  },

  async down(queryInterface, Sequelize) {
    // paranoid: true 설정이 되어 있으므로, 완전히 삭제하기 위해 force: true를 사용합니다.
    await Image.destroy({ truncate: true, force: true });
  }
};