import { getCachedOffer } from "@/app/lib/actions"
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi"
import { paymentRepo } from "@/app/lib/mongodb/repositories/payment.mongo"
import { OmieOrderService } from "@/app/lib/omie/order.omie"
import { OmieReceiveOrdersService } from "@/app/lib/omie/receive-orders.omie"
import axios from "axios"

export async function POST(request: Request) {
  /**
   * data received from bb webhook
  */
  const data: { pix: Pix[] } = await request.json()
  const [pix] = data.pix
  console.log("data pix", data)

  /**
   * request payment entity associated with txid from bb pix in our repository
  */
  const payment = await paymentRepo.findOne({ "bpay_metadata.txid": pix.txid })
  if (!payment) return new Response("No payment with this code", { status: 500, statusText: "No payment with this code" })
  if (!payment?.is_detached) {
    /**
    * set omie secrets on service with enterprise associated with payment entity
    */
    const { omie_metadata } = payment
    OmieOrderService.setSecrets(omie_metadata.enterprise);
    OmieReceiveOrdersService.setSecrets(omie_metadata.enterprise);

    /**
    * request omie offer (pedido)
    */
    const offer = await getCachedOffer(omie_metadata.enterprise, parseInt(omie_metadata.codigo_pedido!));
    if (!offer) return new Response("No offer with this code", { status: 500, statusText: "No offer with this code" })

    if (offer.pedido_venda_produto.cabecalho.etapa !== "60") {
      /**
      * create object to update prop "situação" from omie offer
      */
      let _offer = offer.pedido_venda_produto

      delete _offer.cabecalho.numero_pedido
      delete _offer.cabecalho.bloqueado
      delete _offer.frete
      delete _offer.informacoes_adicionais
      delete _offer.exportacao
      delete _offer.det

      _offer.cabecalho.origem_pedido = "API"
      const codigo_cenario_impostos = offer.pedido_venda_produto.cabecalho.codigo_cenario_impostos
      const categoria_adiantamento = categoriaAdiantamentoCod[
        OmieEnterpriseEnum[omie_metadata.enterprise]
      ]
      const codigo_imposto = cCodImposto[codigo_cenario_impostos as keyof typeof cCodImposto]
      const parcela = _offer.lista_parcelas.parcela.map(parcela => {
        if (parcela.numero_parcela === omie_metadata.numero_parcela) {
          return {
            ...parcela,
            parcela_adiantamento: "S",
            categoria_adiantamento: categoria_adiantamento
            [codigo_imposto as keyof typeof categoria_adiantamento],

            conta_corrente_adiantamento: nCodCCByEnterprise[
              OmieEnterpriseEnum[omie_metadata.enterprise]
            ],
          }
        }
        return parcela
      })
      _offer.lista_parcelas.parcela = parcela

      /**
      * update omie offer (pedido) 
      */
      await OmieOrderService.update(_offer)
    }

    /**
    * request for all omie receive orders (contas a receber)
    */
    const receive_orders = await OmieReceiveOrdersService.findAll({
      pagina: 1,
      registros_por_pagina: 1000,
      filtrar_cliente: Number(omie_metadata.codigo_cliente)
    })

    if (!receive_orders) return new Response(
      "No receive offer with this code",
      {
        status: 500,
        statusText: "No receive offer with this code"
      }
    )

    /**
    * filter omie receive orders that fit with payment entity
    */
    const [current_receive_order] = receive_orders.conta_receber_cadastro.filter(a =>
      Number(a.nCodPedido) === Number(omie_metadata.codigo_pedido) &&
      Number(a.numero_parcela.split('/')[0]) === Number(omie_metadata.numero_parcela)
    )

    if (!current_receive_order) return new Response(
      "No receive offer linked",
      {
        status: 500,
        statusText: "No receive offer linked"
      }
    )

    /**
    * check omie receive order status is different of "RECEBIDO" and then update the omie receive order
    */
    if (current_receive_order.status_titulo !== "RECEBIDO") {
      await OmieReceiveOrdersService.post({
        codigo_lancamento: current_receive_order.codigo_lancamento_omie,
        codigo_conta_corrente: current_receive_order.id_conta_corrente,
        valor: payment.price,
        data: new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }),
        observacao: "Baixa realizada automaticamente pelo sistema BFinancial"
      })
    }
  }

  /**
  *  notify bpay microservice with the dara received from bb webhook
  */
  await axios.post(
    "https://bpay-rest-api.bwsoft.app/update-pix-without-recipient",
    data
  )

  return Response.json({ ok: true })
}

const nCodCCByEnterprise = {
  WFC: '7974650357', // descrição: adiantamento
  ICB: '6331754348', // descrição: adiantamento
  MGC: '8482817541', // descrição: adiantamento
  BWS: '4475468992', // descrição: adiantamento
  ICBFILIAL: '8476221978', //descrição: adiantamento //nao é possivel por que não esta com o cnpj da priscila vinculado e a aplicação no bb não está em produção
}

const categoriaAdiantamentoCod = {
  BWS: {
    PADRAO: "1.01.01" // - Receita Bruta de Vendas
  },
  MGC: {
    VENDA: "1.01.01" // - Clientes - Venda de Mercadoria Fabricadas
  },
  WFC: {
    VENDA: "1.01.03" // - Clientes - Revenda de Mercadoria
  },
  ICB: {
    VENDA: "1.01.01", // 1.01.01 - Venda de Mercadoria Adquirida/ Recebida de Terceiros
    LOCACAO: "1.01.99", // 1.01.99 - Contrato comodato
  },
  ICBFILIAL: {
    VENDA: "1.01.01" // - Receita Bruta de Vendas
  }
}

// https://app.omie.com.br/api/v1/geral/cenarios/#ListarCenarios
const cCodImposto = {
  "405942591": "PADRAO", // ICB Padrao
  "6129600798": "PADRAO", // ICB Novo Cenário Fiscal 21/03/2022 16:09:31
  "6228264146": "VENDA", // ICB LOCAÇÃO
  "6227022961": "LOCALCAO", //ICB LOCACAÇÃO


  "2229186822": "PADRAO", // BWS Padrao
  "2237530857": "PADRAO", // BWS Amostra
  "4005317491": "PADRAO", // BWS 6949-5949
  "4007096027": "PADRAO", // BWS 6912-5912


  "2237648028": "PADRAO", // MGC Padrao 
  "2418257925": "PADRAO", // MGC 5102-6102/ VENDA
  "5999803867": "PADRAO", // MGC 5908- 6908/ LOCAÇÃO
  "5999808436": "PADRAO", // MGC 5916- 6916/ RETORNO
  "8100014320": "PADRAO", // MGC 5911-6911 AMOSTRA
  "8100014411": "PADRAO", // MGC 5910- 6910/ BRINDE, DOAÇÃO
  "8152824796": "PADRAO", // MGC 5912 - 6912 Demosntração

  "2226509434": "PADRAO", // WFC Padrao
  "2237549913": "PADRAO", // WFC Allcom
  // "2418257925": "PADRAO", // WFC 5102-6102/ VENDA
  "3303681841": "PADRAO", // WFC Amostra
  // "5999803867": "PADRAO", // WFC 5908- 6908/ LOCAÇÃO
  // "5999808436": "PADRAO", // WFC 5916- 6916/ RETORNO

  "8397806596": "PADRAO", // ICBFILIAL PADRAO
  "8397806643": "PADRAO", // ICBFILIAL 6908 -5908/ LOCAÇÃO
  "8475883884": "PADRAO" // ICBFILIAL 6916/5916
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