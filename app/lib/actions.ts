"use server"
import { OmieClientService } from "@/app/lib/omie/client.omie"
import { paymentRepo, CreatePayment } from "./mongodb/repositories/payment.mongo"
import { revalidatePath, unstable_cache } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { OmieOrderService } from "./omie/order.omie"
import { OmieClientListParams, OmieClientModel } from "./definitions/OmieClient"
import { OmieListOfferParams, OmieOfferInstallment } from "./definitions/OmieOffer"
import { DocumentEnum, createPixTransaction, getTransactionById } from "./bpay/bpay"
import { noteRepo } from "./mongodb/repositories/note.mongo"
import { OmieCredentials, OmieEnterpriseEnum } from "./definitions/OmieApi"
import { ICompanySecrets } from "../utils/enterpriseSecrets"
import { Filter } from "mongodb";
import { Payment } from "./definitions";
import { BMessageClient } from "./bmessage/bessage";
import { generateQRBuffer } from "../utils/qrCode";
import { getCurrentInstallment } from "../utils/get-current-installment";

import { headers } from 'next/headers';

export async function fetchClients(enterprise: OmieEnterpriseEnum, data?: Omit<OmieClientListParams, 'apenas_importado_api'>, secrets?: Partial<OmieCredentials>) {
  try {
    OmieClientService.setSecrets(enterprise)
    return await OmieClientService.findAll(data, secrets);
  } catch {
    return null;
  }
}

export async function fetchClientById(enterprise: OmieEnterpriseEnum, id: string) {
  OmieClientService.setSecrets(enterprise)
  return await OmieClientService.find(id)
}

export async function fetchOffers(enterprise: OmieEnterpriseEnum, data?: Omit<OmieListOfferParams, 'apenas_importado_api'>) {
  OmieOrderService.setSecrets(enterprise)
  return await OmieOrderService.findAll(data);
}

export const getCachedOffer = unstable_cache(
  async (enterprise, id) => await fetchOfferById(enterprise, id),
  ['omie-offer-list']
);

export async function fetchOfferById(enterprise: OmieEnterpriseEnum, id: number) {
  OmieOrderService.setSecrets(enterprise)
  return await OmieOrderService.find(id);
}

export async function fetchPayments(params?: Filter<Payment>) {
  return await paymentRepo.list(params);
}

export async function fetchPaymentById(id: string) {
  return await paymentRepo.findOne({
    uuid: id,
  });
}

export async function fetchPaymentByGroup(group: string) {
  return await paymentRepo.list({
    group,
  });
}


export async function createClientPayment(
  client: OmieClientModel,
  enterprise: ICompanySecrets,
  formData: FormData
) {
  // const _formData = Object.fromEntries(formData.entries()) as any;
  // const clientType = _formData.client_type;

  // const payer = {
  //   document: {
  //     type: DocumentEnum.CNPJ,
  //     value: client.cnpj_cpf,
  //   },
  //   email: client.email,
  //   name: client.nome_fantasia
  // }
  // const receiver = {
  //   name: enterprise.name
  // }
  // const pix = await createPixTransaction({
  //   payer,
  //   receiver,
  //   price: _formData.price
  // })

  // if (!pix.status) {
  //   throw new Error("error on bpay microservice")
  // }

  // const data: CreatePayment = {
  //   user_uuid: uuidv4(),
  //   uuid: uuidv4(),
  //   created_at: new Date().toISOString(),
  //   price: parseFloat(_formData.price),
  //   omie_metadata: {
  //     enterprise_id: enterprise.name,
  //     client_id: clientType === 'subclient' ? null : _formData.client_id,
  //     offer_id: _formData.offer_id,
  //     installment_number: _formData.installment_number
  //   },
  //   bws_pay: {
  //     transaction_id: pix.transaction._id
  //   }
  // }

  // return await paymentRepo.create(data);
}

