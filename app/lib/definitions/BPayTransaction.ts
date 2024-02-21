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

  status: BPayStatusUnion;
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