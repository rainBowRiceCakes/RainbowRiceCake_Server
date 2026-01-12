/**
 * @file app/middlewares/validations/partner.store.billingkey.validator.js
 */
import partner from "../../fields/partner.field.js";

export default [
  partner.billingKey,
  partner.cardName,
];