export async function createPaymentFromOfferPage(
  omie_enterprise: OmieEnterpriseEnum,
  codigo_pedido_omie: string,
  omie_client: OmieClientModel,
  installment: OmieOfferInstallment
) {
  if (!omie_enterprise || !codigo_pedido_omie) return

  const client = omie_client

  if (!client) return

  const payer = {
    document: {
      type: DocumentEnum.CNPJ,
      value: client.cnpj_cpf,
    },
    email: client.email,
    name: client.nome_fantasia
  }
  const receiver = {
    name: omie_enterprise
  }

  const pix = await createPixTransaction({
    payer,
    receiver,
    // price: installment.valor.toString()
    price: "1"
  })

  if (!pix.status) {
    throw new Error("error on bpay microservice")
  }

  const data: CreatePayment = {
    user_uuid: uuidv4(),
    uuid: uuidv4(),
    created_at: new Date().toISOString(),
    price: pix.transaction.amount,
    omie_metadata: {
      enterprise: omie_enterprise,
      codigo_cliente: omie_client.codigo_cliente_omie,
      codigo_pedido: codigo_pedido_omie,
      numero_parcela: installment.numero_parcela,
      data_vencimento: installment.data_vencimento
    },
    bpay_transaction_id: pix.transaction._id,
    group: `${codigo_pedido_omie}${installment.numero_parcela}`
  }

  const payment = await paymentRepo.create(data);
  revalidatePath(`offer/${omie_enterprise}/${omie_client.codigo_cliente_omie}/${codigo_pedido_omie}`)
  await sendDue({
    data_vencimento: installment.data_vencimento,
    numero_parcela: installment.numero_parcela.toString(),
    pix_copia_e_cola: pix.transaction.bb.pixCopyPaste,
    telefone: "5527999697185"
  })
  return payment
}

export async function getTransactionByPaymentId(id: string) {
  return
}

export async function getManyTransactionById(params: { id: string[] }) {
  return getTransactionById(params)
}

export async function revalidateInstallmentOffer(pathname: string) {
  revalidatePath(pathname)
}

export async function revalidatePaymentPage(pathname: string) {
  revalidatePath(pathname)
}

export async function fetchNote(payment: string) {
  return await noteRepo.list(payment);
}

export async function createNote(author: User, formData: FormData,) {
  const _formData = Object.fromEntries(formData.entries()) as any;
  await noteRepo.create({
    uuid: uuidv4(),
    createdAt: new Date(),
    author,
    note: _formData.comment,
    payment: _formData.payment
  })
  revalidatePath(`/payment/${_formData.payment}`)
}

interface User {
  name: string;
  id: string;
}


export async function createTextMessage(params: { phone: string, message: string }) {
  const result = await BMessageClient.createTextMessage(params)
  return result
}

export async function createDueFromPayment(params: { payment: Payment }) {
  const payment = params.payment;

  const enterprise = payment.omie_metadata?.enterprise;
  const clientId = payment.omie_metadata?.codigo_cliente;
  const offerId = payment.omie_metadata?.codigo_pedido;

  const [offer, client] = await Promise.all([
    getCachedOffer(enterprise, parseInt(offerId)),
    fetchClientById(enterprise, clientId.toString())
  ]);

  if (offer && client) {
    const currentInstallment = getCurrentInstallment(offer?.pedido_venda_produto.lista_parcelas.parcela);
    await createPaymentFromOfferPage(
      enterprise,
      offerId,
      client,
      currentInstallment
    )
  }
}

export async function sendDue(params: {
  numero_parcela: string
  telefone: string
  data_vencimento: string
  pix_copia_e_cola: string
}) {
  const headerInfo = Object.fromEntries(headers().entries());
  const buffer = await generateQRBuffer(params.pix_copia_e_cola)
  if (!buffer) return
  const { status, media_id } = await BMessageClient.uploadMediaWtp({ buffer })
  if (!status) return
  const result = await BMessageClient.createTemplateMessage({
    phone: params.telefone,
    code: "pt_BR",
    template: "cobranca_bfinancial",
    components: [
      {
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              id: media_id
            },
          },
        ],
      },
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: params.numero_parcela,
          },
          {
            type: "text",
            text: params.data_vencimento,
          },
          {
            type: "text",
            text: `${headerInfo['x-forwarded-proto']}://${headerInfo.host}`,
          },
          {
            type: "text",
            text: params.pix_copia_e_cola,
          },
        ],
      },
    ],
  })
  console.log("🚀 ~ result:", result);
  return result
}

export async function uploadMediaWtp(params: {
  buffer: Buffer
}) {
  const result = await BMessageClient.uploadMediaWtp(params)
  return result
}

export async function generatePayShareLink(params: {
  paymentGroupId: string
}) {
  const headerInfo = Object.fromEntries(headers().entries());
  return `${headerInfo['x-forwarded-proto']}://${headerInfo.host}/pay/${params.paymentGroupId}`;
}