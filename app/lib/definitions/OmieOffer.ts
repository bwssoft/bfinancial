import { OmieBoolean, OmieResponse, OmieSearchParams } from "./OmieApi";

type OmieOfferHeader = {
  bloqueado?: OmieBoolean;
  codigo_cenario_impostos: string;
  codigo_cliente: number;
  codigo_empresa: number;
  codigo_parcela: string;
  codigo_pedido: number;
  codigo_pedido_integracao: string;
  data_previsao: string;
  etapa: keyof typeof OmieOfferStep;
  importado_api: string;
  numero_pedido?: string;
  origem_pedido: string;
  qtde_parcelas: number;
  quantidade_itens: number;
};

export const OmieOfferStep = {
  "10": "Proposta / Orçamento",
  "20": "Separar estoque",
  "50": "Faturar",
  "60": "Faturado",
  "70": "Entrega",
  "80": "Pedido / Aprovação Financeira",
};

type OmieOfferFreight = {
  modalidade: string;
  codigo_rastreio?: string;
  quantidade_volumes: number;
  valor_frete: number;
};

type OmieOfferRegisterInfo = {
  autorizado: OmieBoolean;
  cImpAPI: OmieBoolean;
  cancelado: OmieBoolean;
  dAlt: string;
  dFat: string;
  dInc: string;
  denegado: OmieBoolean;
  devolvido: OmieBoolean;
  devolvido_parcial: OmieBoolean;
  faturado: OmieBoolean;
  hAlt: string;
  hFat: string;
  hInc: string;
  uAlt: string;
  uFat: string;
  uInc: string;
};

export type OmieOfferInstallment = {
  data_vencimento: string;
  numero_parcela: number;
  percentual: number;
  quantidade_dias: number;
  valor: number;
};

export type OmieOffer = {
  det: any;
  cabecalho: OmieOfferHeader;
  exportacao?: {
    nao_exportacao?: OmieBoolean;
  };
  frete?: OmieOfferFreight;
  infoCadastro: OmieOfferRegisterInfo;
  lista_parcelas: {
    parcela: OmieOfferInstallment[];
  };
  observacoes: {
    obs_venda: string;
  };
  informacoes_adicionais?: any;
  total_pedido: {
    valor_mercadorias: number;
    valor_total_pedido: number;
  };
};

export type OmieListOfferParams = OmieSearchParams & {
  codigo_pedido?: string;
  filtrar_por_cliente?: number;
  filtrar_por_data_de?: string;
  filtrar_por_data_ate?: string;
  etapa?: string;
};

export type OmieListOfferResponse = OmieResponse & {
  pedido_venda_produto: Array<OmieOffer>;
};

export type OmieFindOfferResponse = OmieResponse & {
  pedido_venda_produto: OmieOffer;
};

export type OmieOfferUpdateResponse = {
  codigo_pedido: number;
  codigo_pedido_integracao: string;
  codigo_status: string;
  descricao_status: string;
  numero_pedido: string;
};
