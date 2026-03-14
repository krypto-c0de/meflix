import { api } from "./api";

export function createPixPayment(id, payload) {
  return api.post(`/payments/series/${id}/pix`, payload);
}

export function getPaymentStatus(id) {
  return api.get(`/payments/series/${id}/status`);
}
