export interface BPayQrCode {
  url: string;
  txId: string;
  emv: string;
}

export type BPayMethodUnion = "PIX" | "BOLETO" | "OMIE";

export type BPayStatusUnion =
  | "LIQUIDADO"
  | "VENCIDO"
  | "PENDENTE"
  | "PROCESSANDO"
  | "CANCELADO"
  | "CARTORIO"
  | "AGENDADO"
  | "CREDITADO"
  | "PARCIALMENTE CREDITADO";

export type BPayStatusEnum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface BPayTransactionReceiverInfo {
  id: string;
  numeroConvenio: number;
}

export interface BPayTransaction {
  readonly _id: string;
  
  qrCode?: BPayQrCode;
  url?: string;
  refPath?: string;
  omieId?: string;

  status: BPayStatusEnum;
  method: BPayMethodUnion;
  finish: boolean;
  receiver: BPayTransactionReceiverInfo;
  payer: string;
  amount: number;

  createdAt: Date;
  updatedAt: Date;
  active: boolean;

  bb: {
    txid: string;
    pixCopyPaste: string;
    status: string;
  }
}