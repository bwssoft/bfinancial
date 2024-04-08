import { BwPay } from "./grpc-client"

const bwpay = new BwPay()

export async function createPixTransaction({
  payer,
  receiver,
  price,
  expiration
}: {
  payer: Payer
  receiver: Receiver
  price: string,
  expiration?: number
}) {
  return await bwpay.createPixWithoutRecipient({
    payer,
    receiver,
    price,
    expiration
  })
}

export async function getTransactionById(params: {
  id: string[]
}) {
  return await bwpay.getManyTransactionById(params)
}


type Payer = {
  /** email do pagador  */
  email: string
  /** nome do pagador  */
  name: string
  /** Valor a pagar em real.
   * @example
   * 123.45
   */
  /** documento do pagador  */
  document: {
    type: DocumentEnum
    value: string
  }
}

export enum DocumentEnum {
  CPF = "CPF",
  CNPJ = "CNPJ"
}

type Receiver = {
  /** nome do recebedor  */
  name: string
}