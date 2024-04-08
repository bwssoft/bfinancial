import { BMessageClient } from "@/app/lib/bmessage/bessage"
import { DocumentEnum, createPixTransaction } from "@/app/lib/bpay/bpay"
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi"
import { auditRepo } from "@/app/lib/mongodb/repositories/audit.mongo"
import { paymentRepo } from "@/app/lib/mongodb/repositories/payment.mongo"
import { OmieClientService } from "@/app/lib/omie/client.omie"
import { OmieOrderService } from "@/app/lib/omie/order.omie"
import { differenceInSeconds } from "date-fns"
import { render } from "@react-email/render"
import { v4 as uuidv4 } from "uuid"
import QRCodeEmail from "@/app/ui/email-templates/qrcode-pix/qrcode-pix-template"
import { generateQRBuffer } from "@/app/utils/qrCode"
import { FirebaseGateway } from "@/app/lib/firebase"
import { nanoid } from "nanoid";
import { getCachedClient, getCachedOffer } from "@/app/lib/actions"

export async function POST(request: Request) {
  const data: VendaProdutoFaturadaEvent = await request.json()
  const omie_enterprise: OmieEnterpriseEnum = appHashByEnterpriseEnum[data.appHash]

  const codigo_pedido = data.event.idPedido
  const codigo_cliente = data.event.idCliente

  /**
  * Requisitar os dados do pedido omie
  */
  OmieOrderService.setSecrets(omie_enterprise)
  const order = await getCachedOffer(omie_enterprise, Number(codigo_pedido))
  if (!order) return new Response("Omie order not found", { status: 404 })

  /**
  * Requisitar os dados do do cliente omie relacionado no pedido
  */
  OmieClientService.setSecrets(omie_enterprise)
  const client = await getCachedClient(omie_enterprise, String(codigo_cliente))
  if (!client) return new Response("Omie client not found", { status: 404 })

  /**
  * Gerar um pix para cada parcela do pedido omie
  */
  const installments = order?.pedido_venda_produto.lista_parcelas.parcela
  if (!installments.length) return new Response("Omie order without installments", { status: 404 })

  const qrCode = []
  for (let installment of installments) {
    try {

      await new Promise((resolve) => setTimeout(resolve, 500))

      const [day, month, year] = installment.data_vencimento.split('/')
      const expirationDate = new Date()
      expirationDate.setDate(Number(day))
      expirationDate.setMonth(Number(month))
      expirationDate.setMonth(Number(year))

      const pix = await createPixTransaction({
        payer: {
          document: {
            type: DocumentEnum.CNPJ,
            value: client.cnpj_cpf,
          },
          email: client.email,
          name: client.nome_fantasia,
        },
        receiver: {
          name: omie_enterprise,
        },
        price: installment.valor.toString(),
        expiration: differenceInSeconds(expirationDate, new Date())
      });

      if (!pix.status) {
        throw new Error()
      }

      const qrCodeBuffer = await generateQRBuffer(pix.transaction.bb.pixCopyPaste)

      if (!qrCodeBuffer) {
        throw new Error()
      }

      const qrCodeurl = await FirebaseGateway.uploadFile({
        buffer: qrCodeBuffer,
        name: `qr-code-${nanoid()}`,
        type: "image/jpeg",
      })

      if (!qrCodeurl) {
        throw new Error()
      }

      qrCode.push({ url: qrCodeurl, code: pix.transaction.bb.pixCopyPaste })

      await paymentRepo.create({
        user_uuid: uuidv4(),
        uuid: uuidv4(),
        created_at: new Date().toISOString(),
        price: pix.transaction.amount,
        omie_metadata: {
          enterprise: omie_enterprise,
          codigo_cliente: codigo_cliente,
          codigo_pedido: String(codigo_pedido),
          numero_parcela: installment.numero_parcela,
          data_vencimento: installment.data_vencimento,
        },
        bpay_metadata: {
          id: pix.transaction._id,
          txid: pix.transaction.bb.txid,
        },
        group: `${codigo_pedido}${installment.numero_parcela}`,
      });

    } catch (e) {

      await auditRepo.create({
        operation: "create-pix",
        metadata: {
          codigo_pedido_omie: codigo_pedido
        }
      })

      return new Response("Error when created payment", { status: 500 })
    }
  }

  /**
   * Enviar a cobrança para o email do cliente omie
  */
  await BMessageClient.createTemplateEmail({
    html: render(QRCodeEmail({ qrCode })),
    subject: "Cobrança dos produtos BWS",
    to: "dev.italo.souza@gmail.com"
  })
  //enviar uma mensagem no wtp falando que as cobranças foram geradas?
  return Response.json({ ok: true })

}

const appHashByEnterpriseEnum: {
  [x: string]: OmieEnterpriseEnum
} = {
  "icb-9s5qgy8": OmieEnterpriseEnum.ICB,
  "mgc-7hz56oa": OmieEnterpriseEnum.MGC,
  "sp-2fbiw9bh": OmieEnterpriseEnum.ICBFILIAL,
  "wfc-7hz8bve": OmieEnterpriseEnum.WFC,
  "bws-7hxz5c8": OmieEnterpriseEnum.BWS,
}

type VendaProdutoFaturadaEvent = {
  messageId: string;
  topic: string;
  event: PedidoFaturadoEvent;
  author: Author;
  appKey: string;
  appHash: string;
  origin: string;
};

type PedidoFaturadoEvent = {
  codIntPedido: string;
  codigoCategoria: string;
  dataFaturado: string;
  dataPrevisao: string;
  etapa: string;
  etapaDescr: string;
  faturada: string;
  horaFaturado: string;
  idCliente: number;
  idContaCorrente: number;
  idPedido: number;
  numeroPedido: string;
  usuarioFaturado: string;
  valorPedido: number;
};

type Author = {
  email: string;
  name: string;
  userId: number;
};
