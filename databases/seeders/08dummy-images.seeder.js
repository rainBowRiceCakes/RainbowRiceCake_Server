/**
 * @file databases/seeders/08dummy-images.seeder.js
 * @description images dummy data create
 * 260107 v1.0.0 sara init
 * 260110 v2.0.0 sara update - 실제 이미지 URL(Picsum) 적용
 */

import db from '../../app/models/index.js';

const { Image } = db; 

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 'pick'과 'com' 타입을 적용한 레코드
    /**
     * Lorem Picsum 사용
     * 뒤에 붙는 ?random=n 은 브라우저 캐시를 방지하여 각각 다른 사진이 나오게 합니다.
     */
    const records = [
      {
        /** @type {number} orders 테이블의 PK(id)를 참조하는 외래키 */
        dlvId: 1, 
        img: 'https://picsum.photos/seed/pick1/600/400', // 픽업 사진 샘플
        type: 'pick',
      },
      {
        /** @type {number} orders 테이블의 PK(id)를 참조하는 외래키 */
        dlvId: 1,
        img: 'https://picsum.photos/seed/com1/600/400', // 도착 사진 샘플
        type: 'com',
      },
      {
        /** @type {number} orders 테이블의 PK(id)를 참조하는 외래키 */
        dlvId: 2,
        img: 'https://picsum.photos/seed/pick2/600/400',
        type: 'pick',
      },
      {
        /** @type {number} orders 테이블의 PK(id)를 참조하는 외래키 */
        dlvId: 3,
        img: 'https://picsum.photos/seed/com3/600/400',
        type: 'com',
      },
      {
        /** @type {number} orders 테이블의 PK(id)를 참조하는 외래키 */
        dlvId: 4,
        img: 'https://picsum.photos/seed/pick4/600/400',
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