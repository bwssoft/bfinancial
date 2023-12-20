type Cents = number
type Pix = {
  code: string
}
type Invoice = any

export type Payment = {
  uuid: string
  user_uuid: string
  client_id: string
  price: Cents
  bws_enterprise_id: string
  offer_uuid?: string
  pix?: Pix
  invoice?: Invoice
  status: "pending" | "paid" | "canceled" | "failed"
  created_at: Date
}

export type Offer = {
  id: string
  client_id: string
  bws_enterprise_id: string
  price: Cents
}

export type Client = {
  id: string
  name: string
}
