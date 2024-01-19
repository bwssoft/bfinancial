"use server"

import * as crm from "./crm"
import * as db from "./db"
import { Client, Offer, Payment } from "./definitions"
import { paymentRepo, CreatePayment } from "./mongodb/repositories/payment.mongo"

import { v4 as uuidv4 } from 'uuid';

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
  const _formData = Object.fromEntries(formData.entries()) as any;
  const clientType = _formData.client_type;
  
  const data: CreatePayment = {
    user_uuid: uuidv4(),
    uuid: uuidv4(),
    created_at: new Date().toISOString(),
    price: parseFloat(_formData.price),
    status: 'pending',
    omie_metadata: {
      client_id: clientType === 'subclient' ? null : _formData.client_id,
      enterprise_id: _formData.enterprise_id,
      offer_id: _formData.proposal
    }
  }
  
  return await paymentRepo.create(data);
}