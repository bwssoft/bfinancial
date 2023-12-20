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

const clients: Client[] = [
  {
    id: "0",
    name: "client#00",
  },
  {
    id: "1",
    name: "client#01",
  }
]
const offers: Offer[] = [
  {
    id: "0",
    client_id: "0",
    bws_enterprise_id: "0",
    price: 100000
  },
  {
    id: "1",
    client_id: "0",
    bws_enterprise_id: "1",
    price: 210000
  }
]
