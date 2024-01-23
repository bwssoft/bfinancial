import { OmieSearchParams } from "../definitions/OmieApi";
import { OmieFindOfferResponse, OmieListOfferResponse } from "../definitions/OmieOffer";
import { OmieBaseService } from "./base.omie";

class OrderService extends OmieBaseService {
  async find(codigo_pedido: number) {
    const data = this.formatSingleBodyRequest('ConsultarPedido', {
      codigo_pedido
    });
    const response = await this._httpProvider.post<OmieFindOfferResponse>('/produtos/pedido/', data)
    return response.data;
  }

  async findAll(params?: OmieSearchParams) {
    const data = this.formatBody('ListarPedidos', params)
    const response = await this._httpProvider.post<OmieListOfferResponse>('/produtos/pedido/', data)
    return response.data;
  }
};

export const OmieOrderService = new OrderService();