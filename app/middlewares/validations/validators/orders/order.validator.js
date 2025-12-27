// validators/orders/order.validator.js
import order from '../../fields/order.field.js';

// 1. 주문 생성 (파트너)
const store = [
  order.email,
  order.name,
  order.hotelId,
  order.price,
  order.cntS,
  order.cntM,
  order.cntL,
];

// 2. 주문 매칭 (라이더)
const match = [
  order.orderId,
];

// 3. 픽업 사진 업로드
const pickupPhoto = [
  order.orderId,
  // multer가 파일 처리, controller에서 req.file 체크
];

// 4. 완료 사진 업로드
const completePhoto = [
  order.orderId,
];

// 5. 오늘 주문 목록 조회
const todayIndex = [
  order.page,
  order.statusQuery, // ?status=req,match,pick,com
];

// 6. 주문 히스토리 조회
const index = [
  order.page,
];

// 7. 주문 상세 조회
const show = [
  order.orderId,
];

export default {
  store,
  match,
  pickupPhoto,
  completePhoto,
  todayIndex,
  index,
  show,
};
