// validators/orders/order.validator.js
import order from '../../fields/order.field.js';

/**
 * 주문 생성 (POST /orders) 파트너가 하는 일
 */
const store = [
  order.email,
  order.firstName,
  order.lastName,
  order.hotelId,
  order.price,
  order.plans,
];

/**
 * 주문 매칭 (POST /orders/:orderCode/match) 라이더가 하는 일
 */
const match = [
  order.orderCode,
];

/**
 * 사진 업로드 (POST /orders/:orderCode/pickup-photo, /orders/:orderCode/complete-photo)
 */
const uploadPhoto = [
  order.orderCode,
];


/**
 * 오늘 주문 조회 (GET /orders/today)
 */
const todayIndex = [
  order.tab,
  order.page,
];

/**
 * 주문 히스토리 조회 (GET /orders)
 */
const index = [
  order.page,
  order.limit,
  order.statusQuery,
  order.from,
  order.to,
];

/**
 * 주문 상세 조회 (GET /orders/:orderCode)
 */
const show = [
  order.orderCode,
];

/**
 * 어드민 강제수정 validator
 */
const force = [
  order.statusQuery,
  order.email,
  order.name,
  order.hotelId,
  order.price,
  order.cntS,
  order.cntM,
  order.cntL
];

const adminStore = [
  order.email,
  order.name,
  order.hotelId,
  order.price,
  order.cntS,
  order.cntM,
  order.cntL,
]

export default {
  store,
  match,
  uploadPhoto,
  todayIndex,
  index,
  show,
  force,
  adminStore,
};
