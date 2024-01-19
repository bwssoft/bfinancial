type Cents = number

export type PaymentOmieMetadata = {
  client_id?: string;
  offer_id?: string;
  enterprise_id?: string;
}

export type PaymentBWSPayMetadata = {
  transaction_id: string;
}

export type Payment = {
  uuid: string
  user_uuid: string
  price: Cents
  // invoice?: Invoice
  status: "pending" | "paid" | "canceled" | "failed"
  created_at: string
  omie_metadata?: PaymentOmieMetadata,
  bws_pay?: PaymentBWSPayMetadata
}
