/**
 * @file databases/seeders/07dummy-notices.seeder.js
 * @description notices dummy data create
 * 251230 v1.0.1 wook init (re-created)
 */
import db from '../../app/models/index.js';
const { Notice } = db;

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    //레코드 정보
    const records = [
      {
        adminId: 1,
        title: '신규 시스템 업데이트 안내',
        content: '안녕하세요. 시스템 업데이트가 완료되었습니다. 변경된 사항을 확인해 주세요.',
        targetRole: 'ALL',
        status: false
      },
      {
        adminId: 1,
        title: '라이더 안전 교육 공지',
        content: '라이더분들은 이번 주말까지 안전 교육을 이수해 주시기 바랍니다.',
        targetRole: 'DLV',
        status: false
      },
      {
        adminId: 1,
        title: '스토어 정산 일정 변경 안내',
        content: '연말 정산 일정이 다음과 같이 변경되었으니 참고 바랍니다.',
        targetRole: 'PTN',
        status: false
      },
      {
        adminId: 1,
        title: '긴급 시스템 점검 공지',
        content: '금일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다.',
        targetRole: 'ALL',
        status: true
      },
      {
        adminId: 1,
        title: '배달 수수료 정산 완료 알림',
        content: '지난 주 배달 수수료 정산이 모두 완료되었습니다. 마이페이지에서 확인 가능합니다.',
        targetRole: 'DLV',
        status: true
      }
    ];

    await Notice.bulkCreate(records);
  },

  async down(queryInterface, Sequelize) {
    // robust delete for seeders
    await Notice.destroy({ truncate: true, force: true });
  }
};
