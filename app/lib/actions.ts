"use server"

import { OmieClientService } from "@/app/lib/omie/client.omie"

import * as crm from "./crm"
import * as db from "./db"

import { paymentRepo, CreatePayment } from "./mongodb/repositories/payment.mongo"

import { v4 as uuidv4 } from 'uuid';
import { OmieOrderService } from "./omie/order.omie"
import { OmieClientListParams, OmieClientModel } from "./definitions/OmieClient"
import { OmieListOfferParams } from "./definitions/OmieOffer"
import { createPix } from "./bwspay/bwpay"

export async function fetchClients(data?: Omit<OmieClientListParams, 'apenas_importado_api'>) {
  return await OmieClientService.findAll(data);
}

export async function fetchClientById(id: string) {
  return await OmieClientService.find(id)
}

export async function fetchOffers(data?: Omit<OmieListOfferParams, 'apenas_importado_api'>) {
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

export async function createClientPayment(client: OmieClientModel, formData: FormData) {
  const _formData = Object.fromEntries(formData.entries()) as any;
  const clientType = _formData.client_type;

  const pix = await createPix({
    payer: {
      document: {
        type: 'CNPJ',
        value: client.cnpj_cpf
      },
      email: client.email,
      name: client.nome_fantasia
    },
    receiver: {
      document: {
        type: "CNPJ",
        value: "20618574000135"
      },
      name: "BWS IOT",
      pix: "20618574000135"
    },
    price: _formData.price
  })


  const data: CreatePayment = {
    user_uuid: uuidv4(),
    uuid: uuidv4(),
    created_at: new Date().toISOString(),
    price: parseFloat(_formData.price),
    status: 'pending',
    omie_metadata: {
      client_id: clientType === 'subclient' ? null : _formData.client_id,
      enterprise_id: _formData.enterprise_id,
      offer_id: _formData.offer_id,
      installment_number: _formData.installment_number
    },
    bws_pay: {
      client_name: client.pessoa_fisica,
      enterprise_doc: client.cnpj_cpf,
      enterprise_name: client.nome_fantasia,
      transaction_id: pix
    }
  }

  return await paymentRepo.create(data);
}