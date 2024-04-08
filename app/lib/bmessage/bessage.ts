import { BMessage } from "./grpc-client"

const bmessage = new BMessage()

async function createTextMessage(params: {
  phone: string,
  message: string
}) {
    return await bmessage.createTextMessage(params)
}

async function createTemplateEmail(params: {
  html: string,
  subject: string
  to: string
}) {
    return await bmessage.createTemplateEmail({...params, attachments:[]})
}

async function createTemplateMessage(params: {
  phone: string
  template: string
  code: string
  components: {
    type: string,
    parameters: ({ type: string, text: string } | { type: string, image: { link: string } })[]
  }[]
}) {
    return await bmessage.createTemplateMessage(params)
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
  createTemplateEmail,
  createTextMessage,
  createTemplateMessage,
  uploadMediaWtp
}