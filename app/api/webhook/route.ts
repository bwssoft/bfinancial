import { paymentRepo } from "@/app/lib/mongodb/repositories/payment.mongo"
import { OmieOrderService } from "@/app/lib/omie/order.omie"
import axios from "axios"

export async function POST(request: Request) {
  const data: { pix: Pix[] } = await request.json()
  const [pix] = data.pix

  const payment = await paymentRepo.findOne({ "bpay_metadata.txid": pix.txid })
  if (!payment) return Response.json({ 0: false })

  const { omie_metadata } = payment
  OmieOrderService.setSecrets(omie_metadata.enterprise);
  const offer = await OmieOrderService.find(Number(omie_metadata.codigo_pedido))
  if (!offer) return Response.json({ 1: false })

  let _offer = offer?.pedido_venda_produto
  if (!_offer) return Response.json({ 2: false })

  delete _offer.cabecalho.numero_pedido
  delete _offer.cabecalho.bloqueado
  delete _offer.frete
  delete _offer.informacoes_adicionais
  delete _offer.exportacao
  delete _offer.det

  _offer.cabecalho.origem_pedido = "API"
  const parcela = _offer.lista_parcelas.parcela.map(parcela => {
    if (parcela.numero_parcela === omie_metadata.numero_parcela) {
      return {
        ...parcela,
        parcela_adiantamento: "S",
        categoria_adiantamento: "1.01.01",
        conta_corrente_adiantamento: "6331754348",
      }
    }
    return parcela
  })
  _offer.lista_parcelas.parcela = parcela

  await OmieOrderService.update(_offer)

  await axios.post(
    "https://bpay-rest-api.bwsoft.app/update-pix-without-recipient",
    data
  )

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