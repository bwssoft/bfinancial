type Cents = Number
type Pix = {
  code: string
}
type Invoice = any

export type Payment = {
  user_uuid: string
  price: Cents
  bws_enterprise_id: string
  offer_uuid?: string
  pix?: Pix
  invoice?: Invoice
}

export type Offer = {
  id: string
  client_id: string
  bws_enterprise_id: string
  price: Cents
}

export type Client = {
  id: string
}
