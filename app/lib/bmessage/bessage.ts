import { BMessage } from "./grpc-client"

const bmessage = new BMessage()

async function createTextMessage(params: {
  phone: string,
  message: string
}) {
  try {
    return await bmessage.createTextMessage(params)
  } catch (e) {
    return null;
  }
}

async function createTemplateMessage(params: {
  phone: string
  template: string
  code: string
  components: {
    type: string,
    parameters: ({ type: string, text: string } | { type: string, image: { id: string } })[]
  }[]
}) {
  try {
    return await bmessage.createTemplateMessage(params)
  } catch (e) {
    return null;
  }
}

async function uploadMediaWtp(params: {
  buffer: Buffer
}) {
  try {
    return await bmessage.uploadBuffer(params)
  } catch (e) {
    return null;
  }
}


export const BMessageClient = {
  createTextMessage,
  createTemplateMessage,
  uploadMediaWtp
}