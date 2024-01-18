"use server"

import { createPix } from "./bwspay/bwpay"
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

export async function createPayment(formData: FormData) {
  const _formData = Object.fromEntries(formData.entries())
  console.log('_formData', _formData)
  const pix = await createPix({
    payer: {
      document: {
        value: "13008219730",
        type: "CPF"
      },
      email: "dev.italo.souza@gmail.com",
      name: "italo"
    },
    receiver: {
      document: {
        value: "13008219730",
        type: "CPF"
      },
      name: "italo",
      pix: "dev.italo.souza@gmail.com"
    },
    price: 5
  })
  console.log('pix', pix)
  // await db.createOnePayment({
  //   pix,
  //   bws_enterprise_id: "0",
  //   client_id: "0",
  //   created_at: new Date(),
  //   price: 6560000,
  //   status: "pending",
  //   user_uuid: "0",
  //   uuid: "0",
  //   offer_uuid: "0"
  // })
}