import { differenceInSeconds, parse } from "date-fns";
import { OmieSearchParams } from "../definitions/OmieApi";
import {
  OmieFindOfferResponse,
  OmieListOfferResponse,
  OmieOffer,
  OmieOfferUpdateResponse,
  OmieInvoice,
  OmieInvoiceResponse
} from "../definitions/OmieOffer";
import { OmieBaseService } from "./base.omie";

class OrderService extends OmieBaseService {
  async find(params: { codigo_pedido?: number, numero_pedido?: number }) {
    const data = this.formatSingleBodyRequest("ConsultarPedido", params);
    const response = await this._httpProvider.post<OmieFindOfferResponse>(
      "/produtos/pedido/",
      data
    );
    return response.data;
  }

  async findAll(params?: OmieSearchParams) {
    const data = this.formatBody("ListarPedidos", params);
    const response = await this._httpProvider.post<OmieListOfferResponse>(
      "/produtos/pedido/",
      data
    );
    response.data.pedido_venda_produto.sort((a, b) => {
      const first = parse(
        `${a.infoCadastro.dInc}-${a.infoCadastro.hInc}`,
        "dd/MM/yyyy-HH:mm:ss",
        new Date()
      );
      const second = parse(
        `${b.infoCadastro.dInc}-${b.infoCadastro.hInc}`,
        "dd/MM/yyyy-HH:mm:ss",
        new Date()
      );

      return differenceInSeconds(second, first);
    });
    return response.data;
  }

  async update(params: OmieOffer) {
    const data = this.formatBody("AlterarPedidoVenda", params);
    const response = await this._httpProvider.post<OmieOfferUpdateResponse>(
      "/produtos/pedido/",
      data
    );
    return response.data;
  }

  async invoice(params: OmieInvoice) {
    const data = this.formatBody("FaturarPedidoVenda", params);
    const response = await this._httpProvider.post<OmieInvoiceResponse>(
      "/produtos/pedidovendafat/",
      data
    );
    return response.data;
  }
}

export const OmieOrderService = new OrderService();
