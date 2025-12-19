/**
 * @file app/models/index.js
 * @description Sequelize 인스턴스 생성 File
 * 251216 v1.0.0 jun 초기 생성
 */

import { Sequelize } from 'sequelize';
import Admin from './Admin.js';
import Alarm from './Alarm.js';
import Hotel from './Hotel.js';
import Image from './Image.js';
import Notice from './Notice.js';
import Order from './Order.js';
import Partner from './Partner.js';
import Rider from './Rider.js';
import Settlement from './Settlement.js';
import User from './User.js';
import Question from './Question.js';

const db = {}; // 생성할 db 인스턴스 저장용

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  process.env.DB_MYSQL_DB_NAME        // DB명
  , process.env.DB_MYSQL_USER         // DB 접속 유저
  , process.env.DB_MYSQL_PASSWORD     // DB 접속 패스워드
  ,{
      host: process.env.DB_MYSQL_HOST                     // 사용 DB Host
      ,port: parseInt(process.env.DB_MYSQL_PORT)          // 사용 DB Port
      ,dialect: process.env.DB_MYSQL_DIALECT              // 사용 DB 드라이버
      ,timezone: process.env.DB_MYSQL_TIMEZONE            // 타임존
      ,logging: process.env.DB_MYSQL_LOG_FLG === 'true' && console.log  // DB Loggin on/off
      ,dialectOptions: {
          dateStrings: true  // 문자열로 날짜 받기
      }
      ,pool: { // 커넥션풀 설정
          max: parseInt(process.env.DB_MYSQL_CONNECTION_COUNT_MAX),   // 최대 커넥션 수
          min: parseInt(process.env.DB_MYSQL_CONNECTION_COUNT_MIN),   // 최소 커넥션 수
          acquire: parseInt(process.env.DB_MYSQL_ACQUIRE_LIMIT),      // 연결 최대 대기 시간 (ms)
          idle: parseInt(process.env.DB_MYSQL_IDLE_LIMIT)             // 유휴 커넥션 유지 시간 (ms)
      }
  }
);

db.sequelize = sequelize; // 생성한 sequelize 인스턴스 db에 저장

// 모델 초기화
db.Admin = Admin.init(sequelize);
db.Alarm = Alarm.init(sequelize);
db.Hotel = Hotel.init(sequelize);
db.Image = Image.init(sequelize);
db.Notice = Notice.init(sequelize);
db.Order = Order.init(sequelize);
db.Partner = Partner.init(sequelize);
db.Rider = Rider.init(sequelize);
db.Settlement = Settlement.init(sequelize);
db.User = User.init(sequelize);
db.Question = Question.init(sequelize)


// 모델 관계 설정
Admin.associate(db);
Hotel.associate(db);
Image.associate(db);
Notice.associate(db);
Order.associate(db);
Partner.associate(db);
Rider.associate(db);
Settlement.associate(db);
User.associate(db);
Question.associate(db);
// Alarm은 관계가 없기떄문에 설정X

export default db;