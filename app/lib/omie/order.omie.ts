import { differenceInSeconds, parse } from "date-fns";
import { OmieSearchParams } from "../definitions/OmieApi";
import {
  OmieFindOfferResponse,
  OmieListOfferResponse,
  OmieOffer,
  OmieOfferUpdateResponse,
} from "../definitions/OmieOffer";
import { OmieBaseService } from "./base.omie";

class OrderService extends OmieBaseService {
  async find(codigo_pedido: number) {
      const data = this.formatSingleBodyRequest("ConsultarPedido", {
        codigo_pedido,
      });
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
}

export const OmieOrderService = new OrderService();
