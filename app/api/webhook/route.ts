import { Payment } from "@/app/lib/definitions/Payment"
import { paymentRepo } from "@/app/lib/mongodb/repositories/payment.mongo"
import { OmieOrderService } from "@/app/lib/omie/order.omie"

export async function POST(request: Request) {
  const data: { pix: Pix[] } = await request.json()
  const [pix] = data.pix

  const payment = await paymentRepo.findOne({ "bpay_metadata.txid": pix.txid })
  if (!payment) Response.json({ ok: false })

  const { omie_metadata } = payment as Payment
  OmieOrderService.setSecrets(omie_metadata.enterprise);
  const offer = await OmieOrderService.find(Number(omie_metadata.codigo_pedido))
  if (!offer) Response.json({ ok: false })

  console.log('offer', offer)
  //atualizar situação da parcela paga
  return Response.json({ ok: true })
}

interface Pix {
  endToEndId: string
  txid: string
  valor: string
  componentesValor: {
    original: {
      valor: string
    }
  }
  chave: string
  horario: string
  infoPagador: string
  pagador: {
    cpf: string
    nome: string
  }
}