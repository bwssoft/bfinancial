import { OmieResponse, OmieSearchParams } from "./OmieApi";

export interface OmieReceiveOrder {
  codigo_lancamento_omie: number;
  id_conta_corrente: number;
  nCodPedido: number;
  numero_documento: string;
  numero_parcela: string;
}

export type OmieListReceiveOrderParams = OmieSearchParams & {
  filtrar_cliente?: number;
};

export type OmieListReceiveOrderResponse = OmieResponse & {
  conta_receber_cadastro: Array<OmieReceiveOrder>;
};

export type OmiePostReceiptParams = {
  codigo_lancamento: number;
  codigo_conta_corrente: number;
  valor: number;
  data: string;
  observacao: string;
};

export type OmiePostReceiptResponse = {
  codigo_lancamento: number;
  codigo_lancamento_integracao: string;
  codigo_baixa: number;
  codigo_baixa_integracao: string;
  liquidado: string;
  valor_baixado: number;
  codigo_status: string;
  descricao_status: string;
};
