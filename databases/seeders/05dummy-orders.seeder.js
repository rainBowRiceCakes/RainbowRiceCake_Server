/**
 * @file databases/seeders/05dummy-orders.seeder.js
 * @description orders dummy data create
 * 251219 v1.0.0 wook init
 * 260110 v2.0.0 sara update - 필드명 불일치, 데이터 타입 오류, 중복 키 위반 문제 해결.dayjs 에러 및 인스턴스화 이슈 해결
 * - [Fix] Math.floor 추가: DB 정수 타입(BIGINT)에 소수점 값이 들어가지 않도록 수정
 * - [Fix] orderCode 중복 오류 해결: serial 변수를 사용해 모든 레코드에 고유 코드 부여
 * - [Fix] 필드명 매핑 수정: DB 컬럼명과 일치하도록 createAt -> createdAt 변경
 * 260111 v2.0.0 sara update - seeder add for sara 주문 체크할 때 내 카카오 로그인으로 처리하니 확인해볼 데이터 더미(sara 전용 추가)  
 */

import { fakerKO as faker } from '@faker-js/faker'; 
// 임포트할 때 'fakerKO'를 'faker'라는 이름으로 가져와서 바로 사용
import dayjs from 'dayjs';
import db from '../../app/models/index.js';
const { Order } = db;


// 테이블명
// const tableName = 'orders';

