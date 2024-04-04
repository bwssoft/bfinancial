import { OmieCredentials } from "../definitions/OmieApi";
import {
  OmieListReceiveOrderParams,
  OmieListReceiveOrderResponse,
  OmiePostReceiptParams,
  OmiePostReceiptResponse,
} from "../definitions/OmieOrderReceive";
import { OmieBaseService } from "./base.omie";

class ReceiveOrdersService extends OmieBaseService {
  async findAll(
    params?: OmieListReceiveOrderParams,
    secrets?: Partial<OmieCredentials>
  ): Promise<OmieListReceiveOrderResponse | null> {
    try {
      const data = this.formatOmieBodyRequest("ListarContasReceber", params, secrets);
      const response = await this._httpProvider.post<OmieListReceiveOrderResponse>(
        "/financas/contareceber/",
        data
      );
      return response.data;
    } catch {
      return null;
    }
  }

  async post(params: OmiePostReceiptParams) {
    try {
      const data = this.formatBody("LancarRecebimento", params);
      const response = await this._httpProvider.post<OmiePostReceiptResponse>(
        "/financas/contareceber/",
        data
      );
      return response.data;
    } catch {
      return null;
    }
  }
}

export const OmieReceiveOrdersService = new ReceiveOrdersService();
