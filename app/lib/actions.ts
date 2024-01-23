"use server"

import { OmieClientService } from "@/app/lib/omie/client.omie"
import { createPix } from "./bwspay/bwpay"

import * as crm from "./crm"
import * as db from "./db"
import { Client, Offer, Payment } from "./definitions"
import { paymentRepo, CreatePayment } from "./mongodb/repositories/payment.mongo"

import { v4 as uuidv4 } from 'uuid';
import { OmieDefaultParams, OmieSearchParams } from "./definitions/OmieApi"
import { OmieOrderService } from "./omie/order.omie"

export async function fetchClients(data?: Omit<OmieDefaultParams, 'apenas_importado_api'>) {
  return await OmieClientService.findAll(data);
}

export async function fetchClientById(id: string) {
  return await crm.listClientById(id)
}

export async function fetchOffers(data?: OmieSearchParams) {
  return await OmieOrderService.findAll(data);
}

export async function fetchOfferById(id: number) {
  return await OmieOrderService.find(id);
}

export async function fetchPayments() {
  return await paymentRepo.list();
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