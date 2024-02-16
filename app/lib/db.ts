import { Payment } from "./definitions"
import { create } from "./mongodb/repositories/payment.mongo"


export async function listPayment() {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return payemnts
}
export async function listPaymentById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return payemnts.find(payment => payment.uuid === id)
}

export async function createOnePayment(payment: Payment) {
  await create(payment);
}


const payemnts: Payment[] = [
  {
    uuid: "0",
    client_id: "0",
    user_uuid: "0",
    price: 50000,
    bws_enterprise_id: "0",
    offer_uuid: "0",
    status: "pending",
    created_at: new Date()
  },
  {
    uuid: "1",
    client_id: "0",
    user_uuid: "0",
    price: 50000,
    bws_enterprise_id: "0",
    offer_uuid: "0",
    status: "pending",
    created_at: new Date()
  }
]
