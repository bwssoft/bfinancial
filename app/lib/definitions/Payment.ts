import { OmieEnterpriseEnum } from "./OmieApi"

type Cents = number

export type OmieMetadata = {
  enterprise: OmieEnterpriseEnum;
  codigo_cliente: number;
  codigo_pedido: string;
  numero_parcela: number;
  data_vencimento: string
}

export type BPayMetadata = {
  id: string
  txid: string
}

export type Payment = {
  uuid: string
  user_uuid: string
  price: Cents
  created_at: string
  omie_metadata: OmieMetadata,
  bpay_metadata: BPayMetadata
  group: string //codigo_pedido_omie + numero_parcela
}
