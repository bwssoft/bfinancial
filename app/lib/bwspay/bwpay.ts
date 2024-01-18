import { BwPay } from "./grpc"

const bwpay = new BwPay()

export async function createPix({
  payer,
  receiver,
  price
}: {
  payer: Payer
  receiver: Receiver
  price: number
}) {
  return await bwpay.creactePixDetached({
    payer,
    receiver,
    price
  })
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
    type: 'CPF' | 'CNPJ'
    value: string
  }
}

type Receiver = {
  /** nome do recebedor  */
  name: string
  /** chave pix do recebedor  */
  pix: string
  /** documento do recebedor  */
  document: {
    type: 'CPF' | 'CNPJ'
    value: string
  }
}