"use server"

import { createPix } from "./bwpay"
import * as crm from "./crm"
import * as db from "./db"
import { Client, Offer, Payment } from "./definitions"

export async function fetchClients() {
  return await crm.listClient()
}
export async function fetchClientById(id: string) {
  return await crm.listClientById(id)
}

export async function fetchOffers(): Promise<(Offer & { client: Client })[]> {
  return (await crm.listOffer()).map(offer => ({ ...offer, client: crm.clients[0] }))
}
export async function fetchOfferById(id: string) {
  return await crm.listOfferById(id)
}

export async function fetchPayments(): Promise<(Payment & { client: Client })[]> {
  return (await db.listPayment()).map(payment => ({ ...payment, client: crm.clients[0] }))
}
export async function fetchPaymentById(id: string) {
  return await db.listPaymentById(id)
}

export async function createPayment() {
  const pix = await createPix(550)
  await db.createOnePayment({
    pix,
    bws_enterprise_id: "0",
    client_id: "0",
    created_at: new Date(),
    price: 6560000,
    status: "pending",
    user_uuid: "0",
    uuid: "0",
    offer_uuid: "0"
  })
}