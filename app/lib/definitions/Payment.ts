import { OmieEnterpriseEnum } from "./OmieApi"

type Cents = number

export type OmieMetadata = {
  enterprise: OmieEnterpriseEnum;
  codigo_cliente: number;
  codigo_pedido: string;
  numero_parcela?: number; //opcional por que quando for um pagamento de frete, não existe parcela
  data_vencimento?: string //opcional por que quando for um pagamento de frete, não existe parcela
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
  is_detached: boolean
  omie_metadata: OmieMetadata,
  bpay_metadata: BPayMetadata
  group: string //codigo_pedido_omie + numero_parcela
}
