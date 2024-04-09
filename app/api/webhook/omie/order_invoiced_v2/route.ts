import { getCachedClient, getCachedOffer } from "@/app/lib/actions";
import { BMessageClient } from "@/app/lib/bmessage/bessage";
import { DocumentEnum, createPixTransaction } from "@/app/lib/bpay/bpay";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { OmieOfferInstallment } from "@/app/lib/definitions/OmieOffer";
import { FirebaseGateway } from "@/app/lib/firebase";
import { auditRepo } from "@/app/lib/mongodb/repositories/audit.mongo";
import { paymentRepo } from "@/app/lib/mongodb/repositories/payment.mongo";
import { OmieClientService } from "@/app/lib/omie/client.omie";
import { OmieOrderService } from "@/app/lib/omie/order.omie";
import QRCodeEmail from "@/app/ui/email-templates/qrcode-pix/qrcode-pix-template";
import { generateQRBuffer } from "@/app/utils/qrCode";
import { render } from "@react-email/render";
import { differenceInSeconds } from "date-fns";
import { nanoid } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const data: VendaProdutoFaturadaEvent = await request.json();
    const omie_enterprise: OmieEnterpriseEnum = appHashByEnterpriseEnum[data.appHash];

    const codigo_pedido = data.event.idPedido;
    const codigo_cliente = data.event.idCliente;
    console.log("omie v2")
    /**
     * Requisitar os dados do pedido omie e do cliente omie
     */
    OmieOrderService.setSecrets(omie_enterprise);
    OmieClientService.setSecrets(omie_enterprise);
    const [order, client] = await Promise.all([
      getCachedOffer(omie_enterprise, Number(codigo_pedido)),
      getCachedClient(omie_enterprise, String(codigo_cliente))
    ])
    if (!order) return new Response("Omie order not found", { status: 404 });
    if (!client) return new Response("Omie client not found", { status: 404 });

    /**
     * Gerar um pix para cada parcela do pedido omie
     */
    console.log("pix v2")
    const installments = order?.pedido_venda_produto.lista_parcelas.parcela;
    if (!installments.length) return new Response("Omie order without installments", { status: 404 });

    const qrCode = await Promise.all<{ url: string, code: string } & OmieOfferInstallment>(installments.map(async installment => {
      try {
        const [day, month, year] = installment.data_vencimento.split("/");
        const expirationDate = new Date();
        expirationDate.setDate(Number(day));
        expirationDate.setMonth(Number(month));
        expirationDate.setMonth(Number(year));

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
          expiration: differenceInSeconds(expirationDate, new Date()),
        });

        if (!pix.status) {
          throw new Error();
        }

        const qrCodeBuffer = await generateQRBuffer(pix.transaction.bb.pixCopyPaste);

        if (!qrCodeBuffer) {
          throw new Error();
        }

        const qrCodeurl = await FirebaseGateway.uploadFile({
          buffer: qrCodeBuffer,
          name: `qr-code-${nanoid()}`,
          type: "image/jpeg",
        });

        if (!qrCodeurl) {
          throw new Error();
        }

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

        return { url: qrCodeurl, code: pix.transaction.bb.pixCopyPaste, ...installment }

      } catch (e) {
        await auditRepo.create({
          operation: "create-pix",
          metadata: {
            codigo_pedido_omie: codigo_pedido,
          },
        });
        throw new Error();
      }
    }))

    const clientName =
      client.pessoa_fisica === "S"
        ? client.nome_fantasia
        : `${client.nome_fantasia} (${client.razao_social})`;

    /**
     * Enviar a cobrança para o email do cliente omie
     */
    console.log("sending email v2")
    await BMessageClient.createTemplateEmail({
      html: render(
        QRCodeEmail({
          metadata: {
            clientName,
            createdAt: order.pedido_venda_produto.infoCadastro.dInc,
            total: order.pedido_venda_produto.total_pedido.valor_total_pedido,
          },
          installments: qrCode,
        })
      ),
      subject: "Cobrança dos produtos BWS",
      to: "dev.italo.souza@gmail.com"
    });
    console.log("email sended v2")
    return Response.json({ ok: true });
  } catch (e) {

    return new Response("Error", { status: 500 })
  }
}





export const appHashByEnterpriseEnum: {
  [x: string]: OmieEnterpriseEnum;
} = {
  "icb-9s5qgy8": OmieEnterpriseEnum.ICB,
  "mgc-7hz56oa": OmieEnterpriseEnum.MGC,
  "sp-2fbiw9bh": OmieEnterpriseEnum.ICBFILIAL,
  "wfc-7hz8bve": OmieEnterpriseEnum.WFC,
  "bws-7hxz5c8": OmieEnterpriseEnum.BWS,
};

export type VendaProdutoFaturadaEvent = {
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
