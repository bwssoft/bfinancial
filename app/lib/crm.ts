import { Client, Offer } from "./definitions"

export async function listClient() {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return clients
}
export async function listClientById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return clients.find(client => client.id === id)
}

export async function listOffer() {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return offers
}
export async function listOfferById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return offers.find(offer => offer.id === id)
}

export const clients: Client[] = [
  {
    id: "0",
    name: "client#00",
  },
  {
    id: "1",
    name: "client#01",
  }
]
export const offers: Offer[] = [
  {
    id: "0",
    client_id: "0",
    bws_enterprise_id: "0",
    price: 100000,
    status: "failed",
    created_at: new Date()
  },
  {
    id: "1",
    client_id: "0",
    bws_enterprise_id: "1",
    price: 210000,
    status: "pending",
    created_at: new Date()
  },
  {
    id: "3",
    client_id: "0",
    bws_enterprise_id: "1",
    price: 6521000,
    status: "paid",
    created_at: new Date()
  }
]