/** @type {import('sequelize-cli').Migration} */
export default {
  /** * [수정] Math.floor() 적용
   * 이유: DB의 PK/FK 컬럼은 정수(BIGINT)이므로 소수점이 포함되면 데이터 삽입 에러가 발생할 수 있음 
   */
  async up(queryInterface, Sequelize) {
    const getRandomInRange = (min, max) =>
      // 정수를 반환하도록 수정 from sara 260110
      Math.floor(Math.random() * (max - min) + min);

    const start = new Date('2025-12-01T00:00:00');
    const end = new Date('2025-12-31T23:59:59');
    const testS = new Date('2026-01-06T00:00:00');
    const testE = new Date('2026-01-12T23:59:59');
    //레코드 정보
    const records = []
    
    const reqCount = 100
    const matCount = 100
    const pickCount = 100
    const comCount = 100

    /** * [수정] 전역 일련번호(serial) 도입 
     * 이유: order_code는 UNIQUE 제약 조건이 있어, 각 반복문마다 동일한 숫자로 시작하면 중복 에러가 발생함
     */
    let serial = 1;

    // 1. 배송 요청 데이터 (req)
    for (let i = 1; i <= reqCount; i++) {
      const randomNum = getRandomInRange(1, 50);
      const randomDate = faker.date.between({ from: start, to: end });
      records.push({
        riderId: null, partnerId: randomNum, hotelId: randomNum,
        // 숫자를 명시적으로 문자열로 변환하여 전달
        orderCode: `20260104${serial++}`,
        email: 'email@email.com', 
        name: faker.person.fullName(),
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'req',
        createdAt: dayjs(randomDate).toDate(), // dayjs로 날짜 객체화, // [수정] 오타 수정: createAt -> createdAt 260110 from sara 
        updatedAt: dayjs(randomDate).toDate(),
        pickupAt: null // [추가] getter 에러 방지를 위해 명시적으로 null 주입
      });
    }
    
    // 2. 배차 완료 데이터 (mat)
    for (let i = 1; i <= matCount; i++) {
      const randomNum = getRandomInRange(1, 50);
      const randomDate = faker.date.between({ from: start, to: end });
      records.push({
        riderId: randomNum, partnerId: randomNum, hotelId: randomNum,
        orderCode: `20260104${serial++}`,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'mat',
        createdAt: dayjs(randomDate).toDate(), // dayjs로 날짜 객체화, // [수정] 오타 수정: createAt -> createdAt 260110 from sara 
        updatedAt: dayjs(randomDate).toDate(),
        pickupAt: null // [추가] getter 에러 방지를 위해 명시적으로 null 주입
      });
    }
    
    // 3. 픽업 완료 데이터 (pick)
    for (let i = 1; i <= pickCount; i++) {
      const randomNum = getRandomInRange(1, 50);
      const randomDate = faker.date.between({ from: start, to: end });
      // [dayjs 활용] 생성 시간 기준 1시간 뒤를 픽업 시간으로 계산
      const pickupTime = dayjs(randomDate).add(1, 'hour').toDate();

      records.push({
        riderId: randomNum, partnerId: randomNum, hotelId: randomNum,
        orderCode: `20260112${serial++}`,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'pick',
        createdAt: dayjs(randomDate).toDate(),
        updatedAt: pickupTime,
        pickupAt: pickupTime
      });
    }
    
    // 4. 도착 완료 데이터 (com)
    for (let i = 1; i <= comCount; i++) {
      const randomNum = getRandomInRange(1, 50);
      const randomDate = faker.date.between({ from: start, to: end });
      const pickupTime = dayjs(randomDate).add(1, 'hour').toDate();
      const completeTime = dayjs(pickupTime).add(1, 'hour').toDate();

      records.push({
        riderId: randomNum, partnerId: randomNum, hotelId: randomNum,
        orderCode: `20260104${serial++}`,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'com',
        createdAt: dayjs(randomDate).toDate(),
        updatedAt: completeTime,
        pickupAt: pickupTime
      });
    }
    
    // 5. 이번달 완료 데이터 (com)
    for (let i = 1; i <= comCount; i++) {
      const randomNum = getRandomInRange(1, 50);
      const randomDate = faker.date.between({ from: testS, to: testE });
      const pickupTime = dayjs(randomDate).add(1, 'hour').toDate();
      const completeTime = dayjs(pickupTime).add(1, 'hour').toDate();

      records.push({
        riderId: randomNum, partnerId: randomNum, hotelId: randomNum,
        orderCode: `20260104${serial++}`,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'com',
        createdAt: dayjs(randomDate).toDate(),
        updatedAt: completeTime,
        pickupAt: pickupTime
      });
    }

    /**
     *  [추가] 특정 계정(dlsdn0118@naver.com) 주문 더미 추가
     * - 사진처럼 테스트/확인 가능한 고정 데이터
     * - 나머지 값(파트너/호텔/라이더 등)은 랜덤
     * - cnt는 사진 스타일로 cntS=1, cntM=0, cntL=0
     */
    const SARA_EMAIL = 'dlsdn0118@naver.com';
    const SARA_NAME = '설아(Sara)';
    const baseTime = dayjs('2025-12-14T20:14:24');

    const addSaraOrder = (status) => {
      const partnerId = getRandomInRange(1, 50);
      const hotelId = getRandomInRange(1, 50);
      const riderId = status === 'req' ? null : getRandomInRange(1, 50);

      const createdAt = baseTime.toDate();
      const pickupAt =
        status === 'pick' || status === 'com'
          ? baseTime.add(1, 'hour').toDate()
          : null;

      const updatedAt =
        status === 'com'
          ? baseTime.add(2, 'hour').toDate()
          : status === 'pick'
          ? baseTime.add(1, 'hour').toDate()
          : createdAt;

      records.push({
        riderId,
        partnerId,
        hotelId,
        orderCode: `20260104${serial++}`, // UNIQUE 유지
        email: SARA_EMAIL,
        name: SARA_NAME,
        price: 22000,
        cntS: 1,
        cntM: 0,
        cntL: 0,
        status,
        createdAt,
        updatedAt,
        pickupAt,
      });
    };

    // 배송 요청
    addSaraOrder("pick");
    addSaraOrder("pick");
    addSaraOrder("pick");
    addSaraOrder("com");
    addSaraOrder("mat");
    addSaraOrder("com");
    
    
    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Order.bulkCreate(records);
  },

  async down(queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    // await queryInterface.bulkDelete(tableName, null, {});
    await Order.destroy();
  }
};