type Cents = number

type Pix = {
  code: string
}

type Invoice = any

export type Payment = {
  uuid: string
  user_uuid: string
  price: Cents
  // invoice?: Invoice
  status: "pending" | "paid" | "canceled" | "failed"
  created_at: string
  omie_metadata?: {
    client_id?: string;
    offer_id?: string;
    enterprise_id?: string;
  },
  bws_pay?: {
    transaction_id: string;
  }
}

export type Offer = {
  id: string
  client_id: string
  bws_enterprise_id: string
  price: Cents
  status: "pending" | "paid" | "canceled" | "failed"
  created_at: Date
}

export type Client = {
  id: string
  name: string
}
