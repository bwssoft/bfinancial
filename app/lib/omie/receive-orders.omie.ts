import { AxiosError } from "axios";
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
      const data = this.formatOmieBodyRequest("ListarContasReceber", params, secrets);
      const response = await this._httpProvider.post<OmieListReceiveOrderResponse>(
        "/financas/contareceber/",
        data
      );
      return response.data;
  }

  async post(params: OmiePostReceiptParams) {
      const data = this.formatBody("LancarRecebimento", params);
      const response = await this._httpProvider.post<OmiePostReceiptResponse>(
        "/financas/contareceber/",
        data
      );
      console.log('response', response)
      return response.data;
  }
}

export const OmieReceiveOrdersService = new ReceiveOrdersService();
