import { OmieResponse, OmieBoolean, OmieSearchParams } from "./OmieApi";

type OmieOfferHeader = {
  bloqueado: OmieBoolean;
  codigo_cenario_impostos: string;
  codigo_cliente: number;
  codigo_empresa: number;
  codigo_parcela: string;
  codigo_pedido: number;
  codigo_pedido_integracao: string;
  data_previsao: string;
  etapa: string;
  importado_api: string;
  numero_pedido: string;
  origem_pedido: string;
  qtde_parcelas: number;
  quantidade_itens: number;
}

type OmieOfferFreight = {
  modalidade: string;
  codigo_rastreio?: string;
  quantidade_volumes: number;
  valor_frete: number;
}

type OmieOfferRegisterInfo = {
  autorizado: OmieBoolean,
  cImpAPI: OmieBoolean,
  cancelado: OmieBoolean,
  dAlt: string,
  dFat: string,
  dInc: string,
  denegado: OmieBoolean,
  devolvido: OmieBoolean,
  devolvido_parcial: OmieBoolean,
  faturado: OmieBoolean,
  hAlt: string,
  hFat: string,
  hInc: string,
  uAlt: string,
  uFat: string,
  uInc: string
}

type OmieOfferInstallment = {
  data_vencimento: string;
  numero_parcela: number;
  percentual: number;
  quantidade_dias: number;
  valor: number;
}

export type OmieOffer = {
  cabecalho: OmieOfferHeader;
  exportacao: {
    nao_exportacao: OmieBoolean
  };
  frete: OmieOfferFreight;
  infoCadastro: OmieOfferRegisterInfo;
  lista_parcelas: {
    parcela: OmieOfferInstallment[];
  };
  observacoes: {
    obs_venda: string;
  };
  total_pedido: {
    valor_mercadorias: number;
    valor_total_pedido: number;
  }
}

export type OmieListOfferParams = OmieSearchParams & {
  filtrar_por_cliente?: number;
}

export type OmieListOfferResponse = OmieResponse & {
  pedido_venda_produto: Array<OmieOffer>
}

export type OmieFindOfferResponse = OmieResponse & {
  pedido_venda_produto: OmieOffer
}