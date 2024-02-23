import { OmieEnterpriseEnum } from "./definitions/OmieApi"

type Cents = number

export type Payment = {
  uuid: string
  user_uuid: string
  price: Cents
  created_at: string
  omie_metadata: {
    enterprise: OmieEnterpriseEnum;
    codigo_cliente: number;
    codigo_pedido: string;
    numero_parcela: number;
    data_vencimento: string
  },
  bpay_transaction_id: string
  group: string //codigo_pedido_omie + numero_parcela
}

export type Note = {
  uuid: string
  author: { name: string, id: string }
  createdAt: Date,
  note: string
  payment: string
}